<!--
 * @Author: zhangHang
 * @Date: 2019-06-24 09:24:53
 * @Description: file content
 -->
<template>

<div  class="fransnana-warp">
    <div class="fransnana">
        <div class="bg"></div>
        <div class="menu-warp">
            <ul class="menu" v-if="menu.length">
                <li class="menu-item" v-for="(item, m1) of menu" :key="item.id"
                    :id="'menu_' + m1"
                    @click.stop="jumpPages(item.target)"
                >
                    <div class="img-warp" >                        
                        <ImageView :src="item.icon" width='90rpx'></ImageView>
                    </div>
                    <div class="text">{{item.name}}</div>
                </li>
            </ul>
        </div>
        <div class="advert" v-if="advertList.length" >
            <lay-swiper :list='advertList' sHeight='160rpx'></lay-swiper>
        </div>
    </div>
    <category top_sort='7' :page='page'
        @length='setShopPageLength'
    ></category>
</div>

</template>

<script>
import Category from "./../views/Category.vue";
import LaySwiper from "@c/swiper/Advertise.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { apiGetAdvert } from "@/api/api";
import { WAPHOST } from "@/config/base";
export default {
    name: "fransnana",
    data() {
        return {
            page: 1,
            scrollTop: 0,
            scrollStatus: true,
            remainListsLength: 5,
            advertList: [],
            menu: [
                {
                    id: 0,
                    name: '婴儿用品',
                    icon: WAPHOST + 'static/tabs/fransnana_cart.png',
                    target: '/pages/filter/category/main?top_sort=7&sort_one=184'
                }, {
                    id: 1,
                    name: '月子中心',
                    icon: WAPHOST + 'static/tabs/fransnana_care.png',
                    target: '/pages/filter/category/main?top_sort=7&sort_one=185'
                }, {
                    id: 2,
                    name: '早教中心',
                    icon: WAPHOST + 'static/tabs/fransnana_edu.png',
                    target: '/pages/filter/category/main?top_sort=7&sort_one=186'
                }, {
                    id: 3,
                    name: '儿童乐园',
                    icon: WAPHOST + 'static/tabs/fransnana_play.png',
                    target: '/pages/filter/category/main?top_sort=7&sort_one=187'
                }, {
                    id: 4,
                    name: '托班',
                    icon: WAPHOST + 'static/tabs/fransnana_baby.png',
                    target: '/pages/filter/category/main?top_sort=7&sort_one=188'
                }
            ],
        };
    },
    components: {
        Category,
        ImageView,
        LaySwiper
    },
    computed: {
        appData() {
            return wx.getStorageSync('appData');
        }
    },
    onLoad (options) {
        const that = this
        apiGetAdvert({
            city_id: this.appData.currentCity.code,
            position: 1,
            industry: 7
        }).then(advers => {
            this.advertList = advers.advert
        })
    },
    methods: {
        setShopPageLength(length) {
            console.log(length);
            
            this.remainListsLength = length
        },
        jumpPages(pageUrl) {
            console.log(pageUrl);
            this.$router.push({
                path: pageUrl
            })
        }
    },
    onPullDownRefresh () {
        this.page = 1
        this.remainListsLength = 5
        mpvue.stopPullDownRefresh()
    },
    onReachBottom () {
        console.log(12);
        
        if (this.remainListsLength === 5) {
            this.page++
            this.scrollStatus = true
        } else {
            mpvue.showToast({
                title: '没有更多数据了！',
                icon: 'none',
                duration: 1000
            })
            this.scrollStatus = false
        }
    },
};
</script>

<style lang="scss" scoped>
.fransnana{
    background: #f5f5f9;
    padding: 24rpx;
    overflow: hidden;
    position: relative;
    z-index: 0;
    .bg{
        position: absolute;
        z-index: 8;
        top: 0;
        left: 0;
        right: 0;
        background: #fff;
        height: 80rpx;
        &::after{
            content: '';
            position: absolute;
            z-index: 9;
            top: -90rpx;
            left: -20%;
            background: #ff4b62;
            width: 140%;
            height: 200rpx;
            border-radius: 0 0 50% 50%;
        }
    }
    .advert{
        margin-top: 30rpx;
        border-radius: 10rpx;
        overflow: hidden;
    }
    .menu-warp{
        position: relative;
        z-index: 10;
        background: #fff;
        padding: 50rpx 30rpx;
        border-radius: 30rpx;
        .menu{
            display: flex;
            justify-content: space-between;
        }
        .img-warp{
            width: 90rpx;
            text-align: center;
            margin: auto;
        }
        .text{
            font-size: 12px;
            color: #323232;
            text-align: center;
            margin-top: 20rpx;
        }
    }
}
</style>

