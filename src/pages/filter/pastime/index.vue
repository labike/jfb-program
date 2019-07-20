<template>

<div  class="pastime-warp">
    <div class="pastime">
        <div class="menu-warp">
            <ul class="menu" v-if="menu.length">
                <li class="menu-item" v-for="(item, m1) of menu" :key="item.id"
                    :id="'menu_' + m1"
                    @click.stop="jumpPages(item.target)"
                >
                    <div class="img-warp" >
                        <img :src="item.icon"  mode="aspectFill" >
                    </div>
                    <div class="text">{{item.name}}</div>
                </li>
            </ul>
        </div>
        <div class="advert" v-if="advertList.length" >
            <lay-swiper :list='advertList' sHeight='160rpx'></lay-swiper>
        </div>
    </div>
    <category top_sort='3' :page='page'
        @length='setShopPageLength'
    ></category>
</div>

</template>

<script>
import Category from "./../views/Category.vue";
import LaySwiper from "@c/swiper/Advertise.vue";
import { apiGetAdvert } from "@/api/api";
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
                    id: 0,
                    name: '按摩足疗',
                    icon: '/static/tabs/relaxation_foot.png',
                    target: '/pages/filter/category/main?top_sort=3&sort_one=702'
                }, {
                    id: 1,
                    name: '洗浴/汗蒸',
                    icon: '/static/tabs/relaxation_shower.png',
                    target: '/pages/filter/category/main?top_sort=3&sort_one=718'
                }, {
                    id: 2,
                    name: 'KTV',
                    icon: '/static/tabs/relaxation_ktv.png',
                    target: '/pages/filter/category/main?top_sort=3&sort_one=710'
                }, {
                    id: 3,
                    name: '夜店酒吧',
                    icon: '/static/tabs/relaxation_hotel.png',
                    target: '/pages/filter/category/main?top_sort=3&sort_one=701'
                }, {
                    id: 4,
                    name: '运动健身',
                    icon: '/static/tabs/relaxation_sport.png',
                    target: '/pages/filter/category/main?top_sort=3&sort_one=712'
                }, {
                    id: 5,
                    name: '游泳',
                    icon: '/static/tabs/relaxation_swmming.png',
                    target: '/pages/filter/category/main?top_sort=3&sort_one=715'
                }, {
                    id: 6,
                    name: '茶馆',
                    icon: '/static/tabs/relaxation_cup.png',
                    target: '/pages/filter/category/main?top_sort=3&sort_one=703'
                }, {
                    id: 7,
                    name: '全部',
                    icon: '/static/tabs/relaxation_all.png',
                    target: '/pages/filter/category/main?top_sort=3&sort_one=226'
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
            industry: 3
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
    margin-bottom: 14rpx;
    .advert{
        margin-bottom: 24rpx;
    }
    .menu-warp{
        .menu{
            display: flex;
            flex-wrap: wrap;
            .menu-item{
                width: 25%;
                margin-bottom: 24rpx;
            }
        }
        .img-warp{
            text-align: center;
            img{
                width: 100rpx;
                height: 100rpx;
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

