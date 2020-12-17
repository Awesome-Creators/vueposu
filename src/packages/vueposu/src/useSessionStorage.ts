import { getCurrentInstance } from 'vue-demi';
import useStorage from './useStorage';

const useSessionStorage = <T>(key: string, defaultValue?: T) => {
  if (getCurrentInstance()) {
    return useStorage(key, defaultValue, window?.sessionStorage);
  } else {
    throw new Error(
      'Invalid hook call: `useSessionStorage` can only be called inside of `setup()`.',
    );
  }
};

export default useSessionStorage;
