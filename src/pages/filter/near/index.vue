<!--
 * @Author: zhangHang
 * @Date: 2019-05-14 11:58:39
 * @Description: file content
 -->
<template>
<div  class="near-warp"  :style="{ height : shareShopStatus ? '100%':'auto'}">
    <header class="near-header">
        <near-header></near-header>
    </header>
    <section class="near-scene">
        <scroll-view :scroll-left="scrollleft" v-if="navList.length"
            id="navBar"  scroll-x="true">
            <ul class="navs" >
                <li class="nav" :id="'navitem'+oix"
                    v-for="(nav, oix) in navList" :key="nav.id" 
                    :class="{ cur:currentTab === oix }"
                    @click="currentTab = oix"
                >
                    <div class="name">{{nav.name}}</div>
                </li>
            </ul>
        </scroll-view>
    </section>
    <swiper class="near-main" :style="'height:'+swiperHeight+'px'"
        duration="200" v-if="navList.length"
        :current="currentTab"
        @change="swiperChange">
        <block v-for="(swi,s) in navList" :key="s">
            <swiper-item >
                <scroll-view :scroll-y="!shareShopStatus"
                    @scrolltolower="LoadMore"
                    class="content"
                    :item="currentTab"
                    :class="{scroll: listScroll}"
                >
                    
                    <div class="loading" v-if="!swi.shopList"></div>
                    
                    <div class="shop-inner" v-else>
                        <div class="recommend" v-if="swi.recommendData">
                            <div class="near-bg"></div>
                            <div class="title">
                                <div class="icon"></div>
                                <div class="name">爆款推荐</div>
                                <div class="bought">{{swi.recommendData.summary.sale}}人已购</div>
                                <ul class="avaters">
                                    <li class="avater" v-for="(avater,aid) of swi.recommendData.summary.head" :key="aid">
                                        <ImageView  picture='/static/img/avatar.png' :src="avater.header_img"
                                            mode='aspectFill'  width='50rpx' height='50rpx'
                                        ></ImageView>
                                    </li>
                                </ul>
                            </div>
                            <scroll-view scroll-x="true" class="product-warp">
                                <ul class="products">
                                    <li v-for="(pro,pin) of swi.recommendData.list" :key="pin" 
                                        class="product"
                                    >   
                                        <div class="faddish" v-if="pro.info &&pro.info.type == 2" @click="jumpPages(`shop/faddish/main?shop_id=${pro.info.x_id}&gid=${pro.info.id}`)">
                                            <div class="pimg">
                                                <ImageView :src="pro.info.img_url"  mode='aspectFill'  width='232rpx' height='232rpx'></ImageView>
                                                <div class="icon">爆款推荐</div>
                                            </div>
                                            <div class="pname">{{pro.info.group_name}}</div>
                                            <div class="old-price">{{pro.info.price}}</div>
                                            <div class="new-price">{{pro.info.group_price}}</div>
                                            <div class="handle">GO</div>
                                        </div>
                                        <div class="saletime" v-if="pro.info &&pro.info.type == 7" @click="jumpPages(`shop/saletime/main?gid=${pro.info.gid}`)">
                                            <div class="pimg">
                                                <ImageView :src="pro.info.img"  mode='aspectFill'  width='232rpx' height='232rpx'></ImageView>
                                                <div class="icon">爆款推荐</div>
                                            </div>
                                            <div class="pname">送价值{{pro.info.buyer}}元{{pro.info.pro_name}}{{pro.info.number}}{{pro.info.unit}}</div>
                                            <div class="old-price">{{pro.info.buyer}}</div>
                                            <div class="new-price">{{pro.info.sale_price}}</div>
                                            <div class="handle">GO</div>
                                        </div>
                                    </li>
                                </ul>
                            </scroll-view>
                        </div>
                        <scroll-view scroll-x="true" class="tabs-bar" >
                            <ul class="tabs">
                                
                                <li class="tab" @click="subclass('')"
                                    :class="{active: swi.sort_one === '' }"
                                >
                                    <div class="icon">
                                        <ImageView src="/static/img/all.png" width='88rpx'></ImageView>
                                    </div>
                                    <div class="name">全部</div>
                                </li>

                                <li v-for="(tab,tabIndex) of swi.sortList" :key="tabIndex"
                                    :data-current="tabIndex" class="tab"
                                    :class="{active: swi.sort_one === tab.id }"
                                    @click="subclass(tab.id)"
                                >
                                    <div class="icon">
                                        <ImageView :src="tab.img" width='88rpx'></ImageView>
                                    </div>
                                    <div class="name">{{tab.sort_name}}</div>
                                </li>
                            </ul>
                        </scroll-view>
                        
                        <section class="empty" v-if="swi.empty">
                            <ImageView src="/static/img/null_bg.png" width='160rpx'></ImageView>
                            <div class="text">暂无相关商铺！</div>
                        </section>
                        <div class="shop-list">
                            <block v-for="shop in swi.shopList" :key="shop.s_id">
                                <shop-card :shopInfo='shop' @share='shareShop'></shop-card>
                            </block>
                        </div>
                    </div>
                    
                </scroll-view>
            </swiper-item>
        </block>
    </swiper>

    
	<div class="share-warp" v-if="shareShopStatus" catchtouchmove="ture">
        <app-share :cardInfo='cardInfo' @close="shareShopStatus=false"></app-share>
	</div>
