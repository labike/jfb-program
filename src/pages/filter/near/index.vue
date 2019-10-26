<!--
 * @Author: zhangHang
 * @Date: 2019-05-14 11:58:39
 * @Description: file content
 -->
<template>
<scroll-view  class="jfb-main"  scroll-y >
    <header class="jfb-header">
        <lay-header></lay-header>
    </header>
    <section class="jfb-warp">
        <div class="jfb-content">
            <lay-banner className='column' :list='advertList' v-if="advertList.length" sHeight="280rpx"></lay-banner>
            
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
                        <swiper-item>
                            <scroll-view scroll-x="true" class="tabs-bar">
                                <ul class="tabs">
                                    <li class="tab"
                                        :class="{active: swi.sort_one === ''|| !swi.sort_one}"
                                        @click="getNearbys()"
                                    >全部</li>
                                    <li v-for="(tab,tabIndex) of swi.sortList" :key="tabIndex"
                                        :data-current="tabIndex" class="tab"
                                        :class="{active: swi.sort_one === tab.id }"
                                        @click="getNearbys(tab.id)"
                                    >
                                        {{tab.sort_name}}
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
import { apiGetAdvert, apiGetSort, apiGetNearbys } from "@/api/api";
import { mapState } from 'vuex';

export default {
    name: "nearShop",
    data() {
        return {
            advertList: [],
            navList: [{
                type: 1,
                name: '美食',
                desc: '吃遍美食',
                shopList: []
            }, {
                type: 3,
                name: '休闲',
                desc: '潮玩享乐',
                shopList: []
            }, {
                type: 4,
                name: '爱车',
                desc: '汽车服务',
                shopList: []
            }, {
                type: 5,
                name: '健康',
                desc: '健康养生',
                shopList: []
            }, {
                type: 6,
                name: '教育',
                desc: '学习培训',
                shopList: []
            }, {
                type: 7,
                name: '母婴',
                desc: '母婴亲子',
                shopList: []
            }],
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
        apiGetAdvert({
            city_id: that.appData.currentCity.code,
            position: 4,
            industry: 0
        }).then(advers => {
            that.advertList = advers.advert
        })
        apiGetSort().then(navs => {
            that.navList = that.normalFrom(navs)
            that.updataShopList(that.currentTab).then(() => {
                setTimeout(() => {
                    const query = wx.createSelectorQuery();               
                    query.select(".jfb-header").boundingClientRect();
                    query.select(".jfb-warp").boundingClientRect();
                    query.select(".hd-warp").boundingClientRect();
                    query.select("#navBar").boundingClientRect();
                    query.exec(function(rect) {  
                        let sollHeight = rect[0].height + rect[1].height - rect[2].height - rect[3].height
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
}
.nav-bar{
    height: 110rpx;
}
#navBar{
    width: 100%;
    white-space:nowrap;
    background-color:#fff;
    box-sizing: border-box;
}
.shop-list {
    background: #fff;
    .navs {
        padding-top: 10rpx;
        color: #000;
        white-space: nowrap;
        display: flex;
        align-items: center;
        .nav {
            padding: 24rpx 40rpx;
            display: inline-block;
            text-align: center;
            .name{
                font-size: 13px;
            }
        }
        .cur{
            color: #2a8cfa;
            position: relative;
            &::after{
                content: '';
                position: absolute;
                bottom: 10rpx;
                left: 34rpx;
                right: 34rpx;
                height: 5rpx;
                border-radius: 5rpx;
                background: #2a8cfa;
            }
            .name{
                font-size: 16px;
                font-weight: 400;
            }
        }
    }
    .card {
        margin-bottom: 24rpx;
        background: #fff;
        border-radius: 10rpx;
        padding: 40rpx 24rpx;
    }
}

.tabs-bar{
    background: #fff;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
    z-index: 1;
    padding: 10rpx 0;
    .tabs{
        display: flex;
        color: #000;
        .tab{
            margin-left: 24rpx;
            white-space: nowrap;
            flex-shrink: 0;
            font-size: 24rpx;
            padding: 0 30rpx;
            height: 60rpx;
            line-height: 60rpx;
            border-radius: 10rpx;
            &.active{
                background: #e3edf9;
                color: #2a8cfa;
            }
        }
    }
}
.content {
	background-color: #fff;
	height: auto;
    &.scroll{
       height: 100%; 
    }
}
.shop-inner{
    padding-bottom: 100rpx;

}
.fix {
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

