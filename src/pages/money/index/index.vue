<!--
 * @Author: zhangHang
 * @Date: 2019-07-03 08:55:53
 * @Description: 我的钱包
 -->
<template>
<div class="container">
    
    <scroll-view class="scroll-warp" scroll-y @scrolltolower="toggleInner" >
        <header class="top-info">
            <div class="info-warp">
                <div class="price-warp">
                    <div class="price">{{balance}}</div>
                    <div class="handle" @click="goWithdraw">去提现</div>
                </div>
                <div class="title">可提现金额</div>
                <div class="price-bar">
                    <ul class="bar">
                        <li v-for="(top, index) of topData" :key="index">
                            <div class="name">{{top.name}}</div>
                            <div class="value">{{top.value}}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
        <div class="foot-list">
            <div class="nav">
                <div class="item" :class="{active: currentView === 0}" @click="currentView=0">收益情况</div>
                <div class="item" :class="{active: currentView === 1}" @click="currentView=1">提现记录</div>
            </div>
            <swiper class="shopListSwiper"
                :current='currentView'
                @change="swiperchange($event)"
            >
                <swiper-item style="overflow: visible;border-radius: 50%;" class="one-scene">
                    <scroll-view :style="{height: listScroll}" scroll-y 
                        @scrolltoupper="toggleWarp"
                        @scrolltolower="loadMore"
                    > 
                        <div  class="shop-list" v-if="shopParams.list.length">
                            <shop-card v-for="(shop, sindex) of shopParams.list" :key="sindex"
                                :shopInfo='shop'
                                @share='shareShop'
                            ></shop-card>
                        </div>
                        <div class="empty" v-else>
                            <img class="icon" src="/static/img/empty.png" mode="widthFix">
                            <div class="text">您还没有相关数据~</div>
                        </div>
                    </scroll-view>
                </swiper-item>
                <swiper-item style="overflow: visible;border-radius: 50%;" class="one-scene">
                    <scroll-view :style="{height: listScroll}" scroll-y 
                        @scrolltoupper="toggleWarp"
                        @scrolltolower="loadMore"
                    > 
                        <div  class="price-list" v-if="casheParams.list.length">
                            <div class="cashe-warp"  v-for="(cashe, cindex) of casheParams.list" :key="cindex">
                                <div class="time">{{cashe.cashes_time}}</div>
                                <div class="type">{{cashe.cash_method}}</div>
                                <div class="price">￥{{cashe.money}}</div>
                            </div>
                        </div>
                        <div class="empty" v-else>
                            <img class="icon" src="/static/img/empty.png" mode="widthFix">
                            <div class="text">您还没有相关数据~</div>
                        </div>
                    </scroll-view>
                </swiper-item>
            </swiper>
        </div>
    </scroll-view>

    <div class="mask-warp" v-if="shareShopStatus">
        <div class="mask" @click="shareShopStatus=false"></div>
        <div class="mask-inner" >
            <div class="canlbtn" @click="shareShopStatus=false"></div>
            <app-share :cardInfo='cardInfo'></app-share>
        </div>
    </div>
</div>


</template>

<script>
import { mapState, mapActions } from 'vuex';
import { apiReward, apiRewardList, apiRewardCashes } from '@/api/api';
import { callPhone } from '@/utils/index';
import ShopCard from "./../views/ShopCard.vue";
import AppShare from "@c/share/AppShare.vue";
import { WAPHOST } from "@/config/base";
export default {
    name: 'moneyindex',
    components: {
        ShopCard,
        AppShare
    },
    data() {
        return {
            topData: [{
                name: '总收益',
                value: '0'
            },{
                name: '已提现',
                value: '0'
            },{
                name: '返佣店铺',
                value: '0'
            }],
            currentView: 0,
            shopParams: {
                page: 1,
                nextPage: true,
                list: [],
            },
            casheParams: {
                page: 1,
                nextPage: true,
                list: [],
            },
            limitLength: 15,
            listScroll: "auto",
            balance: 0,
            shareShopStatus: false
        }
    },
    computed: {
        ...mapState({
            "userInfo": state => state.user.userInfo 
        }),
    },
    onShow() {  
        const self = this;
        self.getBalance().then(res => {
            this.balance = res.balance
            this.topData[0].value = res.total
            this.topData[1].value = res.arrival_account
        })
        self.getRewardList(1)
    },
    onUnload() {        
        const self = this;
        self.shareShopStatus = false
    },
    methods: {
        ...mapActions('user', [
            'updataUsers',
            'getBalance'
        ]),
        
        toggleInner(e) {
            console.log(e);
            this.listScroll = '100%'
        },
        toggleWarp(e) {
            console.log(e);
            this.listScroll = 'auto'
        },
        getRewardList(page) {
            const that = this
            apiRewardList({
                limit: that.limitLength,
                page
            }).then(res => {
                that.topData[2].value = res.total
                that.updatedList(page, 'shop', res.list)
            })
        },
        getRewardCashes(page) {
            const that = this
            apiRewardCashes({
                limit: that.limitLength,
                page
            }).then(res => {
                that.updatedList(page, 'cashe', res.list)
            })
        },
        updatedList(page, name, list) {
            let current = this[name + "Params"]
            if (!current.nextPage) {
                mpvue.showToast({
                    title: '没有更多数据了！',
                    icon: 'none',
                    duration: 1000
                })
                return
            }
            if (page === 1) {
                current.list = list
            } else {
                list.forEach(item => {
                    current.list.push(item)
                });
            }
            current.nextPage = list.length >= this.limitLength
        },
        loadMore() {
            const that = this
            let name = ""
            switch (that.currentView) {
            case 0:
                that.shopParams.page++ 
                that.getRewardList(that.shopParams.page)
                break;
            case 1:
                that.shopParams.page++ 
                that.casheParams(that.shopParams.page)
                break;
            }

        },
        goWithdraw() {         
            this.$router.push({
                path: '/pages/money/withdraw/main'
            })  
        },
        swiperchange(e) {
            if (e.type !== 'change') {
                return
            }
            let oIndex = e.mp.detail.current;
            this.currentView = oIndex;
            if (oIndex === 0) {
                this.shopParams.page = 1
                this.getRewardList(1)
            }
            if (oIndex === 1) {
                this.shopParams.page = 1
                this.getRewardCashes(1)
            }
        },
        
        shareShop(cardInfo) {
            this.cardInfo = cardInfo
            this.shareShopStatus = true
        },
    },
    
    onShareAppMessage (options) {
        if (options.from === "menu") {
            return {
                title: '我发现了一款省钱的小程序',
                path: '/pages/index/main',
                imageUrl: WAPHOST + 'shareImg.png',
            }
        }
        console.log(options);
        const share = options.target.dataset.share
        return {
            title: share.title,
            path: "/pages/start/invitation/main?code=" + share.code,
            imageUrl: share.imageUrl,
        }
    },
}
</script>


