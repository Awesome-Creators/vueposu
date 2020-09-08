<template>
  <div>
    <span>{{ count }}</span>
    <button id="add" @click="setCount(count + 1)">add</button>
    <button id="minus" @click="setCount(count - 1)">minus</button>
    <button
      id="not-working"
      @click="
        () => {
          count = 5;
        }
      "
    >
      not working
    </button>
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
