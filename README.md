<div align="center">
  <h1>
    <br />
    <br />
    VUEPOSU
    <br />
    <br />
    <br />
    <br />
  </h1>
  <sup>
    <br />
    <br />
    <a href="https://app.circleci.com/pipelines/github/Awesome-Creators/vueposu?branch=develop">
      <img src="https://circleci.com/gh/Awesome-Creators/vueposu/tree/develop.svg?style=svg&circle-token=74859479154a741060b1bd036508b21782ae7424" alt="CircleCI" />
    </a>
    <a href="https://codecov.io/gh/Awesome-Creators/vueposu">
      <img src="https://codecov.io/gh/Awesome-Creators/vueposu/branch/develop/graph/badge.svg?token=FA4WQGNR20" alt="codecov" />
    </a>
    <br />
    <br />
    🧭 Vue's Eternal Pose (永久指针, 永久指針エターナルポース, Etānaru Pōsu)
    <br />
    (A hooks library based on <b>Vue Composition-API</b>)
  </sup>
  <br />
  <br />
</div>

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

  <!-- - [`useAudio`](https://vueposu.now.sh/dom/useAudio.html) -->

  - [`useBrowserTabChange`](https://vueposu.now.sh/dom/useBrowserTabChange.html)
  - [`useClickAway`](https://vueposu.now.sh/dom/useClickAway.html)
  - [`useClipboard`](https://vueposu.now.sh/dom/useClipboard.html)
  - [`useEventListener`](https://vueposu.now.sh/dom/useEventListener.html)
  - [`useFavicon`](https://vueposu.now.sh/dom/useFavicon.html)
  - [`useFullscreen`](https://vueposu.now.sh/dom/useFullscreen.html)
  - [`useTitle`](https://vueposu.now.sh/dom/useTitle.html)

- SENSORS

  - [`useMouse`](https://vueposu.now.sh/sensors/useMouse.html)
  - [`useScroll`](https://vueposu.now.sh/sensors/useScroll.html)
  <!-- - [`useScrollTo`](https://vueposu.now.sh/sensors/useScrollTo.html) -->

- STATE

  <!-- - [`useCalculator`](https://vueposu.now.sh/state/useCalculator.html) -->

  - [`useCounter`](https://vueposu.now.sh/state/useCounter.html)
  - [`useCounterInterval`](https://vueposu.now.sh/state/useCounterInterval.html)
  - [`useDynamicList`](https://vueposu.now.sh/state/useDynamicList.html)
  - [`useQueue`](https://vueposu.now.sh/state/useQueue.html)
  - [`useSet`](https://vueposu.now.sh/state/useSet.html)
  - [`useToggle`](https://vueposu.now.sh/state/useToggle.html)

- SWR

  - [`useSWR`](https://vueposu.now.sh/useSWR.html)

- CACHE

  <!-- - [`useCookie`](https://vueposu.now.sh/cache/useCookie.html) -->

  - [`useWebStorage`](https://vueposu.now.sh/cache/useWebStorage.html)
  - [`useLocalStorage`](https://vueposu.now.sh/cache/useLocalStorage.html)
  - [`useSessionStorage`](https://vueposu.now.sh/cache/useSessionStorage.html)

- SIDE EFFECT

  - [`useDebounce`](https://vueposu.now.sh/side-effect/useDebounce.html)
  - [`useDebounceEffect`](https://vueposu.now.sh/side-effect/useDebounceEffect.html)
  - [`useDebounceFn`](https://vueposu.now.sh/side-effect/useDebounceFn.html)
  - [`useEventEmitter`](https://vueposu.now.sh/side-effect/useEventEmitter.html)
  - [`useRequest`](https://vueposu.now.sh/side-effect/useRequest.html)
  - [`useThrottle`](https://vueposu.now.sh/side-effect/useThrottle.html)
  - [`useThrottleEffect`](https://vueposu.now.sh/side-effect/useThrottleEffect.html)
  - [`useThrottleFn`](https://vueposu.now.sh/side-effect/useThrottleFn.html)
  <!-- - [`useTrace`](https://vueposu.now.sh/side-effect/useTrace.html) -->

- ANIMATION

  - [`useInterval`](https://vueposu.now.sh/animation/useInterval.html)
  <!-- - [`useRaf`](https://vueposu.now.sh/animation/useRaf.html) -->
  - [`useTimeout`](https://vueposu.now.sh/animation/useTimeout.html)
