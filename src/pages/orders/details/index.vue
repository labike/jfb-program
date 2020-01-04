<!--
 * @Author: zhangHang
 * @Date: 2019-06-17 14:08:16
 * @Description: file content
 -->
<template>
<div class="container" v-if="detailed">

    <!-- 店铺（买单） -->
    <div class="model slf shop"  v-if="detailed.type==orderType.vippay || detailed.type==orderType.paying || detailed.type==orderType.goods" @click="jumpPage('shop',detailed.baseInfo.x_id)">
        <div class="img-warp">
            <img :src="detailed.baseInfo.header_img" alt="">
        </div>
        <div class="info-warp">
            <div class="title">{{detailed.baseInfo.store_name}}</div>
            <ul class="score" :class="scoreName">
                <li class="star"></li>
                <li class="star"></li>
                <li class="star"></li>
                <li class="star"></li>
                <li class="star"></li>
                <li class="text">{{detailed.baseInfo.score}}分</li>
            </ul>
            <div class="address">{{detailed.baseInfo.address}}</div>
        </div>
    </div>

    <!-- 商品信息 -->
    <div class="model slf blurb" v-else  @click="jumpPage(modelClass,detailed.projects[0].product_id)">
        <div class="img-warp">
            <img :src="detailed.baseInfo.header_img" alt="">
        </div>
        <div class="info-warp">
            <div class="title">{{detailed.projects[0].product_name}}</div>
            <div class="refund" v-if="detailed.type==orderType.timesale">不可退</div>
            <div class="refund" v-else>随时退</div>
            <div class="price">{{detailed.projects[0].amount}}</div>
        </div>
    </div>

    <!-- 券码,买单/购物车详情 -->
    <div class="model"  :class="modelClass" >

        <div class="model-title"  v-if="detailed.type==orderType.vouchers ||detailed.type==orderType.combo ||detailed.type==orderType.timesale">
            <i class="icon"></i>{{detailed.baseInfo.title}}
                <div class="title">
                <span>{{detailed.projects[0].num}}张</span>
                <span>有效期：{{detailed.projects[0].pd_info.rulesData.periodOfValidity}}</span>
            </div>
        </div>
        <div class="model-title"  v-else >
            <i class="icon"></i>{{detailed.baseInfo.title}}
        </div>

        <!-- 买单 -->
        <div class="model-content" v-if="detailed.type==orderType.vippay || detailed.type==orderType.paying">
            <ul class="cell lrbj">
                <li>
                    <span class="left">消费金额</span>
                    <span class="right">￥{{detailed.baseInfo.total_amount}}</span>
                </li>
                <li v-if="Number(detailed.baseInfo.discount_amount) != 0">
                    <span class="left"  v-if="detailed.type==orderType.paying">商家优惠</span>
                    <span class="left"  v-if="detailed.type==orderType.vippay">共享增值卡支付</span>
                    <span class="right">￥{{detailed.baseInfo.discount_amount}}</span>
                </li>
                <li>
                    <span class="left"  v-if="detailed.type==orderType.paying">支付金额</span>
                    <span class="left"  v-if="detailed.type==orderType.vippay">移动支付支付</span>
                    <span class="right">￥{{detailed.baseInfo.pay_amount}}</span>
                </li>
            </ul>
        </div>


        <!-- 购物车 -->
        <div class="model-content" v-if="detailed.type== orderType.goods">
            <ul class="cell">
                <li v-for="(goods,index) in detailed.projects" :key="index" >
                    <span class="left">{{goods.product_name}}</span>
                    <span class="middle">￥{{goods.amount}}</span>
                    <span class="right">x{{goods.num}}</span>
                </li>
            </ul>
        </div>

        <!-- 券码 -->
        <div class="model-content" v-if="detailed.baseInfo.is_pay_success==1">
            <ul class="cell" v-if="detailed.type==orderType.vouchers || detailed.type==orderType.combo || detailed.type==orderType.timesale">
                <li v-for="(codes,index) in detailed.projects[0].consume_codes" :key="index"
                    :class="{del: codes.is_use == 1}"
                >
                     <div class="consum" v-if="codes.status == 1" :class="{del: codes.is_use == 1}">
                        <span class="left">券码：{{codes.consum_code}}</span>
                        <span class="right" v-if="codes.is_use == 1" >已消费</span>
                        <span class="right" v-if="codes.is_use == 2" @click="jumpQrcode(order_id)">可使用</span>
                    </div>
                    <div class="consum refund del"  v-if="codes.status == -1">
                        <span class="left">券码：{{codes.consum_code}}</span>
                        <span class="right" v-if="codes.is_use == 1" >已消费</span>
                        <span class="right " v-if="codes.is_use == 2" >已退款</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    

    <!-- 商家信息 -->
    <div class="model shopinfo"  v-if="detailed.type==orderType.vouchers || detailed.type==orderType.combo ||detailed.type==orderType.timesale" @click="jumpPage('shop',detailed.baseInfo.x_id)">
        <div class="model-title">
            <i class="icon"></i>商家信息
        </div>
        <div class="model-content">
            <div class="info">
                <div class="title">{{detailed.baseInfo.store_name}}</div>
                <div class="address">{{detailed.baseInfo.address}}</div>
            </div>
            <div class="tel"  @click.stop="getCallPhone(detailed.baseInfo.store_mobile)"></div>
        </div>
    </div>


    <!-- 使用规则 -->
    <div class="model use-rule"  v-if="detailed.type==orderType.vouchers || detailed.type==orderType.combo ||detailed.type==orderType.timesale">
        <div class="model-title">
            <i class="icon"></i>使用规则
        </div>
        <div class="model-content"
            v-for="(rules, index) in detailed.projects"
            :key="index"
            >
            <ul class="cell time">
                <li v-if="rules.pd_info.rulesData.UnavailableDate || rules.pd_info.rulesData.UnavailableWeek">
                    <div class="left">不可用日期 : </div>
                    <div class="right">
                        <span v-if="rules.pd_info.rulesData.UnavailableDate">{{rules.pd_info.rulesData.UnavailableDate }}</span>
                        <span v-if="rules.pd_info.rulesData.UnavailableDate && rules.pd_info.rulesData.UnavailableWeek">、</span>
                        <span v-if="rules.pd_info.rulesData.UnavailableWeek">{{rules.pd_info.rulesData.UnavailableWeek }}</span>
                    </div>
                </li>
                <li>
                    <div class="left">使 用 时 间 : </div>
                    <div class="right">
                        {{rules.pd_info.rulesData.availableTime || "24小时可用"}}
                    </div>
                </li>
            </ul>
            <ul class="rule">
                <li v-if="rules.pd_info.rulesData.bespeak">{{rules.pd_info.rulesData.bespeak}}</li>
                <li v-if="rules.pd_info.rulesData.currency">{{rules.pd_info.rulesData.currency}}</li>
                <li v-if="rules.pd_info.rulesData.overlying">{{rules.pd_info.rulesData.overlying}}</li>
                <li v-if="rules.pd_info.rulesData.invoice">{{rules.pd_info.rulesData.invoice}}</li>
                <li v-if="rules.pd_info.rulesData.is_give_change">{{rules.pd_info.rulesData.is_give_change}}</li>
            </ul>
        </div>
    </div>

    <!-- 订单信息 -->
    <div class="model order">
        <div class="model-title">
            <i class="icon"></i>订单信息
        </div>
        <div class="model-content">
            <ul class="cell">
                <li>
                    <span class="left">订&nbsp;&nbsp;单&nbsp;&nbsp;号：</span>
                    <span class="right">{{detailed.baseInfo.order_id}}</span>
                </li>
                <li  v-if="detailed.baseInfo.is_pay_success==1">
                    <span class="left">付款时间：</span>
                    <span class="right">{{payTime}}</span>
                </li>
                <li>
                    <span class="left">总&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价：</span>
                    <span class="right">￥{{detailed.baseInfo.total_amount}}</span>
                </li>
                <li>
                    <span class="left">优&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;惠：</span>
                    <span class="right">￥{{detailed.baseInfo.discount_amount}}</span>
                </li>
                <li v-if="detailed.baseInfo.is_pay_success == 1">
                    <span class="left">实&nbsp;&nbsp;付&nbsp;&nbsp;款：</span>
                    <span class="right">￥{{detailed.baseInfo.pay_amount}}</span>
                </li>
                <li v-if="detailed.baseInfo.is_pay_success == 0">
                    <span class="left">待&nbsp;&nbsp;付&nbsp;&nbsp;款：</span>
                    <span class="right">￥{{detailed.baseInfo.pay_amount}}</span>
                </li>
                <li v-if="detailed.baseInfo.is_refund == 2">
                    <span class="left">退款金额：</span>
                    <span class="right">￥{{detailed.baseInfo.refund_amount}}</span>
                </li>
            </ul>
        </div>
    </div>
