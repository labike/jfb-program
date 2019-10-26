<!--
 * @Author: zhangHang
 * @Date: 2019-06-24 09:24:53
 * @Description: file content
 -->
<template>

<div  class="pastime-warp">
    <div class="pastime">
        <div class="bg"></div>
        <div class="menu-warp">
            <ul class="menu" v-if="menu.length">
                <li class="menu-item" v-for="(item, m1) of menu" :key="item.id"
                    :id="'menu_' + m1"
                    @click.stop="jumpPages(item.target)"
                >
                    <div class="img-warp" >                        
                        <ImageView :src="item.icon" width='130rpx'></ImageView>
                    </div>
                    <div class="text">{{item.name}}</div>
                </li>
            </ul>
        </div>

        <scroll-view class="carry-warp" scroll-x="true">
            <ul class="carry"  v-if="carry && carry.length">
                <li class="item"
                    v-for="nav in carry" :key="nav.gcid"
                    @click.stop="jumpListPages(nav)"
                >
                    <ImageView :src="nav.img" width='220rpx' height='165rpx'></ImageView>
                    <div class="name">商家<span>{{nav.gc_name}}</span></div>
                    <div class="desc" v-if="nav.gcNumber">{{nav.gcNumber}}家老板</div>
                </li>
            </ul>
        </scroll-view>

        <div class="advert" v-if="advertList.length" >
            <lay-swiper :list='advertList' sHeight='160rpx'></lay-swiper>
        </div>
    </div>
    <category :top_sort='3' :page='page'
        @length='setShopPageLength'
    ></category>
</div>

</template>

<script>
import Category from "./../views/Category.vue";
import LaySwiper from "@c/swiper/Advertise.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { apiGetAdvert, apiSalesType } from "@/api/api";
import { WAPHOST, shopType } from "@/config/base";
export default {
    name: "pastime",
    data() {
        return {
            page: 1,
            scrollTop: 0,
            scrollStatus: true,
            remainListsLength: 5,
            advertList: [],
            menu: [
                {
                    id: 106,
                    name: '丽人',
                    icon: WAPHOST + 'static/tabs/relaxation_belle.png',
                    target: '/pages/filter/category/main?top_sort=3&sort_one=106'
                }, {
                    id: 131,
                    name: 'DIV手工坊',
                    icon: WAPHOST + 'static/tabs/relaxation_hand.png',
                    target: '/pages/filter/category/main?top_sort=3&sort_one=131'
                }, {
                    id: 132,
                    name: '生活服务',
                    icon: WAPHOST + 'static/tabs/relaxation_cup.png',
                    target: '/pages/filter/category/main?top_sort=3&sort_one=132'
                }, {
                    id: 144,
                    name: '周边游乐',
                    icon: WAPHOST + 'static/tabs/relaxation_airplane.png',
                    target: '/pages/filter/category/main?top_sort=3&sort_one=144'
                }, {
                    id: 116,
                    name: '运动健身',
                    icon: WAPHOST + 'static/tabs/relaxation_sport.png',
                    target: '/pages/filter/category/main?top_sort=3&sort_one=116'
                }, {
                    id: 92,
                    name: '娱乐',
                    icon: WAPHOST + 'static/tabs/relaxation_hotel.png',
                    target: '/pages/filter/category/main?top_sort=3&sort_one=92'
                }, {
                    id: 126,
                    name: 'KTV',
                    icon: WAPHOST + 'static/tabs/relaxation_ktv.png',
                    target: '/pages/filter/category/main?top_sort=3&sort_one=126'
                }, {
                    id: 7,
                    name: '全部',
                    icon: WAPHOST + 'static/tabs/relaxation_all.png',
                    target: '/pages/filter/category/main?top_sort=3'
                }
            ],
            carry: []
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
        const industry = shopType.pastime
        apiGetAdvert({
            city_id: that.appData.currentCity.code,
            position: 1,
            industry: industry
        }).then(advers => {
            this.advertList = advers.advert
        })
        apiSalesType({
            lng: that.appData.currentLocation.lng,
            lat: that.appData.currentLocation.lat,
            industry_id: industry
        }).then(carry => {
            this.carry = carry
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
        },
        jumpListPages(advers) {
            this.$router.push({
                path: `/pages/shop/salelist/main?industry=${advers.industry_id}&gcid=${advers.gcid}`
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
.pastime{
    background: #fff;
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
        background: #ff8a35;
        height: 80rpx;
        &::after{
            content: '';
            position: absolute;
            z-index: 9;
            top: 50rpx;
            left: -20%;
            background: #fff;
            width: 140%;
            height: 200rpx;
            border-radius: 50% 50% 0 0;
        }
    }
    .advert{
        margin-top: 10rpx;
        overflow: hidden;
        border-radius: 10rpx;
    }
    .menu-warp{
        position: relative;
        z-index: 10;
        .menu{
            display: flex;
            flex-wrap: wrap;
            .menu-item{
                width: 25%;
                margin-bottom: 30rpx;
            }
        }
        .img-warp{
            width: 130rpx;
            text-align: center;
            margin: auto;
        }
        .text{
            font-size: 12px;
            color: #323232;
            text-align: center;
            margin-top: 16rpx;
        }
    }
}
.carry-warp{
    margin-top: 10rpx;
}
.carry {
    color: #323232;
    white-space: nowrap;
    display: flex;
    .item {
        margin-right: 8rpx;
        display: inline-block;
        text-align: center;
        position: relative;
        .name{
            font-size: 16px;
            font-weight: 700;
            position: absolute;
            left: 30rpx;
            top: 10rpx;
            span{
                color: #f00;
            }
        }
        .desc{
            position: absolute;
            left: 30rpx;
            top: 60rpx;
            font-size: 11px;
            font-weight: 400;
            color: #818181;
        }
    }
}
</style>

