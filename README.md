<p align="center">

# VUEPOSU

Vue's Eternal Pose (永久指针, 永久指針エターナルポース, Etānaru Pōsu)

(A hooks library based on Vue composition-api)

[![CircleCI](https://circleci.com/gh/Awesome-Creators/vueposu/tree/develop.svg?style=svg&circle-token=74859479154a741060b1bd036508b21782ae7424)](https://app.circleci.com/pipelines/github/Awesome-Creators/vueposu?branch=develop) [![codecov](https://codecov.io/gh/Awesome-Creators/vueposu/branch/develop/graph/badge.svg?token=FA4WQGNR20)](https://codecov.io/gh/Awesome-Creators/vueposu)

</p>

## 📦 INSTALLATION

Works for both Vue 3 and 2, but if you are using `vue2` must ensure installed `@vue/composition-api`

### vue 3

```bash
npm i vueposu
# or
yarn add vueposu
```

### vue 2

```bash
npm i vueposu @vue/composition-api
# or
yarn add vueposu @vue/composition-api
```

## 🍳 USAGE

```ts
import { useCounter } from 'vueposu';

const Component = defineComponent({
  setup() {
    // create a counter
    const { count, inc, dec, set, reset } = useCounter(0);

    return {
      count,
      inc,
      dec,
      set,
      reset,
    };
  },
});
```

## 🚀 API

Currently supported functions

- DOM

  <!-- - [`useAudio`](https://vueposu.now.sh/useAudio.html) -->

  - [`useBrowserTabChange`](https://vueposu.now.sh/useBrowserTabChange.html)
  - [`useClickAway`](https://vueposu.now.sh/useClickAway.html)
  - [`useClipboard`](https://vueposu.now.sh/useClipboard.html)
  - [`useFavicon`](https://vueposu.now.sh/useFavicon.html)
  - [`useFullscreen`](https://vueposu.now.sh/useFullscreen.html)
  - [`useMouse`](https://vueposu.now.sh/useMouse.html)
  - [`useScroll`](https://vueposu.now.sh/useScroll.html)
  <!-- - [`useScrollTo`](https://vueposu.now.sh/useScrollTo.html) -->
  - [`useTitle`](https://vueposu.now.sh/useTitle.html)

- FUNCTIONALITY

  <!-- - [`useCalculator`](https://vueposu.now.sh/useCalculator.html) -->

  - [`useCounter`](https://vueposu.now.sh/useCounter.html)
  - [`useCounterInterval`](https://vueposu.now.sh/useCounterInterval.html)
  - [`useDebounce`](https://vueposu.now.sh/useDebounce.html)
  - [`useDebounceFn`](https://vueposu.now.sh/useDebounceFn.html)
  - [`useDynamicList`](https://vueposu.now.sh/useDynamicList.html)
  <!-- - [`useEventEmitter`](https://vueposu.now.sh/useEventEmitter.html) -->
  - [`useQueue`](https://vueposu.now.sh/useQueue.html)
  <!-- - [`useRaf`](https://vueposu.now.sh/useRaf.html) -->
  - [`useRequest`](https://vueposu.now.sh/useRequest.html)
  - [`useSet`](https://vueposu.now.sh/useSet.html)
  - [`useSWR`](https://vueposu.now.sh/useSWR.html)
  - [`useThrottle`](https://vueposu.now.sh/useThrottle.html)
  - [`useThrottleFn`](https://vueposu.now.sh/useThrottleFn.html)
  - [`useToggle`](https://vueposu.now.sh/useToggle.html)
  <!-- - [`useTrace`](https://vueposu.now.sh/useTrace.html) -->

- CACHE

  <!-- - [`useCookie`](https://vueposu.now.sh/useCookie.html) -->

  - [`useWebStorage`](https://vueposu.now.sh/useWebStorage.html)
  - [`useLocalStorage`](https://vueposu.now.sh/useLocalStorage.html)
  - [`useSessionStorage`](https://vueposu.now.sh/useSessionStorage.html)

- SIDE EFFECT

  - [`useDebounceEffect`](https://vueposu.now.sh/useDebounceEffect.html)
  - [`useInterval`](https://vueposu.now.sh/useInterval.html)
  - [`useThrottleEffect`](https://vueposu.now.sh/useThrottleEffect.html)
  - [`useTimeout`](https://vueposu.now.sh/useTimeout.html)
