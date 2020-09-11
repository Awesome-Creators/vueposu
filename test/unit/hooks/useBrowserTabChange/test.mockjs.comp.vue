<template>
  <div>
    <span id="leaveRef">{{ $leaveRef }}</span>
    <span id="backRef">{{ $backRef }}</span>
  </div>
</template>

<script lang="ts">
import useBrowserTabChange from '@hooks/useBrowserTabChange';

export default {
  setup() {
    const [$leaveRef, $backRef] = useBrowserTabChange('屁股我们能' as any);
    return { $leaveRef, $backRef };
  },
};
</script>
