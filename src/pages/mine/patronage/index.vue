<!--
 * @Author: zhangHang
 * @Date: 2019-06-24 12:04:48
 * @Description: file content
 -->
<template>
<div class="container">
    <div class="shop-nav">
        <ul class="nav-bar">
            <li v-for="(nav,index) of tabs" :key="index"
                :data-current="index" class="nav"
                :class="{active:activeTab===index}"
                @click.stop="activeTab=index"
            >
                {{nav.name}}
            </li>
        </ul>
        <div class="under-line" :class="{withAnimate:!stv.tStart}"
            :style="'width:'+stv.lineWidth+'px; left: '+stv.offset+'px'"
        ></div>
    </div>

    <div class="scroll-view">
        <swiper class="shopListSwiper" style="width: 100%; height: 100%; overflow: visible;"
            :current='activeTab'
            @change="swiperchange($event)"
        >
            <div v-for="(item,index) of tabs" :key="index" >
                <swiper-item style="overflow: visible;border-radius: 50%;" class="one-scene">
                    <scroll-view style="height:100%" scroll-y v-if="item.shopList"
                        @scrolltolower="updataShopList"
                    > 
                        <div v-if="item.shopList.length" class="shop-list">
                             <shop-card :shopInfo='shop' @share='shareShop'
                                v-for="(shop, sindex) of item.shopList" :key="sindex"
                             ></shop-card>
                        </div>
                        <div v-else class="no-shop">
                            <img class="icon" src="/static/img/empty.png" mode="widthFix">
                            <div class="text">您还没有相关数据~</div>
                        </div>
                    </scroll-view>
                </swiper-item>
            </div>
        </swiper>
    </div>
    <app-share v-if="shareShopStatus" :cardInfo='cardInfo'></app-share>
</div>
</template>

<script>
import Share from "@c/share/Share.vue";
import ShopCard from "./../views/ShopCard.vue";
import { visitedShop, collectsShop, browsersShop } from "@/api/api";
export default {
    data() {
        return {
            tabs: [{
                type: 'all',
                name: "我去过的",
                shopList: null
            }, {
                type: 'collects',
                name: "我的收藏",
                shopList: null
            }, {
                type: 'browsers',
                name: "最近浏览",
                shopList: null
            }],
            stv: {
                windowWidth: 0,
                lineWidth: 0,
                offset: 0,
                tStart: false
            },
            activeTab: 0,
            loadingStatus: false,
            shareShopStatus: false,
            cardInfo: {
                title: '减付宝', //姓名
                imageUrl: "", 
                qrCode: "", 
                address: "程序员鼓励师", //职位
                mobile: "13888888888", //手机
                company: "减付宝", //公司
            },
        }
    },
    onLoad (options) {
        this.activeTab = Number(options.tab) || 0
        this.getVisitedShop(this.activeTab)
        var res = mpvue.getSystemInfoSync()
        this.stv.lineWidth = res.windowWidth / this.tabs.length;
        this.stv.windowWidth = res.windowWidth;
        this.stv.offset = this.stv.lineWidth * this.activeTab
    },
    
    onUnload() {        
        const self = this;
        self.shareShopStatus = false
    },
    components: {
        Share,
        ShopCard
    },
    computed: {},
    methods: {
        swiperchange(e) {
            if (e.type !== 'change') {
                return
            }
            let offset = 0;
            let oIndex = e.mp.detail.current;
            this.stv.offset = this.stv.lineWidth * oIndex
            this.activeTab = oIndex;
            this.getVisitedShop(oIndex)
        },
        getVisitedShop(index) {
            const _current = this.tabs[index]
            _current.page = 1
            if (index === 0) {
                visitedShop({
                    limit: 15,
                    type: _current.type,
                    page: _current.page,
                }).then(res => {
                    _current.shopList = res.list 
                    _current.nextPage = res.list.length >= 15
                }).catch(err => {
                    console.log(err);
                
                })
            } else if (index === 1) {
                collectsShop({
                    limit: 15,
                    page: _current.page,
                }).then(res => {
                    _current.shopList = res.list 
                    _current.nextPage = res.list.length >= 15
                }).catch(err => {
                    console.log(err);
                
                })
            } else if (index === 2) {
                browsersShop({
                    limit: 15,
                    page: _current.page,
                }).then(res => {
                    _current.shopList = res.list 
                    _current.nextPage = res.list.length >= 15
                }).catch(err => {
                    console.log(err);
                })
            }
            
        },
        updataShopList() {
            const _current = this.tabs[this.activeTab]
            if (!_current.nextPage) {
                mpvue.showToast({
                    title: '没有更多数据了！',
                    icon: 'none',
                    duration: 1000
                })
                return
            }
            _current.page = _current.page + 1
            if (this.activeTab === 0) {
                visitedShop({
                    limit: 15,
                    type: _current.type,
                    page: _current.page,
                }).then(res => {
                    _current.nextPage = res.list.length >= 15
                    const shopList = res.list
                    shopList.forEach(element => {
                        if (element.id) {
                            _current.shopList.push(element)
                        }
                    });
                }).catch(err => {
                    console.log(err);
                
                })
            } else if (this.activeTab === 1) {
                collectsShop({
                    limit: 15,
                    page: _current.page,
                }).then(res => { 
                    _current.nextPage = res.list.length >= 15
                    const shopList = res.list
                    shopList.forEach(element => {
                        if (element.id) {
                            _current.shopList.push(element)
                        }
                    });
                }).catch(err => {
                    console.log(err);
                
                })
            } else if (this.activeTab === 2) {
                browsersShop({
                    limit: 15,
                    page: _current.page,
                }).then(res => { 
                    _current.nextPage = res.list.length >= 15
                    const shopList = res.list
                    shopList.forEach(element => {
                        if (element.id) {
                            _current.shopList.push(element)
                        }
                    });
                }).catch(err => {
                    console.log(err);
                })
            }
        },
        shareShop() {
            this.shareShopStatus = true
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/common/variables.scss";
.container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.shop-nav {
    position: relative;
    height: 90rpx;
    line-height: 90rpx;
    background-color: #fff;
    font-size: 26rpx;
    color: #353535;
    .nav-bar {
        display: flex;
        justify-content: space-between;
    }
    .nav {
        flex: 1;
        text-align: center;
        &.active {
            color: $base-color;
        }
        .red-dot {
            width: 16rpx;
            height: 16rpx;
            position: absolute;
            left: 116rpx;
            top: 23rpx;
            background-color: $base-color;
            border-radius: 50%;
            font-size: 18;
            color: #000;
            text-align: center;
        }
    }
    .under-line {
        position: absolute;
        bottom: 6rpx;
        height: 5rpx;
        background-color: transparent;
        &::after{
            content: '';
            display: block;
            width: 80%;
            height: 100%;
            margin: auto;
            background-color: $base-color;
        }
    }
}

.withAnimate {
    transition: all 100ms ease;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000;
}


.scroll-view {
    position: relative;
    width: 100%;
    height: 93%;
    background: #f2f2f2;
    .scroll-view-wrapper {
        position: absolute;
        top: 0;
        bottom: 0;
        display: flex;
        .one-scene {
            overflow: visible;
            border-radius: 50%;
            height: 100%;
        }
    }
}

.no-shop {
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: #f2f2f2;
    .icon{
        margin-top: 200rpx;
        width: 300rpx;
    }
}
.shop-list {
    width: 100%;
    padding-bottom: 24rpx;
}

</style>
