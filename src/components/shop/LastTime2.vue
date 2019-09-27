<!--
 * @Author: zhangHang
 * @Date: 2019-09-12 17:09:55
 * @Description: 倒计时
 -->
<template>
    <div class="linetime">
        <div class="time-warp" v-if="loading">
            <ul class="time">
                <li>{{ hour }}</li>
                <li>{{ minute }}</li>
                <li>{{ second }}</li>
            </ul>
            <p>{{ endTime }}</p>
        </div>
        <p class="over" v-if="timeOver">活动已下线！</p>
    </div>
</template>
<script>
export default {
    name: "countdown",
    data() {
        return {
            timeOver: false,
            loading: false,
            hour: '',
            minute: '',
            second: '',
            linetime: 0
        }
    },
    props: {
        endTime: String
    },
    onLoad () {
        const self = this;
        self.loading = true
        self.timeOver = false
        self.linetime = new Date(self.endTime + " 23:59:59");
        this.countTime()
    },
    onUnload() {        
        const self = this;
        self.loading = false
        self.timeOver = false
        self.linetime = 0
        self.hour = ''
        self.minute = ''
        self.second = ''
    },
    methods: {
        countTime() {
            const that = this;
            let nowTime = new Date().getTime();
            let endTime = that.linetime;
            let leftTime = endTime - nowTime; //时间差                              
            let h, m, s;
            if (leftTime >= 0) {
                h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                m = Math.floor(leftTime / 1000 / 60 % 60);
                s = Math.floor(leftTime / 1000 % 60);
                if (h !== that.hour) {
                    that.hour = h < 10 ? "0" + h : h
                }
                if (m !== that.minute) {
                    that.minute = m < 10 ? "0" + m : m
                }
                if (s !== that.second) {
                    that.second = s < 10 ? "0" + s : s
                }
                //递归每秒调用countTime方法，显示动态时间效果
                setTimeout(that.countTime, 1000);
            } else {
                that.timeOver = true
                that.$emit('endback')
            }
 		}
    }
};
</script>

<style lang="scss" scoped>
.time{
    color: #fff;
    text-align: center;
    display: flex;
    font-weight: 700;
    li{
        width: 40rpx;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 12px;
        background: rgba(0, 0, 0, 0.7);
        position: relative;
        z-index: 10;
        margin-left: 20rpx;
        &:not(:last-child)::before {
            content: ':';
            position: absolute;
            right: -15rpx;
            line-height: 36rpx;
            top: 0;
            font-size: 18px;
            color: #000;
        }
    }
    // :nth-of-type(1){
    //    margin-right: 10rpx; 
    // }
}
p{
    color: #fff;
    text-align: right;
    margin-top: 15rpx;
    text-shadow: 1px 1px 1px #efefef;
}
</style>
