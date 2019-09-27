<!--
 * @Author: zhangHang
 * @Date: 2019-05-22 11:48:30
 * @Description: file content
 -->
<template>
<div class="mine_container">
    <header class="base-info">
        <div class="lt-warp">
            <img :src="userInfo.headimgurl" class="avater bor" v-if="userInfo.headimgurl&&userInfo.headimgurl!=0">
            <img src="/static/tabs/icon_user_head.png" class="avater" v-else>
        </div>
        <div class="rt-warp">
            <div class="name" v-if="userInfo.mobile">{{userInfo.nickname}}</div>
            <div class="name" v-else>未登录</div>
            <div class="phone">{{userInfo.mobile}}</div>
        </div>
        <div class="location"  @click="jumpMinePages('info')"></div>
    </header>
    <div class="big-icon">
        <ul class="nav-bar">
            <li class="nav" @click="jumpMinePages('message')">
                <img src="/static/tabs/icon_me_message.png" alt="" class="icon">
                <div class="text">我的消息</div>
            </li>
            <li class="nav" @click="jumpMinePages('evaluate')">
                <img src="/static/tabs/icon_me_evaluate.png" alt="" class="icon">
                <div class="text">我的评价</div>
            </li>
            <li class="nav" @click="jumpMinePages('patronage', 'tab=1')">
                <img src="/static/tabs/icon_me_collect.png" alt="" class="icon">
                <div class="text">我的收藏</div>
            </li>
        </ul>
    </div>

    <ul class="group">
        <li class="group-item"  @click="jumpMoneyPages('index')">
            <img src="/static/tabs/icon_me_property_wallet.png" class="icon">
            <div class="group-item-text">
                <div class="left">我的钱包</div>
            </div>
        </li>
        <li class="group-item" @click="jumpMinePages('reshop')">
            <img src="/static/tabs/icon_me_shop.png" class="icon">
            <div class="group-item-text">
                <div class="left">我的返佣好店</div>
            </div>
        </li>
    </ul>

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
                <div class="left">我要合作</div>
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

export default {
    name: 'mine',
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
    onShow() {
        const self = this;
        if (!self.userInfo.nickname || !self.userInfo.mobile) {
            apiGetUsers().then(res => {
                console.log(res);
                self.updataUsers({
                    headimgurl: res.header_img,
                    nickname: res.nickname,
                    mobile: res.mobile,
                }) 
            })
        }
        
    },
    methods: {
        ...mapActions('user', [
            'updataUsers',
        ]),
        jumpMinePages(page, params) {
            if (params) {
                mpvue.navigateTo({
                    url: `/pages/mine/${page}/main?${params}`
                })
            } else {
                mpvue.navigateTo({
                    url: `/pages/mine/${page}/main`
                })
            }
             
        },
        jumpWeb(page) {
            this.$router.push({
                path: `/pages/web/main?url=${encodeURIComponent(page)}`
            }) 
        },
        jumpMoneyPages(page) {
            this.$router.push({
                path: `/pages/money/${page}/main`
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
    background-color: $base-color;
    display: flex;
    align-items: center;
    padding : 30rpx 24rpx;
    .location{
        width: 30rpx;
        height: 60rpx;
        background-image: url(~@/assets/img/icon_go.png);
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }
    .lt-warp{
        flex-grow: 0;
        margin-right: .24rem;
        .avater{
            display: block;
            width: 120rpx;
            height: 120rpx;
            &.bor{
                border-radius: 120rpx;
                border: 5rpx solid #f5f5f5;
            }
        }
    }
    .rt-warp{
        flex: 1;
        color: #fff;
        height: 100rpx;
        .name{
            font-weight: 400;
            height: 40rpx;
            font-size: 14px;
            margin-bottom: 20rpx;
        }
        .phone{
            display: flex;
            align-items: flex-end;
            font-size: 11px;
            line-height: 1;
            &::before{
                content: '';
                display: inline-block;
                margin-right: 10rpx;
                width: 24rpx;
                height: 24rpx;
                background-image: url(~@/assets/img/icon_phone.png);
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
            }
        }
    }
}
.big-icon{
    background: #fff;
    .nav-bar{
        display: flex;
        .nav{
            padding: 40rpx 0;
            flex: 1;
            position: relative;
            text-align: center;
            &:not(:last-child)::before {
                content: '';
                position: absolute;
                z-index: 2;
                top: 0;
                right: 0;
                width: 1px;
                height: 100%;
                border-right: 1px solid #e8e8e8;
                -webkit-transform: scaleX(0.5);
                transform: scaleX(0.5);
            }
        }
        .icon{
            width: 80rpx;
            height: 80rpx;
            margin-bottom: 10rpx;
        }
        .text{
            font-size: 12px;
        }
    }

}
.group{
    background: #fff;
    margin-top: 20rpx;
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
