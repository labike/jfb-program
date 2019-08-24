<!--
 * @Author: zhangHang
 * @Date: 2019-06-21 17:28:50
 * @Description: file content
 -->
<template>

<div  class="repast-warp">
    <div class="repast">
        <div class="advert" v-if="advertList.length" >
            <lay-swiper :list='advertList' sHeight='160rpx'></lay-swiper>
        </div>
        <div class="menu-warp">
            <ul class="menu1" v-if="menu.length">
                <li class="menu-item" v-for="(item, m1) of menu" :key="item.id"
                    :id="'menu_1_' + m1"
                    @click.stop="jumpPages(item.target)"
                >
                    <div class="img-warp" >
                        <img :src="item.icon"  mode="aspectFill" >
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
                        <img :src="item.icon"  mode="aspectFill" >
                    </div>
                    <div class="text">{{item.name}}</div>
                </li>
            </ul>
        </div>
    </div>
    <category top_sort='1' :page='page'
        @length='setShopPageLength'
    ></category>
</div>

</template>

<script>
import Category from "./../views/Category.vue";
import LaySwiper from "@c/swiper/Advertise.vue";
import { apiGetAdvert } from "@/api/api";
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
                    id: '0',
                    name: '团购',
                    icon: '/static/tabs/food_icon_four.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=49'
                }, {
                    id: '1',
                    name: '人气店家',
                    icon: '/static/tabs/food_icon_six.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=42'
                }, {
                    id: '2',
                    name: '饮品',
                    icon: '/static/tabs/food_icon_ten.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=39'
                }, {
                    id: '3',
                    name: '水果生鲜',
                    icon: '/static/tabs/food_icon_nine.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=27'
                }, {
                    id: '4',
                    name: '高端商务',
                    icon: '/static/tabs/food_icon_seven.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=35'
                }
            ],
            menu2: [
                {
                    id: '5',
                    name: '火锅',
                    icon: '/static/tabs/food_icon_one.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=23'
                }, {
                    id: '6',
                    name: '自助餐',
                    icon: '/static/tabs/food_icon_two.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=53'
                }, {
                    id: '7',
                    name: '烧烤',
                    icon: '/static/tabs/food_icon_three.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=47'
                }, {
                    id: '8',
                    name: '西餐',
                    icon: '/static/tabs/food_icon_eight.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=41'
                }, {
                    id: '9',
                    name: '面包甜点',
                    icon: '/static/tabs/food_icon_five.png',
                    target: '/pages/filter/category/main?top_sort=1&sort_one=30'
                }
            ],
        };
    },
    components: {
        Category,
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
            industry: 1
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
            
            mpvue.navigateTo({
                url: pageUrl
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
    margin-bottom: 14rpx;
    .advert{
        margin-bottom: 24rpx;
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

