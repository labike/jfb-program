<!--
 * @Author: zhangHang
 * @Date: 2019-05-22 11:48:30
 * @Description: file content
 -->
<template>
<div class="mine_container">
    <header class="base-info">
        <div class="avater" @click="jumpMinePages('info')">
            <ImageView  picture='/static/img/avatar.png' :src="userInfo.headimgurl"
                mode='aspectFill'  width='130rpx' height='130rpx'
            ></ImageView>
        </div>
        <div class="intro-warp">
            <div class="name" v-if="userInfo.mobile">{{userInfo.nickname}}</div>
            <div class="personal">个人主页</div>
            <div class="message" @click="jumpMinePages('message')"></div>
            <div class="settings" @click="jumpMinePages('info')"></div>
        </div>
        <ul class="navbar-warp">
            <li class="reshop" @click="jumpMinePages('reshop')">
                <i class="icon"></i>
                <div class="text">返佣好店</div>
            </li>
            <li class="evaluate" @click="jumpMinePages('evaluate')">
                <i class="icon"></i>
                <div class="text">我的评价</div>
            </li>
            <li class="patronage" @click="jumpMinePages('patronage', 'tab=1')">
                <i class="icon"></i>
                <div class="text">收藏店铺</div>
            </li>
            <li class="rebate" @click="jumpRebatePages('index')">
                <i class="icon"></i>
                <div class="text">我的返佣</div>
            </li>
        </ul>

        <div class="club-warp">
            <div class="club-card" @click="jumpWeb(WAPHOST +'teamwork/club')">
                <div class="title">共享增值卡</div>
                <div class="desc">消费买单可以抵扣一定比例的消费金额</div>
                <div class="go" >去看看</div>
            </div>
        </div>
    </header>

    <div class="money-info"  @click="jumpMinePages('recharge')">
        <div class="title">增值卡余额(元)</div>
        <div class="price">{{userInfo.balance}}</div>
        <div class="btn" >余额明细</div>
    </div>

    <ul class="group">
        <li class="group-item"  @click="jumpMinePages('help')">
            <img src="/static/tabs/icon_me_service_help.png" class="icon">
            <div class="group-item-text">
                <div class="left">帮助中心</div>
            </div>
        </li>
        <li class="group-item"  @click="getCallPhone('02986513755')">
            <img src="/static/tabs/icon_me_service_service.png" class="icon">
            <div class="group-item-text">
                <div class="left">客服中心</div>
                <div class="right">029-86513755</div>
            </div>
        </li>
        <li class="group-item"  @click="jumpWeb(WAPHOST +'teamwork')">
            <img src="/static/tabs/icon_me_service_collaborate.png" class="icon">
            <div class="group-item-text">
                <div class="left">商家合作</div>
            </div>
        </li>
        <li class="group-item"  @click="jumpMinePages('about')">
            <img src="/static/tabs/icon_me_service_about.png" class="icon">
            <div class="group-item-text">
                <div class="left">关于减付宝</div>
            </div>
        </li>
    </ul>

</div>
</template>

<script>
import { WAPHOST } from '@/config/base'
import { mapState, mapActions } from 'vuex';
import { apiGetUsers } from '@/api/api';
import { callPhone } from '@/utils/index';
import ImageView from '@c/layouts/ImageView.vue'

export default {
    name: 'mine',
    components: {
        ImageView
    },
    data() {
        return {
            WAPHOST
        }
    },
    computed: {
        ...mapState({
            "userInfo": state => state.user.userInfo 
        }),
    },
    onLoad() {
        mpvue.removeStorageSync('loggingSign')
    },
    onShow() {
        const self = this;
        if (!self.userInfo.nickname || !self.userInfo.mobile) {
            apiGetUsers().then(res => {
                console.log(res);
                self.updataUsers({
                    headimgurl: res.header_img,
                    nickname: res.nickname,
                    mobile: res.mobile,
                    balance: res.balance
                }) 
            })
        }
        
    },
    methods: {
        ...mapActions('user', [
            'updataUsers',
        ]),
        jumpMinePages(page, params = '') {
            this.$router.push({
                path: `/pages/mine/${page}/main?${params}`
            })
        },
        jumpWeb(page) {
            this.$router.push({
                path: `/pages/web/main?url=${encodeURIComponent(page)}`
            }) 
        },
        jumpRebatePages(page) {
            this.$router.push({
                path: `/pages/rebate/${page}/main`
            }) 
        },
        getCallPhone(phone) {
            callPhone(phone)
        }
    }
}
</script>


