<template>
  <div>
    <span>{{ String(status) }}</span>
    <button id="toggle" @click="toggle()">toggle</button>
    <button id="boy" @click="toggle('boy next door')">set boy next door</button>
    <button id="left" @click="setLeft">set left</button>
    <button id="right" @click="setRight">set right</button>
  </div>
</template>

<script lang="ts">
import useToggle from '@hooks/useToggle';

export default {
  setup() {
    const [status, toggles] = useToggle('open', 'close');

    return {
      status,
      ...toggles,
    };
  },
};
</script>