</div>
</template>

<script>
import { formatTime,callPhone } from '@/utils/index'
import { orderType } from "@/config/base";
import { apiOrderDetails } from "@/api/api.js";
export default {
    data() {
        return {
            orderType,
            order_id: null,
            detailed: null,
        }
    },
    onLoad (options) {
        this.order_id = options.order_id;
        this.getOrderDetails()
    },
    computed: {
        scoreName() {
            let scoreName = ''
            if (this.detailed && this.detailed.baseInfo.score) {
                scoreName = 'score' + this.detailed.baseInfo.score
                const scoreDot = scoreName.indexOf('.')
                if (scoreDot > -1) {
                    scoreName = scoreName.slice(0,scoreDot)
                    if (Math.round(this.detailed.baseInfo.score) > Math.floor(this.detailed.baseInfo.score)) {
                        scoreName = scoreName + ' dot'
                    }
                }
            }
            return scoreName;
        },
        modelClass() {
            let newClass = ''
            if (this.detailed && this.detailed.type) {
                for (const key in orderType) {
                    if (orderType[key] === this.detailed.type) {
                        newClass = key
                    }
                } 
            }
            return newClass
        },
        payTime() {
            if (this.detailed && this.detailed.baseInfo.pay_time) {
                const date = this.detailed.baseInfo.pay_time
                return formatTime(date)
            }
            return null
        },
    },
    methods: {
        
        jumpPage(type,id) {
            console.log(type);
            let shop_id = this.detailed.baseInfo.x_id
            let pageUrl = ''
            switch (type) {
            case 'shop':
                pageUrl = '/pages/shop/index/main?shop_id=' + id
                break;

            case 'timesale':
                pageUrl = '/pages/shop/saletime/main?gid=' + id
                break;
            
            default:
                pageUrl = `/pages/shop/item/main?shop_id=${shop_id}&title=${type}&item_id=${id}`
                break;
            }
            if (pageUrl) {
                this.$router.push({
                    path: pageUrl
                })
            }
            
            
        },
        jumpQrcode(order_id) {
            this.$router.push({
                path: `/pages/orders/qrcode/main?order_id=${order_id}`
            })
        },
        getOrderDetails() {
            apiOrderDetails(this.order_id).then(res => {
                this.detailed = res           
            })
        },
        
        getCallPhone(phone) {
            callPhone(phone)
        },
    }
}
</script>

