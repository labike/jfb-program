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
                    @click="jumpPages(item.target)"
                    id="menu_0"
                >
                    <div class="text">全部</div>
                </li>
                <li class="nav-item" v-for="item of params" :key="item.id"
                    :class="{active: active === item.id}"
                    @click="jumpPages(item.target)"
                    :id="'menu_' + item.id"
                >
                    <div class="text">{{item.sort_name}}</div>
                </li>
            </ul>
        </scroll-view>
        <div class="toggle-show" @click="toggleShow"></div>
    </div>
    <div class="content" v-show="showBottom">
        <ul class="menu" v-if="params.length">
            <li class="nav-item" v-for="item of params" :key="item.id"
                @click="jumpPages(item.target)"
            >
                <div class="text">{{item.sort_name}}</div>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import LaySwiper from "@c/swiper/Swiper.vue";
export default {
    name: "Menus",
    data() {
        return {
            menuId: '',
            active: '',
            showBottom: false
        }
    },
    props: {
        params: Array,
    },
    onLoad (options) {
        this.active = options.sort_two
        if (!options.sort_two) {
            this.menuId = 'menu_0'
        } else {
            this.menuId = 'menu_' + options.sort_two
        }
        console.log(this.menuId);
    },
    components: {
        LaySwiper,
    },
    methods: {
        jumpPages(pageUrl) {
            mpvue.redirectTo({
                url: pageUrl
            })
        },
        toggleShow() {
            this.showBottom = !this.showBottom
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
    .content{
        ul{
            display: flex;
            li{
                flex: 1;
            }
        }
        .img-warp{
            text-align: center;
            img{
                width: 100rpx;
                height: 100rpx;
            }
        }
        .menu2{
            .img-warp{
                padding: 20rpx 0 10rpx;
                img{
                    width: 40rpx;
                    height: 40rpx;
                }
            }
        }
        .text{
            font-size: 10pt;
            color: #323232;
            text-align: center;
        }
    }
}
</style>