</div >
</template>

<script>
import ShopCard from "@c/shop/ShopCard2.vue";
import ImageView from '@c/layouts/ImageView.vue'
import AppShare from './../views/AppShare.vue'
import NearHeader from "./../views/NearHeader.vue";
import { WAPHOST } from '@/config/base'
import { apiGetAdvert, apiGetSort, apiGetNearbys, apiGetBurstByNear, apiStoreScan } from "@/api/api";

export default {
    name: "nearShop",
    data() {
        return {
            // advertList: [],
            navList: [],
            currentTab: 0, //选项卡及swiper位置
            scrollleft: 0, //scroll-view 横向滚动条位置
            windowWidth: 0, //窗口宽度
            swiperHeight: 1000, //此处为swiper高度
            listScroll: false, //列表是否滚动
            listScrollTop: 0, //滚动界限
            shopListLength: 10,
            cardInfo: null,
            shareShopStatus: false
        };
    },
    components: {
        NearHeader,
        ShopCard,
        ImageView,
        AppShare
    },
    computed: {
        appData() {
            return mpvue.getStorageSync('appData');
        }
    },
    onLoad () {
        let that = this;
        let system = mpvue.getSystemInfoSync();
        that.windowWidth = system.windowWidth;
        const query = mpvue.createSelectorQuery();
        query.select(".near-header").boundingClientRect();
        query.select(".near-scene").boundingClientRect();
        query.exec(function(rect) {
            that.swiperHeight = system.windowHeight * 2 - rect[1].height
            that.listScrollTop = rect[0].height
            console.log(that.swiperHeight, that.listScrollTop);
        });
        apiGetSort().then(navs => {
            that.navList = that.normalFrom(navs)
            that.updataShopList(that.currentTab)
            that.updataRecommendList(that.currentTab)
        })
    },
    onUnload() {        
        const self = this;
        self.listScroll = false;
        self.shareShopStatus = false;
        self.cardInfo = null;
        
    },
    methods: {
        swiperChange(e) {
            if (e.type !== 'change') {
                return
            }
            const that = this;
            mpvue.pageScrollTo({
                scrollTop: that.listScrollTop
            })
            const query = mpvue.createSelectorQuery();
            that.currentTab = e.mp.detail.current;
            query.select("#navitem" + that.currentTab).boundingClientRect();
            query.exec(function(res) {
                that.listScroll = false;
                if (res[0].right > that.windowWidth) {
                    that.scrollleft = res[0].right;
                } else if (res[0].left < 0) {
                    that.scrollleft = res[0].left;
                }
            });
            
            const shopList = that.navList[that.currentTab].shopList
            const recommendList = that.navList[that.currentTab].recommendList
            if (!shopList || !shopList.length) {
                that.updataShopList(that.currentTab)
            }
            if (!recommendList || !recommendList.length) {
                that.updataRecommendList(that.currentTab)
            }
        },
        
        LoadMore(e) {
            const that = this
            let _current = that.navList[that.currentTab]
            console.log('LoadMore',_current);
            that.updataShopList(that.currentTab, _current.page + 1)
            
        },
        normalFrom(list) {
            let newList = []
            list.forEach(element => {
                const type = {
                    id: element.id,
                    sort_one: '',
                    name: element.sort_name,
                    sortList: element.childData,
                    shopList: null,
                    recommendData: null
                }
                newList.push(type)
            });
            return newList
        },
        subclass(sort_one) {
            const that = this
            let current = that.navList[that.currentTab]
            let params = {
                lng: that.appData.currentLocation.lng,
                lat: that.appData.currentLocation.lat,
                top_sort: current.id, 
                page: 1,
                limit: that.shopListLength
            }
            if (sort_one) {
                params.sort_one = sort_one
                current.sort_one = sort_one
            } else {
                params.sort_one = ''
                current.sort_one = ''
            }
            that.getNearbys(params).then(res => {
                current.shopList = []
                if (that.shopListLength > res.list.length) {
                    current.loadMore = false
                }
                res.list.forEach(element => {
                    if (element.s_id) {
                        current.shopList.push(element)
                    }
                });
            })
        },
        getNearbys(params) {
            return apiGetNearbys(params)
        },
        updataRecommendList(index) {
            const that = this
            let current = that.navList[index]
            let params = {
                lng: that.appData.currentLocation.lng,
                lat: that.appData.currentLocation.lat,
                top_sort: current.id, 
                page: 1,
                limit: 10
            }
            apiGetBurstByNear(params).then(res => {
                res.summary.head = Array.from({length: 5}).map((item, index) => {
                    let avatar = {}
                    avatar.header_img = res.summary.head[index] ? res.summary.head[index].header_img : ''
                    return avatar;
                });
                current.recommendData = res
            })
        },
        updataShopList(index, page) {
            return new Promise((resolve,reject) => {
                console.log('updataShopList');
                const _this = this
                const _current = _this.navList[index]
                _current.empty = false
                if (!page) {
                    _current.shopList = []
                    _current.page = 1
                    _current.loadMore = true
                } else {
                    _current.page = page
                }
                if (!_current.loadMore) {
                    _current.loadMore = false
                    mpvue.showToast({
                        title: "没有更多数据了",
                        icon: 'none',
                        duration: 2000
                    })
                    return
                }
                let params = {
                    lng: _this.appData.currentLocation.lng,
                    lat: _this.appData.currentLocation.lat,
                    top_sort: _current.id, 
                    page: _current.page,
                    limit: _this.shopListLength,
                }
                if (_current.sort_one) {
                    params.sort_one = _current.sort_one
                } else {
                    params.sort_one = ''
                }
                _this.getNearbys(params).then(res => {
                    const shopList = _current.shopList.slice(0)
                    _current.shopList = []
                    if (_this.shopListLength > res.list.length) {
                        _current.loadMore = false
                    }
                    res.list.forEach(element => {
                        if (element.s_id) {
                            shopList.push(element)
                        }
                    });
                    _current.shopList = shopList
                    if (!_current.shopList.length) {
                        _current.empty = true
                    }
                    resolve(res.list.length)
                }) 

            })
            
        },
        jumpPages(pageUrl) {
            this.$router.push({
                path: `/pages/${pageUrl}`
            })
        },
        shareShop(cardInfo) {
            console.log(cardInfo);
            if (cardInfo.type === "earn" && !cardInfo.shareUrl) {
                mpvue.showToast({
                    title: '请先成为本店合伙人',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            this.cardInfo = cardInfo
            this.shareShopStatus = true
        }
    },
    onPageScroll: function(e) {
        // console.log(e.scrollTop);
        const that = this
        if (that.listScrollTop === 0) {
            return
        }
        if (e.scrollTop >= that.listScrollTop) {
            that.listScroll = true;
           
        } else {
            that.listScroll = false;
        }
    },
    onShareAppMessage (options) {
        if (options.from === "menu") {
            return {
                title: '我发现了一款省钱的小程序',
                path: '/pages/index/main',
                imageUrl: WAPHOST + 'shareImg.png',
            }
        }
        console.log(options);
        const share = options.target.dataset.share
        return {
            title: share.storeInfo.store_name,
            path: "/pages/start/invitation/main?code=" + share.shareUrl,
            imageUrl: share.storeInfo.header_img,
        }
    },
};
</script>

<style lang="scss" scoped>
.near-warp{
    position: relative;
    z-index: 1;
    .near-bg{
        position: absolute;
        z-index: -2;
        top: 0;
        left: 0;
        right: 0;
        background: #f2f2f2;
        height: 400rpx;
        &::after{
            content: '';
            position: absolute;
            z-index: -1;
            top: 0;
            left: -20%;
            background: #2a8cfa;
            width: 140%;
            height: 400rpx;
            border-radius: 0 0 50% 50%;
        }
    }

}
.near-header{
    background: #2a8cfa;
    position: sticky;
    top: 0;
    z-index: 800;
}
.near-scene{
    background: #2a8cfa;
    height: 100rpx;
    position: sticky;
    top: 0;
    z-index: 800;
    #navBar{
        width: 100%;
        white-space:nowrap;
        box-sizing: border-box;
    }
    .navs {
        white-space: nowrap;
        display: flex;
        align-items: center;
        .nav {
            padding: 24rpx;
            text-align: center;
            .name{
                font-size: 14px;
                font-weight: 400;
                color: #fff;
            }
        }
        .cur{
            position: relative;
            &::after{
                content: '';
                position: absolute;
                bottom: 10rpx;
                left: 50%;
                width: 36rpx;
                height: 6rpx;
                border-radius: 4rpx;
                background: #fff;
                margin-left: -18rpx;
            }
            .name{
                font-size: 14px;
                font-weight: 700;
            }
        }
    }
}


.near-main {
    position: relative;
    z-index: 20;
    .tabs-bar{
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding: 30rpx 0 10rpx;
        .tabs{
            white-space: nowrap;
            display: flex;
            align-items: center;
            color: #000;
            margin-left: 30rpx;

        }
        .tab{
             padding-right: 28rpx;
             color: #323232;
            &.active{
                color: #38b1ff;
                .icon{
                    border: 8rpx solid #38b1ff;
                }
            }
            .icon{
                width: 88rpx;
                height: 88rpx;
                margin: 0 auto;
                border-radius: 50%;
                overflow: hidden;
                background: transparent;
                border: 8rpx solid transparent;
            }
            .name{
                flex-shrink: 0;
                font-size: 12px;
                line-height: 60rpx;
                text-align: center;
            }
        }
    }
    .content {
        height: auto;
        &.scroll{
            height: 100%; 
        }
    }
    .shop-list{
        margin: 0 24rpx;
        padding-bottom: 100rpx;

    }
    .card {
        margin-bottom: 24rpx;
        background: #fff;
        border-radius: 10rpx;
        padding: 40rpx 24rpx;
    }
    .loading{
        width: 100%;
        height: 100%;
        background: #f2f2f2;
    }
    .recommend{
        position: relative;
        margin: 0 24rpx;
        padding: 20rpx 24rpx;
        background: #fff;
        border-radius: 10rpx;
        .title{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .icon{
                width: 35rpx;
                height: 35rpx;
                margin-right: 10rpx;
                background-size: auto 35rpx;
                background-position: center;
                background-repeat: no-repeat;
                background-image: url('~@/assets/img/recommend.png');
            }
            .name{
                color: rgb(50, 50, 50);
                font-weight: 700;
                font-size: 15px;
            }
            .bought{
                text-align: right;
                color: #29b3ff;
                flex: 1;
                font-size: 12px;
                font-weight: 400;
            }
            .avaters{
                display: flex;
                align-items: center;
                margin-left: 30rpx;
            }
            .avater{
                width: 50rpx;
                height: 50rpx;
                margin-left: -10rpx;
                border-radius: 50%;
                overflow: hidden;
                position: relative;
            }
        }
        .product-warp{
            margin-top: 10rpx;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            position: relative;
            z-index: 1;
            padding: 10rpx 0;
        }
        .products{
            white-space: nowrap;
            display: flex;
            align-items: center;
        }
        .product{
            margin-right: 20rpx;
            background: #f8fcff;
            border-radius: 10rpx;
            overflow: hidden;
            flex-shrink: 0;
            position: relative;
            line-height: 1;
            .pimg{
                width: 232rpx;
                height: 232rpx;
                background: #f2f2f2;
                overflow: hidden;
                margin: 0 auto;
                position: relative;
                .icon{
                    background: #ff583f;
                    width: 130rpx;
                    height: 36rpx;
                    line-height: 36rpx;
                    text-align: center;
                    font-weight: 400;
                    color: #fff;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    border-radius: 10rpx 0 10rpx 0
                }
            }
            .pname{
                flex-shrink: 0;
                font-size: 12px;
                line-height: 1;
                color: #000;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                margin: 10rpx;
            }
            .old-price{
                margin: 0 10rpx;
                font-size: 12px;
                color: #c0c0c0;
                font-weight: 400;
                text-decoration:line-through;
                &::before{
                    content: '￥';
                }
            }
            .new-price{
                margin: 10rpx;
                font-size: 16px;
                font-weight: 700;
                color: #ff583f;
                &::before{
                    content: '￥';
                }
            }
            .handle {
                position: absolute;
                right: 10rpx;
                bottom: 20rpx;
                background: #00aaff;
                color: #fff;
                font-size: 12px;
                text-align: center;
                width: 56rpx;
                height: 28rpx;
                line-height: 28rpx;
                border-radius: 28rpx;
            }
        }
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

