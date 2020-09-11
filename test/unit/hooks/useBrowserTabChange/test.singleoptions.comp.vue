<template>
  <div>
    <span id="count">{{ count }}</span>
    <span id="leaveRef">{{ $leaveRef }}</span>
    <span id="backRef">{{ $backRef }}</span>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import useBrowserTabChange from '@hooks/useBrowserTabChange';

export default {
  setup() {
    const count = ref(0);
    const [$leaveRef, $backRef] = useBrowserTabChange({
      leave: () => {
        count.value += 1;
      },
    });
    return { count, $leaveRef, $backRef };
  },
};
</script>
