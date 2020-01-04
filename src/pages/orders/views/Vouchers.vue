<!--
 * @Author: zhangHang
 * @Date: 2019-07-02 14:45:42
 * @Description: file content
 -->
<template>
<div class="confirm-order" v-if="currentItem" :class="orderType">
    <div class="order-details">
        <div class="dts-img">
            <ImageView :src="currentItem.headerImg" mode='scaleToFill' height="140rpx" width="210rpx"></ImageView>
        </div>
        <div class="dts-info">
            <div class="name">{{currentItem.name}}</div>
            <div class="price">{{currentItem.price}}</div>

            <div class="rules-use">
                <span v-if="currentItem.rules.availableTime">{{currentItem.rules.availableTime}}</span>
                <span v-if="currentItem.rules.bespeak">{{currentItem.rules.bespeak}}</span>
            </div>
            <ul class="rules-refund">
                <li v-if="currentItem.rules.refund">{{currentItem.rules.refund}}</li>
            </ul>
        </div>
    </div>

    <div class="order-tools">
        <ul class="cell">
            <li class="cell-item num">
                <div class="cell-left">数量</div>
                <div class="cell-right">
                    <div class="spinner"  v-if="orderType != 'timesale'">
                        <span class="minus" @click="numMinus"></span>
                        <p class="num" >{{orderNum}}</p>
                        <span class="add" @click="numAdd"></span>
                    </div>
                    <div class="num" v-else>{{orderNum}}</div>
                </div>
            </li>
            <li class="cell-item subtotal">
                <div class="cell-left">小计</div>
                <div class="cell-right">
                    <span class="price">{{ subtotal }}</span>
                </div>
            </li>
            <li class="cell-item total">
                <div class="cell-left">实付款</div>
                <div class="cell-right">
                    <span class="price">{{ total }}</span> 元
                </div>
            </li>
        </ul>
    </div>
</div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import Voucher from '@/config/class/voucher';
import Combo from '@/config/class/combo';
import Timesale from '@/config/class/timesale';
import ImageView from '@c/layouts/ImageView.vue'


export default {
    name: "Vouchers",
    components: {
        ImageView
    },
    data() {
        return {
            orderNum: 1,
            orderType: ''
        }
    },
    watch: {
        orderNum: function(value) {
            console.log(value);
            this.$emit('numChange', value)
        }
    },
    computed: {
        ...mapState('shop', ['currentItem']),
        subtotal() {
            if (!this.currentItem) {
                return 0
            }
            const price = this.currentItem.price * this.orderNum
            return parseFloat(price.toFixed(2)) 
        },
        total() {
            return this.subtotal
        }
    },
    onLoad (options) {
        this.orderNum = 1
        this.orderType = options.title
        if (options.title === 'vouchers') {
            let voucher = new Voucher({
                id: options.item_id
            })
            voucher.getVoucherRules(options.shop_id).then(res => {
                this.SET_CURRENT_ITEM(res)
            }).catch(err => {
                this.navBack(err)
            })
        }
        if (options.title === 'combo') {
            let combo = new Combo({
                id: options.item_id
            })
            combo.getComboDetails(options.shop_id).then(res => {
                this.SET_CURRENT_ITEM(res)
            }).catch(() => {
                this.navBack()
            })
        }
        if (options.title === 'timesale') {
            let timesale = new Timesale({
                id: options.item_id
            })
            timesale.getTimesaleRules(options.shop_id).then(res => {
                this.SET_CURRENT_ITEM(res)
            }).catch(err => {
                this.navBack(err)
            })
        }
    },
    onUnload() {        
        const self = this;
        self.orderNum = 1
        self.orderType = ''
        self.SET_CURRENT_ITEM(null)
    },
    methods: {
        ...mapMutations('shop', [
            'SET_CURRENT_ITEM'
        ]),
        numMinus() {
            let orderNum = this.orderNum
            if (this.orderNum <= 1) {
                mpvue.showToast({
                    title: '最少添加1个',
                    icon: 'none'
                });
            } else {
                this.orderNum -= 1
            }
        },
        numAdd() {
            let orderNum = this.orderNum
            if (this.orderNum >= 99) {
                mpvue.showToast({
                    title: '数量最大99',
                    icon: 'none'
                });
            } else {
                this.orderNum += 1
            }
        },
        navBack() {
            const that = this
            mpvue.showModal({
                content: '该产品已经下架，或者被删除',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function(res) {
                    if (res.confirm) {
                        that.$router.back()         
                    }
                }
            })
        }
    },
};
</script>
<style lang="scss" scoped>
.order-details {
    display: flex;
    background: #fff;
    margin-bottom: .2rem;
    padding: .4rem .24rem;
    .dts-img {
        width: 2.1rem;
        height: 1.4rem;
        margin-right: .24rem;
        background: #f2f2f2;
        overflow: hidden;
        img {
            display: block;
            width: 100%;
            min-height: 100%;
        }
    }
    .dts-info {
        flex: 1;
        position: relative;
        .name {
            font-size: 15px;
            margin-bottom: .2rem;
        }
        .price {
            font-size: 15px;
            position: absolute;
            right: 0;
            top: 3px;
            color: #818181;
            &::before {
                content: '￥';
                font-size: 10px;
            }
        }
        .rules-use {
            color: #818181;
            font-size: 10px;
            overflow: hidden;
            margin-bottom: .2rem;
            span {
                &:not(:last-child)::after {
                    content: '';
                    width: 1px;
                    height: 10px;
                    margin: -1px 4px;
                    background: #818181;
                    display: inline-block;
                }
            }
        }
        .rules-refund {
            display: flex;
            color: #38be5f;
            li {
                margin-right: .2rem;
                &::before {
                    content: '';
                    margin-right: .1rem;
                    display: inline-block;
                    margin-bottom: -2px;
                    height: 12px;
                    width: 12px;
                    background: url(~@/assets/img/selected@g.png) no-repeat;
                    background-size: contain;
                    background-position: center;
                }
            }
        }
    }

}
.spinner{
    display: flex;
    height: 0.6rem;
    width: 2.4rem;
    vertical-align: middle;
    line-height: 0.6rem;
    span{
        width: 25%;
        height: 100%;
        text-align: center;
        font-weight: 700;
        color: #666;
        letter-spacing: 0;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        
    }
    .minus{
        background-image: url(~@/assets/img/reduction.png);
    }
    .add{
        background-image: url(~@/assets/img/add.png);
    }
    .num {
        flex: 1;
        letter-spacing: 0;
        height: inherit;
        text-align: center;
        color: #666;
        border: none;
        font-size: .26rem;
        background-color: #fff;
    }
}
.timesale{
    .dts-info{
        .rules-use{
            display: none;
        }
        .price{
            top: auto;
            bottom: 0;
        }
    }
}
.order-tools {
    .cell-right {
        flex: 1;
        margin-right: .24rem;
        color: #ff5100;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .subtotal {
        .price {
            font-size: 14px;
            &::before {
                content: '￥';
                font-size: 10px;
            }
        }
    }
    .total {
        .cell-right {
            font-size: 10px;
        }
        .price {
            font-size: 20px;
        }
    }
}
</style>
