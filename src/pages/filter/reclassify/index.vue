<!--
 * @Author: zhangHang
 * @Date: 2019-06-21 17:28:50
 * @Description: file content
 -->
<template>

<div  class="reclassify-warp" v-if="industry">
    <div class="reclassify">
        <div class="advert" v-if="advertList.length" >
            <lay-swiper :list='advertList' sHeight='240rpx'></lay-swiper>
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
    </div>
    <category  v-if="industry"
        :top_sort='industry'
        :page='page'
        @isScroll='setShopIsScroll'
    ></category>
</div>

</template>

<script>
import Category from "./../views/Category.vue";
import LaySwiper from "@c/swiper/Advertise.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { apiGetAdvert, apiSalesType } from "@/api/api";
import { WAPHOST } from "@/config/base";
import { mapGetters } from 'vuex';
export default {
    name: "reclassify",
    data() {
        return {
            page: 1,
            industry: 0,
            scrollTop: 0,
            scrollStatus: true,
            advertList: [],
            carry: []
        };
    },
    components: {
        Category,
        LaySwiper,
        ImageView
    },
    computed: {
        ...mapGetters([
            'storeIndustry'
        ]),
        appData() {
            return mpvue.getStorageSync('appData');
        }
    },
    onLoad (options) {
        this.initDate(options.industry)
        let storeIndustry = this.storeIndustry.filter(indysty => parseInt(indysty.id) === parseInt(options.industry))
        if (storeIndustry && storeIndustry[0]) {
            mpvue.setNavigationBarTitle({
                title: storeIndustry[0].name
            })
        }
    },
    onUnload() {        
        const self = this;
        self.page = 1
        self.industry = 0
        self.scrollTop = 0
        self.scrollStatus = true
        self.advertList = []
        self.carry = []
    },
    methods: {
        initDate(industry) {
            const that = this
            that.industry = industry
            that.page = 1
            that.scrollTop = 0
            that.scrollStatus = true
            that.advertList = []
            that.carry = []
            apiGetAdvert({
                city_id: that.appData.currentCity.code,
                position: 1,
                industry: that.industry
            }).then(advers => {
                this.advertList = advers.advert
            })
            apiSalesType({
                lng: that.appData.currentLocation.lng,
                lat: that.appData.currentLocation.lat,
                industry_id: that.industry
            }).then(carry => {
                console.log(carry);
                this.carry = carry
            })
        },
        setShopIsScroll(flag) {
            if (this.scrollStatus !== flag) {
                this.scrollStatus = flag
            }
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
        const self = this;
        let industry = self.industry
        self.initDate(industry)
        mpvue.stopPullDownRefresh()
    },
    onReachBottom () {
        if (this.scrollStatus) {
            this.page++
        } else {
            mpvue.showToast({
                title: '没有更多数据了！',
                icon: 'none',
                duration: 1000
            })
        }
    },
};
</script>

<style lang="scss" scoped>
.reclassify{
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
}
</style>

