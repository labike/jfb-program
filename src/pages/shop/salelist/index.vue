<!--
 * @Author: zhangHang
 * @Date: 2019-09-21 11:20:27
 * @Description: file content
 -->
<template>

<div  class="time-sale-warp">
    <div class="time-sale">
        <div class="bg"></div>
        <div class="shop-list-warp">
            <ul class="shop-list" v-if="shopList.length">
                <li class="shop-item" v-for="shop of shopList" :key="shop.x_id"
                    @click.stop="jumpPages(shop)"
                >
                    <div class="activity" :class="{gray: shop.stopActivity}"
                        v-if="shop.give">
                        <div class="top">
                            <div class="img-warp">
                                <ImageView :src="shop.give.img" mode='scaleToFill' height="400rpx" width="690rpx"></ImageView>
                            </div>
                            <div class="product">
                                <div class="icon"></div>
                                <div class="disc">
                                    <p>价值{{shop.give.buyer}}元{{shop.give.product_name}}
                                        <span>{{shop.give.number}} {{shop.give.unit}}</span>
                                    </p>
                                </div>
                                <div class="linetime">
                                    <div class="library">
                                        <div class="progress" :style="{width:(shop.sale/shop.give.library*100)+ '%'}"></div>
                                        <p class="sale">已售 {{shop.sale}} 张</p>
                                    </div>
                                    <div class="time">剩余 {{shop.give.library - shop.sale}} 张</div>
                                </div>
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="info">
                                <div class="name">{{shop.storeInfo.storeName}}</div>
                                <ul class="score" :class="shop.storeInfo.scoreName">
                                    <li class="star"></li>
                                    <li class="star"></li>
                                    <li class="star"></li>
                                    <li class="star"></li>
                                    <li class="star"></li>
                                    <li class="text">{{shop.storeInfo.star}}</li>
                                </ul>
                                <div class="location">
                                    <span class="address">{{shop.storeInfo.address}}</span>
                                    <span class="number">{{shop.distance}}</span>
                                </div>
                            </div>
                            <div class="handle">
                                <div class="price">{{shop.give.sale_price}}</div>
                                <div class="go gray" v-if="shop.sale>=shop.give.library">已售罄</div>
                                <div class="go" v-else @click.stop="jumpItemPage(shop)">马上抢</div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            
            <div class="empty" v-if="emptyList">
                <ImageView src="/static/img/null_bg.png" width='160rpx'></ImageView>
                <div class="text">暂时未添加相关活动~</div>
            </div>
        </div>
    </div>
</div>

</template>

<script>
import LastTime from "@c/shop/LastTime.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { apiGiveList } from "@/api/api";
import { WAPHOST, shopType } from "@/config/base";
import { mapState } from 'vuex';
export default {
    name: "time-sale",
    data() {
        return {
            params: {},
            scrollTop: 0,
            emptyList: false,
            scrollStatus: true,
            remainListsLength: 5,
            shopList: []
        };
    },
    components: {
        ImageView,
        LastTime
    },        
    computed: {
        ...mapState('user', [
            'lat',
            'lng',
        ]),
    },
    onLoad (options) {
        const that = this
        that.params = {
            lng: that.lng,
            lat: that.lat,
            give_category: options.gcid, 
            page: 1,
            industry_id: options.industry
        }
        that.shopList = []
        that.pullDownData()    
    },
    onUnload() {        
        const self = this;
        self.scrollStatus = true
        self.emptyList = false
    },
    methods: {
        setShopPageLength(length) {
            console.log(length);
            
            this.remainListsLength = length
        },
        stopActivity(shop) {
            shop.stopActivity = true
        },
        jumpPages(shop) {
            if (shop.stopActivity) {
                return
            }
            this.$router.push({
                path: `/pages/shop/saletime/main?gid=${shop.business_id}`
            })
            
        },
        jumpItemPage(shop) {
            if (shop.stopActivity) {
                return
            }
            this.$router.push({
                path: `/pages/orders/confirm/main?shop_id=${shop.x_id}&title=timesale&item_id=${shop.give.gid}`
            })
        },
        pullDownData () {
            const _this = this
            apiGiveList(_this.params).then(res => {
                res.list.forEach(shop => {
                    _this.shopList.push(_this.formartShop(shop))
                });
                if (_this.remainListsLength === res.list.length) {
                    _this.params.page++
                    _this.scrollStatus = true
                } else {
                    _this.scrollStatus = false
                }
                if (_this.params.page === 1 && _this.shopList.length === 0) {
                    _this.emptyList = true
                }
            })
        },
        formartShop(shop) {
            if (shop.storeInfo.star) {
                let scoreName = 'score' + shop.storeInfo.star
                const scoreDot = scoreName.indexOf('.')
                if (scoreDot > -1) {
                    scoreName = scoreName.slice(0,scoreDot)
                    if (Math.round(this.shop.score) > Math.floor(this.shop.score)) {
                        scoreName = scoreName + ' dot'
                    }
                }
                shop.storeInfo.star = parseFloat(shop.storeInfo.star).toFixed(1);
                shop.storeInfo.scoreName = scoreName
            }
            if (shop.distance) {
                let num = shop.distance
                if (num > 1000) {
                    shop.distance = (num / 1000).toFixed(1) + 'km'
                } else {
                    shop.distance = num + 'm'
                }
            }
            return shop;
        }
    },
    onPullDownRefresh () {
        this.params.page = 1
        this.shopList = []
        this.pullDownData()  
        mpvue.stopPullDownRefresh()
    },
    onReachBottom () {
        console.log(12);
        
        if (this.scrollStatus) {
            this.pullDownData()
        } else {
            mpvue.showToast({
                title: '没有更多数据了！',
                icon: 'none',
                duration: 1000
            })
        }
    },
};
</script>

