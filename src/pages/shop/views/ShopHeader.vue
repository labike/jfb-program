<!--
 * @Author: zhangHang
 * @Date: 2019-05-22 09:23:41
 * @Description: file content
 -->
<template>
<div class="shop-title" :class="currentShopType">
    <div class="default">
        <div class="banner-warp">
            <div class="banner">
                <lay-swiper :list='infoData.headerImgData.envir' v-if="infoData.headerImgData.envir.length" sHeight='380rpx'></lay-swiper>
            </div>
        </div>        
        <div class="intro border-bottom">
            <div class="name">{{ infoData.store_name }}</div>
            <div class="info">
                <div :class="'rate rate' + infoData.score">
                    <i class="icon rate"></i>
                    <i class="icon rate"></i>
                    <i class="icon rate"></i>
                    <i class="icon rate"></i>
                    <i class="icon rate"></i>
                    <span class="rate-title">{{infoData.score}} 分</span>
                </div>
                <div class="type">{{ infoData.sort_name }}</div>
            </div>
        </div>
        <div class="time border-bottom" v-if="infoData.do_business_time">{{ infoData.do_business_time }}</div>
        <div class="address border-bottom">
            <div class="left">
                <p class="tit" @click="openTxMap">{{infoData.address}}</p>
                <!-- <p class="near">距您直线距离{{infoData.distance}}</p> -->
            </div>
            <div class="right">
                <div class="tel"  @click="getCallPhone(infoData.mobile)">
                    <i class="icon-tel"></i>
                </div>
            </div>
        </div>
        <div class="ad" v-if="currentShopAD">
            <div class="tit">商家公告：</div>
            <div class="content">
                <my-marquee :lists="currentShopAD"></my-marquee>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { shopType } from '@/config/base';
import MyMarquee from '@c/layouts/Marquee.vue';
import ImageView from '@c/layouts/ImageView.vue'
import LaySwiper from "@c/swiper/Advertise.vue";
import { callPhone } from '@/utils/index';

export default {
    name: "ShopHeader",
    props: {
        infoData: Object
    },
    data() {
        return {
            currentShopAD: '',
            currentShopType: ''
        }
    },
    onLoad() {
        let that = this;
        console.log(that.currentShopAD);
        if (that.infoData.Notice) {
            that.currentShopAD = that.shopAD() 
        }
        Object.keys(shopType).forEach(function(key) {
            let vaule = shopType[key].toString()
            if (vaule === that.infoData.store_type) {
                that.currentShopType = key;
            }
        });
            
        console.log(that.currentShopAD,that.currentShopType);
    },
    components: {
        MyMarquee,
        ImageView,
        LaySwiper
    },
    methods: {
        handlePhotos() {            
            this.$router.push({
                path: `/pages/shop/photos/main?shop_id=${this.infoData.s_id}`
            })
            
        },
        shopAD: function () {
            let that = this;
            let shopAD = that.infoData.Notice;
            if (that.infoData.Notice) {
                let lists = [];
                lists.push(that.infoData.Notice);
                
                return lists;
            }
            return "";
        },
        
        getCallPhone(phone) {
            callPhone(phone)
        },
        openTxMap() {
            let that = this;
            let plugin = requirePlugin('routePlan');
            let key = 'NW5BZ-Y2WKG-3T6QC-ISBMF-MTDQF-63BGJ'; //使用在腾讯位置服务申请的key
            let referer = '减付宝'; //调用插件的app的名称
            let endPoint = JSON.stringify({ //终点
                'name': that.infoData.store_name,
                'latitude': that.infoData.lat,
                'longitude': that.infoData.lng
            });
            wx.navigateTo({
                url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
            });
        }
    }
};
</script>

<style lang="scss" scoped>
/*************评星*************/
.rate {
    color: #eb1613;
    font-weight: 700;
    font-size: 0;
    .rate-title {
        margin-left: 0.1rem;
        font-size: 12px;
    }
    .icon.rate {
        width: 30rpx;
        height: 30rpx;
        margin-right: 3px;
        display: inline-block;
        vertical-align: bottom;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('~@/assets/img/star.png');
    }
    &.rate1 .icon:nth-child(1),
    &.rate2 .icon:nth-child(-n + 2),
    &.rate3 .icon:nth-child(-n + 3),
    &.rate4 .icon:nth-child(-n + 4),
    &.rate5 .icon:nth-child(-n + 5) {
        background-image: url('~@/assets/img/starSelect.png');
    }
}

/***************** default ***************/
.default{
    background: #fff;
    .show-img {
        white-space: nowrap;
        display: flex;
        justify-content: space-between;
        .img-item {
            padding: 30rpx 16rpx 0 24rpx;
            display: inline-block;
            text-align: center;
        }
        .img-inner{
            border-radius: 20rpx;
            overflow: hidden;
        }
    }
    .banner-warp{
        padding: 24rpx 24rpx 0 24rpx;
        .banner{
            overflow: hidden;
            border-radius: 10rpx;
        }
    }
    .intro{
        padding: 24rpx;
        .name{
            font-size: 20px;
            color: #000;
            font-weight: 700;
        }
        .info{
            display: flex;
            margin-top: 20rpx;
            justify-content: space-between;
        }
    }
    .time{
        padding: 0.26rem 0.24rem 0.26rem 0.7rem;
        display: flex;
        position: relative;
        font-size:  26rpx;
        &::before {
            content: ' ';
            position: absolute;
            display: block;
            left: 26rpx;
            top: 50%;
            margin-top: -6px;
            height: 13px;
            width: 13px;
            background: url('~@/assets/img/stores2.png') no-repeat;
            background-size: contain;
            background-position: center;
        }
    }
    .address {
        padding: 0.26rem 0.24rem;
        display: flex;
        .tit {
            font-weight: 400;
            font-size: 13px;
            color: #000;
        }
        .near {
            font-size: 14px;
            color: #818181;
        }
        .left {
            padding: 0 0.45rem;
            position: relative;
            flex: 1;
            &:before {
                content: ' ';
                position: absolute;
                display: block;
                left: 0;
                top: 2px;
                height: 15px;
                width: 15px;
                background-image: url('~@/assets/img/location.png');
                background-repeat: no-repeat;
                background-size: contain;
                background-position: 0 0;
                margin: auto;
            }
        }
        .right {
            height: 100%;
            width: .6rem;
            border-left: 1px solid #e8e8e8;
        }
        .tel {
            display: flex;
            margin-left: .17rem;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
            .icon-tel:before {
                display: block;
                content: ' ';
                height: 17px;
                width: 17px;
                background: url('~@/assets/img/tel.png') no-repeat;
                background-size: contain;
                background-position: center;
                margin: auto;
            }
        }
    }
    .ad {
        padding: 0.26rem 0.24rem 0.26rem 0.7rem;
        display: flex;
        position: relative;
        &::before {
            content: ' ';
            position: absolute;
            display: block;
            left: 26rpx;
            top: 50%;
            margin-top: -6px;
            height: 12px;
            width: 12px;
            background: url('~@/assets/img/ad.png') no-repeat;
            background-size: contain;
            background-position: center;
        }
        .tit {
            width: 130rpx;
            font-size: 26rpx;
            flex-shrink: 0;
        }
        .content{
            flex: 1;
        }
    }
}
</style>
