<!--
 * @Author: zhangHang
 * @Date: 2019-05-14 11:58:39
 * @Description: file content
 -->
<template>
<scroll-view  class="jfb-main"  scroll-y >
    <header class="jfb-header">
        <div class="location">
            <div class="icon"></div>
            <div class="address">长和国际</div>
        </div>
        <ul class="menu">
            <li class="item" @click="codeToPay">
                <img src="/static/tabs/ic-pay.png" class="icon">
            </li>
            <li class="item" @click="codeToShop">
                <img src="/static/tabs/ic-into.png" class="icon">
            </li>
            <li class="item" @click="jumpPages('mine/patronage/main')">
                <img src="/static/tabs/ic-shop.png" class="icon">
            </li>
        </ul>
    </header>
    <section class="jfb-warp">
        <div class="jfb-bg"></div>
        <div class="jfb-content">
            <!-- <lay-banner className='column' :list='advertList' v-if="advertList.length" sHeight="280rpx"></lay-banner> -->
            
	        <div class="shop-list">
                <div class="nav-bar">
                    <scroll-view :scroll-left="scrollleft"
                        id="navBar"
                        :class="fixtop? 'fix':''"
                        scroll-x="true">
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
                </div>
                <swiper :style="'height:'+swiperHeight+'px'"
                    class="swiper"
                    duration="200"
                    :current="currentTab"
                    @change="swiperChange">
                    <block v-for="(swi,s) in navList" :key="s">
                        <swiper-item >
                            <div class="recommend">
                                <div class="title">
                                    <div class="icon"></div>
                                    <div class="name">爆款推荐</div>
                                    <div class="bought">1.5万人已购</div>
                                    <ul class="avaters">
                                        <li class="avater">
                                            <ImageView  width='50rpx' picture='/static/img/avatar.png' ></ImageView>
                                        </li>
                                        <li class="avater">
                                            <ImageView  width='50rpx' picture='/static/img/avatar.png' ></ImageView>
                                        </li>
                                        <li class="avater">
                                            <ImageView  width='50rpx' picture='/static/img/avatar.png' ></ImageView>
                                        </li>
                                        <li class="avater">
                                            <ImageView  width='50rpx' picture='/static/img/avatar.png' ></ImageView>
                                        </li>
                                        <li class="avater">
                                            <ImageView  width='50rpx' picture='/static/img/avatar.png' ></ImageView>
                                        </li>
                                    </ul>
                                </div>
                                <scroll-view scroll-x="true" class="product-warp">
                                    <ul class="products">
                                        <li v-for="(pro,pin) of swi.sortList" :key="pin"
                                            :data-current="pin" class="product"
                                            :class="{active: swi.sort_one === pro.id }"
                                            @click="getNearbys(pro.id)"
                                        >
                                            <div class="pimg">
                                                <ImageView :src="pro.img" width='232rpx'></ImageView>
                                                <div class="icon">爆款推荐</div>
                                            </div>
                                            <div class="pname">{{pro.sort_name}}</div>
                                            <div class="old-price">29</div>
                                            <div class="new-price">29</div>
                                            <div class="handle">GO</div>
                                        </li>
                                    </ul>
                                </scroll-view>
                            </div>
                            <scroll-view scroll-x="true" class="tabs-bar" >
                                <ul class="tabs">
                                    <li v-for="(tab,tabIndex) of swi.sortList" :key="tabIndex"
                                        :data-current="tabIndex" class="tab"
                                        :class="{active: swi.sort_one === tab.id }"
                                        @click="getNearbys(tab.id)"
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
                            <scroll-view scroll-y v-else
                                @scrolltolower="LoadMore"
                                class="content"
                                :item="currentTab"
                                :class="{scroll: listScroll}"
                            >
                                <div class="shop-inner">
                                    <block v-for="shop in swi.shopList" :key="shop.s_id">
                                        <shop-card :shopInfo='shop'></shop-card>
                                    </block>
                                </div>
                            </scroll-view>
                        </swiper-item>
                    </block>
                </swiper>
	        </div>
        </div>
    </section>
