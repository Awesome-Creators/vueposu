<template>
  <div>
    hello {{text}}
    <span>{{String(status)}}</span>
  </div>
</template>

<script>
import useToggle from "./useToggle";

export default {
  setup() {
    const [status, toggle] = useToggle(false);
    return { status, toggle };
  },
  data() {
    return {
      text: "test",
    };
  },
};
</script>
