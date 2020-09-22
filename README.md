<div align="center">

# VUEPOSE

Vue's Eternal Pose (永久指针, 永久指針エターナルポース, Etānaru Pōsu)

(A hook library based on vue composition-api)

[![CircleCI](https://circleci.com/gh/Awesome-Creators/vuepose.svg?style=svg&circle-token=74859479154a741060b1bd036508b21782ae7424)](https://circleci.com/gh/Awesome-Creators/vuepose) [![codecov](https://codecov.io/gh/Awesome-Creators/vuepose/branch/master/graph/badge.svg?token=FA4WQGNR20)](https://codecov.io/gh/Awesome-Creators/vuepose)

</div>

## 📦 INSTALLATION

Works for both Vue 3 and 2, but if you are using `vue2` must ensure installed `@vue/composition-api`

### vue 3

```bash
npm install vuepose
# or
yarn add vuepose
```

### vue 2

```bash
npm install vuepose @vue/composition-api
# or
yarn add vuepose @vue/composition-api
```

## 🍳 USAGE

```ts
import { useCounter, useMouse } from 'vuepose';

const Component = defineComponent({
  setup() {
    // tracks mouse position
    const { pageX, pageY } = useMouse();

    // create a counter
    const [count, ...actions] = useCounter(0);

    // change title
    const title = useTitle('hello vuepose');

    // get a queue
    const [queue, ...queueMethods] = useQueue([1, 2, 3]);

    return { count, pageX, pageY, title, actions, queueMethods };
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
  - [ ] useInterval
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
