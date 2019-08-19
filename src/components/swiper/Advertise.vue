<template>
<div class="swiper-container" :class="className">
    <swiper v-if="list.length" class="swiper_box"
        :autoplay="true"
        :indicator-dots='true'
        indicator-color='rgba(0, 0, 0, .3)'
        indicator-active-color="#fff"
        :style="{height: sHeight}"
        :interval='6000'
        :duration='1000'
        :circular='true'
        @change="swiperchange"
    >
        <swiper-item class='swiper_item' v-for="(banner,index) of list" :key="index">
            <img @click='tapBanner(banner)' class='slide-image' mode="aspectFill" :src="banner.img_url" 
                :class="{active:index===swiperCurrent}" data-index='index'
            >
        </swiper-item>
    </swiper>
</div>
</template>

<script>
import { adFeature } from "@/config/base";
export default {
    name: "Advertise",
    data() {
        return {
            swiperCurrent: 0,
            bannerHerght: 0,
        }
    },
    props: {
        list: {
            type: Array
        },
        sHeight: {
            type: String,
            default: '100px'
        },
        className: {
            type: String,
            default: ''
        }
    },
    methods: {
        swiperchange(e) {
            this.swiperCurrent = e.mp.detail.current;
        }, 
        tapBanner(adObj) {
            let URL = ''
            switch (adObj.type) {
            case "shop":
                URL = '/pages/shop/index/main?shop_id=' + adObj.href    
                break;
            case "action":
                URL = adFeature[adObj.href]
                break;
            case "link":
                URL = "/pages/web/main?url=" + encodeURIComponent(adObj.href)
                break;
            default:
                break;
            }
            if (URL) {
                wx.navigateTo({
                    url: URL
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.swiper-container {
    position: relative;
    background-color: #FFF;
    .slide-image{
        width: 100%;
        height: 100%;
    }
}
.column{
    width: 750rpx;
    .swiper_box {
        width: 100%;
        height: 280rpx;
        overflow: visible;
    }
    .swiper_item {
        overflow: visible;
        border-radius: 50%;
    }
    .slide-image {
        width: 90%;
        display: inline-block;
        overflow: hidden;
        height: 280rpx;
        border-radius: 15rpx;
        background-color: #fff;
        box-shadow: 0 10rpx 15rpx rgba(0, 0, 0, 0.1);
        position: relative;
        transform: scale(0.75) translate(-30%, 0);
        transition: 0.5s;
        &.active{
            transform: scale(0.9) translate(0, 0);
        }
    }
}
</style>
