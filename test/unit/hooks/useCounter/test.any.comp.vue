<template>
  <div>
    <span>{{ count }}</span>
    <button id="inc" @click="inc(0.1)">inc</button>
    <button id="dec" @click="dec">dec</button>
    <button id="set" @click="set(8)">set</button>
    <button id="set-with-callback" @click="set(v => v + 2)">set with callback</button>
    <button id="reset" @click="reset">reset</button>
  </div>
</template>

<script lang="ts">
import useCounter from '@hooks/useCounter';

export default {
  setup() {
    const [count, actions] = useCounter('屁股我们能' as any, {
      granularity: '男孩下个门' as any,
    });

    return {
      count,
      ...actions,
    };
  },
};
</script>
