<template>
  <div>
    <span>{{ count }}</span>
    <button id="inc" @click="setCount(count + 1)">inc</button>
    <button id="dec" @click="setCount(count - 1)">dec</button>
  </div>
</template>

<script lang="ts">
import useState from '@hooks/useState';

export default {
  setup() {
    const [count, setCount] = useState(0);
    return {
      count,
      setCount,
    };
  },
};
</script>
