<template>
<layout-main>
    <div class="bind">
        <!--头部-->
        <header class="header">
            <div class="wxinfo" v-if="userInfo">
                <div class="avatar">
                    <img :src="userInfo.header_img" alt="">
                </div>
                <div class="nickname">{{userInfo.nickname}}</div>
            </div>
        </header>

        <!--头部 end-->

        <section class="mobile cell">
            <!-- 账号 -->
            <div class="cell-item">
                <div class="mobile-tel">
                    <i class="icon phone"></i>
                    <yd-input slot="right"
                        v-model="bindData.mobile"
                        ref="phone"
                        required
                        regex="mobile"
                        placeholder="请输入手机号码"
                        :show-error-icon="false">
                    </yd-input>
                </div>
            </div>
            <!-- 账号 end-->

            <!-- 手机验证码 -->
            <div class="cell-item">
                <div class="mobile-code">
                    <i class="icon code"></i>
                    <yd-input slot="right"
                        v-model="bindData.sms_code"
                        ref="identify"
                        required
                        regex="^\d{6}$"
                        max="6"
                        placeholder="手机验证码"
                        :show-error-icon="false">
                    </yd-input>     
                </div>
                <div class="sendCode">
                    <yd-sendcode slot="right" class="blue-btn"
                        init-str="获取验证码" second="60" v-model="sendCodeState"
                        @click.native="sendCode" type="hollow"
                    ></yd-sendcode>
                </div>
            </div>
            <!-- 手机验证码 end-->
        </section>


        <!-- 按钮 -->
        <section class="contol">
            <div class="btn-group">
                <yd-button type="danger" class="submit" shape="circle"
                    @click.native="bingMobile" :disabled="bindBtnDisabled">
                    绑定手机
                </yd-button>
                <yd-button type="hollow" class="blue-btn"
                    @click.native="goBack">
                    返回
                </yd-button>
            </div>
        </section>

    </div>
</layout-main>
</template>

<script>
/* eslint-disable no-undef */
import LayoutMain from "@/components/layouts/Main.vue";

import { apiGetCodeByLogin, apiBindMobile } from "@/api/api.js";
import { mapActions, mapState } from 'vuex';

export default {
    name: "bind",
    data: () => {
        return {
            bindBtnDisabled: true,
            sendCodeState: false,
            bindData: {
                mobile: "",
                sms_code: ""
            }
        };
    },
    components: {
        LayoutMain
    },
    created() {
        if (!this.userInfo) {
            this.getUsers()
        }
    },
    computed: {
        ...mapState(['userInfo']),
        inputChange: function() {
            let phone = this.bindData.mobile;
            let identify = this.bindData.sms_code;
            return {
                phone,
                identify
            };
        }
    },
    watch: {
        inputChange: function(newVal) {
            let newV = newVal;
            newV.phoneValid = this.$refs.phone.valid;
            newV.identifyValid = this.$refs.identify.valid;
            let flag = !(newV.phoneValid && newV.identifyValid);
            if (newV.phone === "" || newV.identify === "") {
                flag = true;
            }
            this.bindBtnDisabled = flag;
        }
    },
    methods: {
        ...mapActions(['getUsers']),
        sendCode() {
            const phoneValid = this.$refs.phone.valid;
            if (!phoneValid) {
                return Toast({
                    mes: "请填写正确的手机号！",
                    icon: "fail",
                    timeout: 1500
                });
            }
            Loading.open("发送中...");
            apiGetCodeByLogin(this.bindData.mobile).then(result => {
                if (result.code === 200) {
                    this.sendCodeState = true;
                    Loading.close();
                    Toast({
                        mes: "已发送",
                        icon: "success",
                        timeout: 1500
                    });
                }
            });
        },
        bingMobile() {
            Loading.open("微信正在绑定中，请稍等...");
            apiBindMobile({
                mobile: this.bindData.mobile,
                sms_code: this.bindData.sms_code
            })
                .then(result => {
                    Loading.close();
                    Toast({
                        mes: result.msg,
                        icon: "success",
                        timeout: 1500
                    });
                    this.Lockr.set("token", result.data.accessToken);
                    let redirect = decodeURIComponent(this.$route.query.redirect);
                    this.$router.replace({
                        path: redirect
                    });
                })
                .catch(err => {
                    Loading.close();
                    Toast({
                        mes: err.msg,
                        icon: "fail",
                        timeout: 1500
                    });
                });
        },
        goBack() {
            const redirect = this.$route.query.redirect;
            const shopId = this.$store.state.shopId
            if (redirect) {
                this.$router.push(`/shop/${shopId}`)
                return
            }
            window.history.length > 1 ? this.$router.go(-1) : this.$router.push(`/shop`);
        }
    }
};
</script>

