<!--
 * @Author: zhangHang
 * @Date: 2019-06-01 11:25:13
 * @Description: file content
 -->
<template>
<div class="shop-card" v-if="shop && shop.s_id" @click="jumpShop(shop.s_id)" >
    <div class="card other" v-if="shop.type=='other'">
        <div class="lt-img">
            <i class="icon" v-if="shop.share">返佣好店</i>
            <ImageView :src="shop.headerImg[0].img_url" mode="scaleToFill" width='270rpx' height='270rpx'></ImageView>
        </div>
        <div class="rt-content">
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
                <div class="distance" v-if="shop.distance">{{shop.distance}}</div>
            </div>

            <div class="info2">
                <p class="sort">{{shop.sort_name}}</p>
                <p class="address">{{shop.address}}</p>
            </div>
            
            <ul class="business">
                <li v-if="shop.group">团购</li>
                <li v-if="shop.vouchers">优惠券</li>
                <li v-if="shop.dish">购物车</li>
                <li v-if="shop.share">分享</li>
            </ul>
            <div class="btn-group" v-if="shop.share">
            
                <div class="btn join" @click.stop="tapShare('join')">成为合伙人</div>
                <div class="btn earn" @click.stop="tapShare('earn')">去赚钱</div>
            </div>
            <div class="record" v-else-if="shop.msgData">
                <rollnotice autoplay="2000" :rollData='shop.msgData'>
                </rollnotice>
            </div>
        </div>
        <div class="bt-hot" v-if="vouchers || groupon">
            <div class="groupon" v-if="groupon">{{groupon}}</div>
            <div class="vouchers" v-if="vouchers">{{vouchers}}</div>
        </div>
    </div>
    <div class="card hotel" v-if="shop.type=='hotel'">
        <div class="hl-img">
            <ImageView :src="shop.headerImg[0].img_url" ></ImageView>
        </div>
        <div class="hl-content">
            <div class="title">
                <div class="name">{{shop.store_name}}</div>
            </div>
            <div class="handle">
                <button open-type="share" class="share" :data-share="shop" @click.stop="tapShare">
                    <div class="icon"></div>
                    <div class="num">{{shop.share_num}}</div>
                </button>
            </div>
            <div class="score">
                <span class="num">{{shop.score}}</span>分
            </div>
            <div class="address">{{shop.address}}</div>
        </div>
    </div>
</div>
</template>

<script>
import Rollnotice from "@c/rollnotice/Rollnotice.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { apiShareStore } from "@/api/api";
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
        vouchers() {
            if (this.shop.proData) {
                let vouchers = this.shop.proData.find(item => {
                    return item.type === 'vouchers'
                })
                return vouchers ? vouchers.name : null
            }
            return null 
        },
        groupon() {
            if (this.shop.proData) {
                let groupon = this.shop.proData.find(item => {
                    return item.type === 'group'
                })
                return groupon ? groupon.name : null
            }
            return null
        }
    },
    components: {
        Rollnotice,
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
        tapEarn() {
            
        }
    },
};
</script>


