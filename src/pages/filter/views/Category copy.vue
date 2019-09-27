<!--
 * @Author: zhangHang
 * @Date: 2019-07-20 09:53:30
 * @Description: file content
 -->
<template>
<section class="category-warp">
    <scroll-view class="category" scroll-y @scroll="getScroll">
        <div class="top-warp">
            <slot></slot>
        </div>

        <header class="bar-warp">
            <div class="nav-bar">
                <div class="nav" :data-index="0" @click.stop="showModel(0)">{{selectNavList[0]}}</div>
                <div class="nav" :data-index="1" @click.stop="showModel">{{selectNavList[1]}}</div>
                <div class="nav" :data-index="2" @click.stop="showModel">{{selectNavList[2]}}</div>
            </div>
        </header>

        <section class="container" v-if="shopList && shopList.length">
            <div class="shop-list-warp" >
                <shop-card :shopInfo='shop' v-for="(shop, s_id) of shopList" :key="s_id"></shop-card>
            </div>
        </section>

        <section class="empty" v-else>
            <div class="loading" v-if="listLoading"></div>
            <ImageView class="icon" src="/static/img/null_bg.png" mode="widthFix"></ImageView>
            <div class="text">暂无相关商铺！</div>
        </section>
    </scroll-view>

    <lay-model :show='modelStatus' position='top' :btnhide='true' width="100%" @close='closeModel'>
        <div class="bar-warp top">
            <ul class="nav-bar">
                <block  v-for="(snav, sinx) of selectNavList" :key="sinx">
                    <li class="nav"
                        :class='selectNav'
                        :data-index="sinx"
                        @tap="showModel(sinx)"
                    >{{snav}}</li>
                </block>
            </ul>
            <!-- <div class="list-warp" v-for="(nav, inx) of selectNavList" :key="inx">
                <div class="item"></div>
            </div> -->
        </div>
    </lay-model>
</section>
</template>

<script>
import LayHeader from "@c/header/Header.vue";
import LayModel from "@c/layouts/Model.vue";
import Menus from "./../views/MenuList.vue";
import ShopCard from "@c/shop/ShopCard.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { apiBusinessSort, apiSearch } from "@/api/api";
export default {
    name: "category",
    data() {
        return {
            selectNavList: ['全部', '附近', '智能排序'],
            selectNav: '',
            modelStatus: false,
            scrollTop: 0,
            top_sort: '',
            sort_one: '',
            sort_type: '',
            shopList: []
        };
    },
    components: {
        LayHeader,
        LayModel,
        ShopCard,
        ImageView
    },
    computed: {
        appData() {
            return wx.getStorageSync('appData');
        }
    },
    props: {
        top_sort: String
    },
    onLoad (options) {
        this.sort_one = options.sort_one || ''
        this.getSortShop()
        apiBusinessSort({
            adCode: this.appData.currentCity.code,
            top_sort: 1
        }).then(res => {
            console.log(res);
            // this.navList = this.normalFrom(res)
        })
    },
    methods: {
        getScroll(e) {
            this.scrollTop = e.target.scrollTop
        },
        showModel(e) {
            this.modelStatus = true
            // this.selectNav = e.mp.currentTarget.dataset.index
            console.log(e);
        },
        closeModel() {
            this.modelStatus = false
            this.selectNav = ''
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
                city_id: _this.appData.currentCity.code,
                lng: _this.appData.currentLocation.lng,
                lat: _this.appData.currentLocation.lat,
                top_sort: _this.top_sort,
                sort_one: _this.sort_one,
                sort_two: _this.sort_two ? _this.sort_two : '',
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
.category-warp,
.category,
.container{
    height: 100%;
}
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

