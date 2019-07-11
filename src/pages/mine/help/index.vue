<template>
<div class="container">
    <scroll-view style="height:100%" scroll-y> 
        <div  class="help-list" v-if="helpList.length">
            <div class="help-wrap" v-for="item of helpList" :key="item.ask">
                <div class="help-ask">{{item.ask}}</div>
                <div class="help-answer">{{item.answer}}</div>
            </div>
        </div>
        <div class="empty" v-else>
            <img class="icon" src="/static/img/empty.png" mode="widthFix">
            <div class="text">您还没有相关数据~</div>
        </div>
    </scroll-view>
</div>
</template>

<script>
export default {
    name: 'help',
    data() {
        return {
            helpList: [{
                ask: '申请退款后多久可以退回？',
                answer: '订单在办理退款后，一般情况下退款时间在1-7个工作日左右，节假日期间退款时间会有延迟'
            },{
                ask: 'KTV预约后是否可以退款？',
                answer: 'KTV预约订单在到店前1小时，请联系商家确认是否可以退款'
            },{
                ask: '团购订单是否可以退款？',
                answer: '普通团购券未消费随时退款，已验证券码无法退款'
            },{
                ask: '代金券订单是否可以退款？',
                answer: '普通代金券未消费随时退款，已验证券码无法退款'
            }]
        }
    },
}
</script>


<style lang="scss" scoped>
.empty{
    height: 100%;
    background: #f5f5f5;
    text-align: center;
    .icon{
        margin-top: 100rpx;
        width: 300rpx;
    }
    .text{
        font-size: 24rpx;
        margin-top: 10rpx;
    }
}
.help-wrap{
    background: #fff;
    margin-top: 20rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    .help-ask{
        color: #000;
        border-bottom: 1rpx dashed #e8e8e8;
        margin-bottom: 10rpx;
        line-height: 40rpx;
        padding: 20rpx 0;
    }
    .help-answer{
        padding: 20rpx 0;
        color: #818181;
        line-height: 40rpx;
    }
}
</style>
