<!--
 * @Author: zhangHang
 * @Date: 2019-05-16 16:04:59
 * @Description: file content
 -->
<template>
<div class="activity-card" @click="jumpPage(infoData)">
    <div class="activity"   :class="{gray: Activity}">
        <div class="product">
            <div class="img-warp">
                <ImageView :src="infoData.img" mode='aspectFill'  width='220rpx' height='220rpx'></ImageView>
            </div>
            <div class="info-warp">
                <div class="name">
                    <p>价值{{infoData.buyer}}元{{infoData.pro_name}}
                        <span>{{infoData.number}}{{infoData.unit}}</span>
                    </p>
                </div>
                <div class="disc">最低消费{{infoData.min_consume}}免费送</div>
                <div class="description">{{infoData.description}}</div>
            </div>
        </div>
        <div class="handle">
            <div class="price">{{infoData.sale_price}}</div>
            <div class="go gray" v-if="sale>=library">已售罄</div>
            <div class="go" v-else @click.stop='jumpItemPage(infoData)'>预定</div>
        </div>
    </div>
</div>
</template>

<script>
import LastTime from "@c/shop/LastTime2.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { getDistance } from '@/utils/index';
import { mapState } from 'vuex';

export default {
    name: 'ActivityCard',
    components: {
        ImageView,
        LastTime
    },
    props: {
        infoData: Object
    },
    computed: {
        
        library() {
            if (this.infoData && this.infoData.library) {
                return parseFloat(this.infoData.library)
            }
            return 0
        },
        sale() {
            if (this.infoData && this.infoData.sale) {
                return parseFloat(this.infoData.sale)
            }
            return 0
        },
    },
    methods: {
        jumpPage(shop) {
            if (this.Activity) {
                return
            }
            this.$router.push({
                path: '/pages/shop/saletime/main?gid=' + shop.gid
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
.activity{
    margin: 24rpx;
    padding: 24rpx;
    border-radius: 15rpx;
    overflow: hidden;
    box-shadow: 1px 1px 10px #ececec;
    &.gray{
        filter: grayscale(100%);
        -webkit-filter: grayscale(100%);
    }
    .handle{
        position: relative;
        z-index: 0;
        display: flex;
        line-height: 1;
        justify-content: space-between;
        padding-top: 24rpx;
        margin-top: 24rpx;
        &::before{
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: 1rpx;
            background: #f2f2f2;
            box-shadow: 0rpx 0rpx 1rpx #eceaea;
        }
        .price{
            line-height: 70rpx;
            &::before{
                content: "￥";
                font-size: 12px;
            }
            font-size: 17px;
            color: #ff5100;
            // color: #ff2971;
            font-weight: 700;
        }
        .go{
            background: #ff5100;
            color: #fff;
            font-size: 14px;
            font-weight: 700;
            height: 70rpx;
            width: 160rpx;
            line-height: 70rpx;
            border-radius: 10rpx;
            text-align: center;
            letter-spacing: 10rpx;
            padding-left: 10rpx;
            background-image: linear-gradient(to right,#f16963,#f93c36); 
            &.gray{
                filter: grayscale(100%);
                -webkit-filter: grayscale(100%);
            }
        }
        
    }
    .product{
        .img-warp{
            width: 220rpx;
            height: 220rpx;
            float: left;
            overflow: hidden;
            border-radius: 10rpx;
        }
        .info-warp{
            min-height: 220rpx;
            margin-left: 244rpx;
        }
        .name{
            font-size: 15px;
            color: #000;
            font-weight: 700;
            margin-bottom: 20rpx;
            display: flex;
            align-items: flex-start;
            line-height: 1.3;
        }
        .disc{
            color: #eb3276;
            font-size: 12px;
            margin-bottom: 24rpx;
        }
        
        .description{
            font-size: 12px;
            line-height: 1.6;
            color: #818181;
            font-weight: 400;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
        }
    }
}
</style>

