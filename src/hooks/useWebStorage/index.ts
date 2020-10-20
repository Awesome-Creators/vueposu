import { ref, computed, getCurrentInstance } from 'vue-demi';
import { read, write } from './serializer';
import { localStorageMap, sessionStorageMap } from './map';

import type { StorageMap } from './map';
type RemoveItemEvent = Event & { key: string };
type SetItemEvent = RemoveItemEvent & { value: any };

const originalLocalSetItem = localStorage.setItem.bind(localStorage);
const originalSessionSetItem = sessionStorage.setItem.bind(sessionStorage);
const originalLocalRemoveItem = localStorage.removeItem.bind(localStorage);
const originalSessionRemoveItem = sessionStorage.removeItem.bind(
  sessionStorage,
);
const originalLocalClear = localStorage.clear.bind(localStorage);
const originalSessionClear = sessionStorage.clear.bind(sessionStorage);

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
  console.log(key, value);
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
window.addEventListener('sessionSetItemEvent', ({ key, value }: SetItemEvent) =>
  handleSetItem(key, value, sessionStorageMap),
);
// removeItem
window.addEventListener('localRemoveItemEvent', ({ key }: RemoveItemEvent) =>
  handleSetItem(key, null, localStorageMap),
);
window.addEventListener('sessionRemoveItemEvent', ({ key }: RemoveItemEvent) =>
  handleSetItem(key, null, sessionStorageMap),
);
// clear
window.addEventListener('localClearEvent', () => handleClear(localStorageMap));
window.addEventListener('sessionClearEvent', () =>
  handleClear(sessionStorageMap),
);

// implement
// TODO: COMMENT NEED
export default function useWebStorage<T>(
  key: string,
  defaultValue?: T,
  storage: Storage = window.localStorage,
) {
  if (getCurrentInstance()) {
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
      storageMap[key] ||
      (storageMap[key] = ref(update(read(storage.getItem(key), defaultValue))));

    return computed({
      get: () => item.value,
      set: value => {
        item.value = update(value);
      },
    });
  } else {
    throw new Error(
      'Invalid hook call: `useWebStorage` can only be called inside of `setup()`.',
    );
  }
}
