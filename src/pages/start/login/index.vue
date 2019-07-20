<template>
<section class="container">
    <div class="remind-box" v-if="remind">
        <img class="remind-img" src="/static/more/loading.gif" />
    </div>
    <div v-else>
        <img class="title" src="/static/more/title1.png" />
        <div class="content">
            <div class="hd">
                <img class="logo" v-if="avatarUrl" :src="avatarUrl" />
                <img class="logo" v-else src="/static/more/logo.png" />
                <img class="wave" src="/static/more/wave.png" mode="aspectFill" />
                <img class="wave wave-bg" src="/static/more/wave.png" mode="aspectFill" />
            </div>
            <div class="bd">
                <img class="smalltitle" src="/static/more/title.png" />
                <button v-if="buttonLogin" open-type="getUserInfo"  @getuserinfo="bindGetUserInfo"
                    class="confirm-btn" @click="getUserInfoClick">
                    <span>微信登录</span>
                </button>
                <button v-if="buttonBind" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="confirm-btn">
                    <span>绑定手机号</span>
                </button>
            </div>
        </div>
    </div>

    <lay-model :show='modelBind' :btnhide='true' height='280px' @close='closeMobile'>
        <div class="bind-warp">
            <div class="bind-title">填写验证码</div>
            <div class="bind-desc">验证码已发送至{{hiddleMobile}}请查收</div>
            <div class="bind-code" @click="set_focus">
                <ul class="field-wrap">
                    <li class="code-item" v-for="(item, index) in codeLength" :key="index">{{codeItem[index]}}</li>
                </ul>
                <input class="code" type='number' :focus='sendCodeFocus' :cursor='codeLength' :maxlength='codeLength' @keyup="handleInput($event)" v-model="sendCode"/>
            </div>
            <div class="bind-submit" @click="submitMobile">确认</div>
        </div>
    </lay-model>
</section>
</template>

<script>
import { mapActions } from 'vuex'
import LayModel from "@c/layouts/Model.vue";
import { apiGetOpenId, apiGetMobileByWx, apiGetCodeByLogin, apiBindMobile } from '@/api/api'
import { tabbar } from "@/config/base";

