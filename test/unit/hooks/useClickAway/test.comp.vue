<template>
<div>
    <button ref="buttonRef">click me outside</button><br />
    <span>{{ count }}</span>
</div>
</template>

<script>
import {
    ref,
    onMounted
} from 'vue';
import useClickAway from '@hooks/useClickAway';

export default {
    setup() {
        const count = ref(0);
        const buttonRef = ref();

        onMounted(() => {
            useClickAway(() => {
                count.value += 1;
            }, buttonRef);
        });

        return {
            count,
            buttonRef,
        };
    },
};
</script>
