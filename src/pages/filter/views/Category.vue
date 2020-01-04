<!--
 * @Author: zhangHang
 * @Date: 2019-07-20 09:53:30
 * @Description: file content
 -->
<template>
<section class="category-warp">
    <div class="category">
        <header class="bar-warp">
            <ul class="nav-bar" 
                :class="fixtop? 'fix':''">
                <block  v-for="(snav, sinx) of selectNavList" :key="sinx">
                    <li class="nav"
                        :data-index="sinx"
                        @tap="showModel"
                    >{{snav}}</li>
                </block>
            </ul>
        </header>

        <section class="container"   :style="{height: scrollBox}" v-if="shopList && shopList.length">
            <div class="shop-list-warp" >
                <shop-card :shopInfo='shop' v-for="(shop, s_id) of shopList" :key="s_id"></shop-card>
            </div>
        </section>

        <section class="empty" v-if="listEmpty">
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
</template>

<script>
import CategoryBar from "./CategoryBar.vue";
import ShopCard from "@c/shop/ShopCard.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { apiBusinessSort, apiSearch } from "@/api/api";
export default {
    name: "category",
    components: {
        CategoryBar,
        ShopCard,
        ImageView
    },
    computed: {
        appData() {
            return mpvue.getStorageSync('appData');
        }
    },
    props: {
        top_sort: String,
        list: Array,
        page: Number
    },
    data() {
        return {
            selectNavList: ['全部', '附近', '智能排序'],
            params: '',
            selectNav: '',
            listEmpty: false,
            modelStatus: false,
            shopList: [],
            barParams: {},
            scrollBox: 'auto',
            fixtop: false, //是否吸顶
            scrollTop: 0, //导航栏初始到屏幕顶部高度
            remainListsLength: 5
        };
    },
    onUnload() {        
        const self = this;
        self.fixtop = false
        self.listEmpty = false
        self.modelStatus = false
        self.selectNav = ''
        self.params = ''
        self.shopList = []
        self.scrollTop = 0
        self.barParams = {}
        self.scrollBox = 'auto'
        self.selectNavList = ['全部', '附近', '智能排序']
    },
    onLoad (options) {
        let that = this;
        that.barParams.top_sort = that.top_sort
        if (options.sort_one) {
            that.barParams.sort_one = options.sort_one
            that.barParams.list = that.list
        }
        if (options.sort_two) {
            that.barParams.sort_two = options.sort_two
        }
        console.log('begin');
        console.time('getSortShop');
        that.getSortShop().then(() => {
            console.timeEnd('getSortShop');
            setTimeout(() => {
                const query = mpvue.createSelectorQuery();             
                query.select(".nav-bar").boundingClientRect();
                query.exec(function(rect) {  
                    that.scrollTop = rect[0].top
                });
            }, 500)
        })
    },
    watch: {
        page(val) {
            (val === 1) && (this.shopList = [])
            val > 0 && this.pullDownData(val)
        }
    },
    
    onPageScroll: function(e) {
        const that = this;
        if (that.scrollTop === 0) {
            return
        }
        if (e.scrollTop >= that.scrollTop) {
            that.fixtop = true;
        } else {
            that.fixtop = false;
        }
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
            _this.params.page = 1
            _this.shopList = []
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
                _this.shopList = res.list
                let scrollStatus = !!(res.list.length >= _this.remainListsLength)
                if (!res.list || res.list.length === 0) {
                    _this.listEmpty = true
                }
                _this.$emit('isScroll', scrollStatus)
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
                    sort_one: _this.barParams.sort_one || '',
                    sort_two: _this.barParams.sort_two || '',
                    limit: _this.remainListsLength,
                    page: 1
                }
                apiSearch(_this.params).then(res => {
                    this.shopList = res.list
                    let scrollStatus = !!(res.list.length >= _this.remainListsLength)
                    if (!res.list || res.list.length === 0) {
                        this.listEmpty = true
                    }
                    this.$emit('isScroll', scrollStatus)
                    resolve(res.list.length || 0)
                })
            })
        },
        pullDownData (val) {
            const _this = this
            _this.params.page = val
            apiSearch(_this.params).then(res => {
                let scrollStatus = !!(res.list.length >= _this.remainListsLength)
                if (val === 1) {
                    this.listEmpty = res.list.length === 0
                }
                res.list.forEach(shop => {
                    this.shopList.push(shop)
                });
                this.$emit('isScroll', scrollStatus)
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.container{
    overflow: hidden;
}
.bar-warp {
    position: relative;
    height: 82rpx;
    .nav-bar {
        font-size: 26rpx;
        color: #000;
        background-image: linear-gradient(to bottom , #fff, #f2f2f2);
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
    .fix {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 999;
        animation: move 0.1s linear;
        box-shadow: 0 0 5px #333;
    }
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

