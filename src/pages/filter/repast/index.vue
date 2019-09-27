<!--
 * @Author: zhangHang
 * @Date: 2019-06-21 17:28:50
 * @Description: file content
 -->
<template>

<div  class="repast-warp">
    <div class="repast">
        <div class="advert" v-if="advertList.length" >
            <lay-swiper :list='advertList' sHeight='240rpx'></lay-swiper>
        </div>
        <div class="menu-warp">
            <ul class="menu1" v-if="menu.length">
                <li class="menu-item" v-for="(item, m1) of menu" :key="item.id"
                    :id="'menu_1_' + m1"
                    @click.stop="jumpPages(item.target)"
                >
                    <div class="img-warp" >
                        <ImageView :src="item.icon" width='100rpx' height='100rpx'></ImageView>
                    </div>
                    <div class="text">{{item.name}}</div>
                </li>
            </ul>
            <ul class="menu2" v-if="menu2.length">
                <li class="menu-item" v-for="(item, m2) of menu2" :key="item.id"
                    :id="'menu_2_' + m2"
                    @click.stop="jumpPages(item.target)"
                >
                    <div class="img-warp">
                        <ImageView :src="item.icon" width='44rpx' height='44rpx'></ImageView>
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
                </li>
            </ul>
        </scroll-view>
    </div>
    <category top_sort='1' :page='page'
        @length='setShopPageLength'
    ></category>
</div>

</template>

<script>
import Category from "./../views/Category.vue";
import LaySwiper from "@c/swiper/Advertise.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { apiGetAdvert,apiSalesType } from "@/api/api";
import { WAPHOST, shopType } from "@/config/base";
export default {
    name: "repast",
    data() {
        return {
            page: 1,
            scrollTop: 0,
            scrollStatus: true,
            remainListsLength: 5,
            advertList: [],
            menu: [
                {
                    id: '49',
                    name: '团购',
                    icon: WAPHOST + 'static/tabs/food_icon_four.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=49'
                }, {
                    id: '42',
                    name: '人气店家',
                    icon: WAPHOST + 'static/tabs/food_icon_six.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=42'
                }, {
                    id: '39',
                    name: '饮品',
                    icon: WAPHOST + 'static/tabs/food_icon_ten.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=39'
                }, {
                    id: '27',
                    name: '水果生鲜',
                    icon: WAPHOST + 'static/tabs/food_icon_nine.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=27'
                }, {
                    id: '23',
                    name: '高端商务',
                    icon: WAPHOST + 'static/tabs/food_icon_seven.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=23'
                }
            ],
            menu2: [
                {
                    id: '30',
                    name: '火锅',
                    icon: WAPHOST + 'static/tabs/food_icon_one.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=30'
                }, {
                    id: '8',
                    name: '自助餐',
                    icon: WAPHOST + 'static/tabs/food_icon_two.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=8'
                }, {
                    id: '56',
                    name: '烧烤',
                    icon: WAPHOST + 'static/tabs/food_icon_three.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=56'
                }, {
                    id: '20',
                    name: '西餐',
                    icon: WAPHOST + 'static/tabs/food_icon_eight.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=20'
                }, {
                    id: '19',
                    name: '面包甜点',
                    icon: WAPHOST + 'static/tabs/food_icon_five.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=19'
                }
            ],
            carry: []
        };
    },
    components: {
        Category,
        LaySwiper,
        ImageView
    },
    computed: {
        appData() {
            return wx.getStorageSync('appData');
        }
    },
    onLoad (options) {
        const that = this
        const repast = shopType.repast
        apiGetAdvert({
            city_id: this.appData.currentCity.code,
            position: 1,
            industry: repast
        }).then(advers => {
            this.advertList = advers.advert
        })
        apiSalesType(repast).then(carry => {
            console.log(carry);
            this.carry = carry
        })
    },
    methods: {
        setShopPageLength(length) {
            this.remainListsLength = length
        },
        jumpPages(pageUrl) {
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
        this.remainListsLength = 20
        mpvue.stopPullDownRefresh()
    },
    onReachBottom () {
        if (this.remainListsLength >= 20) {
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
.repast{
    background: #fff;
    padding: 24rpx;
    overflow: hidden;
    .advert{
        margin-bottom: 24rpx;
        overflow: hidden;
        border-radius: 10rpx;
    }
    .menu-warp{
        ul{
            display: flex;
            li{
                flex: 1;
            }
        }
        .img-warp{
            text-align: center;
            width: 100rpx;
            margin: auto;
        }
        .text{
            margin-top: 10rpx;
            font-size: 12px;
            color: #323232;
            text-align: center;
        }
        .menu2{
            margin-top: 10rpx;
            .img-warp{
                margin: 22rpx auto 0;
                width: 44rpx;
            }
            .text{
                font-size: 12px;
            }
        }
    }

    .carry-warp{
        margin-top: 36rpx;
    }
    .carry {
        color: #323232;
        white-space: nowrap;
        display: flex;
        .item {
            margin-right: 8rpx;
            display: inline-block;
            text-align: center;
            .name{
                font-size: 16px;
                font-weight: 700;
            }
            .desc{
                margin-top: 10rpx;
                padding: 0 24rpx;
                font-size: 11px;
                font-weight: 400;
                color: #818181;
            }
        }
    }
}
</style>

