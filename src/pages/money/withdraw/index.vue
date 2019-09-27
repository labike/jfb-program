<!--
 * @Author: zhangHang
 * @Date: 2019-07-03 10:24:48
 * @Description: file content
 -->
<template>
<div class="container">
    <header class="top-info">
        <div class="price-warp">
            <div class="title">
                <span>可提现金额</span>
                <span class="all" @click="withdrawPrice('all')">全部提现</span>
            </div>
            <div class="price">{{balance}}</div>
            <div class="handle" @click="withdrawPrice()">提现</div>
        </div>
    </header>

    <section class="bd-warp">
        <dl class="mode price">
            <dt>选择提现金额</dt>
            <dd v-for="price of  priceData" :key="price"
                :class="{select: price.value === payPrice}"
                @click="payPrice = price.value"
            >{{price.name}}</dd>
        </dl>
        <dl class="mode type">
            <dt>提现方式</dt>
            <dd :class="{select: payType === 'wxpay'}"
                @click="payType = 'wxpay'"
            >
                <i class="wxpay"></i>微信
            </dd>
            <dd :class="{select: payType === 'alipay'}"
                @click="payType = 'alipay'"
            >
                <i class="alipay"></i>支付宝
            </dd>
        </dl>
    </section>
</div>
</template>

<script>
import { apiMoneyByWx } from '@/api/api';
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'withdraw',
    data() {
        return {
            priceData: [{
                name: '30元',
                value: 0.1
            },{
                name: '50元',
                value: 50
            },{
                name: '100元',
                value: 100
            },{
                name: '150元',
                value: 150
            },{
                name: '200元',
                value: 200
            },{
                name: '250元',
                value: 250
            }],
            payPrice: 30,
            payType: 'wxpay',
            nickName: ''
        }
    },
    computed: {
        ...mapState({
            "balance": state => state.user.balance 
        }),
    },
    onLoad(options) {
        const _this = this
        wx.getUserInfo({
            withCredentials: true,
            success(info) {
                let { userInfo } = info;
                _this.nickName = userInfo.nickName 
            }
        })
    },
    methods: {
        ...mapMutations("user", [
            'SET_WITHDRAW',
        ]),
        withdrawPrice(all) {
            const _this = this
            const payType = _this.payType === 'wxpay' ? '微信' : _this.payType === 'alipay' ? '支付宝' : '银联'
            if (all) {
                wx.showModal({
                    title: '提示',
                    content: '确定全部提现？',
                    success: function (res) {
                        console.log(res)
                        if (res.confirm) {
                            if (_this.balance < 0.01) {
                                wx.showToast({
                                    title: `${payType}提现金额必须大于1`,
                                    icon: 'none',
                                    duration: 2000
                                })
                            } else {
                                _this.toEarnMoney()
                            }
                        }
                    }
                })
            } else {
                if (_this.payPrice >= _this.balance) {
                    wx.showToast({
                        title: '您的余额不足，请继续努力哦！',
                        icon: 'none',
                        duration: 2000
                    })
                } else {
                    _this.toEarnMoney()
                }
            }
             
        },
        toEarnMoney() {
            const _this = this
            const payType = _this.payType
            _this.SET_WITHDRAW({
                type: payType,
                amount: _this.payPrice,
                account: _this.nickName
            })
            if (payType === 'wxpay') {
                apiMoneyByWx({
                    openid: wx.getStorageSync('openId'),
                    amount: _this.payPrice
                }).then(res => {
                    wx.showToast({
                        title: '申请提交成功!',
                        duration: 2000
                    })
                    setTimeout(function() {
                        mpvue.redirectTo({
                            url: `/pages/money/ok/main`
                        })
                    }, 1000)
                }).catch(() => {
                    wx.showToast({
                        title: '提现人数过多，请稍后再试！',
                        icon: 'none',
                        duration: 2000
                    })
                })
                return
            }
            if (payType === 'alipay') {
                this.$router.push({
                    path: '/pages/money/alipay/main'
                }) 
            }
            
        }
    }
}
</script>


<style lang="scss" scoped>
@import "~@/assets/styles/common/variables.scss";
.top-info {
    background-color: $base-color;
    padding : 24rpx;
    .price-warp{
        background: #fff;
        padding: 30rpx 24rpx;
        position: relative;
        border-radius: 10rpx;
        .title{
            color: #818181;
            font-size: 24rpx;
            .all{
                color: $base-color;
                margin-left: 10rpx;
            }
        }
        .price{
            color: #000;
            font-size: 80rpx;
            font-weight: 700;
            margin-top: 10rpx;
            &::before{
                content: '￥';
                font-size: 30rpx;
            }
        }
        .handle{
            font-size: 24rpx;
            width: 120rpx;
            height: 60rpx;
            border-radius: 60rpx;
            background: #ff5100;
            color: #fff;
            border-radius: 5rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            right: 24rpx;
            margin-top: -25rpx;
        }
    }
}
.mode{
    background: #fff;
    padding: 24rpx;
    dt{
        font-size: 28rpx;
        margin-bottom: 20rpx;
    }
    dd{
        border: 1rpx solid #e8e8e8;
        height: 90rpx;
        border-radius: 10rpx;
        margin-right: 2%;
        margin-bottom: 2%;
        display: flex;
        align-items: center;
        &.select {
            border: 1rpx solid #2a8cfa;
            background-image: url(~@/assets/img/selected.png);
            background-repeat: no-repeat;
            background-size: 45rpx  auto;
            background-position: 100% 100%;
        }
        i{
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
            display: inline-block;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            &.wxpay{
                background-image: url(~@/assets/img/icon_wx.png);
            }
            &.alipay{
                background-image: url(~@/assets/img/icon_zfb.png);
            }
        }
    }
    
	
    &.price{
        overflow: hidden;
        dd{
            float: left;
            justify-content: center;
            width: 30%;
            font-size: 28rpx;
        }
    }
    &.type{
        overflow: hidden;
        dd{
            height: 80rpx;
            padding-left: .24rem;
        }
    }
}
</style>
