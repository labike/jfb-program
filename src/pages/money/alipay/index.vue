<template>
<div class="container">

    <section class="withdraw">
        <ul class="cell">
            <li class="withdraw-price">
                <p class="left">提现金额</p>
                <div class="center">￥{{withdraw.amount}}</div>
                <div class="right"><i class="alipay"></i></div>
            </li>
            <li class="withdraw-ali">
                <p class="left">支付宝账号</p>
                <div class="center">
                    <input type="text" v-model="account" placeholder="请输入支付宝账号" :focus='true' />
                </div>
            </li>
            <li class="withdraw-ali">
                <p class="left">确认账号</p>
                <div class="center">
                    <input type="text" v-model="account1" placeholder="再次确认账号" />
                </div>
            </li>
            <li class="withdraw-ali">
                <p class="left">提现金额</p>
                <div class="center">
                    <input type="text" v-model="code" placeholder="请输入短信验证码" />
                </div>
                <div class="right">
                    <div v-if="!codeDisabled" class="get-code" @click="getCode">发送验证码</div>
                    <div v-else class="get-code disabled" >{{currentTime}}</div>
                </div>
            </li>
        </ul>
    </section>


    <dl class="explain">
        <dt>提现说明</dt>
        <dd>支付宝红包提现，即直接转账到支付宝账号。</dd>
        <dd>提现时<span>请务必正确填写支付宝账号</span>（手机号或邮箱账号），如个人原因，支付宝账号填写错误，损失将由个人承担。</dd>
        <dd>提现申请将在<span> 24 小时审批后到账</span>，请耐心等待，请及时关注 “ 我的 -> 兑换提现 -> 兑现记录 ” 查看提现记录状态。</dd>
        <dd>如已忘记支付宝账号，可通过 “ <span>支付宝 -> 我的 -> 个人头像昵称 -> 支付宝账号 </span>”查看。或通过 “ <span>淘宝 -> 我的淘宝 -> 我的支付宝 </span>”， 在头像右侧即为支付宝账号。</dd>
    </dl>

    <div class="payBtn" @click="aliWithdraw">立即提现</div>
</div>
</template>

<script>
import { apiGetUsers, apiVerifyByAlipay, apiMoneyByAlipay } from '@/api/api';
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'withdrawByAli',
    data() {
        return {
            account: '',
            account1: '',
            code: '',
            verifyCode: '',
            mobile: '',
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
        apiGetUsers().then(res => {
            this.mobile = res.mobile
        })
    },
    methods: {
        ...mapMutations("user", [
            'SET_WITHDRAW',
        ]),
        aliWithdraw() {
            const _this = this
            let errTitle = ''
            if (_this.account === "") {
                errTitle = '支付宝账号不能为空'
            }
            if (_this.account !== _this.account1) {
                errTitle = '两次输入的支付宝账号不一致'
            }
            if (_this.code === "") {
                errTitle = '手机验证码不能为空'
            }
            if (_this.code !== _this.verifyCode) {
                errTitle = '验证码错误'
            }
            if (errTitle !== "") {
                wx.showToast({
                    title: errTitle,
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            _this.withdrawByAli()
        },
        getCode() {
            const _this = this
            apiVerifyByAlipay({
                phone: _this.mobile,
                money: _this.withdraw.amount
            }).then(res => {
                _this.verifyCode = res.code + ""
                wx.showToast({
                    title: '验证码发送成功!',
                    duration: 2000
                })
                _this.codeTime()
            }).catch(err => {
                wx.showToast({
                    title: err.msg,
                    icon: 'none',
                    duration: 2000
                })
            })
        },
        codeTime () {
            const _this = this
            let currentTime = _this.currentTime
            _this.currentTime = currentTime + '秒后重新获取'
            _this.codeDisabled = true
            let interval = setInterval(function () {
                console.log(currentTime);
                currentTime--;
                _this.currentTime = currentTime + '秒后重新获取'
                if (currentTime <= 0) {
                    clearInterval(interval)
                    _this.codeDisabled = false
                    _this.currentTime = 60
                }
            }, 1000)
        },
        withdrawByAli() {
            const _this = this
            apiMoneyByAlipay({
                account: _this.account,
                amount: _this.withdraw.amount
            }).then(res => {
                wx.showToast({
                    title: '申请提交成功!',
                    duration: 2000
                })
                
                _this.SET_WITHDRAW({
                    type: _this.withdraw.type,
                    amount: _this.withdraw.amount,
                    account: _this.account,
                })
                setTimeout(function() {
                    mpvue.redirectTo({
                        url: `/pages/money/ok/main`
                    })
                }, 1000)
            }).catch(err => {
                wx.showToast({
                    title: err.msg,
                    icon: 'none',
                    duration: 2000
                })
            })

        }
    }
}
</script>
<style lang="scss" scoped>
.withdraw {
    font-size: 14px;
    padding-top: 20rpx;
    li {
        display: flex;
        text-align: left;
        .left {
            width: 200rpx;
            text-align: left;
        }
        .center {
            flex: 1;
        }
    }
    input {
        height: 100%;
        width: 100;
        display: block;
    }
    .withdraw-price {
        .center {
            color: #ff583f;
            font-weight: 700;
        }
    }
    i.alipay{
        width: 100rpx;
        height: 100rpx;
        display: block;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 50rpx 50rpx;
        background-image: url(~@/assets/img/icon_zfb.png);
    }
    .get-code{
        color: #0089ff;
        margin-right: 24rpx;
        &.disabled{
            color: #dedede;
        }
    }
}

.explain {
    margin: 30rpx;
    font-size: 13px;
    dt {
        color: #000;
    }
    dd {
        color: #666;
        margin-top: 40rpx;
        padding-left: 20rpx;
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
