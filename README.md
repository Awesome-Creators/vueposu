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
    const [count, { inc, dec, set, reset }] = useCounter(0);

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

  - [x] useTitle
  - [x] useClickAway
  - [x] useFavicon
  - [ ] useAudio
  - [x] useBrowserTabChange
  - [ ] useLocalStorage
  - [x] useMouse
  - [ ] useScrollTo
  - [x] useCopyToClipboard

- FUNCTIONALITY

  - [ ] useTrace
  - [x] useSet
  - [x] useQueue
  - [ ] useTimeout
  - [x] useInterval
  - [ ] useRaf
  - [ ] useEventEmitter
  - [x] useCounter
  - [ ] useCounterInterval
  - [ ] useCalculator
  - [ ] useDynamicList
  - [x] useDebounce
  - [x] useDebounceFn
  - [x] useDebounceEffect
  - [x] useThrottle
  - [x] useThrottleFn
  - [x] useThrottleEffect
  - [x] useToggle
  - [ ] useSwr
  - [ ] etc..
