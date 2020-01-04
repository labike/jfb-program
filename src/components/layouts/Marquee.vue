<!--
 * @Author: zhangHang
 * @Date: 2019-05-16 15:00:50
 * @Description: file content
 -->
<template>
<scroll-view class="marquee container">
    <div class="marquee_box">
        <div class="marquee_text" 
            v-if="scrollBegin"
            :style="'transform: translateX(-'+marqueeDistance+'px)'"
        >
            <span>{{text}}</span>
            <span>{{text}}</span>
        </div>
        <div class="marquee_text" 
            v-else
            :style="'transform: translateX(-'+marqueeDistance+'px)'"
        >
            <p>{{text}}</p>
        </div>

    </div>
</scroll-view>
</template>
<script>
export default {
    name: "Marquee",
    props: {
        lists: Array
    },

    data() {
        return {
            text: "",
            timer: null,
            marqueePace: 1, //滚动速度
            marqueeDistance: 0, //初始滚动距离
            marquee_margin: 30,
            size: 13,
            interval: 30, // 时间间隔
            scrollBegin: false
        };
    }, // 把父组件传入的arr转化成字符串
    onLoad() {
        const that = this;
        for (let i = 0; i < that.lists.length; i++) {
            that.text += " " + that.lists[i];
        }
        that.length = that.text.length * that.size; //文字长度
        setTimeout(() => {
            const query = mpvue.createSelectorQuery();
            query.select(".marquee").boundingClientRect();
            query.exec(function(rect) {
                console.log(that.length, rect[0].width);
                that.windowWidth = rect[0].width
                if (that.length > that.windowWidth) {
                    that.scrollBegin = true
                } else {
                    that.scrollBegin = false
                }
                that.scrolltxt()
            });
        }, 50)
    },
    // onShow() {
    //     this.scrolltxt(); // 第一个字消失后立即从右边出现    
    // },
    methods: {
        scrolltxt: function() {
            var that = this;
            var length = that.length; //滚动文字的宽度
            var windowWidth = that.windowWidth; //屏幕宽度
            if (length > windowWidth) {
                var interval = setInterval(function() {
                    var maxscrollwidth = length + that.marquee_margin;
                    //滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
                    var crentleft = that.marqueeDistance;
                    if (crentleft < maxscrollwidth) { //判断是否滚动到最大宽度
                        that.marqueeDistance = crentleft + that.marqueePace
                    } else {
                        that.marqueeDistance = 0 // 直接重新滚动
                        clearInterval(interval);
                        that.scrolltxt();
                    }
                }, that.interval);
            } else {
                that.marquee_margin = "1000" // 直接重新滚动
            }
        }
    },

};
</script>
<style scoped lang="scss">
.container {
    height: 40rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
}

.marquee_box {
    height: 40rpx;
    position: relative;
    font-weight: 400;
    display: block;
    overflow: hidden;
}

.marquee_text {
    white-space: nowrap;
    position: absolute;
    top: 0;
    font-size: 26rpx;
    color: #000;
    height: 40rpx;
    line-height: 40rpx;
    .begin{
        display: flex;
    }
}
</style>