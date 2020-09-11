<template>
  <div>
    <p>test useTitle</p>
  </div>
</template>

<script lang="ts">
import useTitle from '@hooks/useTitle';

export default {
  setup() {
    useTitle('a', () => {
      (window as any).testUseTitleSideEffect = 1;
    });
    return {};
  },
};
</script>
