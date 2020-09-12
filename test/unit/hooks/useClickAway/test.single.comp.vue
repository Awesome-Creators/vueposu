<template>
  <div>
    <button ref="buttonRef">click me outside</button>
    <br />
    <span>{{ count }}</span>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import useClickAway from '@hooks/useClickAway';

export default {
  setup() {
    const count = ref(0);
    const buttonRef = ref();

    useClickAway(() => {
      count.value += 1;
    }, buttonRef);

    return {
      count,
      buttonRef,
    };
  },
};
</script>
