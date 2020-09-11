<template>
  <div>
    <span id="leave">{{ $leave }}</span>
    <span id="back">{{ $back }}</span>
    <span id="leaveRef">{{ $leaveRef }}</span>
    <span id="backRef">{{ $backRef }}</span>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import useBrowserTabChange from '@hooks/useBrowserTabChange';

export default {
  setup() {
    const $leave = ref(false);
    const $back = ref(true);
    const [$leaveRef, $backRef] = useBrowserTabChange({});
    return { $leave, $back, $leaveRef, $backRef };
  },
};
</script>
