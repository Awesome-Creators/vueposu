<template>
  <div>
    <span>{{ count }}</span>
    <button id="inc" @click="inc(1)">inc</button>
    <button id="dec" @click="dec">dec</button>
    <button id="set" @click="set(2)">set</button>
    <button id="reset" @click="reset">reset</button>
  </div>
</template>

<script lang="ts">
import useCounter from '@hooks/useCounter';

export default {
  setup() {
    const [count, actions] = useCounter(12n, {
      min: 0n,
      max: 11n,
      granularity: 2n
    });

    console.log(count.value)

    return {
      count,
      ...actions,
    };
  },
};
</script>
