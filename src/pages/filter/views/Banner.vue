<template>
<div class="swiper-container">
    <swiper  v-if="list.length" class="swiper_box" :autoplay="true"  @change="swiperchange">
        <swiper-item class='swiper_item' v-for="(banner,index) of list" :key="index">
            <img @click='tapBanner(banner)' class='slide-image' mode="aspectFill" :src="banner.img_url" 
                :class="{active:index===swiperCurrent}" data-index='index'
            >
        </swiper-item>
    </swiper>
</div>
</template>

<script>
import { apiGetAdvert } from "@/api/api";
import { heightChange } from "@/utils/index";
export default {
    name: "Banner",
    data() {
        return {
            swiperCurrent: 0,
            bannerHerght: 0,
            list: [{
                id: "2",
                img_url: "http://clients.qmwjj.cc/images/2.png",
                jump: "2",
                type: "s",
            },{
                id: "3",
                img_url: "http://clients.qmwjj.cc/images/3.png",
                jump: "2",
                type: "s",
            },{
                id: "4",
                img_url: "http://clients.qmwjj.cc/images/4.png",
                jump: "2",
                type: "s",
            },{
                id: "5",
                img_url: "http://clients.qmwjj.cc/images/5.png",
                jump: "2",
                type: "s",
            }]
        };
    },
    onLoad(options) {
        const that = this
        apiGetAdvert().then(res => {
            const query = wx.createSelectorQuery()
            query.select('.swiper-container').boundingClientRect()
            query.selectViewport().scrollOffset()
            query.exec(function (res) {
                console.log('打印高度', res[0].height);
                that.bannerHerght = res[0].height
                that.$emit('heightInit', res[0].height)
            })
        })
    },
    methods: {
        tapBanner() {

        },
        swiperchange(e) {
            this.swiperCurrent = e.mp.detail.current;
        }, 
    }
};
</script>

<style lang="scss" scoped>
.swiper-container {
    width: 750rpx;
    position: relative;
    background-color: white;
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
