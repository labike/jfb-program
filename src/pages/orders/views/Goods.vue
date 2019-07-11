<template>
<div class="confirm-order" v-if="cartOrderParam">
    <div class="order-details cell">
        <li class="dts-shop">
            <i class="icon store"></i>{{shopInfo.infoData.store_name}}
        </li>
        <li class="dts-goods">
            <div class="goods-list">
                <div class="goods-item" v-for="goods in cartOrderParam.cartList" :key="goods.food_id">
                    <div class="img">
                        <img :src="goods.img" alt="goods.name">
                    </div>
                    <div class="food">
                        <div class="name">
                            <div class="title">{{goods.name}}</div>
                            <div v-if="goods.is_jion_activity"><span class="full">满</span></div>
                        </div>
                        <div class="text">
                            {{goods.specs}}
                        </div>
                    </div>
                    <div class="num">{{goods.num}}</div>
                    <div class="price">{{goods.price}}</div>
                </div>
            </div>
        </li>
        
        <li class="cell-item">
            <div class="cell-left">商品总价</div>
            <div class="cell-right">{{cartOrderParam.totalPrice}}</div>
        </li>

        <li class="dts-activity"  v-for="(activity,index) in cartOrderParam.discount" :key="index" >
            <div class="cell-item" :class="{cur: index == selectIndex}"
                @click="selectActivity(index, activity)"
            >
                <div class="cell-left" v-if="activity">{{activity.activity_title}}
                    <span v-if="cartOrderParam.discount.length>1 && index == selectIndex">(优惠活动不叠加)</span>
                </div>
                <div class="cell-right" v-if="activity">
                    -<span class="price">{{activity.reduce_ammount}}</span>
                </div>
            </div>
        </li>
        
    </div>
</div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "Goods",
    data() {
        return {
            selectIndex: 0
        }
    },
    filters: {
        formatMoney: function(value) {
            if (typeof value !== 'number') {
                value = parseFloat(value)
            }
            return parseFloat(value.toFixed(2))
        }
    },
    computed: {
        ...mapState(['shopInfo','cartOrderParam']),
        title() {
            return this.$route.query.title
        },
        ticketId() {
            return this.$route.query.ticket_id
        },
        subtotal() {
            const price = this.proData.topData.price
            return price * this.orderNum
        },
        total() {
            return this.subtotal - this.vouchers.price
        },
        full_activity() {
            const activityArr = this.cartOrderParam.discount
            let full_activity = null
            if (activityArr && activityArr.length) {
                activityArr.forEach(activity => {
                    if (activity.type === 1) {
                        full_activity = activity
                    }
                });
            }
            return full_activity
        }
    },
    methods: {
        selectActivity(index, activity) {
            this.selectIndex = index
            this.$emit('discountChange',activity)
        }
    }
};
</script>
<style lang="scss" scoped>
.order-details{
    background: #fff;
    margin-top: .2rem;
    
    .cell-left{
        flex: 1;
        text-align: left;
    }
    .cell-right {
        margin-right: .24rem;
        .price {
            &::before{
                content: '￥';
                font-size: 10px;
            }
        }
    }
    
    .dts-shop{
        font-size: 14px;
        font-weight: 500;
        .icon.store{
            font-size: 0;
            margin-right: .1rem;
            display: inline-block;
            height: 1rem;
            width: .32rem;
            background: url(~@/assets/img/stores.png) no-repeat;
            background-size: contain;
            background-position: center;
        }
    }
    .dts-goods{
        position: relative;
        .goods-list{
            width: 100%;
            padding: .24rem 0;
            margin-right: .24rem;
        }
        .goods-item{
            display: flex;
            font-size: 14px;
            color: #323232;
            justify-content: center;
            align-items: center;
            .img{
                width: .7rem;
                height: .7rem;
                margin-right: .24rem;
                background: #f5f5f5;
                overflow: hidden;
                img{
                    display: block;
                    width: 100%;
                    min-height: 100%;
                }
            }
            .food{
                text-align: left;
                flex: 1;
                .text{
                    color: #818181;
                    font-size: 12px;
                    line-height: 20px;
                }
            }
            .name{
                display: flex;
                line-height: 20px;
                align-items: center;
                .title{
                    margin-right: .1rem;
                }
                .full{
                    background: #ff5100;
                    color: #fff;
                    line-height: 1;
                    font-size: 12px;
                    padding: 2px;
                }
            }
            .num{
                width: .88rem;
                &::before{
                    content: 'x';
                    font-size: 10px;
                }
            }
            .price {
                width: 2rem;
                &::before{
                    content: '￥';
                    font-size: 10px;
                }
            }
        }
    }
    .dts-activity{
        font-size: 14px;
        .cell-item{
            width: 100%;
            display: flex;
            text-decoration: line-through;
            color: #ccc;
            &.cur{
                text-decoration: none;
                color: #323232;
                .cell-right{
                    color: #ff5100;
                }
            }
            
        }
        
    }
}
</style>
