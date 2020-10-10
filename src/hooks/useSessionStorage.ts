import useWebStorage from './useWebStorage';

const useSessionStorage = (key, defaultValue) =>
  useWebStorage(key, defaultValue, sessionStorage);

export default useSessionStorage;