<style lang="scss" scoped>
@import "~@/assets/styles/common/variables.scss";
.container,
.scroll-warp{
    background: #fff;
    height: 100%;
}
.top-info {
    padding-bottom: 50px;
    .info-warp{
        text-align: center;
        background-color: $base-color;
        padding : 24rpx 50rpx;
        height: 220rpx;
        .title{
            color: #fff;
            text-align: center;
            font-size: 24rpx;
        }
    }
    .price-warp{
        color: #fff;
        line-height: 1;
        position: relative;
        display: inline-block;
        .price{
            font-size: 80rpx;
            font-weight: 700;
            margin-bottom: 24rpx;
            &::before{
                content: '￥';
                font-size: 30rpx;
            }
        }
        .handle{
            font-size: 24rpx;
            width: 130rpx;
            height: 40rpx;
            border-radius: 40rpx;
            background: rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 40rpx;
            right: -150rpx;
            &::after{
                content: '';
                display: inline-block;
                margin-left: 5rpx;
                width: 15rpx;
                height: 30rpx;
                background-image: url(~@/assets/img/icon_go.png);
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
            }
        }
    }
    .price-bar{
        margin-top: 50rpx;
        border-radius: 10rpx;
        background: #fff;
        height: 130rpx;
        box-shadow: 0rpx 1rpx 50rpx #2a8cfa;
        .bar{
            display: flex;
            line-height: 1;
            height: 100%;
            text-align: center;
            align-items: center;
            li {
                flex: 1;
            }
            li ~ li{
                content: '';
                border-left: 1px solid #e8e8e8;
            }
            .name{
                font-size: 24rpx;
                color: #818181;
                margin-bottom: 20rpx;;
            }
            .value{
                font-size: 30rpx;
                color: #000;
            }
        }
    }
}


.foot-list{
    height: 100%;
    display: flex;
    flex-direction: column;
    .shopListSwiper {
        background: #f5f5f5;
        width: 100%;
        height: auto;
        flex: 1;
        overflow: visible;
    }
    .nav{
        display: flex;
        font-size: 28rpx;
        color: #818181;
        padding: 20rpx 50rpx;
        justify-content: space-between;
        border-bottom: 1rpx solid #f2f2f2;
        .active{
            color: #2a8cfa;
            font-weight: 700;
        }
    }
    .empty{
        height: 100%;
        background: #f5f5f5;
        text-align: center;
        .icon{
            margin-top: 100rpx;
            width: 300rpx;
        }
        .text{
            font-size: 24rpx;
            margin-top: 10rpx;
        }
    }
}
.cashe-warp{
    color: #000;
    font-size: 12px;
    background: #fff;
    padding: 24rpx;
    position: relative;
    border-bottom: 1rpx solid #f2f2f2;
    .time{
        margin-bottom: 10rpx;
    }
    .price{
        font-size: 16px;
        position: absolute;
        right: 24rpx;
        bottom: 24rpx;
    }
}
.mask-warp{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    z-index: 9999;
    justify-content: flex-start;
    .mask{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 10000;
    }
    .mask-inner{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 90%;
        height: auto;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        transform: translate(-50%, -50%);
    }
    .canlbtn{
        width: 60rpx;
        height: 60rpx;
        position: absolute;
        right: 0;
        top: -60rpx;
        background-repeat: no-repeat;
        background-size: 40rpx;
        background-position: center;
        background-image: url(~@/assets/img/close.png);
    }
}
</style>
