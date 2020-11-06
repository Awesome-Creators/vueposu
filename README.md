<br />

<p align="center">
  <a href="https://github.com/Awesome-Creators/vueposu">
    <img src="https://raw.githubusercontent.com/gist/glitchboyl/05f6a8abd2126b56525fa395dcaf9ad6/raw/d102e036ddfb240039dd0bbac913ae2d02bc5515/eposu.svg" alt="logo" width="160"/>
  </a>
</p>

<p>
  <h1 align="center">VUEPOSU</h1>
</p>

<p align="center">
  <sup>
    🧭&nbsp;&nbsp;Vue's Eternal Pose (永久指针, 永久指針エターナルポース, Etānaru Pōsu)
    <br />
    (A hooks library based on <b>Vue Composition-API</b>)
    <br />
    <br />
    <a href="https://app.circleci.com/pipelines/github/Awesome-Creators/vueposu?branch=develop">
      <img src="https://circleci.com/gh/Awesome-Creators/vueposu/tree/develop.svg?style=svg&circle-token=74859479154a741060b1bd036508b21782ae7424" alt="CircleCI" />
    </a>
    <a href="https://codecov.io/gh/Awesome-Creators/vueposu">
      <img src="https://codecov.io/gh/Awesome-Creators/vueposu/branch/develop/graph/badge.svg?token=FA4WQGNR20" alt="codecov" />
    </a>
  </sup>
</p>

<br />

## 📦 INSTALLATION

vueposu supports both Vue 3 and 2, but if you are using `Vue 2` must ensure installed `@vue/composition-api`.

### Vue 3

```bash
# install with npm
npm i vueposu

# install with yarn
yarn add vueposu
```

### Vue 2

```bash
# install with npm
npm i vueposu @vue/composition-api

# install with yarn
yarn add vueposu @vue/composition-api
```

### CDN

```html
<script src="https://unpkg.com/vueposu"></script>
```

<br />

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

<br />

## 🚀 API

Currently supported functions:

- DOM

  <!-- - [`useAudio`](https://vueposu.now.sh/dom/useAudio.html) -->

  - [`useClickAway`](https://vueposu.now.sh/dom/useClickAway.html)
  - [`useClipboard`](https://vueposu.now.sh/dom/useClipboard.html)
  - [`useEventListener`](https://vueposu.now.sh/dom/useEventListener.html)
  - [`useFavicon`](https://vueposu.now.sh/dom/useFavicon.html)
  - [`useFullscreen`](https://vueposu.now.sh/dom/useFullscreen.html)
  - [`usePageHidden`](https://vueposu.now.sh/dom/usePageHidden.html)
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


<br />

## Thanks

In no particular order, vueposu is inspired by these great awesome works:

- [react-use](https://github.com/streamich/react-use)
- [vueuse](https://github.com/antfu/vueuse)
- [vue-composable](https://github.com/pikax/vue-composable)
- [vercel/swr](https://github.com/vercel/swr)
- [ahooks](https://github.com/alibaba/hooks)

<br />

## License

The MIT License.
