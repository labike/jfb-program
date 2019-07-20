<template>

<div  class="icar-warp">
    <div class="icar">
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
    <category top_sort='4' :page='page'
        @length='setShopPageLength'
    ></category>
</div>

</template>

<script>
import Category from "./../views/Category.vue";
import LaySwiper from "@c/swiper/Advertise.vue";
import { apiGetAdvert } from "@/api/api";
export default {
    name: "icar",
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
                    name: '美容洗车',
                    icon: '/static/tabs/car_wash.png',
                    target: '/pages/filter/category/main?top_sort=4&sort_one=217'
                }, {
                    id: 1,
                    name: '维修保养',
                    icon: '/static/tabs/car_maintenance.png',
                    target: '/pages/filter/category/main?top_sort=4&sort_one=219'
                }, {
                    id: 2,
                    name: '租车',
                    icon: '/static/tabs/car_rental.png',
                    target: '/pages/filter/category/main?top_sort=4&sort_one=220'
                }, {
                    id: 3,
                    name: '4S店',
                    icon: '/static/tabs/car_4s.png',
                    target: '/pages/filter/category/main?top_sort=4&sort_one=222'
                }, {
                    id: 4,
                    name: '加油充电',
                    icon: '/static/tabs/car_refuel.png',
                    target: '/pages/filter/category/main?top_sort=4&sort_one=221'
                }, {
                    id: 5,
                    name: '摩托车',
                    icon: '/static/tabs/car_motorbike.png',
                    target: '/pages/filter/category/main?top_sort=4&sort_one=216'
                }, {
                    id: 6,
                    name: '改装调优',
                    icon: '/static/tabs/car_refit.png',
                    target: '/pages/filter/category/main?top_sort=4&sort_one=225'
                }, {
                    id: 7,
                    name: '全部',
                    icon: '/static/tabs/car_more.png',
                    target: '/pages/filter/category/main?top_sort=4&sort_one=226'
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
            industry: 4
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
.icar{
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