<style lang="scss" scoped>
.bind {
    height: 100%;
    position: relative;
    margin-bottom: -.5rem;
    background-color: #fff;
    min-height: 10rem;
    display: flex;
    flex-direction: column;
    .header {
        font-size: 0.28rem;
        padding-top: 1.85rem;
        .wxinfo {
            display: flex;
            flex-direction: column;
            align-items: center;
            .avatar {
                width: 1.5rem;
                height: 1.5rem;
                border-radius: .2rem;
                overflow: hidden;
                background: #f5f5f5;
                img {
                    width: 100%;
                }
            }
            .nickname {
                margin: .15rem 0 .3rem;
                font-size: 18px;
                font-weight: 700;
                color: #323232;
            }
        }
    }
    .blue-btn{
        color: #73a8f6;
        border: 1px solid #73a8f6;
        border-radius: 200px;
    }
    .mobile {
        border-top: .2rem solid #f5f5f5;
        border-bottom: .2rem solid #f5f5f5;
        padding: 0 0.4rem;
        position: relative;
        &:before {
            content: '';
            position: absolute;
            z-index: 0;
            top: 50%;
            left: 0;
            width: 100%;
            height: 1px;
            border-top: 1px solid #e8e8e8;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
        }
        .cell-item{
            overflow: hidden;
            height: 1rem;
            position: relative;
            font-size: 13px;
            display: flex;
            align-items: center;
            .icon{
                width: .35rem;
                height: .35rem;
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
                margin-right: .3rem;
            }
            .icon.code{
                background-image: url(~@/assets/img/code.png);
            }
            .icon.phone{
                background-image: url(~@/assets/img/mobile.png);
            }
        }
        .mobile-tel,
        .mobile-code {
            height: 100%;
            display: flex;
            align-items: center;
            flex: 1;
        }
        .sendCode {
            min-width: 2.4rem;
            .blue-btn{
                border-radius: 10px;
            }
            .btn-disabled {
                color: #ccc;
                border: 1px solid #ccc;
                background-color: #ffffff;
            }
        }
    }
    .contol {
        padding: .4rem;
        flex: 1;
        align-items: center;
        justify-content: center;
        display: flex;
        .btn-group{
            width: 100%;
            padding-bottom: .2rem;
        }
        .blue-btn{
            width: 100%;
            box-sizing: border-box;
            font-weight: 700;
            line-height: 0.8rem;
            height: 0.8rem;
            font-size: 14px;
        }
        .submit {
            display: block;
            background: #73a8f6;
            background: -webkit-gradient( linear, left top, right top, from(#73a8f6), to(#3773ca));
            background: linear-gradient(to right, #73a8f6, #3773ca);
            color: #fff;
            font-weight: 700;
            line-height: 0.8rem;
            height: 0.8rem;
            font-size: 14px;
            width: 100%;
            box-sizing: border-box;
            margin-bottom: .4rem;
            &:disabled {
                opacity: 0.7;
            }
        }
    }
    
    
}
</style>
