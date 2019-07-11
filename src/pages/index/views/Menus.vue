<template>
<div class="container">
    <div class="banner">
        <lay-swiper :list='params' v-if="params.length" sHeight='200rpx'></lay-swiper>
    </div>
    <div class="content">
        <ul class="menu">
            <li class="nav-item" v-for="item of menu" :key="item.id" 
                @click="jumpPages(item.tager)"
            >
                <div class="img-warp">
                    <img :src="item.icon" alt="">
                </div>
                <div class="text">{{item.name}}</div>
            </li>
        </ul>
        <ul class="menu2">
            <li class="nav-item" v-for="item of menu2" :key="item.id">
                <div class="img-warp">
                    <img :src="item.icon" alt="">
                </div>
                <div class="text">{{item.name}}</div>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import LaySwiper from "@c/swiper/Swiper.vue";
export default {
    name: "Menus",
    data() {
        return {
            menu: [{
                id: 0,
                name: '美食',
                icon: '/static/tabs/icon_grid_cate.png',
                tager: '/pages/filter/repast/main'
            }, {
                id: 1,
                name: '酒店',
                icon: '/static/tabs/icon_grid_hotel.png',
                tager: '/pages/filter/hotel/main'
            }, {
                id: 2,
                name: '休闲娱乐',
                icon: '/static/tabs/icon_grid_yule.png',
                tager: '/pages/filter/pastime/main'
            }, {
                id: 3,
                name: '爱车',
                icon: '/static/tabs/icon_grid_car.png',
                tager: '/pages/filter/icar/main'
            }, {
                id: 4,
                name: '更多',
                icon: '/static/tabs/icon_grid_more.png',
                tager: '/pages/filter/all/main'
            }],
            menu2: [{
                id: 5,
                name: '火锅',
                icon: '/static/tabs/icon_home_big_classify_huog.png',
                tager: '/pages/filter/repast/main?'
            }, {
                id: 6,
                name: 'KTV',
                icon: '/static/tabs/icon_home_big_classify_ktv.png'
            }, {
                id: 7,
                name: '洗车',
                icon: '/static/tabs/icon_home_big_classify_xic.png'
            }, {
                id: 8,
                name: '运动健身',
                icon: '/static/tabs/icon_home_big_classify_sport.png'
            }, {
                id: 9,
                name: '足疗按摩',
                icon: '/static/tabs/icon_home_big_classify_zul.png'
            }, ]
        }
    },
    props: {
        params: Object
    },
    components: {
        LaySwiper,
    },
    methods: {
        jumpPages(pageUrl) {
            mpvue.navigateTo({
                url: pageUrl
            }) 
        }
    }
    
};
</script>

<style lang="scss" scoped>
.container{
    background: #fff;
    padding: 24rpx;
    margin-bottom: 24rpx;
    .banner{
        margin-bottom: 24rpx;
    }
    .content{
        ul{
            display: flex;
            li{
                flex: 1;
            }
        }
        .img-warp{
            text-align: center;
            img{
                width: 100rpx;
                height: 100rpx;
            }
        }
        .menu2{
            .img-warp{
                padding: 20rpx 0 10rpx;
                img{
                    width: 40rpx;
                    height: 40rpx;
                }
            }
        }
        .text{
            font-size: 10pt;
            color: #323232;
            text-align: center;
        }
    }
}
</style>