import { ref, computed, getCurrentInstance } from 'vue-demi';
import { read, write } from './serializer';
import { localStorageMap, sessionStorageMap } from './map';
import throttle from '../../libs/throttle';

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
globalThis.localStorage.setItem = (key, value) => {
  const event = new Event('localSetItemEvent') as SetItemEvent;
  event.key = key;
  event.value = value;
  globalThis.dispatchEvent(event);
  originalLocalSetItem(key, value);
};

globalThis.sessionStorage.setItem = (key, value) => {
  const event = new Event('sessionSetItemEvent') as SetItemEvent;
  event.key = key;
  event.value = value;
  globalThis.dispatchEvent(event);
  originalSessionSetItem(key, value);
};

globalThis.localStorage.removeItem = key => {
  const event = new Event('localRemoveItemEvent') as SetItemEvent;
  event.key = key;
  globalThis.dispatchEvent(event);
  originalLocalRemoveItem(key);
};

globalThis.sessionStorage.removeItem = key => {
  const event = new Event('sessionRemoveItemEvent') as SetItemEvent;
  event.key = key;
  globalThis.dispatchEvent(event);
  originalSessionRemoveItem(key);
};

globalThis.localStorage.clear = () => {
  const event = new Event('localClearEvent');
  globalThis.dispatchEvent(event);
  originalLocalClear();
};

globalThis.sessionStorage.clear = () => {
  const event = new Event('sessionClearEvent');
  globalThis.dispatchEvent(event);
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
globalThis.addEventListener(
  'localSetItemEvent',
  ({ key, value }: SetItemEvent) => handleSetItem(key, value, localStorageMap),
);
globalThis.addEventListener(
  'sessionSetItemEvent',
  ({ key, value }: SetItemEvent) =>
    handleSetItem(key, value, sessionStorageMap),
);
// removeItem
globalThis.addEventListener(
  'localRemoveItemEvent',
  ({ key }: RemoveItemEvent) => handleSetItem(key, null, localStorageMap),
);
globalThis.addEventListener(
  'sessionRemoveItemEvent',
  ({ key }: RemoveItemEvent) => handleSetItem(key, null, sessionStorageMap),
);
// clear
globalThis.addEventListener('localClearEvent', () =>
  handleClear(localStorageMap),
);
globalThis.addEventListener('sessionClearEvent', () =>
  handleClear(sessionStorageMap),
);
globalThis.addEventListener(
  'focus',
  throttle(() => {
    Object.keys(localStorageMap).forEach(key => {
      const value = globalThis.localStorage.getItem(key);
      if (localStorageMap[key].value !== value) {
        localStorageMap[key].value = value;
      }
    });
    Object.keys(sessionStorageMap).forEach(key => {
      const value = globalThis.sessionStorage.getItem(key);
      if (sessionStorage[key].value !== value) {
        sessionStorage[key].value = value;
      }
    });
  }, 100),
);

// implement
// TODO: COMMENT NEED
export default function useWebStorage<T>(
  key: string,
  defaultValue?: T,
  storage: Storage = globalThis.localStorage,
) {
  if (getCurrentInstance()) {
    const storageMap =
      storage === globalThis.localStorage ? localStorageMap : sessionStorageMap;
    const setItem =
      storage === globalThis.localStorage
        ? originalLocalSetItem
        : originalSessionSetItem;
    const removeItem =
      storage === globalThis.localStorage
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