<style lang="scss" scoped>
.container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20rpx 24rpx;
    overflow-x: hidden;
    overflow-y: auto;
}
.slf{
    display: flex;
    align-items: center;
    .img-warp{
        width: 100rpx;
        height: 100rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
        img{
            width: 100rpx;
            height: 100rpx;
        }
    }
    .info-warp{
        flex: 1;
        margin-right: 5rpx;
    }
}
.blurb,
.shop{
    font-size: 26rpx;
    &::after{
        content: '';
        width: 16rpx;
        height: 28rpx;
        background-image: url(~@/assets/img/right.png);
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }
    .title{
        color: #000;
        margin-bottom: 8rpx;
    }
    .refund{
        font-size: 22rpx;
        color: #818181;
        margin-bottom: 8rpx;
    }
    .price{
        color: #323232;
        &::before{
            content: '￥';
            font-size: 24rpx;
            margin-right: -4rpx;
        }
    }
    .address{
        font-size: 22rpx;
        color: #818181;
    }
    .score{
        display: flex;
        align-items: center;
        margin-bottom: 7rpx;
        .text{
            color:#f50;
            margin-left: 10rpx;
            font-size: 24rpx;
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
}
.shopinfo{
    position: relative;
    z-index: 1;
    &::after{
        content: '';
        position: absolute;
        right: 24rpx;
        top: 50rpx;
        z-index: 10;
        width: 16rpx;
        height: 28rpx;
        background-image: url(~@/assets/img/icon_click_right_list.png);
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }
    .title{
        color: #000;
        margin-bottom: 8rpx;
    }
    .address{
        font-size: 22rpx;
        color: #818181;
    }
    .model-content{
        display: flex;
        padding-top: 24rpx;
        .info{
            flex: 1;
        }
        .tel{
            display: block;
            width: 100rpx;
            height: 18px;
            background-image: url('~@/assets/img/tel1.png');
            background-repeat: no-repeat;
            background-size: auto 18px;
            background-position: center;
            margin: auto;
        }
    }
}
.model{
    background: #fff;
    padding: 24rpx;
    margin-bottom: 24rpx;
    .model-title{
        border-bottom: 1px dashed #f0f0f0;
        line-height: 80rpx;
        font-size: 14px;
        color: #323232;
        font-weight: 400;
        .title{
            display: flex;
            line-height: 1;
            font-size: 12px;
            font-weight: 400;
            color: #818181;
            align-items: center;
            margin-left: .45rem;
            margin-bottom: 20rpx;
        }
    }
    .cell{
        padding-top: 20rpx;
        li{
            line-height: 1;
            padding: 15rpx 15rpx 15rpx 30rpx;
            &::before{
                display: none;
            }
        }
        .consum{
            width: 100%;
            position: relative;
            display: flex;
            overflow: hidden;
            font-size: 13px;
            &.del{
                color: #c0c0c0;
                .left{
                    text-decoration: line-through;
                }
            }
            .left{
                flex-shrink: 0;
            }
            .right{
                text-align: right;
                flex: 1;
            }
        }
        &.lrbj {
            li{
                justify-content: space-between;
            }
        }
    }
    .icon{
        display: inline-block;
        width: 15px;
        height: 15px;
        background-image: url(~@/assets/img/vouchers_1.png);
        background-size: contain;
        background-position: 0 0;
        background-repeat: no-repeat;
        vertical-align: middle;
        margin-right: 20rpx;
        position: relative;
        top: -2px;
    }
    &.paying,
    &.vippay{
        .icon{
            background-image: url(~@/assets/img/paying_1.png);
        }
    }
    &.shopinfo{
        .icon{
            background-image: url(~@/assets/img/stores2.png);
        }
    }
    &.vouchers{
        .icon{
            background-image: url(~@/assets/img/vouchers_1.png);
        }
    }
    &.combo{
        .icon{
            background-image: url(~@/assets/img/vouchers_1.png);
        }
    }
    &.goods{
        .icon{
            background-image: url(~@/assets/img/cart_1.png);
        }
        .cell {
            .left{
                flex: 1;
                text-align: left;
            }
            .right{
                margin-left: 20rpx;
                flex: 0;
            }
            .middle{
                flex: 0;
            }
        }
    }
    &.order{
        .icon{
            background-image: url(~@/assets/img/order.png);
        }
    }
    &.use-rule{
        .icon{
            background-image: url(~@/assets/img/rule.png);
        }
        .time {
            padding-bottom: 20rpx;
            border-bottom: 1px dashed #f0f0f0;
            .left {
            min-width: 1.65rem;
            padding-right: 20rpx;
            }
            .right{
                text-align: left;
                span ~ span{
                    display: flex;
                    align-items: center;
                    margin-left: .3rem;
                    &::before {
                        content: ' ';
                        display: inline-block;
                        height: 12px;
                        width: 1px;
                        background: #818181;
                        margin-right: .3rem;
                    }
                }
            }
        }
        .rule{
            font-size: 12px;
            padding-top: 20rpx;
            li{
                padding-left: .45rem;
                margin-bottom: .1rem;
                line-height: 1.6;
                display: flex;
                color: #323232;
                &::before{
                    content: '';
                    flex-shrink: 0;
                    margin-right: 16rpx;
                    margin-top: 14rpx;
                    width: 10rpx;
                    height: 10rpx;
                    background: #323232;
                    border-radius: 50%;
                }
            }
        }
    }
    
}
        
</style>
