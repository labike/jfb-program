<!--
 * @Author: zhangHang
 * @Date: 2019-05-24 09:46:03
 * @Description: file content
 -->
<template>
<div class="container">
    <div class="banner">
        <lay-swiper :list='banners' v-if="banners.length" sHeight='200rpx'></lay-swiper>
    </div>
    <div class="content">
        <ul class="menu">
            <li class="nav-item" v-for="item of menu" :key="item.id" 
                @click="jumpTypePages(item.sign)"
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
import { mapState } from 'vuex';
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
        apiNavList('index').then(mList => {
            console.log(mList);
            
            _this.menu = mList
        })
    },
    
    computed: {
        ...mapState({
            "city_id": state => state.user.city_id
        }),
    },
    methods: {
        jumpTypePages(type) {
            this.$router.push({
                path: `/pages/filter/${type}/main`
            }) 
        }
    }
    
};
</script>

<style lang="scss" scoped>
.container{
    background: #fff;
    padding: 24rpx 0;
    .banner{
        margin: 0 24rpx;
        border-radius: 10rpx;
        overflow: hidden;

    }
    .content{
        ul{
            display: flex;
            flex-wrap: wrap;
            li{
                width: 25%;
            }
        }
        .img-warp{
            margin: 35rpx auto 0;
            width: 130rpx;
            height: 130rpx;
        }
        .text{
            font-size: 12px;
            color: #323232;
            text-align: center;
        }
    }
}
</style>