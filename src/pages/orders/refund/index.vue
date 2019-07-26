<template>
<div class="container" v-if="detailed">
    <!-- 商铺信息 -->
    <div class="model shop" v-if="detailed.baseInfo"  @click="jumpShop(detailed.baseInfo.x_id)">
        <div class="img-warp">
            <img :src="detailed.baseInfo.header_img" alt="">
        </div>
        <div class="shop-warp">
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

    <!-- 订单信息 -->
    <div class="model" :class="modelClass">
        <div class="model-title"  v-if="detailed.type==orderType.vouchers ||detailed.type==orderType.combo">
            <i class="icon"></i>{{detailed.baseInfo.title}}({{detailed.projects[0].product_name}})
        </div>
        <div class="model-title"  v-else >
            <i class="icon"></i>{{detailed.baseInfo.title}}
        </div>
        <div class="model-content">
            <ul class="cell">
                <li>
                    <span class="left">订&nbsp;&nbsp;单&nbsp;&nbsp;号&nbsp;&nbsp;:</span>
                    <span class="right">{{detailed.baseInfo.order_id}}</span>
                </li>
                <li v-if="payTime">
                    <span class="left">付款时间&nbsp;&nbsp;:</span>
                    <span class="right">{{payTime}}</span>
                </li>
                <li>
                    <span class="left">实&nbsp;&nbsp;付&nbsp;&nbsp;款&nbsp;&nbsp;:</span>
                    <span class="right">￥{{detailed.baseInfo.pay_amount}}</span>
                </li>
                <li v-if="currentOrder">
                    <span class="left">可退金额&nbsp;&nbsp;:</span>
                    <span class="right">￥{{currentOrder.permit_refund_amount}}</span>
                </li>
            </ul>
        </div>
    </div>


    <div class="model" >
        <div class="model-title" >
            <i class="icon"></i>现金退款方式
        </div>
        <div class="model-content">
           <div class="refund_type">原路退回<span>（1-7个工作日退款到原支付方）</span></div>
        </div>
    </div>

    <div class="model" >
        <div class="model-title" >
            <i class="icon"></i>退款原因(至少一项)
        </div>
        <div class="model-content">
           <ul class="cell reason">
                <li v-for="(item,index) in reason" :key="index"
                    @click="item.value = !item.value"
                >
                    <span class="left">{{item.key}}</span>
                    <span class="right" v-if="item.value" >
                        <img src="/static/img/icon_check_default_true.png" alt="">
                    </span>
                    <span class="right" v-else >
                        <img src="/static/img/icon_check_default_false.png" alt="">
                    </span>
                </li>
            </ul>
        </div>
    </div>

    <div class="model" >
        <div class="model-content">
           <textarea placeholder="超级不爽，必须吐槽！" v-model="rests"/>
        </div>
    </div>

    <div class="submit_from">
        <div class="btn_group">
            <div class="btn" @click="submitFrom">申请退款</div>
        </div>
    </div>

</div>
</template>

<script>
import { formatTime, Toast, showSuccess } from '@/utils/index'
import { orderType } from "@/config/base";
import { apiOrderDetails, apiOrderRefund } from "@/api/api.js";
import { mapState } from 'vuex';
export default {
    data() {
        return {
            orderType,
            order_id: null,
            detailed: null,
            rests: '',
            reason: [{
                key: '预约不上',
                value: false
            },{
                key: '商家营业但不接待',
                value: false
            },{
                key: '使用现金/刷卡/微信/支付宝付了团购价',
                value: false
            },{
                key: '店铺活动更优惠',
                value: false
            },{
                key: '商家停业/装修/转让',
                value: false
            },{
                key: '去过了，不太满意',
                value: false
            },{
                key: '朋友/网上评价不好',
                value: false
            },{
                key: '买多了/买错了',
                value: false
            },{
                key: '计划有变，没时间消费',
                value: false
            }]
        }
    },
    onLoad (options) {
        this.order_id = options.order_id;
        console.log(options);
        this.getOrderDetails()
    },
    computed: {
        ...mapState(['currentOrder']),
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
        jumpShop(id) {
            mpvue.navigateTo({
                url: '/pages/shop/index/main?shop_id=' + id
            }) 
        },
        getOrderDetails() {
            apiOrderDetails(this.order_id).then(res => {
                this.detailed = res
                // this.showData = this.type ? this.type : 'detailed'              
            })
        },
        submitFrom() {
            const _this = this
            let reasonArr = _this.reason.filter(reason => {
                return reason.value
            }).map(item => {
                return item.key
            })
            if (!reasonArr.length) {
                Toast("退款原因至少选择其中一项！");
                return
            }
            if (_this.rests) {
                reasonArr.push(_this.rests)
            }
            const refund_reason = reasonArr.join(';')
            
            apiOrderRefund({
                order_id: _this.order_id,
                refund_reason
            }).then(res => {
                showSuccess("退款申请成功！")
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1000)
            })
        }
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
.shop{
    display: flex;
    align-items: center;
    &::after{
        content: '';
        width: 16rpx;
        height: 28rpx;
        background-image: url(~@/assets/img/right.png);
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }
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
    .shop-warp{
        flex: 1;
        margin-right: 5rpx;
    }
    .title{
        color: #000;
        margin-bottom: 8rpx;
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
            color:#818181;
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
        .icon{
            display: inline-block;
            width: 17px;
            height: 17px;
            background-image: url(~@/assets/img/paying_1.png);
            background-size: contain;
            background-position: 0 0;
            background-repeat: no-repeat;
            vertical-align: middle;
            margin-right: 20rpx;
        }
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
            position: relative;
            display: flex;
            overflow: hidden;
            font-size: 13px;
            line-height: 1;
            padding: .15rem .15rem .15rem .45rem;
            .left{
                flex-shrink: 0;
            }
            .right{
                text-align: right;
                flex: 1;
            }
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
    .reason{
        img{
            width: 30rpx;
            height: 30rpx;
        }
    }
    .refund_type{
        padding: 24rpx;
        span{
            color: #f23a3a;
        }
    }
}
.submit_from{
    position: relative;
    z-index: 10;
    .btn_group{
        margin-top: .15rem;
        box-shadow: 1px 1px 10px #b2b2b2;
    }
    .btn{
        flex: 1;
        background-color: #f23a3a;
        text-align: center;
        border: none;
        color: #fff;
        line-height: .9rem;
        height: .9rem;
        font-size: .3rem;
        border-radius: 3px;
    }
}      
</style>
