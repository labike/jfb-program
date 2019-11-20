<!--
 * @Author: zhangHang
 * @Date: 2019-06-24 14:39:02
 * @Description: file content
 -->
<template>
<section class="container">
    <header class="header-warp fix" >
        <div class="search">
            <lay-header></lay-header>
        </div>
        <menus v-if="categoryStatus" 
            :name="navName"
            :params='barParams.list'
            @change="updataParam"
        ></menus>
        <ul class="nav-bar" >
            <block  v-for="(snav, sinx) of selectNavList" :key="sinx">
                <li class="nav"
                    :data-index="sinx"
                    @tap="showModel"
                >{{snav}}</li>
            </block>
        </ul>
    </header>
    <section class="category-warp" v-if="categoryStatus" :style="{paddingTop:scrollTop + 'px'}">
        <div class="category">
            <section class="container"   :style="{height: scrollBox}" v-if="shopList && shopList.length">
                <div class="shop-list-warp" >
                    <shop-card :shopInfo='shop' v-for="(shop, s_id) of shopList" :key="s_id"></shop-card>
                </div>
            </section>

            <section class="empty" v-else>
                <div class="loading" v-if="listLoading"></div>
                <ImageView src="/static/img/null_bg.png" width='160rpx'></ImageView>
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
    
</section>
</template>

<script>
import LayHeader from "@c/header/Header.vue";
import ShopCard from "@c/shop/ShopCard.vue";
import ImageView from '@c/layouts/ImageView.vue'
import Menus from "./../views/MenuList.vue";
import CategoryBar from "./../views/CategoryBar.vue";
import { apiGetThreeSort, apiBusinessSort, apiSearch } from "@/api/api";
export default {
    name: "category",
    data() {
        return {
            page: 1,
            scrollStatus: true,
            remainListsLength: 5,
            categoryStatus: false,
            navName: '',
            top_sort: '',
            sort_one: '',
            sort_two: '',
            selectNavList: ['全部', '附近', '智能排序'],
            selectNav: '',
            modelStatus: false,
            scrollBox: 'auto',
            shopList: [],
            barParams: {},
            params: '',
            scrollTop: 80, 
        };
    },
    components: {
        LayHeader,
        Menus,
        CategoryBar,
        ShopCard,
        ImageView
    },
    computed: {
        appData() {
            return wx.getStorageSync('appData');
        }
    },
    onLoad (options) {
        let that = this;
        that.top_sort = options.top_sort
        that.sort_one = options.sort_one || ''
        that.sort_two = options.sort_two || ''
        apiGetThreeSort(that.sort_one).then(res => {
            that.barParams.list = res.map(item => {
                item.target = `/pages/filter/category/main?top_sort=${options.top_sort}&sort_one=${options.sort_one}&sort_two=${item.id}`
                return item
            })
            that.categoryStatus = true
        }).catch(err => {
            console.log(err);
            that.categoryStatus = true
        })
        
        if (that.sort_one) {
            that.barParams.sort_one = that.sort_one
        }
        that.barParams.top_sort = that.top_sort
        that.getSortShop().then(() => {
            setTimeout(() => {
                const query = wx.createSelectorQuery();             
                query.select(".header-warp").boundingClientRect();
                query.exec(function(rect) {  
                    that.scrollTop = rect[0].height
                });
            }, 500)
        })
    },
    onUnload() {        
        const self = this;
        self.scrollBox = 'auto'
        self.modelStatus = false
        self.selectNav = ''
        self.barParams = {}
        self.categoryStatus = false
        self.shopList = []
        self.remainListsLength = 5
        self.page = 1
        self.selectNavList = ['全部', '附近', '智能排序']
    },
    methods: {
        showModel(e) {
            this.modelStatus = true
            this.scrollBox = '0'
            
            this.selectNav = e.mp.currentTarget.dataset.index
        },
        closeModel() {
            this.modelStatus = false
            this.scrollBox = 'auto'
            this.selectNav = ''
        },
        initSelectNavList(name) {
            this.selectNavList[0] = name
        },
        updataParam(item) {
            const _this = this
            switch (item.type) {
            case 0:
                _this.params.sort_two = item.id
                _this.selectNavList[0] = item.sort_name || '全部'
                break;
            case 1:
                _this.params.lng = item.lng
                _this.params.lat = item.lat
                _this.selectNavList[1] = item.areaName || '附近'
                break;
            case 2:
                _this.params.sort_type = item.id
                _this.selectNavList[2] = item.name || '智能排序'
                break;
            }
            _this.shopList = []
            apiSearch(_this.params).then(res => {
                _this.shopList = res.list
                _this.remainListsLength = res.list.length
            })
        },
        getSortShop() {
            return new Promise((resolve,reject) => {
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
                    this.remainListsLength = res.list.length
                    resolve(res.list.length)
                })
            })
        },
        pullDownData (val) {
            const _this = this
            _this.params.page = val
            apiSearch(_this.params).then(res => {
                res.list.forEach(shop => {
                    this.shopList.push(shop)
                });
                this.remainListsLength = res.list.length
            })
        }
    },
    
    onPullDownRefresh () {
        this.page = 1
        this.remainListsLength = 10
        this.getSortShop()
        mpvue.stopPullDownRefresh()
    },
    onReachBottom () {
        if (this.remainListsLength === 10) {
            this.page++
            this.scrollStatus = true
            this.pullDownData(this.page)
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
.search{
    background: #2a8cfa;
    padding: 0 .24rem;
}
.header-warp{
    position: relative;
    .nav-bar {
        font-size: 26rpx;
        color: #000;
        // background-image: linear-gradient(to bottom , #fff, #f2f2f2);
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
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
    &.fix {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 999;
        animation: move 0.2s linear;
        box-shadow: 0 0 5px #efefef;
    }
} 
.container{
    overflow: hidden;
}
.empty{
    text-align: center;
    padding-top: 160rpx;
    .text{
        margin-top: 15rpx;
        font-size: 24rpx;
        color: #818181;
        text-shadow: 1px 1px 1px #e8e8e8;
    }
}


@keyframes move {
	from {
		opacity: 0.7;
	}
	to {
		opacity: 1;
	}
}
</style>

