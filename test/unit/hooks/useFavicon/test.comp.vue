<template>
  <div id="click" @click="changeIcon('https://www.another.com/icon.ico')">testing</div>
  <div id="empty" @click="changeIcon(1)">testing</div>
  <div id="emptyII" @click="changeIcon()">testing</div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import useFavicon from '@hooks/useFavicon';

export default {
  setup() {
    const [changeIcon] = useFavicon('https://www.test.com/icon.ico');
    return {
      changeIcon,
    };
  },
};
</script>
