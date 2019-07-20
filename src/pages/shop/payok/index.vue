<template>
<div class="payok-wrap" v-if="showPayOk">
    <div class="payok" v-if="createOrderReturn">
        <div class="successful">
            <div class="icon-success"></div>
            <div class="text-success">付款成功</div>
            <div class="store" v-if="createOrderReturn.order_name">
                {{createOrderReturn.order_name}}
            </div>
            <div class="price">{{createOrderReturn.actual}}</div>
        </div>

        <div class="order-tools">
            <div class="btn" @click="jumpMy">完成</div>
        </div>
    </div>
    <lay-share :store_id="shareStoreId"></lay-share>
</div>
</template>


<script>
import { apiPayStatus } from "@/api/api";
import { payIsSuccess } from "@/config/base";
import { mapState, mapActions } from "vuex";
import LayShare from "@c/share/Share.vue";
export default {
    name: "PayOK",
    data() {
        return {
            showPayOk: false,
            shareStoreId: null,
        }
    },
    components: {
        LayShare
    },
    onLoad (options) {
        this.order_id = options.order_id;
        wx.showLoading()
        if (!this.createOrderReturn) {
            this.updateOrderReturn(this.order_id)
        }
        apiPayStatus(this.order_id).then(res => {
            if (res.is_pay_success === payIsSuccess.OK) {
                wx.hideLoading();
                this.showPayOk = true
                if (res.order_name === '购物车订单') {
                    // 清空购物车信息
                    this._vm.Lockr.set('cartOrderParam', null);
                    this._vm.Lockr.set('buyCart', {});
                }
                this.shareStoreId = res.store_id 
            }
        }).catch(err => {
            wx.hideLoading();
            wx.showToast({
                title: err.data.msg,
                icon: 'none',
                duration: 2000
            })
        })
    },
    computed: {
        ...mapState(['createOrderReturn']),
    },
    methods: {
        ...mapActions(['updateOrderReturn']),
        jumpMy() {
            mpvue.switchTab({
                url: `/pages/orders/list/main`
            }) 
        },
    },
    onShareAppMessage (options) {
        if (options.from === "menu") {
            return {
                title: '减付宝',
                path: '/pages/start/login/main',
                imageUrl: '',
            }
        }
        console.log(options);
        const share = options.target.dataset.share
        const paramStart = share.qrCode.indexOf("?")
        const param = share.qrCode.substr(paramStart)
        console.log(param);
        
        return {
            title: share.title,
            path: "/pages/start/invitation/main" + param,
            imageUrl: share.imageUrl,
        }
    },
};
</script>


<style lang="scss" scoped>
.payok-wrap {
    background: #fff;
    min-height: 100%;
	.payok{
		padding: 100rpx 24rpx;
	}
    .successful {
        text-align: center;
        margin-bottom: 80rpx;
        .icon-success {
            display: inline-block;
            width: 200rpx;
            height: 200rpx;
            background-image: url(~@/assets/img/successful.png);
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% auto;
        }
        .text-success {
            color: #06be03;
            font-size: 15px;
            margin: 20rpx 0;
        }
    }
    .details {
        color: #323232;
        font-size: 15px;
        margin-top: 10rpx;
    }
    .price {
        font-weight: 700;
        font-size: 40px;
        color: #323232;
        margin: 24rpx 0;
        &::before {
            content: '￥';
            font-size: 15px;
        }
    }
}

.order-tools {
    background: #fff;
    padding: 0 24rpx;
    .btn {
        width: 100%;
        text-align: center;
        letter-spacing: 1px;
        font-size: 14px;
        line-height: 100rpx;
        border-radius: 10rpx;
        background: #2e80f9;
        color: #fff;
    }
}


</style>