<style lang="scss" scoped>
@import "~@/assets/styles/common/variables.scss";
.base-info {
    position: relative;
    z-index: 0;
    background-color: $base-color;
    margin-bottom: 94rpx;
    .avater{
        display: block;
        width: 130rpx;
        height: 130rpx;
        border-radius: 130rpx;
        overflow: hidden;
        position: absolute;
        left: 24rpx;
        top: 0;
    }
    .intro-warp{
        margin-left: 184rpx;
        padding-top: 24rpx;
        color: #fff;
        height: 150rpx;
        .name{
            font-size: 20px;
            margin-bottom: 30rpx;
            font-weight: 700;
            line-height: 1;
        }
        .personal{
            display: flex;
            align-items: flex-end;
            font-size: 11px;
            line-height: 1;
            &::after{
                content: '';
                display: inline-block;
                margin-left: 6rpx;
                width: 24rpx;
                height: 20rpx;
                background-image: url(~@/assets/img/icon_go.png);
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
                position: relative;
                top: 1rpx;
            }
        }
        .message{
            position: absolute;
            z-index: 10;
            top: 24rpx;
            right: 104rpx;
            width: 50rpx;
            height: 44rpx;
            background-image: url(~@/assets/img/icon_message.png);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }
        .settings{
            position: absolute;
            z-index: 10;
            top: 24rpx;
            right: 30rpx;
            width: 50rpx;
            height: 44rpx;
            background-image: url(~@/assets/img/icon_setting.png);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
            
        }
    }
    .navbar-warp{
        display: flex;
        li{
            flex: 1;
            position: relative;
            text-align: center;
        }
        .icon{
            height: 60rpx;
            margin-bottom: 30rpx;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }
        .reshop > .icon{
            background-image: url(~@/assets/img/icon_reshop.png);
        }
        .evaluate > .icon{
            background-image: url(~@/assets/img/icon_evaluate.png);
        }
        .patronage > .icon{
            background-image: url(~@/assets/img/icon_patronage.png);
        }
        .rebate > .icon{
            background-image: url(~@/assets/img/icon_rebate.png);
        }
        .text{
            font-weight: 400;
            font-size: 13px;
            color: #fff;
        }
    }
    .club-warp{
        height: 160rpx;
        padding: 0 24rpx;
        .club-card{
            position: relative;
            top: 40rpx;
            height: 184rpx;
            background-color: #262626;
            background-image: url($img-club_card);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: 0 0;
            border-radius: 10rpx;
            color: #e9e3c3;
            box-shadow: 1px 1px 4px #eee;
            .title{
                font-size: 15px;
                font-weight: 700;
                padding: 32rpx 30rpx 20rpx;
                &::before{
                    content: '';
                    display: inline-block;
                    margin-right: 12rpx;
                    width: 24rpx;
                    height: 30rpx;
                    background-image: url(~@/assets/img/vip.png);
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: center;
                    position: relative;
                    top: 1rpx;
                }
            }
            .desc{
                font-size: 13px;
                font-weight: 400;
                padding: 20rpx 30rpx 32rpx;
            }
            .go{
                font-size: 13px;
                font-weight: 400;
                position: absolute;
                right: 30rpx;
                top: 40rpx;
                &::after{
                    content: '';
                    display: inline-block;
                    width: 16rpx;
                    height: 16rpx;
                    border-width: 2rpx;
                    border-style: solid;
                    border-color: transparent #e9e3c3 #e9e3c3 transparent;
                    box-sizing: border-box;
                    transform: rotate3d(0, 0, 1, -45deg);
                }
            }
        }

    }
}
.money-info{
    height: 184rpx;
    border-radius: 10rpx;
    color: #000;
    box-shadow: 1px 1px 4px #eee;
    background: #fff;
    margin: 24rpx;
    position: relative;
    .title{
        padding: 30rpx;
        font-size: 14px;
        font-weight: 700;
        &::before{
            content: '';
            float: left;
            margin-right: 12rpx;
            width: 40rpx;
            height: 40rpx;
            background-image: url(~@/assets/img/money.png);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }
    }
    .price{
        font-size: 26px;
        font-weight: 700;
        padding: 0 30rpx;
    }
    .btn{
        width: 160rpx;
        height: 50rpx;
        line-height: 50rpx;
        text-align: center;
        border-radius: 50rpx;
        color: #fff;
        font-weight: 400;
        font-size: 13px;
        position: absolute;
        right: 30rpx;
        bottom: 27rpx;
        background: linear-gradient(to right, #00a9ff, #0085ff);
    }
}
.group{
    background: #fff;
    margin: 24rpx;
    border-radius: 10rpx;
    box-shadow: 1px 1px 4px #eee;
    overflow: hidden;
    .group-item{
        position: relative;
        display: flex;
        align-items: center;
        height: 100rpx;
        padding-right: 24rpx;
        .icon{
            width: 40rpx;
            height: 40rpx;
            margin: 0 24rpx;
            flex-grow: 0;
        }
        &::after{
            flex-grow: 0;
            content: '';
            width: 15rpx;
            height: 30rpx;
            margin-left: 20rpx;
            background-image: url(~@/assets/img/icon_click_right_list.png);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }
        &:not(:last-child)::before {
            content: '';
            position: absolute;
            z-index: 2;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            border-bottom: 1px solid #e8e8e8;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            -webkit-transform-origin: 0 100%;
            transform-origin: 0 100%;
        }
    }
    .group-item-text{
        flex: 1;
        font-size: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>
