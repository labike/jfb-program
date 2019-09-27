<!--
 * @Author: zhangHang
 * @Date: 2019-09-12 17:09:55
 * @Description: 倒计时
 -->
<template>
    <p v-if="lastTime">{{ lastTime }}</p>
</template>
<script>
export default {
    name: "countdown",
    data() {
        return {
            lastTime: '',
            loading: false,
        }
    },
    props: {
        endTime: String
    },
    onLoad () {
        this.loading = true
        this.countTime()
    },
    onUnload() {        
        const self = this;
        self.loading = false
    },
    methods: {
        countTime() {
            const that = this;
            let date = new Date();
            let now = date.getTime();
            var end = new Date(that.endTime + " 23:59:59");
            // let end = new Date("2019-9-12 17:50:00");
            let leftTime = end - now; //时间差                              
            let d, h, m, s;
            if (leftTime >= 0) {
                d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                if (d > 10) {
                    h = h < 10 ? "0" + h : h
                    that.lastTime = "距结束还有" + d + "天"
                    return
                }
                h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                m = Math.floor(leftTime / 1000 / 60 % 60);
                s = Math.floor(leftTime / 1000 % 60);
                s = s < 10 ? "0" + s : s
                m = m < 10 ? "0" + m : m
                if (d) {
                    h = h < 10 ? "0" + h : h
                    that.lastTime = "距结束" + d + '天 ' + h + ":" + m + ":" + s
                } else if (h) {
                    h = h < 10 ? "0" + h : h
                    that.lastTime = "距结束 " + h + ":" + m + ":" + s
                } else {
                    that.lastTime = "距结束 " + m + ":" + s
                }
                //递归每秒调用countTime方法，显示动态时间效果
                setTimeout(that.countTime, 1000);
            } else {
                that.lastTime = '活动已下线！'
                that.$emit('endback')
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
