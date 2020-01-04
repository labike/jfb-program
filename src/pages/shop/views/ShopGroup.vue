<!--
 * @Author: zhangHang
 * @Date: 2019-05-16 16:04:59
 * @Description: file content
 -->
<template>
<div class="product-warp">
    <scroll-view scroll-x="true" class="product-inner"  v-if="groupList.length">
        <ul class="products">
            <li v-for="(pro,pin) of groupList" :key="pin" 
                class="product"
            >   
                <div class="faddish" @click="jumpPages('faddish',pro.id)">
                    <div class="pimg">
                        <ImageView :src="pro.imgUrl"  mode='aspectFill'  width='232rpx' height='232rpx'></ImageView>
                        <div class="icon">爆款推荐</div>
                    </div>
                    <div class="pname">{{pro.name}}</div>
                    <div class="old-price">{{pro.old_price}}</div>
                    <div class="new-price">{{pro.price}}</div>
                    <div class="handle">GO</div>
                </div>
            </li>
        </ul>
    </scroll-view>
</div>
</template>

<script>
import ImageView from '@c/layouts/ImageView.vue'
import { getDistance } from '@/utils/index';
import { mapState } from 'vuex';

export default {
    name: 'ShopGroup',
    components: {
        ImageView,
    },
    data() {
        return {
            shop_id: 0
        }
    },
    props: {
        groupList: Array
    },
    onLoad(options) {        
        this.shop_id = options.shop_id;
        console.log(this.groupList);
        
    },
    methods: {
        jumpPages(type, id) {
            const that = this
            that.$router.push({
                path: `/pages/shop/${type}/main?shop_id=${that.shop_id}&gid=${id}`
            })
        },
        jumpItemPage(item) {
            this.$router.push({
                path: `/pages/orders/confirm/main?shop_id=${item.x_id}&title=timesale&item_id=${item.gid}`
            })
        },
        stopActivity() {
            this.Activity = true
        },
    },
};
</script>


<style lang="scss" scoped>
.product-warp{
    padding: 24rpx;
}
.product-inner{
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
    z-index: 1;
}
.products{
    white-space: nowrap;
    display: flex;
    align-items: center;
}
.product{
    margin-right: 20rpx;
    background: #f8fcff;
    border-radius: 10rpx;
    overflow: hidden;
    flex-shrink: 0;
    position: relative;
    line-height: 1;
    .pimg{
        width: 232rpx;
        height: 232rpx;
        background: #f2f2f2;
        overflow: hidden;
        margin: 0 auto;
        position: relative;
        .icon{
            background: #ff583f;
            width: 130rpx;
            height: 36rpx;
            line-height: 36rpx;
            text-align: center;
            font-weight: 400;
            color: #fff;
            position: absolute;
            left: 0;
            bottom: 0;
            border-radius: 10rpx 0 10rpx 0
        }
    }
    .pname{
        flex-shrink: 0;
        font-size: 12px;
        line-height: 1;
        color: #000;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        margin: 10rpx;
    }
    .old-price{
        margin: 0 10rpx;
        font-size: 12px;
        color: #c0c0c0;
        font-weight: 400;
        text-decoration:line-through;
        &::before{
            content: '￥';
        }
    }
    .new-price{
        margin: 10rpx;
        font-size: 16px;
        font-weight: 700;
        color: #ff583f;
        &::before{
            content: '￥';
        }
    }
    .handle {
        position: absolute;
        right: 10rpx;
        bottom: 20rpx;
        background: #00aaff;
        color: #fff;
        font-size: 12px;
        text-align: center;
        width: 56rpx;
        height: 28rpx;
        line-height: 28rpx;
        border-radius: 28rpx;
    }
}
</style>

