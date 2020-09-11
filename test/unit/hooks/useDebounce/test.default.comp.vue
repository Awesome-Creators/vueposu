<template>
  <div>
    <span id="count">{{ count }}</span>
    <span id="trigger" @click="fn"></span>
    <span id="cancel" @click="fn.cancel"></span>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import useDebounce from '@hooks/useDebounce';

export default {
  setup() {
    const count = ref(1);
    const fn = useDebounce(() => (count.value = count.value + 1));
    return {
      count,
      fn,
    };
  },
};
</script>
