<!--
 * @Author: zhangHang
 * @Date: 2019-05-16 10:28:57
 * @Description: file content
 -->
<template>
    <ul class="footer border-top"  v-if="infoData.check || infoData.is_shopping">
        <li class="item" @click="switchMine()">
            <div class="meun">
                <img class="icon" src="/static/tabs/mine2.png">
                <p class="text">我的</p>
            </div>
        </li>
        <li class="item" v-if="infoData.is_shopping" @click="jumpGoods()">
            <div class="meun">
                <img class="icon" src="/static/tabs/shop.png">
                <p class="text">购物车</p>
            </div>
        </li>
        <li class="item">
            <div class="btn payout" @click="jumpPages('recharge')">立即充值</div>
        </li>
        <li class="item">
            <div class="btn vippay" @click="jumpPages('paythebill')">立即买单</div>
        </li>
    </ul>
</template>

<script type="text/babel">
import { mapState } from 'vuex';
import { WAPHOST } from "@/config/base";
export default {
    name: 'footer',
    data() {
        return {
            shop_id: ''
        };
    },
    props: {
        infoData: Object
    },
    onLoad (options) {
        this.shop_id = options.shop_id;
        console.log(this.infoData);
    },
    methods: {
        jumpPages(type) {
            this.$router.push({
                path: `/pages/shop/${type}/main?shop_id=${this.shop_id}`
            })
        },
        switchMine() {
            this.$router.push({
                path: '/pages/mine/index/main',
                reLaunch: true
            })
        },
        jumpGoods() {
            const page = WAPHOST + "goods?shop_id=" + this.shop_id + "&token=" + mpvue.getStorageSync('token')
            this.$router.push({
                path: `/pages/web/main?url=${encodeURIComponent(page)}`
            })
        },
    },
};
</script>


<style lang="scss" scoped>
.footer{
    background: #fff;
    height: 100rpx;
    position: fixed;
    left:0;
    bottom:0;
    right: 0;
    display: flex;
    align-items: center;
    padding-right: 10rpx;
    .item{
        flex: 1;
    }
    .meun{
        text-align: center;
        font-size: 0;
        .icon{
            width: 40rpx;
            height: 40rpx;
            background-size: auto 40rpx;
            background-position:center;
            background-repeat: no-repeat;
            margin: 0 auto;
        }
        .text{
            margin-top: 6rpx;
            line-height: 1;
            font-size: 10px;
            color: #323232;
        }
    }
    .btn{
        background: #ff4400;
        color: #fff;
        font-size: 15px;
        font-weight: 400;
        height: 78rpx;
        width: 230rpx;
        line-height: 78rpx;
        text-align: center;
        border-radius: 78rpx;
        margin: 0 8rpx;
        &.payout{
            background: linear-gradient(to right,#ffc54a, #fea21d);
        }
        &.vippay{
            background: linear-gradient(to right,#ff551a, #e9090a);
        }
    }
}
</style>


