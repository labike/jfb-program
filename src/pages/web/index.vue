<template>
    <web-view :src="h5Url"></web-view>
</template>

<script>
export default {
    data() {
        return {
            h5Url: 'http://wap.qmwjj.cc/shop'
        }
    },
    onLoad (options) {
        this.h5Url = options.url + '#wechat_redirect'
    },
}
</script>