<br />

<p align="center">
  <a href="https://github.com/Awesome-Creators/vueposu">
    <img src="https://raw.githubusercontent.com/gist/glitchboyl/05f6a8abd2126b56525fa395dcaf9ad6/raw/157d517d36f7f63c100714c1cc5bbce95e1c3aa4/vueposu.svg" alt="logo" width="160"/>
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
    <a href="https://github.com/Awesome-Creators/vueposu/actions/workflows/coverage.yml">
      <img src="https://github.com/awesome-creators/vueposu/actions/workflows/coverage.yml/badge.svg?branch=main" alt="workflow" />
    </a>
    <a href="https://codecov.io/gh/Awesome-Creators/vueposu">
      <img src="https://codecov.io/gh/Awesome-Creators/vueposu/branch/develop/graph/badge.svg?token=FA4WQGNR20" alt="codecov" />
    </a>
  </sup>
</p>

<br />

## 📦 INSTALLATION

Vueposu supports both Vue 3 and 2, but if you are using `Vue 2` must ensure installed `@vue/composition-api`.

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

<!-- ### CDN

```html
<script src="https://unpkg.com/vueposu"></script>
``` -->

<br />

## 🍳 USAGE

```ts
import { useCounter } from "vueposu";

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

  <!-- - [`useAudio`](https://vueposu.netlify.app/dom/useAudio.html) -->

  - [`useClickAway`](https://vueposu.netlify.app/dom/useClickAway.html)
  - [`useClipboard`](https://vueposu.netlify.app/dom/useClipboard.html)
  - [`useEventListener`](https://vueposu.netlify.app/dom/useEventListener.html)
  - [`useFavicon`](https://vueposu.netlify.app/dom/useFavicon.html)
  - [`useFullscreen`](https://vueposu.netlify.app/dom/useFullscreen.html)
  - [`usePageHidden`](https://vueposu.netlify.app/dom/usePageHidden.html)
  - [`useTitle`](https://vueposu.netlify.app/dom/useTitle.html)

- SENSORS

  - [`useMouse`](https://vueposu.netlify.app/sensors/useMouse.html)
  - [`useScroll`](https://vueposu.netlify.app/sensors/useScroll.html)
  <!-- - [`useScrollTo`](https://vueposu.netlify.app/sensors/useScrollTo.html) -->

- STATE

  <!-- - [`useCalculator`](https://vueposu.netlify.app/state/useCalculator.html) -->

  - [`useCounter`](https://vueposu.netlify.app/state/useCounter.html)
  - [`useCounterInterval`](https://vueposu.netlify.app/state/useCounterInterval.html)
  - [`useDynamicList`](https://vueposu.netlify.app/state/useDynamicList.html)
  - [`useQueue`](https://vueposu.netlify.app/state/useQueue.html)
  - [`useSet`](https://vueposu.netlify.app/state/useSet.html)
  - [`useToggle`](https://vueposu.netlify.app/state/useToggle.html)

- SWR

  - [`useSWR`](https://vueposu.netlify.app/useSWR.html)

- CACHE

  <!-- - [`useCookie`](https://vueposu.netlify.app/cache/useCookie.html) -->

  - [`useLocalStorage`](https://vueposu.netlify.app/cache/useLocalStorage.html)
  - [`useSessionStorage`](https://vueposu.netlify.app/cache/useSessionStorage.html)
  - [`useStorage`](https://vueposu.netlify.app/cache/useStorage.html)

- SIDE EFFECT

  - [`useDebounce`](https://vueposu.netlify.app/side-effect/useDebounce.html)
  - [`useDebounceEffect`](https://vueposu.netlify.app/side-effect/useDebounceEffect.html)
  - [`useDebounceFn`](https://vueposu.netlify.app/side-effect/useDebounceFn.html)
  - [`useEventEmitter`](https://vueposu.netlify.app/side-effect/useEventEmitter.html)
  - [`useRequest`](https://vueposu.netlify.app/side-effect/useRequest.html)
  - [`useThrottle`](https://vueposu.netlify.app/side-effect/useThrottle.html)
  - [`useThrottleEffect`](https://vueposu.netlify.app/side-effect/useThrottleEffect.html)
  - [`useThrottleFn`](https://vueposu.netlify.app/side-effect/useThrottleFn.html)
  <!-- - [`useTrace`](https://vueposu.netlify.app/side-effect/useTrace.html) -->

- ANIMATION

  - [`useInterval`](https://vueposu.netlify.app/animation/useInterval.html)
  <!-- - [`useRaf`](https://vueposu.netlify.app/animation/useRaf.html) -->
  - [`useTimeout`](https://vueposu.netlify.app/animation/useTimeout.html)

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

[The MIT License](https://github.com/Awesome-Creators/vueposu/blob/develop/LICENSE).
