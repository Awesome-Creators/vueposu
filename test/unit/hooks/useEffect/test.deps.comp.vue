<template>
  <div>{val}}</div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import useEffect from '@hooks/useEffect';

export default {
  setup() {
    const val = ref((window as any).testDepsEffect);
    const val2 = ref(0);

    useEffect(() => {
      (window as any).testDepsSpy();
      if (val2.value === 20) {
        (window as any).testDepsEffect = 20;
      }
      return () => {
        val.value = 1;
        (window as any).testDepsEffect = 0;
      };
    }, [val2]);

    onMounted(() => {
      setTimeout(() => {
        val2.value = 20;
      }, 200);
    });

    return {
      val,
    };
  },
};
</script>
