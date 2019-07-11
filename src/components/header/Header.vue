<template>
<header class="hd-warp">
    <div class="top">
        <div class="location">西安市<img src="/static/img/back.png" class="icon"></div>
        <div class="search" @click="jumpSearch">
            <img src="/static/img/ic-search.png" class="icon">请输入搜索内容
        </div>
    </div>
</header>
</template>

<script>
export default {
    name: "JFBHeader",
    components: {},
    methods: {
        jumpSearch() {
            mpvue.navigateTo({
                url: '/pages/search/main'
            })
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/common/variables.scss";
.hd-warp {
    height: 80rpx;
    .top{
        background: $base-color;
        padding: 0 24rpx;
        height: 80rpx;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        display: flex;
        align-items: center;
        z-index: 9999;
    }
    .location {
        display: flex;
        color: #fff;
        font-size: 12px;
        align-items: center;
        margin-right: 24rpx;
        flex-shrink: 0;
        .icon {
            display: block;
            margin-left: 5px;
            width: 25rpx;
            height: 25rpx;
            transform: rotate(-90deg)
        }
    }
    .search {
        flex: 1;
        height: 56rpx;
        line-height: 56rpx;
        border-radius: 56rpx;
        background: #fff;
        color: #818181;
        font-size: 10px;
        justify-content: center;
        display: flex;
        align-items: center;
        .icon {
            margin-right: 5px;
            width: 25rpx;
            height: 25rpx;
        }
    }
}
</style>
