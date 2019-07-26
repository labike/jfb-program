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
        <swiper class="photoListSwiper" style="width: 100%; height: 100%; overflow: visible;"
            :current='activeTab'
            @change="swiperchange($event)"
        >
            <div v-for="(item,index) of tabs" :key="index" >
                <swiper-item style="overflow: visible;border-radius: 50%;" class="one-scene">
                    <scroll-view style="height:100%" scroll-y v-if="item.photoList"> 
                        <ul v-if="item.photoList.length" class="photo-list">
                            <li class="photo-item" v-for="(photo, sindex) of item.photoList" :key="sindex">
                                <div class="img-warp" @click="showGallary(item.photoList,sindex)">
                                    <img  class="photo-img" mode="aspectFit" :src="photo">
                                </div>
                            </li>
                        </ul>
                        <div v-else class="no-shop">
                            <img class="icon" src="/static/img/no_rate.png" mode="widthFix">
                            <div class="text">您还没有相关数据~</div>
                        </div>
                    </scroll-view>
                </swiper-item>
            </div>
        </swiper>
    </div>


    <common-gallary v-if="showGallaryState && photoList.length"
        :imgs="photoList"
        :index="showGallaryIndex"
        @close="closeGallary"
    ></common-gallary>
</div>
</template>

<script>
import CommonGallary from "@c/gallary/Gallary.vue";
import { apiGetShopImg } from "@/api/api.js";
export default {
    data() {
        return {
            tabs: [{
                type: 'all',
                name: "全部",
                photoList: null
            }, {
                type: 'pro',
                name: "商品",
                photoList: null
            }, {
                type: 'scen',
                name: "环境",
                photoList: null
            }, {
                type: 'license',
                name: "资质",
                photoList: null
            }],
            stv: {
                windowWidth: 0,
                lineWidth: 0,
                offset: 0,
                tStart: false
            },
            activeTab: 0,
            s_id: '',
            photoList: [],
            showGallaryIndex: 0,
            showGallaryState: false
        }
    },
    onLoad (options) {
        this.s_id = options.shop_id;
        this.getShopImg(this.activeTab)
        const res = wx.getSystemInfoSync()
        this.stv.lineWidth = res.windowWidth / this.tabs.length;
        this.stv.windowWidth = res.windowWidth;
    },
    components: {
        CommonGallary
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
            this.getShopImg(oIndex)
        },        
        getShopImg(index) {
            const _this = this
            const _current = _this.tabs[index]
            if (!_current.photoList) {
                apiGetShopImg({
                    type: _current.type,
                    s_id: _this.s_id
                }).then(res => { 
                    _current.photoList = res.imgList
                }).catch(() => {
                    _current.photoList = [];
                });
            }
            
        },
        showGallary(list, index) {
            this.photoList = list
            this.showGallaryIndex = index
            this.showGallaryState = true
        },
        closeGallary() {            
            this.showGallaryState = false
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

.photo-list{
    min-height: 100%;
    padding: 0 .12rem;
    overflow: hidden;
    .photo-item{
        width: 30%;
        padding: .12rem;
        float: left;
        .img-warp{
            width: 100%;
            height: 0;
            padding-bottom: 100%;
            position: relative;
            overflow: hidden;
        }
        .photo-img{
            position: absolute;
            width: 100%;
            height: 100%;
        }
    }
}

</style>
