<template>
  <div>{{val}}</div>
</template>

<script lang="ts">
import { ref } from 'vue';
import useEffect from '@hooks/useEffect';

export default {
  setup() {
    const val = ref((window as any).testNotDepsEffect);

    useEffect(() => {
      return () => {
        val.value = 1;
        (window as any).testNotDepsEffect = 0;
      };
    });

    return {
      val,
    };
  },
};
</script>
