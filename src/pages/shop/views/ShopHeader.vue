<!--
 * @Author: zhangHang
 * @Date: 2019-05-22 09:23:41
 * @Description: file content
 -->
<template>
<div class="shop-intro" v-if="storeInfo">
    <div class="default">
        <div class="banner-warp">
            <lay-swiper :list='storeInfo.headerImgData.envir' v-if="storeInfo.headerImgData.envir.length" sHeight='400rpx'></lay-swiper>
        </div>
        <div class="intro-warp">
            <div class="name">{{ storeInfo.store_name }}</div>
            <div class="share" @click="tapShare">分享</div>
            <div class="intro">
                <div class="lt-img">
                    <ImageView :src="storeInfo.headerImgData.imgUrl" mode="scaleToFill" width='160rpx' height='160rpx'></ImageView>
                </div>
                <div class="rt-content">
                    <div class="come">
                        <ul class="avatar">
                            <li v-for="(item, avaid) in storeInfo.avatarList" :key="avaid">
                                <ImageView  picture='/static/img/avatar.png' :src="item.header_img"
                                    mode='aspectFill'  width='46rpx' height='46rpx'
                                ></ImageView>
                            </li>
                            <li class="more">...</li>
                        </ul>
                        <p class="hits"><span>{{storeInfo.browser}}</span>人已逛过</p>
                    </div>
                    <div class="info">
                        <p>{{storeInfo.distance}}</p>
                        <p v-if="storeInfo.average_fee-0">人均: <span>{{storeInfo.average_fee}}元</span></p>
                        <p>人气:{{storeInfo.browser}}</p>
                    </div>
                    <div class="notice-warp">
                        <div class="notice" v-if="storeInfo.Notice">{{storeInfo.Notice}}</div>
                        <div class="notice" v-else>一店充值，多店消费</div>
                    </div>
                </div>
                <div class="record">持“共享增值卡”消费买单可以抵折扣{{infoData.proData.is_paying_pro}}%消费金额</div>
            </div>
        </div>
        <div class="contact-warp">
            <p><span>营业时间 :</span>{{storeInfo.do_business_time}}</p>
            <p><span>地址 :</span>{{storeInfo.address}}</p>
            <ul class="btn-group">
                <li  @click="openTxMap">
                    <div class="icon location"></div>
                    <div class="text">导航</div>
                </li>
                <li  @click="getCallPhone(storeInfo.mobile)">
                    <div class="icon tel"></div>
                    <div class="text">电话</div>
                </li>
            </ul>
        </div>
        
    </div>
</div>
</template>

<script>
import MyMarquee from '@c/layouts/Marquee.vue';
import ImageView from '@c/layouts/ImageView.vue'
import LaySwiper from "@c/swiper/Advertise.vue";
import { getDistance, callPhone } from '@/utils/index';
import { apiShareStore } from "@/api/api";

