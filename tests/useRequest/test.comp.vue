<template>
<div>
    <p>test useRequest</p>
</div>
</template>

<script lang="ts">
import {} from 'vue';
import useRequest from '../../src/useRequest';

export default {
    setup() {
        const {
            data,
            error,
            loading
        } = useRequest({});
        console.log(data)
    },
};
</script>
