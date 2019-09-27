<!--
 * @Author: zhangHang
 * @Date: 2019-07-04 09:38:42
 * @Description: file content
 -->
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
            <li @click="jumpWeb(WAPHOST +'protocol.html')">
                <div class="left">用户协议</div>
            </li>
        </ul>
    </section>

    <div class="copyright">
        <div class="hd">CopyRight © 2010-2019</div>
        <div class="ft">版权所有 减付宝公司</div>
    </div>
</div>
</template>

<script>
import { WAPHOST } from '@/config/base'
export default {
    data() {
        return {
            WAPHOST
        }
    },
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
            this.$router.push({
                path: `/pages/web/main?url=${encodeURIComponent(page)}`
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
.copyright{
    text-align: center;
    margin-top: 200rpx;
    color: #8d8d8d;
    text-shadow: 1px 1px #ededed;
}
</style>