export default {
    name: "ShopHeader",
    props: {
        infoData: Object
    },
    data() {
        return {
            storeInfo: null
        }
    },
    computed: {
        currentLocation () {            
            let appData = mpvue.getStorageSync('appData')
            let location = appData && appData.currentLocation ? appData.currentLocation : '';
            return location
        },
    },
    onLoad() {
        let that = this;
        that.storeInfo = that._formatStoreInfo(that.infoData.infoData)
    },
    components: {
        MyMarquee,
        ImageView,
        LaySwiper
    },
    methods: {
        _formatStoreInfo(storeInfo) {
            const that = this
            if (that.currentLocation && storeInfo) {
                let num = getDistance(that.currentLocation.lat, that.currentLocation.lng, storeInfo.lat, storeInfo.lng)
                if (num > 1000) {
                    storeInfo.distance = (num / 1000).toFixed(1) + 'km'
                } else {
                    storeInfo.distance = num + 'm'
                }
            }
            if (storeInfo.brower_user) {
                storeInfo.avatarList = Array.from({length: 9}).map((item, index) => {
                    let avatar = {}
                    avatar.header_img = storeInfo.brower_user[index] ? storeInfo.brower_user[index].header_img : '';
                    avatar.header_img === '0' && (avatar.header_img = '')
                    return avatar;
                });
            }
            if (storeInfo.do_business_time) {
                let index = storeInfo.do_business_time.indexOf('时间:');
                if (index >= 0) {
                    storeInfo.do_business_time = storeInfo.do_business_time.substring(index + 3)
                }
            }
            return storeInfo
        },
        handlePhotos() {            
            this.$router.push({
                path: `/pages/shop/photos/main?shop_id=${this.storeInfo.s_id}`
            })
            
        },
        tapShare() {
            let that = this;
            apiShareStore(that.storeInfo.s_id).then(result => {
                result.type = 'earn'
                that.$emit('share', result)
            })
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
                'name': that.storeInfo.store_name,
                'latitude': that.storeInfo.lat,
                'longitude': that.storeInfo.lng
            });
            this.$router.push({
                path: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
            })
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/common/mixins.scss";
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
        overflow: hidden;
    }
    .intro-warp{
        overflow: hidden;
        padding: 0 24rpx;
        position: relative;
        z-index: 0;
        margin-top: 24rpx;
        .name{
            color: #000;
            display: block;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 30rpx;
            margin-right: 150rpx;
            @include textOverflow;
        }
        .share{
            font-size: 12px;
            background: linear-gradient(to right,#f11b1b, #f25313);
            width: 110rpx;
            height: 44rpx;
            line-height: 44rpx;
            text-align: center;
            font-weight: 400;
            color: #fff;
            position: absolute;
            right: 40rpx;
            top: 6rpx;
            border-radius: 10rpx;
        }
        .intro{
            margin-right: 26rpx;
        }
        
        .record{
            background: #57bbaa ;
            font-weight: 700;
            height: 50rpx;
            line-height: 50rpx;
            color: #fff;
            overflow: hidden;
            border-radius: 12rpx;
            @include textOverflow;
            text-align: center;
            margin-top: 18rpx;

        }
    }
    .lt-img{
        width: 160rpx;
        height: 160rpx;
        overflow: hidden;
        border-radius: 10rpx;
        float: left;
        position: relative;
        img{
            width: 160rpx;
            height: 160rpx;
        }
    
    }
    .rt-content{
        margin-left: 184rpx;
        min-height: 160rpx;
        color: #818181;
        font-weight: 700;
        .come{
            text-align: right;
            line-height: 46rpx;
            .hits{
                color: #818181;
                span{
                    color: #cf0002;
                }
            }
        }
        .avatar{
            li{
                float: left;
                position: relative;
                margin-right: -18rpx;
                width: 46rpx;
                height: 46rpx;
                border-radius: 50%;
                overflow: hidden;
                background: #f2f2f2;
            }
            .more{
                line-height: 24rpx;
                color: #fff;
                font-weight: 700;
                text-align: center;
                font-size: 20px;
            }
        }
        .info{
            position: relative;
            display: flex;
            align-items: center;
            line-height: 1;
            font-size: 11px;
            line-height: 24rpx;
            margin-top: 20rpx;
            p:not(:last-child){
                border-right: 2rpx solid #818181;
                padding-right: 8rpx;
                margin-right: 8rpx;
            }
            span{
                color: #cf0002;
            }
        }
        .notice-warp{
            display: inline-block;
            max-width: 100%;
            margin-top: 20rpx;
            @include textOverflow;
            text-align: center;
            .notice{
                background: #f7f5f8;
                padding: 0 24rpx;
                font-size: 12px;
                color: #323232;
                line-height: 40rpx;
                margin-right: 10rpx;
                display: inline-block;
            }
        }
    }
    .contact-warp{
        padding: 0 24rpx;
        position: relative;
        z-index: 0;
        margin-top: 24rpx;
        padding-right: 200rpx;
        font-weight: 700;
        p{
            line-height: 40rpx;
            color: #323232;
            margin-top: 10rpx;
            @include textOverflow;
            span{
                color: #818181;
                margin-right: 10rpx;
            }
        }
        .btn-group{
            position: absolute;
            right: 40rpx;
            bottom: 0;
            width: 142rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &::before{
                content: '';
                position: absolute;
                height: 60%;
                top: 20%;
                left: 49%;
                width: 1px;
                background: #eee;
            }
            .icon{
                width: 50rpx;
                height: 50rpx;
                border-radius: 50%;
                background-color: #f7f9f8;
                background-size: auto 30rpx;
                background-position: center;
                background-repeat: no-repeat;
            }
            .text{
                margin-top: 10rpx;
                color: #818181;
            }
            .location{
                background-image: url('~@/assets/img/location2.png');
            }
            .tel{
                background-image: url('~@/assets/img/tel2.png');
            }
        }
    }
}
</style>
