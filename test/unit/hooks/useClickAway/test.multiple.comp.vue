<template>
  <div>
    <button ref="buttonRef">click me outside</button>
    <button ref="buttonRef2">
      click me outside
      <button ref="buttonRef3">click me outside</button>
    </button>
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
    const buttonRef2 = ref();
    const buttonRef3 = ref();

    useClickAway(() => {
      count.value += 1;
    }, [buttonRef, buttonRef2, buttonRef3]);

    return {
      count,
      buttonRef,
      buttonRef2,
      buttonRef3,
    };
  },
};
</script>