<style lang="scss" scoped>
.time-sale{
    background: #f5f5f5;
    padding: 30rpx;
    overflow: hidden;
    position: relative;
    z-index: 0;
    .bg{
        position: absolute;
        z-index: 8;
        top: 0;
        left: 0;
        right: 0;
        background-image: linear-gradient(to bottom , #fcfcfc, #f5f5f5);
        height: 400rpx;
        &::after{
            content: '';
            position: absolute;
            z-index: 9;
            top: -90rpx;
            left: -20%;
            background: #ff5a35;
            width: 140%;
            height: 300rpx;
            border-radius: 0 0 50% 50%;
        }
    }
    .shop-list{
        position: relative;
        z-index: 10;
    }
    .score{
        display: flex;
        align-items: center;
        .text{
            color:#ff5100;
            margin-left: 10rpx;
            font-size: 12px;
            line-height: 1;
        }
        .star{
            width: 24rpx;
            height: 24rpx;
            display: inline-block;
            vertical-align: bottom;
            background-size: 24rpx 24rpx;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/icon_rating_bar_secondary_progress.png');
        }
        &1 .star:nth-child(1),
        &2 .star:nth-child(-n + 2),
        &3 .star:nth-child(-n + 3),
        &4 .star:nth-child(-n + 4),
        &5 .star:nth-child(-n + 5) {
            background-image: url('~@/assets/img/icon_rating_bar_progress.png');
        }
        &1.dot .star:nth-child(2),
        &2.dot .star:nth-child(3),
        &3.dot .star:nth-child(4),
        &4.dot .star:nth-child(5) {
            position: relative;
            &::after{
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                width: 50%;
                height: 100%;
                vertical-align: bottom;
                background-size: 25rpx 25rpx;
                background-position: 0 0;
                background-repeat: no-repeat;
                background-image: url('~@/assets/img/icon_rating_bar_progress.png');
            }
            
        }
    }
    .activity{
        background: #fff;
        box-shadow: 1px 1px 10px #efefef;
        border-radius: 10rpx;
        overflow: hidden;
        margin-bottom: 30rpx;
        &.gray{
            -webkit-filter: grayscale(100%)
        }
        .top{
            position: relative;
        }
        .bottom{
            padding: 30rpx;
            display: flex;
            line-height: 1;
            .info{
                flex: 1;
            }
            .name{
                font-size: 16px;
                color: #000;
                font-weight: 700;
                margin-bottom: 20rpx;
            }
            .location{
                font-size: 11px;
                color: #818181;
                margin-top: 30rpx;
            }
            .address{
                margin-right: 30rpx;
            }
            .price{
                &::before{
                    content: "￥";
                    font-size: 16px;
                }
                font-size: 27px;
                color: #323232;
                font-weight: 700;
                text-align: center;
            }
            .go{
                background: #ff1800;
                color: #fff;
                font-size: 14px;
                font-weight: 700;
                height: 60rpx;
                min-width: 88rpx;
                line-height: 60rpx;
                border-radius: 60rpx;
                margin-top: 10px;
                padding: 0 24rpx;
                text-align: center;
                &.gray{
                    -webkit-filter: grayscale(100%)
                }
            }
        }
        .product{
            position: absolute;
            bottom: 0;
            height: 100rpx;
            width: 100%;
            background: rgba(0, 0, 0, .7);
            display: flex;
            color: #fff;
            .icon{
                margin-left: 30rpx;
                width: 108rpx;
                height: 108rpx;
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
                background-image: url('~@/assets/img/send.png');
                position: relative;
                top: -24rpx;
            }
            .disc{
                font-size: 15px;
                font-weight: 400;
                margin: 0 10rpx;
                flex: 1;
                display: flex;
                align-items: center;
                line-height: 1.4;
            }
            .linetime{
                font-size: 12px;
                background-size: auto 100rpx;
                background-position: left center;
                background-repeat: no-repeat;
                background-image: url('~@/assets/img/linetime.png');
                padding: 0 24rpx 0 30rpx;
                position: relative;
                &::after{
                    content: '';
                    position:absolute;
                    right: 0;
                    top: 0;
                    left: 50rpx;
                    height: 100%;
                    z-index: 1;
                    background: #ff5100;
                }
                .library{
                    font-size: 10px;
                    min-width: 100rpx;
                    padding: 0 24rpx;
                    margin: 20rpx auto 10rpx;
                    height: 30rpx;
                    line-height: 30rpx;
                    background: #fde7d8;
                    border-radius: 30rpx;
                    position: relative;
                    overflow: hidden;
                    z-index: 3;
                    .progress{
                        position:absolute;
                        left: 0;
                        top: 0;
                        width: 0;
                        height: 30rpx;
                        z-index: 8;
                        background: #ffde00;
                    }
                    .sale{
                        position: relative;
                        text-align: center;
                        z-index: 10;
                        color: #13100c;
                    }
                }
                .time{
                    position: relative;
                    z-index: 4;
                    text-align: center;
                }
            }
        }
    }
    .empty{
        text-align: center;
        position: relative;
        z-index: 20;
        padding-top: 240rpx;
        color: #818181;
    }
}
</style>

