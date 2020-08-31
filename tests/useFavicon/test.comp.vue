<template>
  <div id="click" @click="changeIcon('https://www.another.com/icon.ico')">testing</div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import useFavicon from '../../src/useFavicon';

export default {
  setup() {
    const [changeIcon] = useFavicon('https://www.test.com/icon.ico');
    return {
      changeIcon,
    };
  },
};
</script>
