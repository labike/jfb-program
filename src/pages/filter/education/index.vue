<!--
 * @Author: zhangHang
 * @Date: 2019-06-24 09:24:53
 * @Description: file content
 -->
<template>

<div  class="education-warp">
    <div class="education">
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

            <ul class="menu2" v-if="menu2.length">
                <li class="menu-item" v-for="(item, m2) of menu2" :key="item.id"
                    :id="'menu_2_' + m2"
                    @click.stop="jumpPages(item.target)"
                >
                    <div class="img-warp">
                        <ImageView :src="item.icon" width='100rpx'></ImageView>
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
    <category top_sort='6' :page='page'
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
    name: "education",
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
                    name: '外语培训',
                    icon: WAPHOST + 'static/tabs/edu_foreign.png',
                    target: '/pages/filter/category/main?top_sort=6&sort_one=173'
                }, {
                    id: 1,
                    name: '美术培训',
                    icon: WAPHOST + 'static/tabs/edu_art.png',
                    target: '/pages/filter/category/main?top_sort=6&sort_one=174'
                }, {
                    id: 2,
                    name: '音乐培训',
                    icon: WAPHOST + 'static/tabs/edu_music.png',
                    target: '/pages/filter/category/main?top_sort=6&sort_one=175'
                }, {
                    id: 3,
                    name: '职业培训',
                    icon: WAPHOST + 'static/tabs/edu_career.png',
                    target: '/pages/filter/category/main?top_sort=6&sort_one=176'
                }
            ],
            menu2: [
                {
                    id: 4,
                    name: '驾校',
                    icon: WAPHOST + 'static/tabs/edu_car.png',
                    target: '/pages/filter/category/main?top_sort=6&sort_one=177'
                }, {
                
                    id: 5,
                    name: '烘焙厨艺',
                    icon: WAPHOST + 'static/tabs/edu_chef.png',
                    target: '/pages/filter/category/main?top_sort=6&sort_one=178'
                }, {
                    id: 6,
                    name: '茶艺咖啡',
                    icon: WAPHOST + 'static/tabs/edu_tea.png',
                    target: '/pages/filter/category/main?top_sort=6&sort_one=179'
                }, {
                    id: 7,
                    name: '美妆学习',
                    icon: WAPHOST + 'static/tabs/edu_beauty.png',
                    target: '/pages/filter/category/main?top_sort=6&sort_one=180'
                }, {
                    id: 8,
                    name: '成人教育',
                    icon: WAPHOST + 'static/tabs/edu_adult.png',
                    target: '/pages/filter/category/main?top_sort=6&sort_one=182'
                }, {
                    id: 9,
                    name: '会计培训',
                    icon: WAPHOST + 'static/tabs/edu_account.png',
                    target: '/pages/filter/category/main?top_sort=6&sort_one=183'
                }, {
                    id: 10,
                    name: '书法培训',
                    icon: WAPHOST + 'static/tabs/edu_writing.png',
                    target: '/pages/filter/category/main?top_sort=6&sort_one=181'
                }, {
                    id: 11,
                    name: '更多',
                    icon: WAPHOST + 'static/tabs/edu_more.png',
                    target: '/pages/filter/category/main?top_sort=6'
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
        const industry = shopType.education //education
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
.education{
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
        background: #21dfa8;
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
        margin-top: 24rpx;
        border-radius: 10rpx;
        overflow: hidden;
    }
    .menu-warp{
        position: relative;
        z-index: 10;
        ul{
            display: flex;
            flex-wrap: wrap;
            li{
                width: 25%;
                margin-bottom: 30rpx;
            }
        }
        
        .img-warp{
            width: 130rpx;
            text-align: center;
            margin: auto;
        }
        .menu2{
            .img-warp{
                width: 100rpx;
            }
        }
        .text{
            font-size: 12px;
            color: #323232;
            text-align: center;
            margin-top: 16rpx;
        }
    }
}.carry-warp{
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

