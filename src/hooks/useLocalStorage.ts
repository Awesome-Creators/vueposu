import { getCurrentInstance } from 'vue-demi';
import useStorage from './useStorage';

const useLocalStorage = <T>(key: string, defaultValue?: T) => {
  if (getCurrentInstance()) {
    return useStorage(key, defaultValue);
  } else {
    throw new Error(
      'Invalid hook call: `useLocalStorage` can only be called inside of `setup()`.',
    );
  }
};

export default useLocalStorage;
