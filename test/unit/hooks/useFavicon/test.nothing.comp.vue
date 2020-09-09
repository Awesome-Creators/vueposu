<template>
  <div></div>
</template>

<script lang="ts">
import useFavicon from '@hooks/useFavicon';

export default {
  setup() {
    const [changeIcon] = useFavicon();
    return {
      changeIcon,
    };
  },
};
</script>
