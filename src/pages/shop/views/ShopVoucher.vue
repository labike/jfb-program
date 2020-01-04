<!--
 * @Author: zhangHang
 * @Date: 2019-05-16 16:04:59
 * @Description: file content
 -->
<template>
<div class="activity-card">
    <scroll-view scroll-x="true" class="vouchers-warp"  v-if="voucherList.length">
        <ul class="vouchers-list">
            <li class="vouchers-item" v-for="voucher of voucherList" :key="voucher.id"
                @click="jumpCombo(voucher.id)" >
                <div class="vs-warp">
                    <div class="msg">
                        <div class="name">
                            <span>{{ voucher.old_price  }}</span> 元 代金券
                        </div>
                        <div class="overlay" v-if="voucher.rules">{{ voucher.rules.overlying }}</div>
                    </div>
                    
                    <div class="price">
                        <span class="new">{{ voucher.price }}</span>
                    </div>
                    <div class="handle">
                        <div class="btn" @click.stop="jumpConfirm(voucher.id)">抢 购</div>
                    </div>
                </div>
            </li>
            <li class="vouchers-item empty"></li>
        </ul>
    </scroll-view>
</div>
</template>

<script>
import LastTime from "@c/shop/LastTime2.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { getDistance } from '@/utils/index';
import { mapState, mapMutations } from 'vuex';

export default {
    name: 'ShopVoucher',
    components: {
        ImageView,
        LastTime
    },
    props: {
        voucherList: Array
    },
    onLoad(options) {        
        this.shop_id = options.shop_id;
        console.log(this.voucherList);
        
    },
    methods: {
        ...mapMutations('shop', [
            'SET_CURRENT_ITEM'
        ]),
        jumpCombo(id) {
            const that = this
            that.SET_CURRENT_ITEM(null)
            that.$router.push({
                path: `/pages/shop/item/main?shop_id=${that.shop_id}&title=vouchers&item_id=${id}`
            })
        },
        jumpConfirm(id) {
            const that = this
            that.$router.push({
                path: `/pages/orders/confirm/main?shop_id=${that.shop_id}&title=vouchers&item_id=${id}`
            })
        }
    },
};
</script>

<style lang="scss" scoped>
.activity-card {
    padding: 24rpx 0;
}
.vouchers-warp{
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}
.btn{
    font-size: 12px;
    background: linear-gradient(to right, #f11b1b, #f25313);
    width: 110rpx;
    height: 40rpx;
    line-height: 40rpx;
    text-align: center;
    font-weight: 400;
    color: #fff;
    border-radius: 10rpx;

}
.vouchers-list {
    white-space: nowrap;
    display: flex;
    align-items: center;
    .vouchers-item {
        position: relative;
        margin-left: 24rpx;
        width: 500rpx;
        height: 125rpx;
        background: #fffdf4;
        border: 1rpx solid #f6c17a;
        border-radius: 10rpx;
        &.empty{
            opacity: 0;
        }
        .vs-warp{
            display: flex;
            align-items: center;
            padding: 16rpx 40rpx;
            position: relative;
            z-index: 1;
        }
        .msg{
            flex: 1;
        }
        .name {
            color: #323232;
            font-size: 10px;
            span{
                font-size: 20px;
            }
        }
        .overlay{
            font-size: 10px;
            margin-top: 10rpx;
            color: #818181;
        }
        .price {
            flex-shrink: 0;
            margin: 0 40rpx;
            font-weight: 700;
            .new {
                color: #ff2a18;
                font-size: 15px;
                margin-left: -2px;
                &::before{
                    content: '￥';
                    font-size: 10px;
                }
            }
        }
        .handle {
            flex-shrink: 0;
        }
    }
}

</style>

