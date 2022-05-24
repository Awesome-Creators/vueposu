//  DOM
// export * from './useAudio';
export * from "./useClickOutside";
export * from "./useClipboard";
export * from "./useEventListener";
export * from "./useFavicon";
export * from "./useFullscreen";
export * from "./usePageHidden";
export * from "./useTitle";

//  SENSORS
export * from "./useMouse";
export * from "./useScroll";
// export * from './useScrollTo';

//  STATE
// export * from './useCalculator';
export * from "./useCounter";
export * from "./useCounterInterval";
export * from "./useDynamicList";
export * from "./useQueue";
export * from "./useSet";
export * from "./useToggle";

//  CACHE
export * from "./useCookie";
export * from "./useLocalStorage";
export * from "./useSessionStorage";
export * from "./useStorage";

//  SIDE EFFECT
export * from "./useDebounce";
export * from "./useDebounceEffect";
export * from "./useDebounceFn";
export * from "./useEventEmitter";
export * from "./useRequest";
export * from "./useThrottle";
export * from "./useThrottleEffect";
export * from "./useThrottleFn";
// export * from './useTrace';

//  ANIMATION
export * from "./useInterval";
// export * from './useRaf';
export * from "./useTimeout";

//  SWR
import { useSWR, useSWRGlobalConfig } from "@vueposu/swr";
import * as swr from "@vueposu/swr";
const { useSWR: _, useSWRGlobalConfig: __, ...swrActions } = swr;
export { useSWR, useSWRGlobalConfig, swrActions as swr };