import useWebStorage from './useWebStorage';

const useLocalStorage = (key, defaultValue) => useWebStorage(key, defaultValue);

export default useLocalStorage;
