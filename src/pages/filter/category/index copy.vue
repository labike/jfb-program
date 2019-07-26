<template>
<section class="jfb-flexview">
    <div class="jfb-header">
        <lay-header></lay-header>
    </div>
    <header class="header-warp">
        <menus v-if="navList.length" :params='navList' ></menus>
        <div class="nav-bar">
            <ul class="nav">
                <li class="item">全部</li>
                <li class="item">附近</li>
                <li class="item">智能排序</li>
            </ul>
        </div>
    </header>
    <scroll-view class="jfb-content" scroll-y @scroll="getScroll">
        <div class="container" v-if="shopList && shopList.length">
            <div class="shop-list-warp" >
                <shop-card :shopInfo='shop' v-for="(shop, index) of shopList" :key="index"></shop-card>
            </div>
        </div>
        <div class="empty" v-else>
            <div class="loading" v-if="listLoading"></div>
            <img src="/static/img/null_bg.png" mode="aspectFit" >
            <div class="text">暂无相关商铺！</div>
        </div>
    </scroll-view>
</section>
</template>

<script>
import LayHeader from "@c/header/Header.vue";
import Menus from "./../views/MenuList.vue";
import ShopCard from "@c/shop/ShopCard.vue";
import { apiGetThreeSort, apiSearch } from "@/api/api";
export default {
    name: "category",
    data() {
        return {
            navList: [],
            scrollTop: 0,
            top_sort: '',
            sort_one: '',
            sort_two: '',
            sort_type: '',
            shopList: []
        };
    },
    components: {
        LayHeader,
        Menus,
        ShopCard
    },
    onLoad (options) {
        this.top_sort = options.top_sort
        this.sort_one = options.sort_one || ''
        this.sort_two = options.sort_two || ''
        apiGetThreeSort(this.sort_one).then(res => {
            this.navList = res.map(item => {
                item.target = `/pages/filter/category/main?top_sort=${options.top_sort}&sort_one=${options.sort_one}&sort_two=${item.id}`
                return item
            })
            this.getSortShop()
        }).catch(() => {
            this.navList = []
            this.getSortShop()
        })
    },
    watch: {
        scrollTop (newY) {
            if (this.bannerShow && this.minTranslateY && this.minTranslateY < newY) {
                this.bannerShow = false
            }
        }
    },
    computed: {
        appData() {
            return wx.getStorageSync('appData');
        }
    },
    methods: {
        getScroll(e) {
            this.scrollTop = e.target.scrollTop
        },
        heightInit(height) {
            this.minTranslateY = height
        },
        normalFrom(list) {
            let newList = []
            list.forEach(element => {
                const type = {
                    id: element.id,
                    params: {
                        page: 1,
                        sort_one: 0
                    },
                    name: element.sort_name,
                    sortList: element.childData,
                    shopList: null
                }
                newList.push(type)
            });
            return newList
        },
        getSortShop() {
            const _this = this
            let params = {
                city_id: _this.appData.currentLocation.code,
                lng: _this.appData.currentLocation.lng,
                lat: _this.appData.currentLocation.lat,
                top_sort: _this.top_sort,
                sort_one: _this.sort_one,
                sort_two: _this.sort_two,
                page: 1
            }
            apiSearch(params).then(res => {
                this.shopList = res.list
            })
        },
    }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/components/layout.scss";
.jfb-header{
    background: $base-color;
    padding: 0 .24rem;
}
.jfb-content{
    height: 100%;
    display: flex;
    flex-direction: column;
}

.nav-bar {
    flex-shrink: 0;
    position: relative;
    background-color: #fff;
    font-size: 26rpx;
    color: #000;
    border-bottom: 1rpx solid #ededed;
    .nav {
        display: flex;
        align-items: center;
        justify-content: center;
        .item{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding:  24rpx;
            &::after {
                content: '';
                display: block;
                width: 25rpx;
                height: 25rpx;
                margin-left: 10rpx;
                background-image: url(~@/assets/img/radio_right.png);
                transform: rotateZ(90deg);
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
            }
        }
    }
}
.container{
    height: 100%;
    flex: 1;
}  

.empty{
    text-align: center;
    img{
        width: 300rpx;
        height: 300rpx;
        margin-top: 100rpx;
    }
    .text{
        margin-top: 15rpx;
        font-size: 24rpx;
        color: #818181;
        text-shadow: 1px 1px 1px #e8e8e8;
    }
}  
</style>

