<template>
<div class="order-card" v-if="order" @click="jumpOrderPages('details',order)">
   <div class="card-warp">
       <div class="card-hd">
           <div class="title">{{order.store_name}}</div>
           <div class="status">{{status}}</div>
       </div>
       <div class="card-bd">
           <div class="card">
               <div class="img-warp">
                   <img :src="order.img" alt="">
                </div>
               <div class="info-warp">
                   <div class="title">
                       <span class="time">创建时间：{{createTime}}</span>
                       <span class="type">{{order.title}}</span>
                   </div>
                   <div class="price">
                       <span>价格：￥{{order.actual_price}}</span>
                   </div>
               </div>
           </div>
       </div>
       <div class="card-ft" v-if="order.product_info">
           <div class="type">{{order.product_info[0].product_name}}</div>
           <div class="handle" v-if="status === '待支付'">
               <div class="btn"  @click.stop="cancelOrder(order.order_id)">取消订单</div>
               <div class="btn red"  @click.stop="payOrder(order)">立即支付</div>
           </div>
           <div class="handle" v-if="status === '待评价'">
               <div class="btn red"  @click.stop="jumpOrderPages('evaluate',order)">立即评价</div>
           </div>
           <div class="handle" v-if="status === '待消费'">
               <div class="btn"  @click.stop="jumpOrderPages('refund',order)">退款</div>
               <div class="btn red"  @click.stop="jumpOrderPages('qrcode',order)">扫码验券</div>
           </div>
       </div>
   </div>
</div>
</template>

<script>
import { formatDate } from '@/utils/index';
import { apiOrderCancel } from "@/api/api";
import { mapMutations } from 'vuex';
export default {
    name: 'orderCard',
    data() {
        return {
            order: {}
        }
    },
    props: {
        orderInfo: Object
    },
    onLoad() {
        this.order = this.orderInfo
    },
    computed: {
        discount() {
            if (!this.order.product_info) {
                return null
            } 
            let discount = this.order.product_info.find(item => {
                return item.type === 'check'
            });
            const check = discount ? discount.name.match(/^\d*(\.?\d{0,1})/g)[0] : null
            return check 
        },
        vouchers() {
            if (this.order.product_info) {
                let vouchers = this.order.product_info.find(item => {
                    return item.type === 'vouchers'
                })
                return vouchers ? vouchers.name : null
            }
            return null 
        },
        groupon() {
            if (this.order.product_info) {
                let groupon = this.order.product_info.find(item => {
                    return item.type === 'group'
                })
                return groupon ? groupon.name : null
            }
            return null
        },
        createTime() {
            const date = this.order.create_time
            return formatDate(date)
        },
        status () {
            const order = this.order
            let staText = '待支付'
            if (order.is_pay_success === '1') {
                const consume_codes = order.product_info[0].consume_codes
                if (consume_codes) {
                    let flag = consume_codes.every((item) => {
                        return item.is_use === "1";
                    })
                    staText = flag ? '待评价' : '待消费'
                } else {
                    staText = '待评价'
                }
            }
            if (order.is_comment === '1') {
                staText = '已完成'
            }
            if (order.is_refund === '2') {
                staText = '退款完成'
            }
            return staText
        }
    },
    methods: {
        ...mapMutations([
            'SET_CURRENT_ORDER',
            "SET_ORDER_RETURN"
        ]),
        jumpOrderPages(page, order) {
            this.SET_CURRENT_ORDER(order)
            mpvue.navigateTo({
                url: `/pages/orders/${page}/main?order_id=${order.order_id}`
            }) 
        },
        cancelOrder(order_id) {
            const _this = this
            wx.showModal({
                title: '取消订单提醒',
                content: '您确认要取消该订单吗？',
                success: function (res) {
                    if (res.confirm) {
                        apiOrderCancel(order_id).then(() => {
                            wx.showToast({
                                title: '您已成功取消订单',
                                icon: 'success',
                                duration: 1000
                            })
                            _this.$emit('cancel')
                        }).catch(err => {
                            wx.showToast({
                                title: err.msg,
                                duration: 1000
                            })
                        })
                        
                    }
                }
            })
        },
        payOrder(order) {
            console.log(order);
            
            const deadlinetime = Number(order.create_time) + 60 * 60 * 24
            this.SET_ORDER_RETURN({
                order_id: order.order_id,
                order_name: order.title,
                actual: order.actual_price,
                deadlinetime
            });
            mpvue.navigateTo({
                url: `/pages/shop/pay/main?order_id=${order.order_id}`
            }) 
        }
    },
};
</script>


<style lang="scss" scoped>

.order-card{
    background: #fff;
    margin-top: 24rpx;
    padding: 0 24rpx;
    position: relative;
    .card-warp{
        padding: .15rem 0;
    }
}
.card-hd{
    display: flex;
    justify-content: space-between;
    .title{
        display: flex;
        align-items: center;
        color: #000; 
        font-weight: 700;
        font-size: 28rpx;
        padding-bottom: .15rem;
        &::before{
            content: '';
            display: inline-block;
            margin-right: 10rpx;
            width: 28rpx;
            height: 28rpx;
            background-image: url(~@/assets/img/icon_shop.png);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }
    } 
    .status{
        color: #ff2900;
        font-size: 22rpx; 
    } 
}
.card-bd{
    .card{
        background: #f5f5f5;
        padding: 20rpx;
        display: flex;
    }
    .img-warp{
        margin-right: 30rpx;
        flex-shrink: 0;
        width: 100rpx;
        height: 100rpx;
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .info-warp{
        flex: 1;
        line-height: 30rpx;
        color: #818181;
        font-size: 22rpx;
        .title{
            height: 30rpx;
            padding-top: 10rpx;
        }
        .type{
            border-left: 1rpx solid #ccc;
            padding-left: 24rpx;
            margin-left: 24rpx;
        }
        .price{
            padding-top: 10rpx;
            height: 30rpx;
        }
    }
}
.card-ft{
    position: relative;
    font-size: 22rpx;
    color: #818181;
    margin-top: 24rpx;
    .type{
        line-height: 42rpx;
    }
    .handle{
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        align-items: center;
        .btn{
            min-width: 60rpx;
            line-height: 40rpx;
            text-align: center;
            padding: 0 20rpx;
            border: 1rpx solid #818181;
            margin-left: 14rpx;
            white-space: nowrap;
            font-size: 22rpx;
            border-radius: 30rpx;

            &.red{
                color: #ff2900;
                border: 1rpx solid #ff2900;
            }
        }
    }
}
</style>

