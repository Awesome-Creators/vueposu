import { ref, computed, watch } from 'vue-demi';
import { read, write } from './serializer';
import { localStorageMap, sessionStorageMap } from './map';
import { noop } from 'lodash-es';
import throttle from '../../libs/throttle';
import { isServer, isEqual } from '../../libs/helper';

import type { StorageMap } from './map';
type RemoveItemEvent = Event & { key: string };
type SetItemEvent = RemoveItemEvent & { value: any };

let originalLocalSetItem = noop;
let originalSessionSetItem = noop;
let originalLocalRemoveItem = noop;
let originalSessionRemoveItem = noop;

if (!isServer) {
  originalLocalSetItem = window.localStorage.setItem.bind(localStorage);
  originalSessionSetItem = window.sessionStorage.setItem.bind(sessionStorage);
  originalLocalRemoveItem = window.localStorage.removeItem.bind(localStorage);
  originalSessionRemoveItem = window.sessionStorage.removeItem.bind(
    sessionStorage,
  );
  const originalLocalClear = window.localStorage.clear.bind(localStorage);
  const originalSessionClear = window.sessionStorage.clear.bind(sessionStorage);

  // override
  window.localStorage.setItem = (key, value) => {
    const event = new Event('localSetItemEvent') as SetItemEvent;
    event.key = key;
    event.value = value;
    window.dispatchEvent(event);
    originalLocalSetItem(key, value);
  };

  window.sessionStorage.setItem = (key, value) => {
    const event = new Event('sessionSetItemEvent') as SetItemEvent;
    event.key = key;
    event.value = value;
    window.dispatchEvent(event);
    originalSessionSetItem(key, value);
  };

  window.localStorage.removeItem = key => {
    const event = new Event('localRemoveItemEvent') as SetItemEvent;
    event.key = key;
    window.dispatchEvent(event);
    originalLocalRemoveItem(key);
  };

  window.sessionStorage.removeItem = key => {
    const event = new Event('sessionRemoveItemEvent') as SetItemEvent;
    event.key = key;
    window.dispatchEvent(event);
    originalSessionRemoveItem(key);
  };

  window.localStorage.clear = () => {
    const event = new Event('localClearEvent');
    window.dispatchEvent(event);
    originalLocalClear();
  };

  window.sessionStorage.clear = () => {
    const event = new Event('sessionClearEvent');
    window.dispatchEvent(event);
    originalSessionClear();
  };

  // listen for change

  // handler
  const handleSetItem = (key: string, value: any, map: StorageMap) => {
    if (key in map) {
      map[key].value = value;
    }
  };
  const handleClear = (map: StorageMap) => {
    Object.values(map).forEach(item => (item.value = null));
  };

  // setItem
  window.addEventListener('localSetItemEvent', ({ key, value }: SetItemEvent) =>
    handleSetItem(key, value, localStorageMap),
  );
  window.addEventListener(
    'sessionSetItemEvent',
    ({ key, value }: SetItemEvent) =>
      handleSetItem(key, value, sessionStorageMap),
  );
  // removeItem
  window.addEventListener('localRemoveItemEvent', ({ key }: RemoveItemEvent) =>
    handleSetItem(key, null, localStorageMap),
  );
  window.addEventListener(
    'sessionRemoveItemEvent',
    ({ key }: RemoveItemEvent) => handleSetItem(key, null, sessionStorageMap),
  );
  // clear
  window.addEventListener('localClearEvent', () =>
    handleClear(localStorageMap),
  );
  window.addEventListener('sessionClearEvent', () =>
    handleClear(sessionStorageMap),
  );
  window.addEventListener(
    'focus',
    throttle(() => {
      Object.keys(localStorageMap).forEach(key => {
        const oldValue = localStorageMap[key].value;
        const newValue = read(window.localStorage.getItem(key), oldValue);
        if (!isEqual(oldValue, newValue)) {
          localStorageMap[key].value = newValue;
        }
      });
      Object.keys(sessionStorageMap).forEach(key => {
        const oldValue = sessionStorage[key].value;
        const newValue = read(window.sessionStorage.getItem(key), oldValue);
        if (!isEqual(oldValue, newValue)) {
          sessionStorage[key].value = newValue;
        }
      });
    }, 100),
  );
}

// implement
// TODO: COMMENT NEED
export default function useStorage<T>(
  key: string,
  defaultValue?: T,
  storage?: Storage,
) {
  // TODO: ENHANCE SSR
  if (isServer) return { value: null };

  storage = storage ?? window.localStorage;

  const storageMap =
    storage === window.localStorage ? localStorageMap : sessionStorageMap;
  const setItem =
    storage === window.localStorage
      ? originalLocalSetItem
      : originalSessionSetItem;
  const removeItem =
    storage === window.localStorage
      ? originalLocalRemoveItem
      : originalSessionRemoveItem;
  const update = value => {
    if (value === null) {
      removeItem(key);
    } else {
      setItem(key, write(value));
    }
    return value;
  };

  const item =
    storageMap[key] ??
    (storageMap[key] = ref(update(read(storage.getItem(key), defaultValue))));

  watch(
    item,
    () => {
      update(item.value);
    },
    {
      flush: 'post',
      deep: true,
    },
  );

  return computed({
    get: () => item.value,
    set: value => {
      item.value = update(value);
    },
  });
}
