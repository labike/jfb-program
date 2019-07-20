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
            @touchstart='handlerStart'
            @touchmove='handlerMove'
            @touchend='handlerEnd'
        >
            <div v-for="(item,index) of tabs" :key="index" >
                <swiper-item style="overflow: visible;border-radius: 50%;" class="one-scene">
                    <scroll-view style="height:100%" scroll-y v-if="item.shopList"> 
                        <div v-if="item.shopList.length" class="shop-list">
                             <shop-card :shopInfo='shop' :handle='true'
                                @share='shareShop'
                                @refresh='refreshShop'
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
    
	<div class="mask-warp" v-if="shareShopStatus">
		<div class="mask" @click="shareShopStatus=false"></div>
		<div class="mask-inner" >
            <div class="canlbtn" @click="shareShopStatus=false"></div>
            <app-share :cardInfo='cardInfo'></app-share>
		</div>
	</div>
    
</div>
</template>

<script>
import AppShare from "@c/share/AppShare.vue";
import LayModel from "@c/layouts/Model.vue";
import ShopCard from "./../views/ShopCard.vue";
import { visitedShop } from "@/api/api";
export default {
    data() {
        return {
            tabs: [{
                type: '1',
                name: "已加入分享店铺",
                shopList: null
            }, {
                type: '2',
                name: "未加入分享店铺",
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
            shareShopStatus: false
        }
    },
    onLoad: function() {
        this.getVisitedShop(this.activeTab)
        var res = wx.getSystemInfoSync()
        this.stv.lineWidth = res.windowWidth / this.tabs.length;
        this.stv.windowWidth = res.windowWidth;
    },
    components: {
        LayModel,
        AppShare,
        ShopCard
    },
    computed: {},
    methods: {
        swiperchange(e) {
            console.log(e);
            
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
            let page = _current.page ? _current.page : 1
            visitedShop({
                limit: 15,
                type: _current.type,
                page,
            }).then(res => {
                if (page === 1) {
                    _current.shopList = []
                }
                const shopList = res.list
                shopList.forEach(element => {
                    if (element.id) {
                        _current.shopList.push(element)
                    }
                }); 
                this.tabs[index].shopList = _current.shopList
            }).catch(err => {
                console.log(err);
                
            })
        },
        shareShop(cardInfo) {
            this.cardInfo = cardInfo
            this.shareShopStatus = true
        },
        refreshShop() {
            this.tabs.forEach(typeShop => {
                typeShop.page = 1
                typeShop.shopList = null
            })
            this.getVisitedShop(this.activeTab)
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
.mask-warp{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    z-index: 9999;
    justify-content: flex-start;
    .mask{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 10000;
    }
    .mask-inner{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 90%;
        height: auto;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        transform: translate(-50%, -50%);
    }
    .canlbtn{
        width: 60rpx;
        height: 60rpx;
        position: absolute;
        right: 0;
        top: -60rpx;
        background-repeat: no-repeat;
        background-size: 40rpx;
        background-position: center;
        background-image: url(~@/assets/img/close.png);
    }
}
</style>
