import useStorage from './useStorage';

const useSessionStorage = (key, defaultValue) =>
  useStorage(key, defaultValue, window?.sessionStorage);

export default useSessionStorage;
