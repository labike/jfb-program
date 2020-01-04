<!--
 * @Author: zhangHang
 * @Date: 2019-05-24 09:46:03
 * @Description: file content
 -->
<template>
<div class="container">
    <div class="bg"></div>
    <div class="banner">
        <lay-swiper :list='banners' v-if="banners.length" sHeight='260rpx'></lay-swiper>
    </div>
    <div class="content">
        <ul class="menu">
            <li class="nav-item" v-for="item of menu" :key="item.id" 
                @click="jumpTypePages(item.id)"
            >
                <div class="img-warp">
                    <ImageView :src="item.img"></ImageView>
                </div>
                <div class="text">{{item.name}}</div>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import LaySwiper from "@c/swiper/Advertise.vue";
import { mapState, mapActions } from 'vuex';
import { apiGetAdvert, apiNavList } from "@/api/api";
import { WAPHOST } from "@/config/base";
import ImageView from '@c/layouts/ImageView.vue'
export default {
    name: "Menus",
    components: {
        ImageView,
        LaySwiper,
    },
    data() {
        return {
            banners: [],
            menu: []
        }
    },
    mounted () {
        const _this = this
        apiGetAdvert({
            city_id: _this.city_id,
            position: 1,
            industry: 0
        }).then(advers => {
            _this.banners = advers.advert
        })
        _this.queryIndustry(true).then(mList => {
            _this.menu = mList
        })
    },
    
    computed: {
        ...mapState({
            "city_id": state => state.user.city_id
        }),
    },
    methods: {
        ...mapActions(['queryIndustry']),
        jumpTypePages(id) {
            if (id === '9') {
                this.$router.push({
                    path: `/pages/web/main?url=${encodeURIComponent(WAPHOST + 'teamwork/club')}`
                })  
            } else if (id === '10') {
                this.$router.push({
                    path: `/pages/filter/all/main`
                }) 
            } else {
                this.$router.push({
                    path: `/pages/filter/reclassify/main?industry=${id}`
                })
            }
             
        }
    }
    
};
</script>

<style lang="scss" scoped>
.container{
    background: #fff;
    position: relative;
    z-index: 0;
    .bg{
        position: absolute;
        z-index: 8;
        top: 0;
        left: 0;
        right: 0;
        background: #2a8cfa;
        height: 130rpx;
        &::after{
            content: '';
            position: absolute;
            z-index: 9;
            top: 95rpx;
            left: -20%;
            background: #fff;
            width: 140%;
            height: 200rpx;
            border-radius: 50% 50% 0 0;
        }
    }
    .banner{
        margin: 0 24rpx;
        border-radius: 10rpx;
        overflow: hidden;
        position: relative;
        z-index: 10;
    }
    .content{
        position: relative;
        z-index: 11;
        ul{
            display: flex;
            flex-wrap: wrap;
            li{
                width: 20%;
            }
        }
        .img-warp{
            margin: 35rpx auto 10rpx;
            width: 100rpx;
            height: 100rpx;
        }
        .text{
            font-size: 12px;
            color: #323232;
            text-align: center;
        }
    }
}
</style>