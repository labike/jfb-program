<!--
 * @Author: zhangHang
 * @Date: 2019-06-26 17:29:48
 * @Description: file content
 -->
<template>
    <div class="time">
        <span v-if="PayStatus">剩余支付时间</span>
        <span>{{ lastTime }}</span>
    </div>
</template>
<script>
export default {
    name: "countdown",
    data() {
        return {
            lastTime: '',
            PayStatus: true,
        }
    },
    props: {
        endTime: Number
    },
    onLoad () {
        this.PayStatus = true
        this.countTime()
    },
    methods: {
        countTime() {
            var that = this;
            var date = new Date();
            var now = date.getTime();
            var end = that.endTime * 1000;
            
            var leftTime = end - now; //时间差                              
            var d, h, m, s;
            if (leftTime >= 0) {
                h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                m = Math.floor(leftTime / 1000 / 60 % 60);
                s = Math.floor(leftTime / 1000 % 60);
                s = s < 10 ? "0" + s : s
                m = m < 10 ? "0" + m : m
                if (h) {
                    h = h < 10 ? "0" + h : h
                    that.lastTime = h + "：" + m + "：" + s
                } else {
                    that.lastTime = m + "：" + s
                }
                //递归每秒调用countTime方法，显示动态时间效果
                setTimeout(that.countTime, 1000);
            } else {
                that.lastTime = '已超时，请重新下单！'
                that.PayStatus = false
                that.$emit('callback')
            }
 		}
    }
};
</script>

<style lang="scss" scoped>
    .time{
        color: #818181;
        text-align: center;
        :nth-of-type(1){
           margin-right: 10rpx; 
        }
    }
</style>
