<!--
 * @Author: zhangHang
 * @Date: 2019-07-20 09:53:30
 * @Description: file content
 -->
<template>
<section class="category-warp">
    <div class="category">
        <header class="bar-warp">
            <ul class="nav-bar">
                <block  v-for="(snav, sinx) of selectNavList" :key="sinx">
                    <li class="nav"
                        :data-index="sinx"
                        @tap="showModel"
                    >{{snav}}</li>
                </block>
            </ul>
        </header>

        <section class="container" v-if="shopList && shopList.length">
            <div class="shop-list-warp" >
                <shop-card :shopInfo='shop' v-for="(shop, s_id) of shopList" :key="s_id"></shop-card>
            </div>
        </section>

        <section class="empty" v-else>
            <div class="loading" v-if="listLoading"></div>
            <img src="/static/img/null_bg.png" mode="aspectFit" >
            <div class="text">暂无相关商铺！</div>
        </section>
    </div>

    <category-bar v-if="barParams.top_sort"
        :params='barParams'
        :show="modelStatus" 
        :select='selectNav'
        @init='initSelectNavList'
        @change='updataParam'
        @close='closeModel'
    ></category-bar>
</section>
</template>

<script>
import LayHeader from "@c/header/Header.vue";
import CategoryBar from "./CategoryBar.vue";
import Menus from "./../views/MenuList.vue";
import ShopCard from "@c/shop/ShopCard.vue";
import { apiBusinessSort, apiSearch } from "@/api/api";
export default {
    name: "category",
    data() {
        return {
            selectNavList: ['全部', '附近', '智能排序'],
            selectNav: '',
            modelStatus: false,
            scrollTop: 0,
            sort_one: '',
            shopList: [],
            barParams: {},
            params: ''
        };
    },
    components: {
        LayHeader,
        CategoryBar,
        ShopCard
    },
    computed: {
        appData() {
            return wx.getStorageSync('appData');
        }
    },
    props: {
        top_sort: String,
        list: Array,
        page: Number
    },
    onLoad (options) {
        // this.screenHeight = wx.getSystemInfoSync().windowHeight + 'px'
        this.sort_one = options.sort_one || ''
        if (this.sort_one) {
            this.barParams.sort_one = this.sort_one
            this.barParams.list = this.list
        }
        this.barParams.top_sort = this.top_sort
        this.getSortShop()
    },
    watch: {
        page(val) {

            this.pullDownData(val)
        }
    },
    methods: {
        getScroll(e) {
            this.scrollTop = e.target.scrollTop
        },
        showModel(e) {
            this.modelStatus = true
            this.selectNav = e.mp.currentTarget.dataset.index
        },
        closeModel() {
            this.modelStatus = false
            this.selectNav = ''
        },
        initSelectNavList(name) {
            this.selectNavList[0] = name
        },
        updataParam(item) {
            const _this = this
            switch (item.type) {
            case 0:
                _this.params.sort_one = item.id
                _this.selectNavList[0] = item.sort_name
                break;
            case 1:
                _this.params.lng = item.lng
                _this.params.lat = item.lat
                _this.selectNavList[1] = item.areaName
                break;
            case 2:
                _this.params.sort_type = item.id
                _this.selectNavList[2] = item.name
                break;
            }
            apiSearch(_this.params).then(res => {
                this.shopList = res.list
                this.$emit('length', res.list.length)
            })
        },
        getSortShop() {
            const _this = this
            _this.params = {
                city_id: _this.appData.currentCity.code,
                lng: _this.appData.currentLocation.lng,
                lat: _this.appData.currentLocation.lat,
                top_sort: _this.top_sort,
                sort_one: _this.sort_one,
                sort_two: _this.sort_two ? _this.sort_two : '',
                page: 1
            }
            apiSearch(_this.params).then(res => {
                this.shopList = res.list
                this.$emit('length', res.list.length)
            })
        },
        pullDownData (val) {
            const _this = this
            _this.params.page = val
            apiSearch(_this.params).then(res => {
                res.list.forEach(shop => {
                    this.shopList.push(shop)
                });
                
                this.$emit('length', res.list.length)
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.bar-warp {
    position: relative;
    .nav-bar {
        font-size: 26rpx;
        color: #000;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1rpx solid #ededed;
        .nav{
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
        .active{
            color: #2a8cfa;
            &::after {
                content: '';
                background-image: url(~@/assets/img/radio_right.png);
                transform: rotateZ(-90deg);
            }
        }
    }
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

