<template>
<div class="container">
    <header class="info">
        <img class="logo" src="/static/more/logo.png" />
        <img class="title" src="/static/more/title.png" />
    </header>

    <section class="bd-warp">
        <ul class="cell">
            <li>
                <div class="left">版本</div>
                <div class="right">当前版本1.0.0</div>
            </li>
            <li @click="jumpWeb('http://wap2.qmwjj.cc/shop')">
                <div class="left">用户协议</div>
            </li>
        </ul>
    </section>

</div>
</template>

<script>
export default {
    methods: {
        swiperchange(e) {
            if (e.type !== 'change') {
                return
            }
            let offset = 0;
            let oIndex = e.mp.detail.current;
            this.stv.offset = this.stv.lineWidth * oIndex
            this.activeTab = oIndex;
            this.getVisitedShop(oIndex)
        },
        jumpWeb(page) {
            mpvue.navigateTo({
                url: `/pages/web/main?url=${page}`
                // url: `/pages/web/main?url=${encodeURIComponent(page)}`
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.info{
    padding: 40rpx;
    text-align: center;
    background: #fff;
    margin-bottom: 20rpx;
    img{
        display: block;
        margin: 40rpx auto;
    }
    .logo{
        width: 160rpx;
        height: 160rpx;
    }
    .title{
        width: 300rpx;
        height: 35rpx;
    }
}
.cell{
    li{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 24rpx;
        .right{
            flex: 1;
        }
        &::after{
            flex-grow: 0;
            content: '';
            width: 15rpx;
            height: 30rpx;
            margin-left: 20rpx;
            background-image: url(~@/assets/img/icon_click_right_list.png);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }
    }
}
</style>
