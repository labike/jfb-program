<template>
<section class="pay-the-bill" v-if="paying">
    <p class="address">{{paying.storeInfo.address}}</p>
    <ul class="cell consume">
        <li class="odrer-price">
            <p class="lable">订单金额</p>
            <div class="input">
                <input type="digit" v-model="orderPrice" placeholder="请询问服务员后输入"
                    :confirm-hold='true' :focus='true'
                    @input='replaceInput'
                />
            </div>
        </li>
        <li class="odrer-ticket" v-if="paying.isUse">
            <p class="lable">商家优惠<span class="tenth">({{paying.discount/10}}折)</span></p>
            <div class="input">{{discountPrice}}</div>
        </li>
        <li class="odrer-ticket" v-else>
            <p class="lable">商家优惠</p>
            <div class="input">该时间段无优惠</div>
        </li>
        <li class="odrer-other">
            <p class="lable">实际支付</p>
            <div class="input">
                <div class="input">{{payPrice}}</div>
            </div>
        </li>
    </ul>
    <div id="payBtn" @click="jumpPay">和店员确认，立即支付</div>
</section>
</template>

<script>
import PayTheBill from '@/config/class/pay_the_bill';
import { mapActions, mapState } from "vuex";
import { orderType } from '@/config/base';
import { Toast } from '@/utils/index';
export default {
    name: "payTheBill",
    data() {
        return {
            shop_id: 0,
            explain: false,
            orderPrice: '',
            paying: null
        };
    },
    computed: {
        discountPrice: function() {
            let oPrice = parseFloat(this.orderPrice);
            let price = '';
            if (this.paying) {
                const discount = (1 - this.paying.discount / 100).toFixed(2);
                price = -(discount * oPrice).toFixed(2) || '';
            }
            return price;
        },
        payPrice: function() {
            let price = parseFloat(this.orderPrice) || 0;
            if (this.paying && this.paying.isUse) {
                price = this.orderPrice - (-this.discountPrice); 
            }
            return Number(price.toFixed(2));
        }
    },
    onLoad (options) {
        this.shop_id = options.shop_id;
        const paying = new PayTheBill({});
        paying.getDetails(this.shop_id).then(res => {
            this.paying = res;
            mpvue.setNavigationBarTitle({
                title: res.storeInfo.store_name
            })
        });
    },
    methods: {
        ...mapActions(['createOrder']),
        replaceInput(e) {
            let value = e.mp.detail.value
            // const reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
            let money;
            if (/^(\d?)+(\.\d{0,2})?$/.test(value)) { //正则验证，提现金额小数点后不能大于两位数字
                money = value;
            } else {
                money = value.substring(0, value.length - 1);
            }
            this.orderPrice = money
        },
        jumpPay() {
            const that = this;
            const orderPrice = that.orderPrice;
            const reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
            if (!reg.test(orderPrice)) {
                Toast("请核对您的输入金额！");
                return; 
            }
            // 创建订单
            that.createOrder({
                s_id: that.shop_id,
                total: orderPrice,
                type: orderType.paying
            }).then(res => {
                mpvue.navigateTo({
                    url: `/pages/shop/pay/main?order_id=${res.order_id}`
                }) 
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/components/pay-the-bill.scss";
* { touch-action: pan-y; } 
.navbar-explain{
    color: #fff;
    display: block;
    width: 100%;
    text-align: right;
}
.popup-explain{
    background-color: #fff;
    padding: .6rem .3rem;
    .title{
        text-align: center;
        font-size: 15px;
        margin-bottom: .4rem;
    }
    li {
        margin-bottom: .2rem;
        line-height: 1.7;
        list-style-type: disc;
        list-style-position: inside;
        display: flex;
        .rule{
            flex:1;
            color: #fb513f;
        }
    }
}

.cell {
    background: #fff;
    text-align: right;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    margin-bottom: .3rem;
    li {
        position: relative;
        display: flex;
        padding-left: .24rem;
        overflow: hidden;
        font-size: 14px;
        line-height: 1rem;
        &:not(:last-child)::before {
            content: '';
            position: absolute;
            z-index: 2;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            border-bottom: 1px solid #e8e8e8;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            -webkit-transform-origin: 0 100%;
            transform-origin: 0 100%;
        }
        .lable {
            float: left;
            display: flex;
            align-items: center;
            margin-right: .5rem;
        }
    }
}
</style>
