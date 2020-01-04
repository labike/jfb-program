<!--
 * @Author: zhangHang
 * @Date: 2019-06-26 14:18:22
 * @Description: file content
 -->
<template>
	<div class="pay-wrapper"  v-if="showPay">
		<div class="order-details">
			<!-- <last-time  :endTime="createOrderReturn.deadlinetime" @callback='closePay'></last-time > -->
			<div class="price">{{createOrderReturn.actual}}</div>
			<div class="details"
			 v-if="createOrderReturn.order_name">
				{{createOrderReturn.order_name}}
			</div>
			<div class="pay-type">
				支付方式： <i class="wxpay"></i> 微信支付
			</div>
		</div>

		<div class="btn-group" v-if="confirmPay">
			<div class="btn" @click="goPay">确认支付</div>
		</div>
	</div>
</template>

<script>
import { apiOrderPay, apiPayRecharge, apiPayStatus } from "@/api/api";
import { mapState, mapActions } from 'vuex';
import { payIsSuccess } from "@/config/base";
import LastTime from "./../views/Countdown.vue";
export default {
    name: "Pay",
    components: {
        LastTime
    },
    data() {
        return {
            order_id: '',
            showPay: false,
            confirmPay: true,
        }
    },
    onUnload() {        
        const self = this;
        self.order_id = ''
        self.showPay = false
        self.confirmPay = true
    },
    onLoad (options) {
        console.log(this.createOrderReturn);
        this.order_id = options.order_id;
        if (this.createOrderReturn && this.createOrderReturn.order_id === this.order_id) {
            this.showPay = true;
        } else {
            this.$router.replace({
                path: "/pages/orders/list/main",
                reLaunch: true
            })
        }
    },
    computed: {
        ...mapState(['createOrderReturn']),
    },
    methods: {
        ...mapActions(['updateOrderReturn']),
        goPay() {
            const that = this
            mpvue.showLoading({
                title: '正在支付中...',
            })
            that.orderPay().then(wxConfig => {
                mpvue.hideLoading()
                console.log(wxConfig);
                mpvue.requestPayment({
                    'timeStamp': wxConfig.timeStamp,
                    'nonceStr': wxConfig.nonceStr,
                    'package': wxConfig.package,
                    'signType': wxConfig.signType,
                    'paySign': wxConfig.paySign,
                    'success': function (res) {
                        console.log('支付成功');
                    },
                    'fail': function (res) {
                        console.log('支付失败');
                    },
                    'complete': function (res) {
                        console.log(res);
                        if (res.errMsg === 'requestPayment:ok') {
                            apiPayStatus(that.order_id).then(res => {
                                if (res.is_pay_success + '' === payIsSuccess.OK) {
                                    that.$router.push({
                                        path: `/pages/shop/payok/main?order_id=${that.order_id}`
                                    })
                                }
                            })
                        }
            
                    }
                });
            }).catch(err => {
                mpvue.hideLoading();
                mpvue.showToast({
                    title: err,
                    icon: 'none',
                    duration: 2000
                })
            })
        },

        orderPay() {
            const that = this
            if (this.createOrderReturn.recharge) {
                return apiPayRecharge({
                    order_id: that.order_id,
                    actual: that.createOrderReturn.actual,
                    pay_method: 6,
                    openid: mpvue.getStorageSync('openId')
                })
            }
            return apiOrderPay({
                order_id: that.order_id,
                actual: that.createOrderReturn.actual,
                pay_method: 6,
                openid: mpvue.getStorageSync('openId')
            })
            
        },
    }
};
</script>

<style lang="scss" scoped>
.pay-wrapper{
	padding: 24rpx;
}
.order-details{
    background: #fff;
    margin-bottom: 80rpx;
    padding: 74rpx 24rpx;
	box-shadow: 1px 1px 5px #efefef;
	border-radius: 10rpx;
	font-size: 14px;
    .time{
        color: #818181;
        text-align: center;
        :nth-of-type(1){
           margin-right: 10rpx; 
        }
    }
    .price{
        text-align: center;
        font-weight: 700;
        font-size: 40px;
        color: #000;
        margin: 24rpx 0;
        &::before {
            content: '￥';
            font-size: 15px;
		}
	}
    .details{
		text-align: center;
		margin-bottom: 30rpx;
	}
	.pay-type{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.wxpay{
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
		display: inline-block;
		background-image: url(~@/assets/img/icon_wx.png);
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
	}
}
.btn {
    width: 100%;
    text-align: center;
    letter-spacing: 1px;
    font-size: 14px;
    line-height: 100rpx;
	border-radius: 100rpx;
    background: #ff5100;
    color: #fff;
}
</style>
