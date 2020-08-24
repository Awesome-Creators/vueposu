<template>
  <div>
    hello {{ text }}
    <span>{{ String(status) }}</span>
    <button id="toggle" @click="toggle()">toggle</button>
    <button id="boy" @click="toggle('boy next door')">set boy next door</button>
    <button id="left" @click="setLeft">set left</button>
    <button id="right" @click="setRight">set right</button>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import useToggle from './useToggle';

export default {
  setup() {
    const state = reactive({
      text: 'test',
    });
    const [status, toggles] = useToggle(false);

    return {
      status,
      ...toggles,
      ...toRefs(state),
    };
  },
};
</script>
