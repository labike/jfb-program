<template>
<div class="container" v-if="detailed">
    <div class="qrcode">
        <div class="title">
            <div class="shop">{{detailed.baseInfo.store_name}}</div>
            <div class="name">{{detailed.projects[0].product_name}}</div>
        </div>
        <div class="content">
            <div class="left">券 码 ：</div>
            <ul class="right">
                <li v-for="(codes,index) in detailed.projects[0].consume_codes" :key="index"
                    :class="{del: codes.is_use == 1}"
                >
                    <span>{{codes.consum_code}}</span>
                </li>
            </ul>
        </div>
        <canvas style="width: 250px; height: 250px;margin: auto;" canvas-id="qrcode"></canvas>
    </div>
    <ul class="remark">
        <li>出示此二维码即可消费多张券</li>
        <li>可在“订单-待使用订单”中查看</li>
    </ul>
</div>
</template>

<script>
import { apiOrderDetails } from "@/api/api.js";
import drawQrcode from 'weapp-qrcode'
export default {
    data() {
        return {
            order_id: null,
            detailed: null,
        }
    },
    onLoad (options) {
        this.order_id = options.order_id;
        this.getOrderDetails()
        this.createQrCode(this.order_id, "qrcode",);
    },
    computed: {

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
        createQrCode: function (text, canvasId) {
            //调用插件中的draw方法，绘制二维码图片
            // drawQrcode.api.draw(content, canvasId, cavW, cavH);
            drawQrcode({
                width: '250',
                height: '250',
                canvasId,
                text
            })
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
    overflow-x: hidden;
    overflow-y: auto;
    background: #2a8cfa;
}
.remark{
    background: #edf4ff;
    color: #323232;
    padding: 24rpx;
    margin: -24rpx 24rpx 0;
    li{
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
.qrcode{
    background: #fff;
    margin: 24rpx;
    padding: 24rpx;
    color: #323232;
    .title{
        padding: 24rpx;
        border-bottom: 1px dashed #f0f0f0;
        text-align: center;
        .shop{
            color: #000;
            line-height: 20px;
            font-size: 17px;
            margin-bottom: 20rpx;
        }
        .name{
            color: #323232;
            font-size: 14px;
        }
    }
    .content{
        line-height: 1.5;
        font-size: 15px;
        display: flex;
        padding: .4rem .24rem;
        .left{
            width: 1.2rem;
        }
        .right{
            color: #fb513f;
            li{
                list-style-type: korean-hanja-informal;
                list-style-position: inside;
            }
        }
        .del{
            color: #c0c0c0;
            span{
                text-decoration: line-through;
            }
        }
    }
}
        
</style>
