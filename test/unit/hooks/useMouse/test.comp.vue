<template>
  <div>
    <p>
      pageX:
      <span id="page-x">{{pageX}}</span>
    </p>
    <p>
      pageY:
      <span id="page-y">{{pageY}}</span>
    </p>
    <p>
      screenX:
      <span id="screen-x">{{screenX}}</span>
    </p>
    <p>
      screenY:
      <span id="screen-x">{{screenY}}</span>
    </p>
    <p>
      clientX:
      <span id="client-x">{{clientX}}</span>
    </p>
    <p>
      clientY:
      <span id="client-x">{{clientY}}</span>
    </p>
  </div>
</template>

<script lang="ts">
import useMouse from '@hooks/useMouse';

export default {
  setup() {
    const state = useMouse();

    return {
      ...state.value,
    };
  },
};
</script>