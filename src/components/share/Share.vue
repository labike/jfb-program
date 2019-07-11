<template>
<div class="share-warp">
    <div class="buydes-dialog-container" v-if="showModalStatus">
        <div class="buydes-dialog-container-top" @click="hideModal">
            <canvas id="shareImg"></canvas>
        </div>
 
        <div class="buydes-dialog-container-bottom">
            <div class="fl bottom-image-fen">
                <button open-type="share" hover-class="other-button-hover" class="button-bg">
                    <image src="" style="width: 80rpx; height: 80rpx;" class="bottom-img"></image>
                    <div class="image-txt">发送好友</div>
                </button>
            </div>
            <div class="fl bottom-image-fen">
                <div style="margin-top: 5rpx;" @click="saveShareImg">
                    <image src="" style="width: 60rpx; height: 60rpx;" class="bottom-img-right "></image>
                    <div class="image-txt">保存卡片</div>
                </div>
            </div>
 
            <div class="clear"></div>
            <div @click="hideModal" class="buydes-dialog-container-bottom-item" >取消</div>
        </div>
    </div>
    <image @click="showModal" bindload="imageLoad" style="width:200px;" src=""/>
</div>
</template>

<script type="text/babel">
    export default {
        name: 'Share',
        mounted() {
            wx.showShareMenu();
        },
        data() {
            return {
                showModalStatus: true,
                imageHeight: 0,
                imageWidth: 0,
                shareImgHidden: false,
                shareImgSrc: '',// 画布转成图片的临时地址
            }
        },
        watch: { // 使用监听的方式，监听数据的变化
            showModalStatus(val) {
                if (val) {
                    wx.hideTabBar({})
                } else {
                    wx.showTabBar({})
                }
            }
        },
        methods: {
            showModal: function () {
                let that = this;
                let animation = wx.createAnimation({
                    duration: 200,
                    timingFunction: "linear",
                });
                that.animation = animation;
                // animation.translateY(animationShowHeight).step();
                that.setData({
                    animationData: animation.export(),
                    showModalStatus: true
                });
                setTimeout(function () {
                    animation.translateY(0).step();
                    that.setData({
                        animationData: animation.export()
                    })
                }, 200);
 
                //canvas绘制文字和图片
                const ctx = wx.createCanvasContext('shareImg');
                let bgImg = '';
                let headImg = '';
                let xcxImg = '';
 
                let ImgHeight = 250;
                let ImgWidth = 250;
                //首图位置
                ctx.drawImage(bgImg, 53, 10, ImgWidth, ImgHeight);
                ctx.setFillStyle('white');
                ctx.fillRect(30, 10, 23, ImgHeight);
                ctx.setFillStyle('white');
                ctx.fillRect(303, 10, 23, ImgHeight);
 
                ctx.setFillStyle('white');
                ctx.fillRect(30, ImgHeight + 10, 296, 180);
                //头像位置
                ctx.setFillStyle('#ececec');
                ctx.fillRect(42, ImgHeight - 10, 60, 60);
                ctx.setFillStyle('white');
                ctx.fillRect(40, ImgHeight - 12, 60, 60);
                ctx.drawImage(headImg, 45, ImgHeight - 7, 50, 50);
                //昵称
                ctx.setFontSize(14);
                ctx.setFillStyle('#888888');
                ctx.fillText('昵称', 110, ImgHeight + 25);
 
                ctx.setFontSize(14);
                // ctx.setFillStyle(config.fontColor);
                ctx.fillText('“快来跟我一起抢”', 105, ImgHeight + 45);
 
                ctx.setFontSize(15);
                ctx.setFillStyle('#333333');
                let str = 'RumbaTime时尚手表潮流时装女表电子钢带石英表美国正品进口表';
                let height = that.drawText(ctx, str, 45, ImgHeight + 70, 30, 265);// 调用行文本换行函数
                ctx.setFontSize(13);
                // ctx.setFillStyle(config.fontColor);
                ctx.fillText('￥', 45, ImgHeight + 65 + height);
                ctx.setFontSize(20);
                // ctx.setFillStyle(config.fontColor);
                ctx.fillText('1999.00', 60, ImgHeight + 65 + height);
 
                ctx.setFillStyle('#999999');
                ctx.setFontSize(12);
                ctx.fillText('￥', 140, ImgHeight + 65 + height);
                ctx.setFontSize(16);
                ctx.fillText('1999.00', 150, ImgHeight + 65 + height);
 
                ctx.moveTo(140, ImgHeight + 60 + height);
                ctx.lineTo(210, ImgHeight + 60 + height);
                ctx.stroke('#999999');
 
                ctx.setFontSize(14);
                ctx.setFillStyle('#888888');
                ctx.fillText('长按识别小程序码访问', 45, ImgHeight + 85 + height);
 
                //二维码
                ctx.drawImage(xcxImg, 240, ImgHeight + height + 30, 70, 70);
                ctx.draw();
 
                //canvas画布转成图片
                setTimeout(function() {
                    wx.canvasToTempFilePath({
                        x: 30,
                        y: 10,
                        width: 300,
                        height: 430,
                        destWidth: 900,//生成图片的大小设置成canvas大小的3倍
                        destHeight: 1290,
                        canvasId: 'shareImg',
                        success: function(res) {
                            that.setData({
                                shareImgSrc: res.tempFilePath
                            });
                        },
                        fail: function (res) {
                            wx.showToast({
                                title: res.errMsg,
                                icon: 'none',
                                duration: 1000,
                            });
                        }
                    });
                }, 500);
                that.setData({
                    shareImgHidden: true,
                });
            },
 
            /**
     * 保存到相册
     */
            saveShareImg: function () {
                let that = this;
                console.log(that.data.shareImgSrc);
                setTimeout(function () {
                    wx.saveImageToPhotosAlbum({
                        filePath: that.data.shareImgSrc,
                        success: function (res) {
                        },
                        fail: function (error) {
                            console.log(error.errMsg);
                            wx.showModal({
                                title: '提示',
                                content: '请允许保存图片到相册',
                            });
                        },
                    });
                }, 500);
            },
 
            /**
     * 绘制多行文本
     * @param ctx canvas对象
     * @param str 文本
     * @param leftWidth 距离左侧的距离
     * @param initHeight 距离顶部的距离
     * @param titleHeight 文本的高度
     * @param canvasWidth 文本的宽度
     * @returns {*}
     */
            drawText: function(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
                let lineWidth = 0;
                let lastSubStrIndex = 0; //每次开始截取的字符串的索引
                for (let i = 0; i < str.length; i++) {
                    lineWidth += ctx.measureText(str[i]).width;
                    if (lineWidth > canvasWidth) {
                        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
                        initHeight += 22; //22为 文字大小20 + 2
                        lineWidth = 0;
                        lastSubStrIndex = i;
                        titleHeight += 22;
                    }
                    if (i === str.length - 1) { //绘制剩余部分
                        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
                    }
                }
                // 标题border-bottom 线距顶部距离
                titleHeight = titleHeight + 10;
                return titleHeight;
            },
 
 
            /**
     * // 隐藏遮罩层
     */
            hideModal: function () {
                let that = this;
                let animation = wx.createAnimation({
                    duration: 200,
                    timingFunction: "linear",
                    delay: 0
                });
                that.animation = animation;
                // animation.translateY(animationShowHeight).step();
                that.setData({
                    animationData: animation.export(),
                });
                setTimeout(function () {
                    animation.translateY(0).step();
                    that.setData({
                        animationData: animation.export(),
                        showModalStatus: false
                    })
                }, 200);
            },
 
            onShow: function() {
                let that = this;
                wx.getSystemInfo({
                    success: function(res) {
                        // animationShowHeight = res.windowHeight;
                    }
                });
            },
 
            onShareAppMessage: function () {
                let that = this;
                return {
                    title: that.data.shopName,
                    path: '/pages/detail/detail?id=' + 5,
                }
            },
        }
    }
</script>


<style lang="scss" scoped>
.buydes-dialog-container{
    width: 100%; height: 100%; background-color:rgba(15, 15, 26, 0.3); 
    position: fixed; z-index: 999;
}
.buydes-dialog-container-top { height: 80vh; }

.buydes-dialog-container-bottom { background-color: #ffffff; }

.buydes-dialog-container-bottom-item{
    background-color: #eeeeee; padding:24rpx; text-align: center; 
    border-bottom: 1rpx solid #eeeeee;
}
.bottom-img { border: 0; margin-bottom: -20rpx; }
button::after { border: 0; }
.button-bg {
    background-color: #ffffff; height: 160rpx; padding-top: 20rpx;
}
.bottom-image-fen { width: 50vw; }
.image-txt { line-height: 30rpx; text-align: center; font-size: 24rpx;}
.bottom-img-right {
    background-color: #3EBDFE; border-radius: 50rpx; padding: 10rpx; margin-top: 20rpx;
    margin-left: 20vw; margin-bottom: 5rpx;
}
</style>