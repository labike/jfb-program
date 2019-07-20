<template>
<section class="jfb-flexview">
    <div class="jfb-header">
        <lay-header></lay-header>
    </div>
    <scroll-view class="jfb-content" scroll-y @scroll="getScroll">
        <div class="banner-warp">
            <lay-banner className='column' :list='advertList' v-if="advertList.length" sHeight="280rpx"></lay-banner>
        </div>
        <div class="container" :class="bannerShow? '': 'stick'">
            <ul class="nav-bar">
                <li v-for="(nav,index) of navList" :key="index"
                    :data-current="index" class="nav"
                    :class="{active:activeTab===index}"
                    @click.stop="activeTab=index"
                >
                    {{nav.name}}
                </li>
            </ul>
            <swiper class="listSwiper"
                :current='activeTab'
                @change="navChange($event)"
            >
                <div class="swiper-inner">
                    <div v-for="(item, navIndex) of navList" :key="navIndex" >
                        <swiper-item class="swiper-item">
                            <scroll-view :style="{ height: bannerShow ? 'auto':'100%'}" scroll-y>
                                <scroll-view scroll-x="true" class="tabs-bar">
                                    <ul class="tabs">
                                        <li class="tab" :class="item.params&&item.params.sort_one? '': 'active'"
                                            @click="getNearbys(item.id)"
                                        >全部</li>
                                        <li v-for="(tab,tabIndex) of item.sortList" :key="tabIndex"
                                            :data-current="tabIndex" class="tab"
                                            :class="{active: item.params.sort_one === tab.id }"
                                            @click="getNearbys(item.id,tab.id)"
                                        >
                                            {{tab.sort_name}}
                                        </li>
                                    </ul>
                                </scroll-view>
                                <div class="tabs-container" v-if="item.shopList && item.shopList.length">
                                     <shop-card :shopInfo='shop' v-for="(shop, index) of item.shopList" :key="index"></shop-card>
                                </div>
                                <div class="no-shop"  v-if="item.shopList && !item.shopList.length">
                                    <img class="icon" src="/static/img/null_bg.png" mode="widthFix">
                                </div>
                            </scroll-view>
                        </swiper-item>
                    </div>
                </div>
            </swiper>
        </div>
    </scroll-view>
</section>
</template>

<script>
import LayHeader from "@c/header/Header.vue";
import LayBanner from "@c/swiper/Advertise.vue";
import ShopCard from "@c/shop/ShopCard.vue";
import { apiGetAdvert, apiGetSort, apiGetNearbys } from "@/api/api";
import { mapState } from 'vuex';

export default {
    name: "shop",
    data() {
        return {
            navList: ["美食", "酒店", "休闲娱乐", "爱车保养", "全部"],
            advertList: [],
            activeTab: 0,
            scrollTop: 0,
            bannerShow: true,
            bannerOffsetHeight: 0,
            handler: {
                startX: 0,
                startY: 0
            }
        };
    },
    components: {
        LayHeader,
        LayBanner,
        ShopCard
    },
    computed: {
        appData() {
            return wx.getStorageSync('appData');
        }
    },
    onLoad (options) {
        apiGetSort().then(res => {
            this.navList = this.normalFrom(res)
            this.getNearbys("1")
        })
        apiGetAdvert({
            city_id: this.appData.currentCity.code,
            position: 4,
            industry: 0
        }).then(advers => {
            this.advertList = advers.advert
        })
    },
    watch: {
        scrollTop (newY) {
            console.log(newY);
            
            if (this.bannerShow && this.minTranslateY && this.minTranslateY < newY) {
                this.bannerShow = false
            }
        }
    },
    methods: {
        
        getScroll(e) {
            this.scrollTop = e.target.scrollTop
            //this.scrollTop = e.mp.detail.scrollTop
        },
        heightInit(height) {
            this.minTranslateY = height
        },
        navChange(e) {
            if (e.type !== 'change') {
                return
            }
            let oIndex = e.mp.detail.current;
            this.activeTab = oIndex;
            const shopList = this.navList[oIndex].shopList
            if (!shopList || !shopList.length) {
                this.getNearbys(this.navList[oIndex].id)
            }
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
        getNearbys(top_sort,sort_one) {
            let params = {
                lng: 108.94712,
                lat: 34.29318,
                top_sort,
                page: 1
            }
            if (sort_one) {
                params.sort_one = sort_one
            }
            apiGetNearbys(params).then(res => {
                const current = this.navList.find(item => {
                    return item.id === top_sort
                })
                // if (!sort_one) {
                //     params.sort_one = 0
                // }
                current && (current.shopList = res.list) && (current.params = params)
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
    .banner-warp{
        height: 280rpx;
    }
    .nav-bar {
        flex-shrink: 0;
        position: relative;
        background-color: #fff;
        font-size: 26rpx;
        color: #000;
        display: flex;
        .nav {
            min-width: 80rpx;
            padding:  24rpx;
            &.active {
                color: $base-color;
            }
        }
    }
}

.container{
    height: 100%;
    flex: 1;
    &.stick{
        padding-top: 0;
        display: flex;
        flex-direction: column;
        .nav-bar{
            padding-top: 0;
        }
        .listSwiper{
            height: auto;
            flex: 1;
        }
    }
    .listSwiper{
        width: 100%;
        height: 100%;
        overflow: visible;
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
            color: #323232;
            .tab{
                margin-left: 24rpx;
                white-space: nowrap;
                flex-shrink: 0;
                font-size: 24rpx;
                padding: 10rpx 20rpx;
                border-radius: 10rpx;
                &.active{
                    background: #e3edf9;
                    color: $base-color;
                }
            }
        }
    }
    .no-shop{
        text-align: center;
        .icon{
            width: 194rpx;
            height: 194rpx;
            margin-top: 100rpx;
        }
    }
}    
</style>

