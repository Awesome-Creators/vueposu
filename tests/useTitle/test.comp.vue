<template>
<div>
    <p>test useTitle</p>
    <sub v-if="show" />
    <button id="show" @click="() => (show = !show)">show</button><br />
    <!-- <button id="error" @click="useTitle('error')">error</button> -->
</div>
</template>

<script>
import {
    h,
    ref
} from 'vue';
import useTitle from '../../src/useTitle';

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

        return {
            show,
            useTitle,
        };
    },
};
</script>
