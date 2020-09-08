<template>
  <div>
    <span>{{ count }}</span>
    <button id="add" @click="add">add</button>
    <button id="minus" @click="minus">minus</button>
  </div>
</template>

<script lang="ts">
import useState from '@hooks/useState';

export default {
  setup() {
    const [count, setCount] = useState(0);
    return {
      count,
      add: () => setCount(count + 1),
      minus: () => setCount(count - 1),
    };
  },
};
</script>
