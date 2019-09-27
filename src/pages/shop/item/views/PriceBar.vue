<!--
 * @Author: zhangHang
 * @Date: 2019-07-01 15:28:36
 * @Description: file content
 -->
<template>
<div class="price-bar border-top" v-if="currentItem">
    <div class="price">
        <div class="new-price">{{currentItem.price}}</div>
        <div class="old-price">门市价<span>{{currentItem.old_price}}</span></div>
    </div>
    <div class="btn" @click="jumpConfirm(currentItem.id)">立即抢购</div>
</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'PriceBar',
    computed: {
        ...mapState('shop',['currentItem']),
    },
    onLoad (options) {
        this.title = options.title
        this.shop_id = options.shop_id
    },
    methods: {
        jumpConfirm(id) {
            const that = this 
            that.$router.push({
                url: `/pages/orders/confirm/main?shop_id=${that.shop_id}&title=${that.title}&item_id=${id}`
            }) 
        }
    }
}
</script>

<style lang="scss" scoped>
.price-bar {
    height: 1rem;
    background: #fff;
    display: flex;
    .price {
        overflow: hidden;
        flex: 1;
        padding: .1rem .24rem;
        display: flex;
        align-items: center;
        .new-price {
            color: #ff5100;
            font-size: 24px;
            font-weight: 700;
            margin-right: .1rem;
            &::before {
                content: '￥';
                font-size: 12px;
            }
        }
        .old-price {
            text-decoration: line-through;
            color: #818181;
            font-size: 12px;
            span::before {
                content: '￥';
            }
        }
    }
    .btn {
        width: 2rem;
        text-align: center;
        letter-spacing: 1px;
        font-size: 14px;
        line-height: 1rem;
        background: #ff5100;
        color: #fff;
    }
}
</style>