</scroll-view>
</template>

<script>
import LayHeader from "@c/header/Header.vue";
import LayBanner from "@c/swiper/Advertise.vue";
import ShopCard from "@c/shop/ShopCard2.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { apiGetAdvert, apiGetSort, apiGetNearbys, apiStoreScan } from "@/api/api";
import { mapState } from 'vuex';

export default {
    name: "nearShop",
    data() {
        return {
            // advertList: [],
            navList: [],
            fixtop: false, //是否吸顶
            top: 0, //导航栏初始到屏幕顶部高度
            currentTab: 0, //选项卡及swiper位置
            scrollleft: 0, //scroll-view 横向滚动条位置
            windowWidth: 0, //窗口宽度
            swiperHeight: 600, //此处为swiper高度
            listScroll: false, //列表是否滚动
            listScrollHeigth: 0, //滚动界限
            listScrollTop: 0, //滚动界限
            shopListLength: 10
        };
    },
    components: {
        LayHeader,
        LayBanner,
        ShopCard,
        ImageView,
    },
    computed: {
        ...mapState({
            "user": state => state.user 
        }),
        appData() {
            return wx.getStorageSync('appData');
        }
    },
    onLoad () {
        let that = this;
        let system = wx.getSystemInfoSync();
        that.windowWidth = system.windowWidth;
        that.swiperHeight = system.windowHeight;        
        // apiGetAdvert({
        //     city_id: that.appData.currentCity.code,
        //     position: 4,
        //     industry: 0
        // }).then(advers => {
        //     that.advertList = advers.advert
        // })
        apiGetSort().then(navs => {
            that.navList = that.normalFrom(navs)
            that.updataShopList(that.currentTab).then(() => {
                setTimeout(() => {
                    const query = wx.createSelectorQuery();               
                    query.select(".jfb-header").boundingClientRect();
                    query.select(".jfb-warp").boundingClientRect();
                    query.select("#navBar").boundingClientRect();
                    query.exec(function(rect) { 
                        console.log(rect);
                         
                        let sollHeight = rect[0].height + rect[1].height - rect[2].height
                        that.top = sollHeight - that.swiperHeight 
                        that.listScrollHeigth = sollHeight - system.windowHeight;
                    });
                }, 500)
            })
        })
    },
    onUnload() {        
        const self = this;
        self.fixtop = false;
        self.listScroll = false;
    },
    methods: {
        swiperChange(e) {
            if (e.type !== 'change') {
                return
            }
            const that = this;
            const query = wx.createSelectorQuery();
            that.currentTab = e.mp.detail.current;
            query.select("#navitem" + that.currentTab).boundingClientRect();
            query.exec(function(res) {
                that.listScroll = false;
                if (res[0].right > that.windowWidth) {
                    that.scrollleft = res[0].right;
                } else if (res[0].left < 0) {
                    that.scrollleft = res[0].left;
                }
                setTimeout(function () {
                    wx.pageScrollTo({
                        scrollTop: that.top
                    })
                }, 20)
            });
            
            const shopList = that.navList[that.currentTab].shopList
            if (!shopList || !shopList.length) {
                that.updataShopList(that.currentTab)
            }
        },
        
        updataShopList(index, page) {
            return new Promise((resolve,reject) => {
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
                    wx.showToast({
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
                apiGetNearbys(params).then(res => {
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
        LoadMore(e) {
            const that = this
            let _current = that.navList[that.currentTab]
            console.log('LoadMore',_current);
            that.updataShopList(that.currentTab, _current.page + 1)
            console.log('LoadMore');
            
        },
        normalFrom(list) {
            let newList = []
            list.forEach(element => {
                const type = {
                    id: element.id,
                    sort_one: 0,
                    name: element.sort_name,
                    sortList: element.childData,
                    shopList: null
                }
                newList.push(type)
            });
            return newList
        },
        getNearbys(sort_one) {
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
            apiGetNearbys(params).then(res => {
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
        
        codeToPay () {
            console.log('codeToPay');
            var _this = this;
            mpvue.scanCode({
                onlyFromCamera: true,
                scanType: ['QR_CODE'],
                success: (confing) => {
                    var content = confing.result;
                    apiStoreScan({
                        content,
                        type: 1
                    }).then(res => {
                        console.log(res);
                        wx.navigateTo({
                            url: '/pages/shop/paythebill/main?shop_id=' + res.x_id,
                        })
                    })
                }
            })
        },
        codeToShop () {
            var _this = this;
            // 允许从相机和相册扫码
            mpvue.scanCode({
                onlyFromCamera: true,
                scanType: ['QR_CODE'],
                success: (confing) => {
                    var content = confing.result;
                    apiStoreScan({
                        content,
                        type: 2
                    }).then(res => {
                        console.log(res);
                        wx.navigateTo({
                            url: '/pages/shop/index/main?shop_id=' + res.x_id,
                        })
                    })
                }
            })
        },
        jumpPages(pageUrl) { 
            
            this.$router.push({
                path: `/pages/${pageUrl}`
            })
        },
    },
    onPageScroll: function(e) {
        // console.log(e.scrollTop);
        const that = this;
        if (that.top === 0) {
            return
        }
        if (e.scrollTop >= that.top) {
            that.fixtop = true;
            if (e.scrollTop >= that.listScrollHeigth) {
                that.listScroll = true;
            } else {
                that.listScroll = false;
            }
        } else {
            that.fixtop = false;
            that.listScroll = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.jfb-header{
    background: #2a8cfa;
    padding: 0 24rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    .location{
        color: #fff;
        position: relative;
        .icon {
            position: absolute;
            left: 0;
            top: 6rpx;
            width: 38rpx;
            height: 38rpx;
            background-size: auto 38rpx;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/location3.png');
        }
        .address{
            padding-left: 50rpx;
            font-weight: 400;
            font-size: 18px;
        }
    }
    .menu {
        font-size: 0;
        display: flex;
        align-items: center;
        .icon {
            width: 38rpx;
            height: 38rpx;
        }
        .item {
            margin-left: 40rpx;
        }
    }
}
.jfb-warp{
    position: relative;
    z-index: 1;
    .jfb-bg{
        position: absolute;
        z-index: 2;
        top: 0;
        left: 0;
        right: 0;
        background: #f2f2f2;
        height: 400rpx;
        &::after{
            content: '';
            position: absolute;
            z-index: 9;
            top: 0;
            left: -20%;
            background: #2a8cfa;
            width: 140%;
            height: 400rpx;
            border-radius: 0 0 50% 50%;
        }
    }
    .jfb-content{
        position: relative;
        z-index: 10;
    }
}

.nav-bar{
    height: 100rpx;
    position: sticky;
    top: 0;
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
#navBar{
    width: 100%;
    white-space:nowrap;
    box-sizing: border-box;
}
.shop-list {
    
    .tabs-bar{
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        position: relative;
        z-index: 1;
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
                color: #00aaff;
                .icon{
                    background: #00aaff;
                }
            }
            .icon{
                width: 88rpx;
                height: 88rpx;
                margin: 0 auto;
                border-radius: 50%;
                overflow: hidden;
                background: #fff;
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
    .shop-inner{
        margin: 0 24rpx;
        padding-bottom: 100rpx;

    }
    .card {
        margin-bottom: 24rpx;
        background: #fff;
        border-radius: 10rpx;
        padding: 40rpx 24rpx;
    }
    
    .recommend{
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



.fix1 {
	position: fixed;
	top: 80rpx;
	left: 0;
	width: 100%;
	z-index: 999;
	animation: move 0.1s linear;
    box-shadow: 0 0 5px #333;
    .navs{
        padding: 0;
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

