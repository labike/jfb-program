<!--
 * @Author: zhangHang
 * @Date: 2019-05-16 16:05:21
 * @Description: file content
 -->

<template>
	<section class="shop-list"  v-if="showListView">
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
                        <div class="name">{{nav.nickname}}</div>
                        <div class="desc">{{nav.description}}</div>
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
                    <section class="empty" v-if="swi.empty">
                        <ImageView src="/static/img/null_bg.png" width='160rpx'></ImageView>
                        <div class="text">暂无相关商铺！</div>
                    </section>

					<scroll-view scroll-y v-if="swi.shopList.length"
                        @scrolltolower="LoadMore"
                        class="content"
                        :item="currentTab"
                        :class="{scroll: listScroll}"
                    >
                        <block v-for="shop in swi.shopList" :key="shop.x_id">
                            <shop-card :shopInfo='shop'></shop-card>
                        </block>
                    </scroll-view>
				</swiper-item>
			</block>
		</swiper>
	</section>
</template>


<script>
import ShopCard from "./ShopCard.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { apiGetRecommends } from "@/api/api";
export default {
    components: {
        ShopCard,
        ImageView
    },
    props: {
        allIndysty: Array
    },
    data() {
        return {
            showListView: false, 
            navList: [],            
            fixtop: false, //是否吸顶
            top: 0, //导航栏初始到屏幕顶部高度
            currentTab: 0, //选项卡及swiper位置
            scrollleft: 0, //scroll-view 横向滚动条位置
            windowWidth: 0, //窗口宽度
            swiperHeight: 1000, //此处为swiper高度
            listScroll: false, //列表是否滚动
            listScrollHeigth: 0, //滚动界限
            shopListLength: 10,
            listLoading: false
        };
    },
    computed: {
        appData() {
            return mpvue.getStorageSync('appData');
        }
    },
    methods: {
        tabClick(e) {
            this.currentTab = e;
        },
        
        swiperChange(e) {
            if (e.type !== 'change') {
                return
            }
            const that = this;
            if (that.listLoading) {
                return
            }
            const query = mpvue.createSelectorQuery();
            that.currentTab = e.mp.detail.current;
            query.select("#navitem" + that.currentTab).boundingClientRect();
            query.exec(function(res) {
                console.log(res);
                if (res[0].right > that.windowWidth) {
                    that.scrollleft = res[0].right;
                } else if (res[0].left < 0) {
                    that.scrollleft = res[0].left;
                }
                setTimeout(function () {
                    mpvue.pageScrollTo({
                        scrollTop: that.top
                    })
                }, 20)
            });
            that.listLoading = true
            that.updataShopList(that.currentTab)

        },
        updataShopList(index, page) {
            return new Promise((resolve,reject) => {
                const _this = this
                const _current = _this.navList[index]
                _current.empty = false
                if (!page) {
                    _current.page = 1
                    _current.loadMore = true
                    _current.shopList = []
                } else {
                    _current.page = page
                }
                apiGetRecommends({
                    lng: _this.appData.currentLocation.lng,
                    lat: _this.appData.currentLocation.lat,
                    top_sort: _current.id, 
                    page: _current.page,
                    limit: _this.shopListLength,
                }).then(res => {
                    let shopList = _current.shopList
                    if (_this.shopListLength > res.list.length) {
                        _current.loadMore = false
                    }
                    res.list.forEach(element => {
                        if (element.x_id) {
                            shopList.push(element)
                        }
                    });
                    if (!_current.shopList.length) {
                        _current.empty = true
                    }
                    _this.listLoading = false
                    resolve(res.list.length)
                }) 

            })
            
        },
        LoadMore(e) {            
            const that = this
            let _current = that.navList[that.currentTab]
            console.log('LoadMore',_current.loadMore, _current);
            if (!_current.loadMore) {
                mpvue.showToast({
                    title: "没有更多数据了",
                    icon: 'none',
                    duration: 2000
                })
                return
            } 
            that.updataShopList(that.currentTab, _current.page + 1)
            
        },
        _formatNavList() {
            let that = this;
            let allIndysty = that.allIndysty.filter(indysty => indysty.index_show && indysty.index_show === '1')
            that.navList = allIndysty.map((item, index) => {
                that.$set(item,"shopList", [])
                return item
            })
            that.showListView = true
        }
    },

    onLoad() {
        this._formatNavList()
        let that = this;
        let system = mpvue.getSystemInfoSync();
        that.windowWidth = system.windowWidth;
        that.updataShopList(that.currentTab).then(() => {
            setTimeout(() => {
                const query = mpvue.createSelectorQuery();               
                query.select(".jfb-header").boundingClientRect();
                query.select(".jfb-warp").boundingClientRect();
                query.select(".hd-warp").boundingClientRect();
                query.select("#navBar").boundingClientRect();
                query.exec(function(rect) {  
                    let sollHeight = rect[0].height + rect[1].height - rect[2].height - rect[3].height
                    that.top = sollHeight - that.swiperHeight 
                    that.listScrollHeigth = sollHeight - system.windowHeight;
                    // console.log(that.top);
                });
            }, 800)
        })
        
    },
    onUnload() {        
        const self = this;
        self.fixtop = false;
        self.listScroll = false;
        self.showListView = false
    },
    onPageScroll: function(e) {
        // console.log(e.scrollTop);
        const that = this;
        if (that.top === 0) {
            that.fixtop = false;
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
        }
    }
};
</script>


<style lang="scss" scoped>
.nav-bar{
    height: 134rpx;
}
#navBar{
    width: 100%;
    white-space:nowrap;
    box-sizing: border-box;
}
.shop-list {
    // background: #fff;
    .navs {
        color: #323232;
        white-space: nowrap;
        display: flex;

        .nav {
            padding: 24rpx 20rpx;
            display: inline-block;
            text-align: center;
            .name{
                font-size: 16px;
                font-weight: 700;
            }
            .desc{
                margin-top: 10rpx;
                padding: 0 20rpx;
                font-size: 11px;
                font-weight: 400;
                color: #818181;
            }
        }
        .cur{
            color: #ff5100;
            position: relative;
            .desc{
                background: #ff5100;
                line-height: 34rpx;
                border-radius: 34rpx;
                color: #fff;
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

.content {
	// background-color: #fff;
	height: auto;
    &.scroll{
       height: 100%; 
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
.fix {
	position: fixed;
	top: 80rpx;
	left: 0;
	width: 100%;
	z-index: 999;
	animation: move 0.1s linear;
    box-shadow: 0 0 5px #666;
    background-color:#fff;
    .navs{
        .nav{
            padding: 24rpx 40rpx;
            .name{
                font-weight: 400;
            }
        }
        .cur{
            position: relative;
            &::after{
                content: '';
                position: absolute;
                bottom: 10rpx;
                left: 40rpx;
                right: 40rpx;
                height: 5rpx;
                border-radius: 5rpx;
                background: #ff5100;
            }
            .name{
                font-weight: 700;
            }
        }
    }
    
    .desc{
        display: none;
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