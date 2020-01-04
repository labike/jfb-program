<!--
 * @Author: zhangHang
 * @Date: 2019-05-22 11:47:56
 * @Description: file content
 -->
<template>
<div class="container">
    <header class="orders-nav">
        <ul class="nav-bar">
            <li v-for="(nav, idx1) of navList" :key="idx1"
                :data-current="nav.id" class="nav"
                :class="{active:activeTab===nav.id}"
                @click.stop="activeTab=nav.id"
            >
                {{nav.name}}
            </li>
        </ul>
        <div class="under-line" :class="{withAnimate:!stv.tStart}"
            :style="'width:'+stv.lineWidth+'px; left: '+stv.offset+'px'"
        ></div>
    </header>

    <div class="scroll-view">
        <swiper class="orderListSwiper" style="width: 100%; height: 100%; overflow: visible;"
            :current='activeTab'
            @change="swiperchange"
        >
            <block  v-for="(orderData,idx2) of navList" :key="idx2" >
                <swiper-item style="overflow: visible;border-radius: 50%;" class="one-scene">
                    <scroll-view style="height:100%" scroll-y v-if="orderData.loading"
                        @scrolltolower="LoadMore"
                    > 
                        <div v-if="orderData.orderList.length" class="order-list">
                            <block v-for="order of orderData.orderList" :key="order.order_id">
                                <order-card :orderInfo='order' @cancel='cancelOrder(order.order_id)'></order-card>
                            </block>
                        </div>
                        <div v-else class="no-order">
                            <img class="icon" src="/static/img/no_rate.png" mode="widthFix">
                            <div class="text">您还没有相关订单~</div>
                        </div>
                    </scroll-view>
                </swiper-item>
            </block>
        </swiper>
    </div>

</div>
</template>

<script>
import OrderCard from "./../views/OrderCard.vue";
import { apiOrderList } from "@/api/api";
export default {
    data() {
        return {
            navList: [{
                id: 0,
                type: 'all',
                name: "全部订单",
                loading: false,
                orderList: []
            }, {
                id: 1,
                type: 0,
                name: "待付款",
                loading: false,
                orderList: []
            }, {
                id: 2,
                type: 1,
                name: "可使用",
                loading: false,
                orderList: []
            }, {
                id: 3,
                type: 2,
                name: "待评价",
                loading: false,
                orderList: []
            }, {
                id: 4,
                type: 3,
                name: "退款/售后",
                loading: false,
                orderList: []
            }],
            stv: {
                windowWidth: 0,
                lineWidth: 0,
                offset: 0,
                tStart: false
            },
            orderListLength: 5,
            activeTab: 0,
        }
    },
    onLoad() {
        let res = mpvue.getSystemInfoSync()
        this.stv.lineWidth = res.windowWidth / this.navList.length;
        this.stv.windowWidth = res.windowWidth;
    },
    onShow() {
        this.navList.forEach(nav => {
            nav.orderList = []
        })
        this.updataOrderList(1)
    },
    components: {
        OrderCard
    },
    methods: {
        swiperchange(e) {
            if (e.type !== 'change') {
                return
            }
            const that = this
            let offset = 0;
            let oIndex = e.mp.detail.current;
            that.stv.offset = that.stv.lineWidth * oIndex
            that.activeTab = oIndex
            const orderList = that.navList[oIndex].orderList
            that.updataOrderList(1)
            
        },
        
        updataOrderList(page) {
            return new Promise((resolve,reject) => {
                const that = this
                let _current = that.navList[that.activeTab]
                _current.page = page
                if (page === 1) {
                    _current.loadMore = true
                    _current.orderList = []
                }
                apiOrderList({
                    limit: that.orderListLength,
                    nav_type: _current.type,
                    page: _current.page,
                }).then(res => {
                    let orderList = _current.orderList
                    _current.orderList = []
                    if (that.orderListLength > res.list.length) {
                        _current.loadMore = false
                    }
                    res.list.forEach(element => {
                        if (element.x_id && element.order_id) {
                            orderList.push(element)
                        }
                    });
                    _current.orderList = orderList
                    _current.loading = true
                    resolve(res.list.length)
                }) 

            })
            
        },
        cancelOrder() {
            this.updataOrderList(1)
        },
        LoadMore(e) {
            const that = this
            let _current = that.navList[that.activeTab]
            if (!_current.loadMore) {
                _current.loadMore = false
                mpvue.showToast({
                    title: "没有更多数据了",
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            console.log('LoadMore',_current);
            that.updataOrderList(_current.page + 1)
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
    z-index: 1;
}
.orders-nav {
    height: 90rpx;
    line-height: 90rpx;
    background-color: #fff;
    font-size: 26rpx;
    color: #353535;
    box-shadow: 0 0 5px #333;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10;
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
    z-index: 2;
    width: 100%;
    height: 100%;
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

.no-order {
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: #f2f2f2;
    .icon{
        margin-top: 200rpx;
        width: 300rpx;
    }
}
.order-list {
    width: 100%;
    padding-bottom: 24rpx;
    padding-top: 90rpx;
}

</style>
