<template>
  <div>
    <p>test useTitle</p>
    <Sub v-if="show" />
    <button id="show" @click="() => (show = !show)">show</button>
    <br />
  </div>
</template>

<script lang="ts">
import { h, ref } from 'vue';
import useTitle from '@hooks/useTitle';
import { isUndefined } from '@libs/helper';

export default {
  components: {
    Sub: {
      setup() {
        useTitle('d');
      },
      render() {
        return h('div', {}, 'sub test useTitle');
      },
    },
  },
  setup() {
    const show = ref(true);

    useTitle('a');
    useTitle('b');
    useTitle('b');
    useTitle('c', () => {
      if (!isUndefined((window as any).testUseTitleCallback)) {
        (window as any).testUseTitleCallback = 1;
      }
    });

    function useTitleByEvent() {
      useTitle('e');
    }

    return {
      show,
      useTitleByEvent,
    };
  },
};
</script>
