<template>
  <div>
    <span>{{ state.count }}</span>
    <button id="inc" @click="dispatch({ type: 'inc' })">inc</button>
    <button id="dec" @click="dispatch({ type: 'dec' })">dec</button>
    <button
      id="reset"
      @click="dispatch({ type: 'reset' })"
    >
      reset
    </button>
  </div>
</template>

<script lang="ts">
import useReducer from '@hooks/useReducer';

export default {
  setup() {
    let initialCount = 0;
    const [state, dispatch] = useReducer(
      reducer,
      { count: initialCount },
      init,
    );

    function init() {
      return { count: initialCount + 8 };
    }

    function reducer(state, action) {
      switch (action.type) {
        case 'inc':
          return { count: state.count + 1 };
        case 'dec':
          return { count: state.count - 1 };
        case 'reset':
          return init();
        default:
          return state;
      }
    }

    return {
      state,
      dispatch,
    };
  },
};
</script>
