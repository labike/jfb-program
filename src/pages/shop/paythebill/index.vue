<!--
 * @Author: zhangHang
 * @Date: 2019-05-14 11:58:39
 * @Description: file content
 -->
<template>
<section class="pay-the-bill" v-if="storeInfo">
    <div class="store-name">{{storeInfo.storeName}}</div>
    <p class="store-pro">本店消费支持{{vipPayPro}}%共享增值卡余额支付</p>
    <ul class="cell consume">
        <li class="odrer-vip">
            <p class="lable"><i class="vip"></i>共享增值卡支付<span>({{vipPayPro}}%)</span></p>
            <div class="price">￥{{vipPrice}}</div>
        </li>
        <li class="odrer-wechat">
            <p class="lable"><i class="wechat"></i>微信支付<span>({{100-vipPayPro}}%)</span></p>
            <div class="price" >￥{{payPrice}}</div>
        </li>
        <li class="odrer-price">
            <p class="lable">消费金额</p>
            <div class="input">￥
                <input type="digit" v-model="orderPrice" placeholder="输入金额"
                    placeholder-style="color:#C0C0C0;font-size:30px;"
                    :confirm-hold='true' :focus='true'
                    @input='replaceInput'
                />
            </div>
        </li>
    </ul>
    <div class="tips" v-show="orderPrice&&(prepVipPrice>balance)">您的共享增值卡余额不足，只可抵扣0.00元，
        <span @click="jumpRecharge">去充值</span></div>
    <div class="payBtn" @click="jumpPay">和店员确认，立即支付</div>
</section>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { orderType } from '@/config/base';
import { apiGetRechargeList } from "@/api/api.js";
export default {
    name: "payTheBill",
    data() {
        return {
            shop_id: 0,
            balance: 0,
            payPrice: 0,
            vipPrice: 0,
            vipPayPro: 0,
            orderPrice: '',
            storeInfo: null,
            prepVipPrice: 0
        };
    },
    onUnload() {        
        const self = this;
        self.shop_id = 0
        self.balance = 0
        self.payPrice = 0
        self.vipPrice = 0
        self.vipPayPro = 0
        self.orderPrice = ''
        self.prepVipPrice = 0
        self.storeInfo = null
    },
    watch: {
        orderPrice(oPrice) {
            const that = this
            oPrice = parseFloat(oPrice) || 0;
            let prepVipPrice = this.vipPayPro * oPrice / 100
            if (prepVipPrice > that.balance) {
                that.vipPrice = 0
                that.payPrice = oPrice.toFixed(2)
            } else {
                that.vipPrice = prepVipPrice.toFixed(2)
                that.payPrice = (oPrice - prepVipPrice).toFixed(2)
            }
            that.prepVipPrice = prepVipPrice.toFixed(2)
        }
    },
    onLoad (options) {
        const that = this
        that.shop_id = options.shop_id;
        apiGetRechargeList(that.shop_id).then(res => {
            console.log(res);
            let vipPayPro = parseInt(res.ratio)
            if (vipPayPro && vipPayPro !== 100) {
                that.vipPayPro = vipPayPro
            }
            that.storeInfo = res.storeInfo || null
            that.balance = res.user.balance || 0
        })
    },
    onShow() {
        console.log(123);
        
    },
    methods: {
        ...mapActions(['createOrder']),
        replaceInput(e) {
            let value = e.mp.detail.value
            let sNum = value.toString(); //先转换成字符串类型
            if (sNum.indexOf('.') === 0) { //第一位就是 .
                console.log('first str is .')
                sNum = '0' + sNum
            }
            sNum = sNum.replace(/[^\d.]/g,""); //清除“数字”和“.”以外的字符
            sNum = sNum.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
            sNum = sNum.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
            sNum = sNum.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
            //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            if (sNum.indexOf(".") < 0 && sNum !== "") {
                sNum = parseFloat(sNum);
            }
            this.orderPrice = sNum

        },
        jumpPay() {
            const that = this;
            const orderPrice = that.orderPrice;
            // const reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
            const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!reg.test(orderPrice) || orderPrice <= 0) {
                mpvue.showToast({
                    title: "请核对您的输入金额",
                    icon: 'none',
                    duration: 2000
                })
                return; 
            }
            // 创建订单
            that.createOrder({
                s_id: that.shop_id,
                total: orderPrice,
                type: orderType.vippay
            }).then(res => {
                that.$router.push({
                    path: `/pages/shop/pay/main?order_id=${res.order_id}`
                })
            });
        },
        jumpRecharge() {
            console.log(11);
            
            this.$router.push({
                path: `/pages/shop/recharge/main?shop_id=${this.shop_id}`
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.pay-the-bill {
    min-height: 100%;
    background: #fff;
    .store-name{
        text-align: center;
        font-size: 17px;
        color: #323232;
        font-weight: 700;
        padding-top: 40rpx;
    }
    .store-pro {
        text-align: center;
        padding: 20rpx 0;
        text-align: center;
        font-size: 12px;
        color: #818181;
    }
    .consume{
        margin-top: 20rpx;
        margin-bottom: 60rpx;
        border-top: 1rpx solid #e8e8e8;
        border-bottom: 1rpx solid #e8e8e8;
        .price {
            flex: 1;
            width: 100%;
            text-align: right;
            padding-right: 24rpx;
            font-size: 18px;
            color: #f00;
        }
        .input{
            color: #323232;
            font-weight: 700;
            font-size: 35px;
            display: flex;
            justify-items: center;
        }
        input {
            display: block;
            height: 100%;
            border: none;
            font-size: 35px;
            font-weight: 700;
            background: transparent;
            color: #323232;
        }
        i{
            float: left;
            width: 40rpx;
            height: 100%;
            margin-right: 20rpx;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            &.vip{
                background-image: url(~@/assets/img/vip_pay.png);
            }
            &.wechat{
                background-image: url(~@/assets/img/wechat_pay.png);
            }
        }
    }
    .odrer-price{
        display: block;
        text-align: left;
        .lable{
            font-weight: 400;
            font-size: 12px;
            color: #818181;
        }
    }
    .tips{
        font-size: 12px;
        color: #c0c0c0;
        margin-bottom: 30rpx;
        padding: 0 24rpx;
        span{
            color: #f00;
        }
    }
    .payBtn {
        height: 100rpx;
        line-height: 100rpx;
        font-weight: 700;
        text-align: center;
        color: #fff;
        font-size: 17px;
        background: #f00;
        border-radius: 10rpx;
        margin: 0 24rpx;
    }
}
</style>
