<!--
 * @Author: zhangHang
 * @Date: 2019-07-04 15:55:22
 * @Description: file content
 -->
<template>
    <web-view v-if="h5Url" :src="h5Url" 
        @message="postMessage"
        @load="pageLoad"
    ></web-view>
</template>

<script>
export default {
    data() {
        return {
            h5Url: ''
        }
    },
    onLoad (options) {
        mpvue.showNavigationBarLoading()
        this.h5Url = decodeURIComponent(options.url)       
        console.log(this.h5Url);
        
    },
    methods: {
        postMessage(e) {
            console.log(e)
        },
        pageLoad() {
            mpvue.hideNavigationBarLoading()
        }
    },
}
</script>