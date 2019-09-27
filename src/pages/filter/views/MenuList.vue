<!--
 * @Author: zhangHang
 * @Date: 2019-06-24 16:37:25
 * @Description: file content
 -->
<template>
<div class="container">
    <div class="tabs-bar">
        <scroll-view scroll-x="true" class="menu-warp" 
            :scroll-into-view="menuId"
            scroll-with-animation="true"
        >
            <ul class="menu" v-if="params.length">
                <li class="nav-item"
                    :class="{active: !active}"
                    @click="jumpPages()"
                    id="menu_0"
                >
                    <div class="text">全部</div>
                </li>
                <li class="nav-item" v-for="item of params" :key="item.id"
                    :class="{active: active === item.id}"
                    @click="jumpPages(item)"
                    :id="'menu_' + item.id"
                >
                    <div class="text">{{item.sort_name}}</div>
                </li>
            </ul>
        </scroll-view>
        <div class="toggle-show" @click="toggleShow"></div>
    </div>
    <div class="mask-warp" v-if="showBottom" :style="{height: windowHeight}">
        <div class="mask" @click="closeMask"></div>
        <div class="mask-inner content">
            <ul class="menu" v-if="params.length">
                <li class="nav-item"
                    :class="{active: !active}"
                    @click="jumpPages()"
                    id="menu_0"
                >
                    <div class="text">全部</div>
                </li>
                <li class="nav-item" v-for="item of params" :key="item.id"
                    :class="{active: active === item.id}"
                    @click="jumpPages(item)"
                >
                    <div class="text">{{item.sort_name}}</div>
                </li>
            </ul>
        </div>
    </div>
</div>
</template>

<script>
import LaySwiper from "@c/swiper/Swiper.vue";
import { getCurrentPageUrlWithArgs } from '@/utils/index'
export default {
    name: "Menus",
    data() {
        return {
            menuId: '',
            active: '',
            showBottom: false,
            windowHeight: 650
        }
    },
    props: {
        params: Array,
    },
    onLoad (options) {
        this.showBottom = false
        this.active = options.sort_two
        if (!options.sort_two) {
            this.menuId = 'menu_0'
        } else {
            this.menuId = 'menu_' + options.sort_two
        }
        console.log(this.menuId);
        
        let system = wx.getSystemInfoSync();
        this.windowHeight = system.windowHeight + 'px';
    },
    onUnload() {        
        this.closeMask()
    },
    components: {
        LaySwiper,
    },
    methods: {
        jumpPages(item) {
            console.log(item);
            item.type = 0
            this.$emit('change', item)
            this.active = item.id
            if (!item.id) {
                this.menuId = 'menu_0'
            } else {
                this.menuId = 'menu_' + item.id
            }
            this.closeMask()
            // if (!pageUrl) {
            //     pageUrl = getCurrentPageUrlWithArgs()
            //     const last = pageUrl.indexOf("&sort_two")
            //     if (last > -1) {
            //         pageUrl = pageUrl.substring(0,last)
            //     }
            // }
            // mpvue.redirectTo({
            //     url: pageUrl
            // })
        },
        closeMask() {
            this.showBottom = false
        },
        toggleShow() {
            this.showBottom = true
        }
    }
};
</script>

<style lang="scss" scoped>
.container{
    background: #fff;
    .tabs-bar{
        display: flex;
        align-items: center;
        .menu-warp{
            background: #fff;
            width: 90%;
        }
        .menu{
            height: 100%;
            white-space: nowrap;
            display: flex;
            color: #323232;
            .nav-item{
                white-space: nowrap;
                flex-shrink: 0;
                font-size: 24rpx;
                padding: 24rpx;
                &.active{
                    color: #2a8cfa;
                    position: relative;
                    &::after{
                        content: '';
                        position: absolute;
                        left: 20rpx;
                        right: 20rpx;
                        bottom: 0;
                        border-bottom:  3px solid #2a8cfa;
                    }
                }
            }
        }
        .toggle-show{
            width: 10%;
            display: block;
            height: 25rpx;
            margin-left: 10rpx;
            background-image: url(~@/assets/img/icon_click_right_list.png);
            transform: rotateZ(90deg);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }
    }
    .mask-warp{
        position: absolute;
        left: 0;
        right: 0;
        top: 80rpx;
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
            background: #fff;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            min-height: 10%;
            max-height: 80%;
            z-index: 10001;
            display: flex;
            flex-direction: column;
            margin: 0 auto;
        }
    }
    .content{
        .img-warp{
            text-align: center;
            img{
                width: 100rpx;
                height: 100rpx;
            }
        }
        .menu{
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            justify-items:  flex-start;
            .nav-item{
                margin-top: 20rpx;
                width: 25%;
                min-height: 60rpx;
            }
            .active{
                position: relative;
                .text{
                    font-size: 12px;
                    color: #2a8cfa;
                    text-align: center;
                }
            }
            .img-warp{
                padding: 20rpx 0 10rpx;
                img{
                    width: 40rpx;
                    height: 40rpx;
                }
            }
        }
        .text{
            font-size: 12px;
            color: #323232;
            text-align: center;
        }
    }
}
</style>