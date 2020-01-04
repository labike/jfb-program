<!--
 * @Author: zhangHang
 * @Date: 2019-07-04 16:34:54
 * @Description: 我的钱包 -> 收益情况
 -->
<template>
<div class="shop-card" v-if="shop && shop.id" >

    <div class="bd">
        <div class="img-warp">
            <img :src="shop.store_img" alt="">
        </div>
        <div class="info-warp">
            <div class="title">{{shop.store_name}}</div>
            <ul class="score" :class="scoreName">
                <li class="star"></li>
                <li class="star"></li>
                <li class="star"></li>
                <li class="star"></li>
                <li class="star"></li>
                <li class="text">{{shop.score}}分</li>
            </ul>
            <div class="type">{{shop.type_name}}</div>
            <div class="handle">
                <div class="btn"  @click.stop="goShare(shop)">再次分享</div>
            </div>
        </div>
    </div>
    
    <footer class="ft">
        <div class="record" v-if="record">{{record}}</div>
        <div class="scale">返佣: 
            <span class="red" >￥{{shop.reward_ammount}}</span>
        </div>
    </footer>
</div>
</template>

<script>

import { apiShareStore } from "@/api/api";
import { formatTime } from '@/utils/index'
export default {
    name: 'ShopCard',
    data() {
        return {
            shop: {}
        }
    },
    props: {
        shopInfo: Object
    },
    onLoad() {
        this.shop = this.shopInfo
    },
    computed: {
        scoreName() {
            if (!this.shop.score) {
                return ''
            }
            let scoreName = 'score' + this.shop.score
            const scoreDot = scoreName.indexOf('.')
            if (scoreDot > -1) {
                scoreName = scoreName.slice(0,scoreDot)
                if (Math.round(this.shop.score) > Math.floor(this.shop.score)) {
                    scoreName = scoreName + ' dot'
                }
            }
            return scoreName;
        },
        record() {
            const reward_time = this.shop.reward_time
            if (!reward_time) {
                return null
            }
            return formatTime(reward_time) 
        },
    },
    methods: {
        
        goShare(shop) {
            const that = this
            apiShareStore(shop.id).then(result => {
                if (result.shareInfo.sharePermit) {
                    if (result.userShareStoreNum < 50) {
                        const cardInfo = {
                            code: result.shareUrl,
                            title: result.storeInfo.store_name,
                            qrCode: result.shareQrImg,
                            imageUrl: result.storeInfo.header_img,
                            address: result.storeInfo.address,
                            mobile: result.storeInfo.store_mobile,
                        }
                        this.$emit('share', cardInfo)
                    } else {
                        mpvue.showModal({
                            content: '您分享的店铺已到达上限',
                            showCancel: false,
                            // confirmText: '好的',
                            confirmColor: '#333',
                        })
                    }
                }
            })
            
        },
    },
};
</script>


<style lang="scss" scoped>
.shop-card{
    background: #fff;
    padding: 24rpx 24rpx 0 24rpx;
    position: relative;
    border-bottom: 1rpx solid #f2f2f2;
    .handle{
        position: absolute;
        right: 24rpx;
        bottom: 24rpx;
        .btn{
            min-width: 100rpx;
            text-align: center;
            height: 40rpx;
            line-height: 40rpx;
            border-radius: 40rpx;
            padding: 0 15rpx;
            font-size: 11px;
            border: 1px solid #ff2900;
            color: #ff2900;
        }
    }
}
.ft{
    color: #000;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 24rpx;
    .record {
        word-wrap: normal;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .scale {
        flex-shrink: 0;
        .red {
            color: #ff2900;
        }
    }
}
.bd{
    background: #f2f2f2;
    padding: 24rpx;
    min-height: 120rpxs;
    position: relative;
    .img-warp{
        position: absolute;
        left: 24rpx;
        top: 24rpx;
        width: 120rpx;
        height: 120rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
        img{
            display: block;
            width: 100%;
            height: 100%;
        }
    }
    .info-warp{
        margin-left: 144rpx;
    }
    .title{
        font-size: 14px;
        font-weight: 700;
        margin-right: 70rpx;
        margin-bottom: 15rpx;
        word-wrap: normal;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .score{
        display: flex;
        align-items: center;
        margin-bottom: 15rpx;
        .text{
            color:#818181;
            margin-left: 10rpx;
            font-size: 12px;
            line-height: 1;
        }
        .star{
            width: 25rpx;
            height: 25rpx;
            display: inline-block;
            vertical-align: bottom;
            background-size: 25rpx 25rpx;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/icon_rating_bar_secondary_progress.png');
        }
        &1 .star:nth-child(1),
        &2 .star:nth-child(-n + 2),
        &3 .star:nth-child(-n + 3),
        &4 .star:nth-child(-n + 4),
        &5 .star:nth-child(-n + 5) {
            background-image: url('~@/assets/img/icon_rating_bar_progress.png');
        }
        &1.dot .star:nth-child(2),
        &2.dot .star:nth-child(3),
        &3.dot .star:nth-child(4),
        &4.dot .star:nth-child(5) {
            position: relative;
            &::after{
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                width: 50%;
                height: 100%;
                vertical-align: bottom;
                background-size: 25rpx 25rpx;
                background-position: 0 0;
                background-repeat: no-repeat;
                background-image: url('~@/assets/img/icon_rating_bar_progress.png');
            }
            
        }
    }
    .type{
        color: #818181;
        font-size: 11px;
    }
}

</style>

