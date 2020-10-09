import useSWR, { trigger, mutate } from './useSWR';
import { useSWRGlobalConfig } from './config';

// types
export * from './types';

export { trigger, mutate, useSWRGlobalConfig };
export default useSWR;
