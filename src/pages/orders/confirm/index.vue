<template>
<div class="container">
    <div class="confirm-warp">
        <scroll-view style="height:100%" scroll-y>
            <order-vouchers v-if="showOrderVouchers" @numChange="orderNumChange" ></order-vouchers>
            <order-goods v-if="showOrderGoods"  @discountChange="orderDiscountChange" ></order-goods>
        </scroll-view>
    </div>
    <div class="confirm-btn">
        <div v-if="showOrderVouchers" class="btn" @click="jumpPay">提交支付</div>
        <div v-if="showOrderGoods" class="goods-bar" @click="jumpPay">
            <div class="bar-price">
                <div class="price">￥{{(cartOrderParam.totalPrice - discountPrice) | formatMoney}}</div>
                <div class="derate">已优惠￥{{discountPrice}}</div>
            </div>
            <div class="btn">确认付款</div>
        </div>
    </div>
</div>
</template>

<script>
import OrderVouchers from "./../views/Vouchers.vue";
import OrderGoods from "./../views/Goods.vue";
import { orderType } from '@/config/base'
import { mapActions, mapState } from "vuex";
export default {
    name: "ConfirmOrder",
    data() {
        return {
            shop_id: '',
            title: '',
            item_id: '',
            orderNum: 1,
            showOrderVouchers: false
        }
    },
    components: {
        OrderVouchers,
        OrderGoods
    },
    onLoad (options) {
        this.shop_id = options.shop_id;
        this.title = options.title;
        this.item_id = options.item_id;
        if (this.title === 'vouchers' || this.title === 'combo') {
            this.showOrderVouchers = true
        }
    },
    computed: {

        orderData: function () {
            /**
            * * 代金券
            * @params p_id:商品id
            * @params number: 数量
            * 购物车
            * @params activity_id: 优惠活动id (0-无优惠)
            * @params carts:购物车内容 [{ "pid": "203", "sku": "", "num": 2}}
            */
            const that = this
            const baseData = {
                s_id: that.shop_id,
                type: orderType[that.title]
            }
            if (that.title === 'vouchers' || this.title === 'combo') {
                baseData.number = that.orderNum
                baseData.p_id = that.item_id
            }

            return baseData
        }
        
    },
    methods: {
        ...mapActions(['getOrderDiscount', 'createOrder']),
        orderDiscount() {
            const that = this
            that.getOrderDiscount(that.orderData).then(discount => {
                console.log(discount);
                let price = 0
                if (discount && discount.length) {
                    discount.forEach((reduce,index) => {
                        if (reduce && index === 0) {
                            price += Number(reduce.reduce_ammount)
                            that.activity_id = reduce.activity_id
                        }
                    });
                }
                console.log(price);
                this.discountPrice = price
            }) 
        },
        orderDiscountChange(activity) {
            this.discountPrice = activity.reduce_ammount
            this.activity_id = activity.activity_id
        },
        orderNumChange(num) {
            this.orderNum = num
        },
        jumpPay() {
            const that = this
            // 创建订单
            that.createOrder(that.orderData).then(res => {
                mpvue.navigateTo({
                    url: `/pages/shop/pay/main?order_id=${res.order_id}`
                })
            })
        }
    }
    
};
</script>
<style lang="scss" scoped>
.container{
    display: flex;
    height: 100%;
    flex-direction: column;
    .confirm-warp{
        flex: 1;
    }
    .confirm-btn{
        height: 1rem;
    }
}
.btn {
    width: 100%;
    text-align: center;
    letter-spacing: 1px;
    font-size: 15px;
    line-height: 1rem;
    background: #ff5100;
    color: #fff;
}
.goods-bar{
    background-color: #444;
    color: #fff;
    display: flex;
    .bar-price{
        flex: 1;
        display: flex;
        align-items: center;
        .price{
            font-size: 20px;
            padding-left: .24rem;
            padding-right: .15rem;
            font-weight: 700;
        }
        .derate{
            
            padding-left: .15rem;
            color: #c0c0c0;
            font-size: 12px;
            border-left: 1px solid  #c0c0c0;
        }
    }
    .btn{
        width: 2.3rem;
        background: #38be5f;
    }
}
</style>
