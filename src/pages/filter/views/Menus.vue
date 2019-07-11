<template>
<div class="container">
    <div class="banner">
        <lay-swiper :list='params.banners' v-if="params.banners.length" sHeight='160rpx'></lay-swiper>
    </div>
    <div class="content">
        <ul class="menu" v-if="params.menu.length">
            <li class="nav-item" v-for="item of params.menu" :key="item.id"
                @click="jumpPages(item.target)"
            >
                <div class="img-warp">
                    <img :src="item.icon" alt="">
                </div>
                <div class="text">{{item.name}}</div>
            </li>
        </ul>
        <ul class="menu2" v-if="params.menu2.length">
            <li class="nav-item" v-for="item of params.menu2" :key="item.id">
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