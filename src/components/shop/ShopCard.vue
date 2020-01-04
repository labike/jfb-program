<!--
 * @Author: zhangHang
 * @Date: 2019-06-01 11:25:13
 * @Description: file content
 -->
<template>
<div class="shop-card" v-if="shop && shop.s_id" @click="jumpShop(shop.s_id)" >
    <div class="card">
        <div class="lt-img">
            <ImageView :src="shop.headerImg[0].img_url" mode="scaleToFill" width='160rpx' height='160rpx'></ImageView>
        </div>
        <div class="rt-content">
            <i class="icon">进店</i>
            <div class="title">{{shop.store_name}}</div>
            <div class="info">
                <ul class="score" :class="scoreName">
                    <li class="star"></li>
                    <li class="star"></li>
                    <li class="star"></li>
                    <li class="star"></li>
                    <li class="star"></li>
                    <li class="text">{{score}}分</li>
                </ul>
                <!-- <p class="hits">人气:400</p> -->
                <p class="hits">{{shop.sort_name}}</p>
                <p class="distance" v-if="shop.distance">{{shop.distance}}</p>
            </div>
            <div class="notice">{{shop.address}}</div>
        </div>
        <div class="record">持“共享增值卡”消费买单可以抵折扣{{vipPayPro}}%消费金额</div>
        <div class="address">地址: {{shop.address}}</div>
        <div class="icon-group">
            <div class="location" @click.stop="openTxMap"></div>
            <div class="tel" @click.stop="getCallPhone"></div>
        </div>
    </div>
</div>
</template>

<script>
import ImageView from '@c/layouts/ImageView.vue'
import { apiShareStore } from "@/api/api";
import { callPhone } from '@/utils/index';
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
        vipPayPro() {
            let rechrage = parseInt(this.shop.rechrage)
            if (rechrage === 100) {
                rechrage = 0;
            }
            return rechrage;
        },
        score() {
            let score = parseFloat(this.shop.score)
            if (score === 0) {
                return 0;
            }
            return score.toFixed(1);
        },
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
        discount() {
            if (!this.shop.proData) {
                return null
            } 
            let discount = this.shop.proData.find(item => {
                return item.type === 'check'
            });
            const check = discount ? discount.name.match(/^\d*(\.?\d{0,1})/g)[0] : null
            return check 
        },
    },
    components: {
        ImageView
    },
    methods: {
        
        jumpShop(id) {
            this.$router.push({
                path: '/pages/shop/index/main?shop_id=' + id
            })
        },
        tapShare(type) {
            const that = this
            apiShareStore(that.shop.s_id).then(result => {
                result.type = type
                that.$emit('share', result)
            })
        },
        
        getCallPhone() {
            let phone = this.shopInfo.mobile
            callPhone(phone)
        },
        openTxMap() {
            let that = this;
            let plugin = requirePlugin('routePlan');
            let key = 'NW5BZ-Y2WKG-3T6QC-ISBMF-MTDQF-63BGJ'; //使用在腾讯位置服务申请的key
            let referer = '减付宝'; //调用插件的app的名称
            let endPoint = JSON.stringify({ //终点
                'name': that.shopInfo.store_name,
                'latitude': that.shopInfo.lat,
                'longitude': that.shopInfo.lng
            });
            that.$router.push({
                path: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
            })
        }
    },
};
</script>


<style lang="scss" scoped>
@import "~@/assets/styles/common/mixins.scss";
.shop-card{
    margin: 24rpx;
    box-shadow: 1px 1px 10px #ebebeb;
}
.card{
    background: #fff;
    margin-bottom: 14rpx;
    border-radius: 10rpx;
    padding: 30rpx 24rpx;
    position: relative;
    font-weight: 700;
    .score{
        display: flex;
        align-items: center;
        .text{
            color:#818181;
            margin-left: 10rpx;
            font-size: 11px;
            line-height: 24rpx;
        }
        .star{
            width: 24rpx;
            height: 24rpx;
            margin-right: 2rpx;
            display: inline-block;
            vertical-align: bottom;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/star3.png');
            position: relative;
            top: -2rpx;
        }
        &1 .star:nth-child(1),
        &2 .star:nth-child(-n + 2),
        &3 .star:nth-child(-n + 3),
        &4 .star:nth-child(-n + 4),
        &5 .star:nth-child(-n + 5) {
            background-image: url('~@/assets/img/starSelect3.png');
        }
        &1.dot .star:nth-child(2),
        &2.dot .star:nth-child(3),
        &3.dot .star:nth-child(4),
        &4.dot .star:nth-child(5) {
            &::after{
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                width: 50%;
                height: 100%;
                vertical-align: bottom;
            background-size: contain;
                background-position: 0 0;
                background-repeat: no-repeat;
                background-image: url('~@/assets/img/starSelect3.png');
            }
            
        }
    }
    
    .lt-img{
        width: 160rpx;
        height: 160rpx;
        overflow: hidden;
        border-radius: 10rpx;
        float: left;
        position: relative;
        img{
            width: 160rpx;
            height: 160rpx;
        }
    
    }
    .rt-content{
        margin-left: 184rpx;
        min-height: 160rpx;
        color: #818181;
        .title{
            color: #000;
            display: block;
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 15rpx;
            margin-right: 150rpx;
            @include textOverflow;
        }
        .icon{
            font-size: 12px;
            background: linear-gradient(to right,#f11b1b, #f25313);
            width: 100rpx;
            height: 40rpx;
            line-height: 40rpx;
            text-align: center;
            font-weight: 400;
            color: #fff;
            position: absolute;
            right: 40rpx;
            top: 30rpx;
            border-radius: 10rpx;
        }

        .info{
            position: relative;
            display: flex;
            align-items: center;
            line-height: 1;
            font-size: 11px;
            line-height: 24rpx;
            margin-bottom: 20rpx;
            p{
                border-left: 2rpx solid #818181;
                padding-left: 8rpx;
                margin-left: 8rpx;

            }
        }
        .notice{
            font-size: 12px;
            @include textOverflow;
        }
        
    }
    
    .record{
        background: #f7f9f8;
        height: 50rpx;
        line-height: 50rpx;
        color: #fe413c;
        overflow: hidden;
        border-radius: 10rpx;
        @include textOverflow;
        text-align: center;
        margin-top: 18rpx;

    }
    .address{
        line-height: 50rpx;
        color: #818181;
        margin-top: 18rpx;
        padding-left: 10rpx;
        margin-right: 140rpx;
        @include textOverflow;
    }
    .icon-group{
        position: absolute;
        right: 24rpx;
        bottom: 30rpx;
        width: 130rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &::before{
            content: '';
            position: absolute;
            height: 80%;
            top: 10%;
            left: 50%;
            width: 1px;
            background: #eee;
        }
        div{
           width: 50rpx;
           height: 50rpx;
           border-radius: 50%;
           background-color: #f7f9f8;
           background-size: auto 30rpx;
           background-position: center;
           background-repeat: no-repeat;
        }
        .location{
            background-image: url('~@/assets/img/location2.png');
        }
        .tel{
            background-image: url('~@/assets/img/tel2.png');
        }
    }
    
}
</style>

