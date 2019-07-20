<template>
<section class="jfb-flexview">
    <div class="jfb-header">
        <lay-header></lay-header>
    </div>
    <scroll-view class="jfb-content" scroll-y @scroll="getScroll">
        <header class="header-warp">
        </header>
        <div class="container">
            <div class="nav-bar">
                <ul class="nav">
                    <li class="item">全部</li>
                    <li class="item">附近</li>
                    <li class="item">智能排序</li>
                </ul>
            </div>
            <div class="shop-list-warp" v-if="shopList && shopList.length">
                <shop-card :shopInfo='shop' v-for="(shop, index) of shopList" :key="index"></shop-card>
            </div>
        </div>
    </scroll-view>
</section>
</template>

<script>
import LayHeader from "@c/header/Header.vue";
import ShopCard from "@c/shop/ShopCard.vue";
import { apiBusinessSort, apiSearch } from "@/api/api";
export default {
    name: "shop",
    data() {
        return {
            scrollTop: 0,
            top_sort: 1,
            shopList: []
        };
    },
    components: {
        LayHeader,
        ShopCard
    },
    onLoad (options) {
        apiBusinessSort({
            adCode: '2809',
            top_sort: 1
        }).then(res => {
            console.log(res);
            
            // this.navList = this.normalFrom(res)
        })
        this.getSortShop()
    },
    watch: {
        scrollTop (newY) {
            if (this.bannerShow && this.minTranslateY && this.minTranslateY < newY) {
                this.bannerShow = false
            }
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
        getSortShop(sort_one) {
            let params = {
                city_id: 2809,
                lng: 108.94712,
                lat: 34.29318,
                top_sort: 2,
                page: 1
            }
            if (sort_one) {
                params.sort_one = sort_one
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
    .header-warp{
        margin-bottom: 10rpx;
    }
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
</style>

