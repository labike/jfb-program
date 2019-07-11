<template>
	<div class="pay-wrapper"  v-if="createOrderReturn">
		<div class="order-details">
			<last-time :endTime="createOrderReturn.deadlinetime" @callback='closePay'></last-time >
			<div class="price">{{createOrderReturn.actual}}</div>
			<div class="details"
			 v-if="createOrderReturn.order_name">
				{{createOrderReturn.order_name}}
			</div>
			<div class="pay-type">
				支付方式： <i class="wxpay"></i> 微信支付
			</div>
		</div>

		<div class="btn-group" v-if="paying">
			<div class="btn" @click="goPay">确认支付</div>
		</div>
	</div>
</template>

<script>
import { apiOrderPay, apiPayStatus } from "@/api/api";
import { mapState, mapActions } from 'vuex';
import LastTime from "./../views/Countdown.vue";
export default {
    name: "Pay",
    data() {
        return {
            order_id: '',
            paying: true
        }
    },
    components: {
        LastTime
    },
    onLoad (options) {
        this.order_id = options.order_id;
        if (!this.createOrderReturn) {
            this.updateOrderReturn(this.order_id)
        }
    },
    computed: {
        ...mapState(['createOrderReturn']),
    },
    methods: {
        ...mapActions(['updateOrderReturn']),
        closePay() {
            console.log('closePay');
            this.paying = false
        },
        goPay() {
            const that = this
            that.orderPay().then(wxConfig => {
                console.log(wxConfig);
                wx.requestPayment({
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
                            wx.showModal({
                                title: '提示',
                                content: '充值成功'
                            });
                            setTimeout(function () {
                                mpvue.navigateTo({
                                    url: `/pages/shop/payok/main?order_id=${that.order_id}`
                                }) 
                            }, 1000)
                        }
            
                    }
                });
            })
        },

        orderPay() {
            const that = this
            wx.showLoading({
                title: '正在支付中，请稍等...',
            })
            return new Promise(resolve => {
                apiOrderPay({
                    order_id: that.order_id,
                    actual: that.createOrderReturn.actual,
                    pay_method: 6
                }).then(res => {
                    wx.hideLoading()
                    resolve(res)
                }).catch(err => {
                    wx.hideLoading();
                    wx.showToast({
                        title: err,
                        icon: 'fail',
                        duration: 2000
                    })
                })
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
