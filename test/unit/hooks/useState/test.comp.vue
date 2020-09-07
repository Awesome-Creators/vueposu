<template>
  <div>
    <span>{{ count }}</span>
    <button @click="add">add</button>
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
    };
  },
};
</script>