export default {
    data() {
        return {
            remind: '加载中',
            buttonLogin: false,
            codeLength: 6,
            buttonBind: false,
            modelBind: false,
            avatarUrl: '',
            mobile: '',
            sendCode: '',
            sendCodeFocus: false,
        };
    },
    components: {
        LayModel
    },
    onLoad() {
        const self = this;
        self.again_getLocation()
    },
    computed: {
        codeItem() {
            const sendCode = this.sendCode.split('')
            if (this.codeLength >= sendCode.length) {
                for (let i = sendCode.length; i < this.codeLength; i++) {
                    sendCode.push('')
                }
            } else {
                this.sendCode = this.sendCode.slice(0, this.codeLength)
            }
            return sendCode
        },
        hiddleMobile() {
            if (this.mobile) {
                var reg = /^(\d{3})\d{4}(\d{4})$/;  
                return this.mobile.replace(reg, "$1****$2");
            }
            return ''
        }
    },
    methods: {
        ...mapActions('user', [
            'Login',
            'bingMobile',
            'setLocation'
        ]),
        closeMobile() {
            this.modelBind = false;
            this.sendCode = "";
        },
        set_focus() {
            this.sendCodeFocus = true
        },
        getLocation: function () {
            var self = this;
            wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                    self.setLocation(res)
                    mpvue.login({
                        success(res) {
                            setTimeout(function() {
                                self.remind = ''
                            }, 1000);
                            if (res.code) {
                                console.log('授权登录成功！' + JSON.stringify(res))
                                self.code = res.code
                                self.wxGetUserInfo(res.code);
                            } else {
                                console.log('授权登录失败！' + res.errMsg)
                            }
                        }
                    })
                },
                fail() {
                    self.again_getLocation()
                }
            })
        },
        again_getLocation: function() {
            let that = this;
            // 获取位置信息
            wx.getSetting({
                success: (res) => {
                    console.log(res)
                    if (res.authSetting['scope.userLocation'] !== undefined && res.authSetting['scope.userLocation'] !== true) { //非初始化进入该页面,且未授权
                        wx.showModal({
                            title: '是否授权当前位置',
                            content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
                            success: function (res) {
                                console.log(res)
                                if (res.cancel) {
                                    wx.showToast({
                                        title: '授权失败',
                                        icon: 'success',
                                        duration: 1000
                                    })
                                } else if (res.confirm) {
                                    wx.openSetting({
                                        success: function (dataAu) {
                                            console.log(dataAu)
                                            if (dataAu.authSetting["scope.userLocation"] === true) {
                                                wx.showToast({
                                                    title: '授权成功',
                                                    icon: 'success',
                                                    duration: 1000
                                                })
                                                //再次授权，调用getLocationt的API
                                                that.getLocation(that);
                                            } else {
                                                wx.showToast({
                                                    title: '授权失败',
                                                    icon: 'fail',
                                                    duration: 1000
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    } else if (res.authSetting['scope.userLocation'] === undefined) { //初始化进入
                        that.getLocation(that);
                    } else { //授权后默认加载
                        that.getLocation(that);
                    }
                }
            })

        },
        wxGetUserInfo(code) {
            const self = this;            
            wx.getUserInfo({
                withCredentials: true,
                success(info) {
                    let { encryptedData, iv, userInfo } = info;
                    apiGetOpenId(code).then(confing => {
                        confing = JSON.parse(confing)
                        self.session_key = confing.session_key
                        if (confing.unionid) {
                            userInfo.unionId = confing.unionid
                            userInfo.openId = confing.openid
                            self.doLogin(userInfo)
                        } else {
                            apiGetMobileByWx({
                                session_key: confing.session_key,
                                iv,
                                data: encryptedData
                            }).then(userInfo => {
                                self.doLogin(userInfo)
                            })
                        }
                    })
                },
                fail(err) {
                    console.log('自动wx.getUserInfo失败:', err);
                    // 显示主动授权的button
                    self.buttonLogin = true;
                }
            })
        },
        getUserInfoClick() {
            wx.showLoading({
                title: '请求授权中...',
            })
            if (!wx.canIUse('button.open-type.getUserInfo')) {
                console.log('请升级微信版本')
            }
        },
        bindGetUserInfo(e) {
            const self = this;
            if (e.mp.detail.userInfo) {
                console.log('用户按了允许授权按钮')
                let { encryptedData, iv, userInfo } = e.mp.detail;
                apiGetOpenId(self.code).then(confing => {
                    confing = JSON.parse(confing)
                    self.session_key = confing.session_key
                    if (confing.unionid) {
                        userInfo.unionId = confing.unionid
                        userInfo.openId = confing.openid
                        self.doLogin(userInfo)
                    } else {
                        apiGetMobileByWx({
                            session_key: confing.session_key,
                            iv,
                            data: encryptedData
                        }).then(userInfo => {
                            self.doLogin(userInfo)
                        })
                    }
                })
            } else {
                wx.hideLoading()
                wx.showModal({
                    title: '温馨提示',
                    content: '亲，拒绝授权将无法购物，您确定要这么做吗？',
                    showCancel: false,
                    confirmText: '确定'
                })
            }
        },
        async doLogin(info) {
            const that = this
            wx.showLoading({
                title: '登录中...',
                mask: true,
            });
            const other_info = {
                openid: info.openId,
                nickname: info.nickName,
                sex: info.gender,
                language: info.language,
                city: info.city,
                province: info.province,
                country: info.country,
                headimgurl: info.avatarUrl,
                privilege: [],
                unionid: info.unionId
            }
            that.Login(other_info).then(res => {
                if (res.mobile_isbind !== 0) {
                    that.jumpHistory() 
                } else {
                    that.buttonLogin = false;
                    that.buttonBind = true
                }
            })
            
        },
        getPhoneNumber: function(e) {
            const self = this  
            if (e.mp.detail.errMsg === 'getPhoneNumber:user deny') {  
                wx.showModal({  
                    title: '提示',  
                    showCancel: false,  
                    content: '未授权',  
                    success: function (res) { }  
                })  
            } else {
                apiGetMobileByWx({
                    session_key: self.session_key,
                    iv: e.mp.detail.iv,
                    data: e.mp.detail.encryptedData
                }).then(res => {
                    self.mobile = res.phoneNumber
                    apiGetCodeByLogin(res.phoneNumber).then(result => {
                        if (result.code === 200) {
                            self.modelBind = true
                            self.set_focus()
                        }
                    });
                })
            }  
        },
        submitMobile() {
            const that = this
            that.bingMobile({
                mobile: that.mobile,
                sms_code: that.sendCode
            }).then(() => {
                that.jumpHistory() 
            }).catch(err => {
                wx.showToast({
                    title: err.msg,
                    icon: 'none',
                    duration: 1000
                })
            })
        },
        jumpHistory() {
            let beforeUrl = mpvue.getStorageSync('loginBefore')
            if (beforeUrl) {
                mpvue.switchTab({
                    url: '/pages/index/main',
                });
            }
            let current = tabbar.find(item => {
                return item === beforeUrl
            })
            if (current) {
                mpvue.switchTab({
                    url: "/" + beforeUrl,
                });
            } else {
                wx.redirectTo({
                    url: "/" + beforeUrl,
                }); 
            } 
        }
        
    }
}
</script>

<style lang="scss" scoped>
.container {
    position: relative;
    display: flex;
    flex-direction: column;
    background: #2a8cfa;
    align-items: stretch;
    padding: 0;
    height: 100%;
    overflow: hidden;
    justify-content: space-between;
    box-sizing: border-box;
    .title {
        position: absolute;
        top: 30rpx;
        left: 50%;
        width: 600rpx;
        height: 200rpx;
        margin-left: -300rpx;
        opacity: 0;
        animation: show 2.5s cubic-bezier(0.19, 1, 0.22, 1) .5s forwards;
    }
}

.remind-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 300rpx;
    .remind-img {
        width: 250rpx;
        height: 250rpx;
    }
}

.content {
    flex: 1;
    display: flex;
    position: relative;
    justify-content: center;
    flex-direction: column;
    align-items: stretch;
    z-index: 10;
    width: 100%;
    height: 100%;
    opacity: 0;
    padding-bottom: 450rpx;
    background: -webkit-gradient(linear, left top, left bottom, from(rgba(244, 244, 244, 0)), color-stop(0.1, #f4f4f4), to(#f4f4f4));
    transform: translate3d(0, 100%, 0);
    animation: rise 3s cubic-bezier(0.19, 1, 0.22, 1) .25s forwards;
    .hd {
        position: absolute;
        top: 0;
        left: 50%;
        width: 1000rpx;
        margin-left: -500rpx;
        height: 200rpx;
        transition: all .35s ease;
        transform: rotateZ(0deg);
        .logo {
            position: absolute;
            z-index: 2;
            left: 50%;
            bottom: 160rpx;
            width: 160rpx;
            height: 160rpx;
            margin-left: -80rpx;
            border-radius: 160rpx;
            animation: sway 10s ease-in-out infinite;
            opacity: .95;
        }
        .wave {
            position: absolute;
            z-index: 3;
            right: 0;
            bottom: 0;
            opacity: 0.725;
            height: 260rpx;
            width: 2250rpx;
            animation: wave 10s linear infinite;
        }
        .wave-bg {
            z-index: 1;
            animation: wave-bg 10.25s linear infinite;
        }
    }
    .bd {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        animation: bd-rise 2s cubic-bezier(0.23, 1, 0.32, 1) .75s forwards;
        opacity: 0;
        z-index: 4;
        .smalltitle {
            position: absolute;
            top: 150rpx;
            left: 50%;
            width: 408rpx;
            height: 43rpx;
            margin-left: -204rpx;
            opacity: 0;
            animation: show 2.5s cubic-bezier(0.19, 1, 0.22, 1) .5s forwards;
        }
        .confirm-btn {
            font-size: 13pt;
            line-height: 85rpx;
            height: 85rpx;
            background: #2a8cfa;
            color: #fff;
            text-align: center;
            border-radius: 100rpx;
            margin: 60% 20% 20%;
            &:active {
                opacity: .8;
            }
        }
    }
}
.bind-warp{
    padding: 24rpx;
    .bind-title {
        text-align: center;
        font-size: 40rpx;
        color: #000;
        line-height: 100rpx;
    }
    .bind-desc{
        text-align: center;
        font-size: 30rpx;
        color: #818181;
        line-height: 1;
        margin-top: 18rpx;

    }
    .bind-code{
        position: relative;
        padding: 24rpx;
        overflow: hidden;
        .code{
            height: 107rpx;
            position: absolute;
            left: -100%;
            right: 0;
            bottom: 0;
            opacity: 0;
            display: block;
            color: #fff;
        }
    }
    .bind-submit{
        margin: 58rpx auto 40rpx;
        width: 411rpx;
        height: 74rpx;
        background: linear-gradient(to right, #2EB90D , #67E24A);
        border-radius: 50rpx;
        text-align: center;
        line-height: 74rpx;
        font-size: 27rpx;
        color: #fff;
    }
    .field-wrap{
        display: flex;
        width: 100%;
        justify-content: space-between;
        .code-item{
            height: 107rpx;
            width:56rpx;
            border-bottom: 5rpx solid rgba(59,147,58,.55);
            line-height: 107rpx;
            text-align: center;
            font-size: 73rpx;
            color: #000;
        }
    }
}
@keyframes rise {
    0% {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 1;
        transform: translate3d(0, 450rpx, 0);
    }
}
@keyframes show {
    0% {
        opacity: 0;
    }
    100% {
        opacity: .95;
    }
}
@keyframes sway {
    0% {
        transform: translate3d(0, 20rpx, 0) rotate(-15deg);
    }
    17% {
        transform: translate3d(0, 0rpx, 0) rotate(25deg);
    }
    34% {
        transform: translate3d(0, -20rpx, 0) rotate(-20deg);
    }
    50% {
        transform: translate3d(0, -10rpx, 0) rotate(15deg);
    }
    67% {
        transform: translate3d(0, 10rpx, 0) rotate(-25deg);
    }
    84% {
        transform: translate3d(0, 15rpx, 0) rotate(15deg);
    }
    100% {
        transform: translate3d(0, 20rpx, 0) rotate(-15deg);
    }
}
@keyframes wave {
    from {
        transform: translate3d(125rpx, 0, 0);
    }
    to {
        transform: translate3d(1125rpx, 0, 0);
    }
}
@keyframes wave-bg {
    from {
        transform: translate3d(375rpx, 0, 0);
    }
    to {
        transform: translate3d(1375rpx, 0, 0);
    }
}
@keyframes bd-rise {
    from {
        opacity: 0;
        transform: translate3d(0, 60rpx, 0);
    }
    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}
</style>
