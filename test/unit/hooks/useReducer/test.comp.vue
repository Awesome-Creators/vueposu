<template>
  <div>
    <span>{{ state.count }}</span>
    <button id="inc" @click="dispatch({ type: 'inc' })">inc</button>
    <button id="dec" @click="dispatch({ type: 'dec' })">dec</button>
  </div>
</template>

<script lang="ts">
import useReducer from '@hooks/useReducer';

export default {
  setup() {
    const [state, dispatch] = useReducer(reducer, { count: 0 });
    function reducer(state, action) {
      switch (action.type) {
        case 'inc':
          return { count: state.count + 1 };
        case 'dec':
          return { count: state.count - 1 };
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
