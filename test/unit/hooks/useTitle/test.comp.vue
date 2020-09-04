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
    useTitle('c');

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
