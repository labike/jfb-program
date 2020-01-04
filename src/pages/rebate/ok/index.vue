<template>
<div class="container" v-if="withdraw">

    <section class="withdraw-ok">

        <div class="successful">
            <i class="icon-success"></i>
            <div class="text-success">提现成功</div>
        </div>

        <ul class="flow">
            <li><i class="selected"></i><span class="text">已提交</span></li>
            <li><i class="wait"></i><span class="text">待审核</span></li>
            <li><i class="select"></i><span class="text">提现到账</span></li>
        </ul>

        <ul class="cell withdraw">
            <li class="withdraw-price">
                <p class="left">提现金额</p>
                <div class="right">￥{{withdraw.amount}}</div>
            </li>
            <li class="withdraw-type">
                <p class="left">提现方式</p>
                <div class="right">
                    <div class="type" v-if="withdraw.type === 'wxpay'">微信({{withdraw.account}})</div>
                    <div class="type" v-if="withdraw.type === 'alipay'">支付宝({{withdraw.account}})</div>
                </div>
            </li>
            <!-- <li class="withdraw-service">
                <p class="left">手续费</p>
                <div class="right">￥20</div>
            </li> -->
        </ul>
    </section>


    <dl class="explain">
        <dt>注意事项</dt>
        <dd>提现时<span>请务必确认收款账号</span>，如个人原因，支付宝账号填写错误，损失将由个人承担。</dd>
        <dd>提现即时到账，如遇高峰期，可能延迟到账，烦请耐心等待。</dd>
        <dd>微信提现到账查询：<span>微信 ->我 ->支付 ->钱包 ->账单</span></dd>
        <dd>支付宝提现到账查询：<span>支付宝 ->我的 ->账单</span></dd>
    </dl>

    <div class="payBtn" @click="jumpBack">完成</div>
</div>
</template>

<script>
import { apiGetUsers, apiVerifyByAlipay, apiMoneyByAlipay } from '@/api/api';
import { mapState } from 'vuex';
export default {
    name: 'withdrawByAli',
    data() {
        return {
            // payPrice: 0,
            // payType: 'wxpay',
            account: '',
            currentTime: 60,
            codeDisabled: false
        }
    },
    
    computed: {
        ...mapState({
            "withdraw": state => state.user.withdraw 
        }),
    },
    onLoad(options) {
        this.payPrice = options.amount
        apiGetUsers().then(res => {
            this.mobile = res.mobile
        })
    },
    methods: {
        jumpBack() {
            this.$router.back()
        },

    }
}
</script>
<style lang="scss" scoped>
.successful {
    text-align: center;
    padding-top: 10rpx;
    .icon-success {
        display: inline-block;
        width: 240rpx;
        height: 240rpx;
        background-image: url(~@/assets/img/withdraw_true.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% auto;
    }
    .text-success {
        color: #666;
        font-size: 24px;
        font-weight: 400;
        margin-top: -30rpx;
    }
}

.flow {
    display: flex;
    align-items: center;
    margin-top: 80rpx;
    position: relative;
    &::before{
        content: '';
        position: absolute;
        top: 50%;
        left: 28%;
        height: 0;
        width: 10%;
        border-top: 1px solid #0089ff;
    }
    &::after{
        content: '';
        position: absolute;
        top: 50%;
        right: 29%;
        height: 0;
        width: 10%;
        border-top: 1px solid #0089ff;
    }
    li {
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    i{
        width: 30rpx;
        height: 30rpx;
        margin-right: 12rpx;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% auto;
        &.select{
            background-image: url(~@/assets/img/selected@b.png);
        }
        &.wait{
            width: 40rpx;
            height: 40rpx;
            background-image: url(~@/assets/img/withdraw_wait.png);
        }
        &.selected{
            background-image: url(~@/assets/img/withdraw_select.png);
        }
    }
    .text{
        color: #323232;
        font-size: 14px;
    }
}
.withdraw{
    background: transparent;
    margin: 60rpx 30rpx 10rpx;
    border-top: 1rpx solid #e8e8e8;
    border-bottom: 1rpx solid #e8e8e8;
    li {
        justify-content: space-between;
        line-height: 75rpx;
        padding-right: 24rpx;
        &::before{
            display: none;
        }
    }
}
.explain {
    margin: 30rpx;
    font-size: 12px;
    dt {
        color: #000;
        font-size: 14px;
    }
    dd {
        color: #666;
        margin-top: 20rpx;
        padding-left: 24rpx;
        line-height: 1.6;
        position: relative;
        &::before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border: 3px solid #323232;
            vertical-align: middle;
            margin-top: -3px;
            top: 20rpx;
            left: 0rpx;
            border-radius: 50%;
        }
        span {
            color: #ff583f;
        }
    }
}
.payBtn {
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    color: #fff;
    font-size: 28rpx;
    background: #2f81f9;
    border-radius: 10rpx;
    background: linear-gradient(to right, #00a5ff , #0089ff);
    margin: 44rpx 30rpx 30rpx;
}
</style>
