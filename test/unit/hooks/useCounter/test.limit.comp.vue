<template>
  <div>
    <span>{{ count }}</span>
    <button id="inc" @click="inc(2)">inc</button>
    <button id="dec" @click="dec">dec</button>
    <button id="set" @click="set(2)">set</button>
    <button id="reset" @click="reset">reset</button>
  </div>
</template>

<script lang="ts">
import useCounter from '@hooks/useCounter';

export default {
  setup() {
    const [count, actions] = useCounter(-10, {
      min: 0,
      max: 10,
    });

    return {
      count,
      ...actions,
    };
  },
};
</script>
