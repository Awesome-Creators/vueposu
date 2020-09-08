<template>
  <div>
    <span>{{ count }}</span>
    <button id="add" @click="setCount(prev => prev + 1)">add</button>
    <button id="minus" @click="setCount(prev => prev - 1)">minus</button>
  </div>
</template>

<script lang="ts">
import useState from '@hooks/useState';

export default {
  setup() {
    const [count, setCount] = useState(() => 0);
    return {
      count,
      setCount,
    };
  },
};
</script>
