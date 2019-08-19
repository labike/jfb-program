<!--
 * @Author: zhangHang
 * @Date: 2019-05-16 15:00:50
 * @Description: file content
 -->
<template>
<scroll-view class="container">
    <view class="marquee_box">
      <view class="marquee_text" :style="'transform: translateX(-'+marqueeDistance+'px)'">
        <text>{{text}}</text>
        <text>{{text}}</text>      
      </view>
  </view>
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
            marqueePace: 1,//滚动速度
            marqueeDistance: 0,//初始滚动距离
            marquee_margin: 30,
            size: 13,
            interval: 30 // 时间间隔
        };
    },// 把父组件传入的arr转化成字符串
    onLoad() {
        const that = this;
        for (let i = 0; i < that.lists.length; i++) {
            that.text += " " + that.lists[i];
        }
        that.length = that.text.length * that.size; //文字长度
        that.windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度 
        that.scrolltxt()
        
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
                    var maxscrollwidth = length + that.marquee_margin; //滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
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
    position:relative;
    font-weight: 400;
    display:block;
    overflow:hidden;
} 
.marquee_text {
    white-space: nowrap;
    position:absolute;
    top:0;
    font-size: 26rpx;
    color: #000;
    height: 40rpx;
    line-height:40rpx;
}
</style>