<style lang="scss" scoped>
@import "~@/assets/styles/common/mixins.scss";
.card{
    background: #fff;
    margin-bottom: 14rpx;
    border-radius: 10rpx;
    padding: 30rpx 24rpx;
    position: relative;
    .title{
        display: flex;
        margin-bottom: 14rpx;
        justify-items: center;
        align-items: center;
        .name{
            font-size: 17px;
            font-weight: 400;
            margin-right: 10rpx;
        }
    }
    .score{
        display: flex;
        align-items: center;
        .text{
            color:#818181;
            margin-left: 10rpx;
            font-size: 12px;
            line-height: 32rpx;
        }
        .star{
            width: 32rpx;
            height: 32rpx;
            margin-right: 5rpx;
            display: inline-block;
            vertical-align: bottom;
            background-size: 32rpx;
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
                background-size: 32rpx;
                background-position: 0 0;
                background-repeat: no-repeat;
                background-image: url('~@/assets/img/starSelect3.png');
            }
            
        }
    }
}
.other{
    background: #fff;
    position: relative;
    .lt-img{
        width: 270rpx;
        height: 270rpx;
        overflow: hidden;
        border-radius: 10rpx;
        float: left;
        position: relative;
        img{
            width: 270rpx;
            height: 270rpx;
        }
        .icon{
            font-size: 10px;
            background: #000;
            width: 100rpx;
            height: 36rpx;
            line-height: 36rpx;
            text-align: center;
            font-weight: 400;
            color: #ffc263;
            position: absolute;
            left: 0;
            top: 0;
            border-radius: 10rpx 0 10rpx 0;
        }
    }
    .rt-content{
        margin-left: 294rpx;
        min-height: 270rpx;
        .distance{
            position :absolute;
            right: 0;
            top: 0;
            line-height: 32rpx;
            color:#818181;
            font-size: 12px;
        }
        .business{
            margin-bottom: 20rpx;
            display: flex;
            li{
                font-size: 11px;
                background: #f7f7f7;
                color: #818181;
                text-align: center;
                height: 40rpx;
                line-height: 40rpx;
                padding: 0 12rpx;
                &:not(:last-child){
                    margin-right: 10rpx;
                }
            }
        }
        .info{
            position: relative;
            margin-bottom: 15rpx;
        }
        .info2{
            display: flex;
            align-items: center;
            line-height: 1;
            color: #818181;
            font-size: 12px;
            margin-bottom: 20rpx;
            p:not(:last-child){
                border-right: 2rpx solid #e8e8e8;
            }
            .sort{
                flex-shrink: 0;
                padding-right: 10rpx;
            }
            .address{
                padding-left: 10rpx;
                @include textOverflow;
            }
        }
        
        
    }
    
    .record{
        background: rgba(255, 88, 63, .1);
        height: 60rpx;
        line-height: 60rpx;
        text-align: right;
        color: #ff583f;
        overflow: hidden;
        border-radius: 10rpx;
        @include textOverflow;
    }
    .btn-group{
        display: flex;
        align-items: center;
        .btn{
            width: 170rpx;
            height: 60rpx;
            line-height: 60rpx;
            text-align: center;
            border-radius: 10rpx;
            color: #fff;
            font-weight: 400;
            font-size: 13px;
            &:not(:last-child){
                margin-right: 30rpx;
            }
        }
        .join{
            background: linear-gradient(to right,#00aaff, #0086ff);
        }
        .earn{
            background: linear-gradient(to right,#ff6000, #ff2f10);
        }
    }
    .bt-hot{
        clear: both;
        margin-top: 30rpx;
        border-top: 1px dashed #d2d2d2;
        line-height: 36rpx;
        color: #818181;
    }
    .title{
        display: block;
        font-size: 17px;
        font-weight: 400;
        margin-bottom: 15rpx;
        margin-right: 10rpx;
        @include textOverflow;
    }
    
    .vouchers{
        font-size: 24rpx;
        margin-top: 20rpx;
        @include textOverflow;
        &::before{
            content:  '';
            width: 34rpx;
            height: 34rpx;
            font-size: 0;
            flex-shrink: 0;
            margin-right: 20rpx;
            display: inline-block;
            vertical-align: bottom;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/first_code.png');
        }
    }
    .groupon{
        font-size: 24rpx;
        margin-top: 20rpx;
        @include textOverflow;
        &::before{
            content:  '';
            width: 34rpx;
            height: 34rpx;
            font-size: 0;
            flex-shrink: 0;
            margin-right: 15rpx;
            display: inline-block;
            vertical-align: bottom;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/first_group.png');
        }
    }
}
.hotel{
    display: flex;
    .hl-img{
        width: 193rpx;
        height: 193rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
        img{
            width: 193rpx;
            height: 193rpx;
        }
    }
    .hl-content{
        flex: 1;
        .score{
            color: #2a8cfa;
            font-size: 24rpx;
            margin-bottom: 24rpx;
            font-weight: 400;
            .num{
                font-size: 30rpx;
                margin-right: 10rpx;
                font-weight: 700;
            }
        }
    }
}
</style>

