import { ref, reactive, watch, Ref } from "vue-demi";
import { read, write } from "./serializer";
import { localStorageMap, sessionStorageMap } from "./map";
import { isServer } from "@vueposu/utils";

import type { StorageMap } from "./map";

let originalLocalSetItem: Function = () => {};
let originalSessionSetItem: Function = () => {};

if (!isServer) {
  window.addEventListener(
    "storage",
    ({ key, oldValue, newValue, storageArea }) => {
      const storageMap =
        storageArea === window.localStorage
          ? localStorageMap
          : sessionStorageMap;
      if (key && storageMap[key]) {
        handleSetItem(key!, read(newValue, oldValue), storageMap);
      }
    }
  );

  originalLocalSetItem = window.localStorage.setItem.bind(localStorage);
  originalSessionSetItem = window.sessionStorage.setItem.bind(sessionStorage);

  // override
  window.localStorage.setItem = (key, value) => {
    window.dispatchEvent(
      new StorageEvent("storage", {
        key,
        oldValue: window.localStorage.getItem("key"),
        newValue: value,
        storageArea: window.localStorage,
      })
    );
    originalLocalSetItem(key, value);
  };

  window.sessionStorage.setItem = (key, value) => {
    window.dispatchEvent(
      new StorageEvent("storage", {
        key,
        oldValue: window.sessionStorage.getItem("key"),
        newValue: value,
        storageArea: window.sessionStorage,
      })
    );
    originalSessionSetItem(key, value);
  };

  // listen for change
  // handler
  const handleSetItem = (key: string, value: any, map: StorageMap) => {
    if (key in map) {
      map[key].value = value;
    }
  };
}

// implement
// TODO: COMMENT NEED
export function useStorage<T>(
  key: string,
  defaultValue?: T,
  storage: Storage = window.localStorage
) {
  // TODO: ENHANCE SSR
  if (isServer) return { value: null };

  const storageMap = (
    storage === window.localStorage ? localStorageMap : sessionStorageMap
  ) as StorageMap<T>;
  const update = (value: T | null) => {
    storage!.setItem(key, write(value));
    return value;
  };

  const item = reactive(
    storageMap[key] ??
      (storageMap[key] = ref(
        update(read(storage.getItem(key), defaultValue))
      ) as Ref<T | null>)
  );

  watch(item, () => update(item.value), {
    flush: "post",
    deep: true,
  });

  return item;
}
