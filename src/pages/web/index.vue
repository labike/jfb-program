<template>
    <web-view v-if="h5Url" :src="h5Url" @message="postMessage"></web-view>
</template>

<script>
export default {
    data() {
        return {
            h5Url: ''
        }
    },
    onLoad (options) {
        this.h5Url = decodeURIComponent(options.url)
        console.log(this.h5Url);
        
    },
    methods: {
        postMessage(e) {
            console.log(e)
        },
    },
}
</script>