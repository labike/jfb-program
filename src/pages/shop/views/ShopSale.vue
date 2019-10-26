<!--
 * @Author: zhangHang
 * @Date: 2019-05-16 16:04:59
 * @Description: file content
 -->
<template>
<div class="activity-card" v-if="infoData && infoData.x_id" @click="jumpPage(infoData)">
    <div class="activity"   :class="{gray: Activity}">
        <div class="top">
            <div class="shade">
                <div class="round">
                    <div class="img-warp">
                        <ImageView :src="infoData.img" mode='scaleToFill' height="374rpx" width="702rpx"></ImageView>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="product">
                <div class="name">
                    <div class="icon"></div>
                    <p>价值{{infoData.buyer}}元{{infoData.pro_name}}
                        <span>{{infoData.number}}{{infoData.unit}}</span>
                    </p>
                </div>
                <div class="disc">最低消费{{infoData.min_consume}}免费送</div>
                <div class="price">{{infoData.sale_price}}</div>
            </div>
            <div class="handle">
                <div class="go gray" v-if="infoData.sale>=infoData.library">已售罄</div>
                <div class="go" v-else @click.stop='jumpItemPage(infoData)'>马上抢</div>
                <div class="library-warp">
                    <p class="sale">已售{{infoData.sale}} </p>
                    <div class="library">
                        <div class="progress" :style="{width:(infoData.sale/infoData.library*100)+ '%'}"></div>
                    </div>
                </div>
                
            </div>
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
    onLoad() {
        // console.log(this.infoData.sale = 10);
        
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
.activity-card{
    padding: 30rpx 24rpx;
    font-family: '.PingFang-SC-Medium';
    background: #fff;
    margin-top: 20rpx;
}
.activity{
    border-radius: 15rpx;
    overflow: hidden;
    box-shadow: 1px 1px 10px #ececec;
    &.gray{
        -webkit-filter: grayscale(100%)
    }
    .top{
        position: relative;
        z-index: 1;
    }
    .shade{
        height: 226rpx;
        position: relative;
        .round{
            position: absolute;
            z-index: 9;
            bottom: 0;
            left: -20%;
            background: #fff;
            width: 140%;
            height: 400rpx;
            border-radius: 0 0 50% 50%;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: flex-end;
        }
    }
    .time{
        position: absolute;
        right: 24rpx;
        top: 20rpx;
        z-index: 10;
    }
    
    .linetime{
        font-size: 12px;
        background-size: auto 100rpx;
        background-position: left center;
        background-repeat: no-repeat;
        background-image: url('~@/assets/img/linetime.png');
        padding: 0 24rpx 0 30rpx;
        position: relative;
        &::after{
            content: '';
            position:absolute;
            right: 0;
            top: 0;
            left: 50rpx;
            height: 100%;
            z-index: 1;
            background: #ff5100;
        }
        .time{
            position: relative;
            z-index: 4;
        }
    }
    .bottom{
        padding: 24rpx;
        display: flex;
        line-height: 1;
        .go{
            background: #ff1800;
            color: #fff;
            font-size: 14px;
            font-weight: 700;
            height: 70rpx;
            width: 180rpx;
            line-height: 70rpx;
            border-radius: 10rpx;
            text-align: center;
            &.gray{
                -webkit-filter: grayscale(100%)
            }
        }
        .library-warp{
            font-size: 10px;
            position: relative;
            margin-top: 40rpx;
            .sale{
                position: absolute;
                right: 100%;
                bottom: 2rpx;
                text-align: right;
                z-index: 10;
                color: #818181;
                width: 100%;
                padding-right: 15rpx;
            }
        }
        .library{
            height: 16rpx;
            line-height: 16rpx;
            background: #fff;
            border: 1rpx solid #ff5100;
            overflow: hidden;
            position: relative;
            z-index: 4;
            border-radius: 16rpx;
            .progress{
                position:absolute;
                left: 0;
                top: 0;
                width: 0;
                height: 16rpx;
                z-index: 8;
                background: #ffa57b;
                border-radius: 16rpx 0 0 16rpx;
            }
        }
    }
    .product{
        flex: 1;
        .name{
            font-size: 15px;
            color: #000;
            font-weight: 700;
            margin-bottom: 20rpx;
            display: flex;
            align-items: flex-start;
            line-height: 1.3;
        }
        .icon{
            margin-right: 12rpx;
            width: 36rpx;
            height: 36rpx;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/sends.png');
            position: relative;
        }
        .disc{
            color: #818181;
            font-size: 12px;
            margin-bottom: 24rpx;
        }
        .price{
            &::before{
                content: "￥";
                font-size: 12px;
            }
            font-size: 17px;
            color: #ff5100;
            font-weight: 700;
        }
    }
}
</style>

