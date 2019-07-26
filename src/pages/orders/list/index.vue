<template>
<div class="container">
    <div class="orders-nav">
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
        <swiper class="orderListSwiper" style="width: 100%; height: 100%; overflow: visible;"
            :current='activeTab'
            @change="swiperchange($event)"
        >
            <div v-for="(item,index) of tabs" :key="item.type" >
                <swiper-item style="overflow: visible;border-radius: 50%;" class="one-scene">
                    <scroll-view style="height:100%" scroll-y v-if="item.orderList"
                        :data-item='index'
                        @scrolltolower="LoadMore"
                    > 
                        <div v-if="item.orderList.length" class="order-list">
                             <order-card :orderInfo='order' 
                                v-for="(order,oinx) of item.orderList" :key="order.order_id"
                                @cancel='cancelOrder(index, oinx)'
                            ></order-card>
                        </div>
                        <div v-else class="no-order">
                            <img class="icon" src="/static/img/no_rate.png" mode="widthFix">
                            <div class="text">您还没有相关订单~</div>
                        </div>
                    </scroll-view>
                </swiper-item>
            </div>
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
            tabs: [{
                type: 'all',
                name: "全部订单",
                orderList: null
            }, {
                type: 0,
                name: "待付款",
                orderList: null
            }, {
                type: 1,
                name: "可使用",
                orderList: null
            }, {
                type: 2,
                name: "待评价",
                orderList: null
            }, {
                type: 3,
                name: "退款/售后",
                orderList: null
            }],
            stv: {
                windowWidth: 0,
                lineWidth: 0,
                offset: 0,
                tStart: false
            },
            orderListLength: 5,
            activeTab: 0,
            loadingStatus: false,
            
        }
    },
    onLoad() {
        var res = wx.getSystemInfoSync()
        this.stv.lineWidth = res.windowWidth / this.tabs.length;
        this.stv.windowWidth = res.windowWidth;
    },
    onShow() {
        this.updataOrderList(this.activeTab)
    },
    components: {
        OrderCard
    },
    methods: {
        swiperchange(e) {
            if (e.type !== 'change') {
                return
            }
            let offset = 0;
            let oIndex = e.mp.detail.current;
            this.stv.offset = this.stv.lineWidth * oIndex
            this.activeTab = oIndex;
            this.updataOrderList(oIndex)
        },
        updataOrderList(index, page) {
            const that = this
            const _current = this.tabs[index]
            if (!page) {
                _current.orderList = []
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
            apiOrderList({
                limit: that.orderListLength,
                nav_type: _current.type,
                page: _current.page,
            }).then(res => {
                const orderList = res.list
                if (that.orderListLength > res.list.length) {
                    _current.loadMore = false
                }
                orderList.forEach(element => {
                    if (element.x_id && element.order_id) {
                        _current.orderList.push(element)
                    }
                });
            })
        },
        cancelOrder(index, oinx) {
            let _current = this.tabs[index]
            _current.orderList.splice(oinx, 1);
               
        },
        LoadMore(e) {
            const _item = e.mp.currentTarget.dataset.item
            let _current = this.tabs[_item]
            console.log('LoadMore',_current);
            this.updataOrderList(_item, _current.page + 1)
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
.orders-nav {
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
}

</style>
