<template>
  <div>
    <span id="leave">{{ $leave }}</span>
    <span id="back">{{ $back }}</span>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import useBrowserTabChange from '@hooks/useBrowserTabChange';

export default {
  setup() {
    const $leave = ref(false);
    const $back = ref(true);
    useBrowserTabChange({
      leave: () => {
        $leave.value = true;
        $back.value = false;
      },
      back: () => {
        $leave.value = false;
        $back.value = true;
      },
    });
    return { $leave, $back };
  },
};
</script>
