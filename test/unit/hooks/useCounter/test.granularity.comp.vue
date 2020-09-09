<template>
  <div>
    <span>{{ count }}</span>
    <button id="inc" @click="inc">inc</button>
    <button id="dec" @click="dec">dec</button>
    <button id="dec-to-min" @click="dec(99)">dec</button>
    <button id="set-callback" @click="set(v => v + 0.1)">set-callback</button>
    <button id="reset" @click="reset">reset</button>
  </div>
</template>

<script lang="ts">
import useCounter from '@hooks/useCounter';

export default {
  setup() {
    const [count, actions] = useCounter(0.2, {
      min: 0,
      granularity: 0.1,
    });

    return {
      count,
      ...actions,
    };
  },
};
</script>
