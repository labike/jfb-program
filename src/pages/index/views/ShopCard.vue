<!--
 * @Author: zhangHang
 * @Date: 2019-05-16 16:04:59
 * @Description: file content
 -->
<template>
<div class="shop-card" v-if="shop && shop.x_id" @click="jumpShop(shop)">
    <div class="card other">
        <div class="activity" v-if="shop.giveInfo">
            <div class="top">
                <div class="img-warp">
                    <ImageView :src="shop.giveInfo.img" mode='aspectFill' height="350rpx" width="690rpx"></ImageView>
                </div>
                <div class="time">剩余 {{shop.giveInfo.library - shop.giveInfo.sale}}</div>
            </div>
            <div class="bottom">
                <div class="info">
                    <div class="name">
                        <span class="icon">赠送</span>送价值{{shop.giveInfo.buyer}}元{{shop.giveInfo.pro_name}}
                        <span>{{shop.giveInfo.number}} {{shop.giveInfo.unit}}</span>
                    </div>
                    <div class="location">
                        <span class="number">{{distance}}</span>
                    </div>
                    <div class="description">{{shop.giveInfo.description}}</div>
                </div>
                <div class="handle">
                    <div class="price-group" >
                        <span>预定价 : </span>
                        <span class="price">{{shop.giveInfo.sale_price}}</span>
                    </div>
                    <div class="go gray" v-if="shop.giveInfo.sale>=shop.giveInfo.library">已售罄</div>
                    <div class="go" v-else @click.stop="jumpItemPage(shop.giveInfo, 'timesale')">预定</div>
                </div>
            </div>
        </div>
        <div class="activity" v-else-if="shop.groupInfo">
            <div class="top">
                <div class="img-warp">
                    <ImageView :src="shop.groupInfo.img_url" mode='aspectFill' height="350rpx" width="690rpx"></ImageView>
                </div>
                <div class="time">剩余 {{shop.groupInfo.library - shop.groupInfo.sale}}</div>
            </div>
            <div class="bottom">
                <div class="info">
                    <div class="name">
                        <span class="icon">爆款</span>{{shop.groupInfo.group_name}}
                    </div>
                    <div class="location">
                        <span class="number">{{distance}}</span>
                    </div>
                    <div class="description">{{shop.groupInfo.description}}</div>
                </div>
                <div class="handle">
                    <div class="price-group" >
                        <span>特惠价 : </span>
                        <span class="price">{{shop.groupInfo.group_price}}</span>
                    </div>
                    <div class="go gray" v-if="shop.groupInfo.sale-0 >=shop.groupInfo.library">已售罄</div>
                    <div class="go" v-else @click.stop="jumpItemPage(shop.groupInfo, 'combo')">马上抢</div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import LastTime from "@c/shop/LastTime.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { likeShare, unLikeShare, apiShareStore } from "@/api/api";
import { getDistance } from '@/utils/index';
import { mapState } from 'vuex';

export default {
    name: 'ShopCard',
    components: {
        ImageView,
        LastTime
    },
    data() {
        return {
            shop: {}
        }
    },
    props: {
        shopInfo: Object
    },
    onLoad() {
        this.shop = this.formatShop(this.shopInfo)
    },
    computed: {
        ...mapState('user', [
            'lat',
            'lng',
        ]),
        distance() {
            const _this = this
            let num = _this.shop.distance
            if (num > 1000) {
                return (num / 1000).toFixed(1) + 'km'
            } else {
                return num + 'm'
            }
        },
    },
    methods: {
        formatShop(shop) {
            let newShop = JSON.parse(JSON.stringify(shop))
            newShop.star = parseFloat(newShop.star)
            if (newShop.giveInfo) {
                newShop.giveInfo.library = parseInt(newShop.giveInfo.library);
                newShop.giveInfo.sale = parseInt(newShop.giveInfo.sale);
            }
            return newShop
        },
        jumpShop(shop) {
            if (shop.giveInfo) {
                this.$router.push({
                    path: '/pages/shop/saletime/main?gid=' + shop.giveInfo.gid
                })
            } else {    
                this.$router.push({
                    path: `/pages/shop/faddish/main?shop_id=${shop.x_id}&gid=${shop.groupInfo.id}`
                })
            }
            
        },
        jumpItemPage(item, title) {
            this.$router.push({
                path: `/pages/orders/confirm/main?shop_id=${item.x_id}&title=${title}&item_id=${item.id}`
            })
            
        }
    },
};
</script>


<style lang="scss" scoped>
.shop-card{
    padding:20rpx 30rpx;
    font-family: '.PingFang-SC-Medium';
}
.card{
    background: #fff;
    border-radius: 10rpx;
    padding: 36rpx 24rpx;
    position: relative;
    box-shadow: 1px 4px 10px #ddd;
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
}
.other{
    padding: 0;
    overflow: hidden;
    .distance{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10rpx;
    }
    
    .location{
        font-size: 12px;
        color: #818181;
        display: flex;
        .address{
            max-width: 200rpx;
            min-width: 100rpx;
            width: auto;
            word-wrap: normal;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            padding-right: 24rpx;
            border-right: 1rpx solid #e8e8e8;
        }
        .number{
            padding-left: 24rpx;
        }
    }
}
.activity{
    &.gray{
        filter: grayscale(100%);
        -webkit-filter: grayscale(100%);
    }
    .top{
        position: relative;
        .img-warp{
            height: 350rpx;
            width: 690rpx;
        }
    }
    .bottom{
        padding: 20rpx 30rpx 30rpx 30rpx;
        line-height: 1;
        .info{
            position: relative;
        }
        .location{
            position: absolute;
            right: 0;
            top: 20rpx;
            font-size: 11px;
        }
        .description{
            font-size: 12px;
            line-height: 1.6;
            color: #818181;
            font-weight: 400;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
        }
        .handle{
            margin-top: 10rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .price-group{
            color: #323232;
            font-size: 12px;
        }
        .price{
            font-size: 21px;
            color: #ff4400;
            font-weight: 400;
            text-align: center;
            &::before{
                content: "￥";
                font-size: 12px;
                font-weight: 400;
            }
        }
        .go{
            background: #ff4400;
            color: #fff;
            font-size: 12px;
            font-weight: 400;
            height: 60rpx;
            min-width: 132rpx;
            line-height: 60rpx;
            border-radius: 60rpx;
            padding: 0 24rpx;
            text-align: center;
            &.gray{
                filter: grayscale(100%);
                -webkit-filter: grayscale(100%);
            }
        }
    }
    
    .name{
        font-size: 16px;
        color: #000;
        font-weight: 700;
        margin-bottom: 10rpx;
        margin-right: 100rpx;
        line-height: 1.4;
        .icon{
            background: #ff4400;
            font-size: 12px;
            color: #fff;
            padding: 1rpx 9rpx;
            border-radius: 2px;
            margin-right: 10rpx;
            position: relative;
            top: -1rpx;
        }
    }
    .time{
        position: absolute;
        z-index: 4;
        width: 116rpx;
        height: 50rpx;
        line-height: 50rpx;
        top: 20rpx;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        font-size: 11px;
        padding-left: 24rpx;
        border-radius: 0 50rpx 50rpx 0;
    }
}
</style>

