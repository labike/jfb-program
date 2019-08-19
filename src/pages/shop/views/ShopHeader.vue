<!--
 * @Author: zhangHang
 * @Date: 2019-05-22 09:23:41
 * @Description: file content
 -->
<template>
<div class="shop-title" :class="currentShopType">
    <div class="intro border-bottom">
        <div class="img-warp" @click="handlePhotos">
            <img :src="infoData.headerImgData.imgUrl" alt="">
            <p class="num" v-if="currentShopType == 'hotel'">
                <i class="icon-img"></i> {{ infoData.headerImgData.count }}</p>
            <p class="num" v-else>
                {{ infoData.headerImgData.count }}张</p>
        </div>
        <dl>
            <dt class="name">{{ infoData.store_name }}</dt>
            <dd :class="'rate rate' + infoData.score">
                <i class="icon rate"></i>
                <i class="icon rate"></i>
                <i class="icon rate"></i>
                <i class="icon rate"></i>
                <i class="icon rate"></i>
                <span class="rate-title">{{infoData.score}} 分</span>
            </dd>
            <dd class="tag" v-if="currentShopType != 'hotel'">
                <span>{{infoData.sort_name}}</span>
                <span>人均{{infoData.per_capita}}元</span>
            </dd>
            <dd class="time" v-if="currentShopType != 'hotel'">
                <p>{{infoData.do_business_time}}</p>
            </dd>
        </dl>
    </div>
    <div class="address border-bottom">
        <div class="left">
            <p class="tit" @click="openTxMap">{{infoData.address}}</p>
            <!-- <p class="near" v-if="currentShopType == 'hotel'">{{infoData.distance}}</p>
            <p class="near" v-else>距您直线距离{{infoData.distance}}</p> -->
        </div>
        <div class="right">
            <div class="tel"  @click="getCallPhone(infoData.mobile)">
                <i class="icon-tel"></i>
            </div>
        </div>
    </div>
    <div class="ad" v-if="currentShopAD">
        <my-marquee :lists="currentShopAD"></my-marquee>
        <!-- <div class="">{{infoData.Notice}}</div> -->
    </div>
</div>
</template>

<script>
import { shopType } from '@/config/base';
import MyMarquee from '@c/layouts/Marquee.vue';
import { callPhone } from '@/utils/index';

export default {
    name: "ShopHeader",
    props: {
        infoData: Object
    },
    computed: {
        currentShopAD: function () {
            let that = this;
            let shopAD = that.infoData.Notice;
            if (that.infoData.Notice) {
                let lists = [];
                lists.push(that.infoData.Notice);
                return lists;
            }
            return "";
        },
        currentShopType: function() {
            let that = this;
            let stclass = '';
            Object.keys(shopType).forEach(function(key) {
                if (shopType[key] === that.infoData.store_type) {
                    stclass = key;
                }
            });
            return stclass;
        }
    },
    components: {
        MyMarquee
    },
    methods: {
        handlePhotos() {
            mpvue.navigateTo({
                url: `/pages/shop/photos/main?shop_id=${this.infoData.s_id}`
            })
        },
        getCallPhone(phone) {
            callPhone(phone)
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/components/shop-header.scss";
</style>
