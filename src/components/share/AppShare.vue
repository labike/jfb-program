<template>
<div class="wxshare">
    <!-- <div @close='closeWxShare' class="close"></div> -->

    <div class="canvas-warp" @click="hideModal">
        <div class="canvas">
            <canvas canvas-id="shareImg"  style="width:100%;height:100%;" ></canvas>
        </div>
    </div>

    <div class="btn-title">分享到</div>
    <div class="btn-group-warp">
        <div class="btn-warp">
            <button open-type="share" class="btn" :data-share="cardInfo">
                <i class="btn-img wx"></i>
                <div class="btn-txt">发送好友</div>
            </button>
        </div>
        <div class="btn-warp">
            <div class="btn"  @click="saveShareImg">
                <i class="btn-img down"></i>
                <div class="btn-txt">保存卡片</div>
            </div>
        </div>
    </div>
</div>
</template>

<script type="text/babel">
import drawQrcode from 'weapp-qrcode'
import logo from './../../../static/img/logo_w.png'
export default {
    name: 'AppShare',
    onLoad: function() {
        this.getAvaterInfo();
    },
    data() {
        return {
            shareImgHidden: false,
            shareImgSrc: '', // 画布转成图片的临时地址
        }
    },
    props: {
        cardInfo: Object
    },
    methods: {
        /**
         * 先下载商铺图片
         */
        getAvaterInfo: function() {
            wx.showLoading({
                title: '生成中...',
                mask: true,
            });
            var that = this;
            wx.downloadFile({
                url: that.cardInfo.imageUrl, //商铺图片路径
                success: function(res) {
                    wx.hideLoading();
                    if (res.statusCode === 200) {
                        var imageUrl = res.tempFilePath; //下载成功返回结果
                        that.getQrCode(imageUrl); //继续下载二维码图片
                    } else {
                        wx.showToast({
                            title: '商铺图片下载失败！',
                            icon: 'none',
                            duration: 2000,
                            success: function() {
                                var imageUrl = "";
                                that.getQrCode(imageUrl);
                            }
                        })
                    }
                }
            })
        },

        /**
         * 下载二维码图片
         */
        getQrCode: function(imageUrl) {
            wx.showLoading({
                title: '生成中...',
                mask: true,
            });
            var that = this;
            //生成二维码
            // drawQrcode({
            //     width: 50,
            //     height: 50,
            //     ctx: wx.createCanvasContext('shareImg'),
            //     text: that.cardInfo.link,
            //     callback: (res) => {
            //         wx.canvasToTempFilePath({
            //             width: 50,
            //             height: 50,
            //             canvasId: 'shareImg',
            //             success: function(res) {
            //                 that.shareImgHidden = true
            //                 var tempFilePath = res.tempFilePath;
            //                 that.sharePosteCanvas(imageUrl, tempFilePath);
            //             }
            //         });    
            //     }
            // })

            //已有二维码
            wx.downloadFile({
                url: that.cardInfo.qrCode, //二维码路径
                success: function(res) {
                    wx.hideLoading();
                    if (res.statusCode === 200) {
                        var codeSrc = res.tempFilePath;
                        that.sharePosteCanvas(imageUrl, codeSrc);
                    } else {
                        wx.showToast({
                            title: '二维码下载失败！',
                            icon: 'none',
                            duration: 2000,
                            success: function() {
                                var codeSrc = "";
                                that.sharePosteCanvas(imageUrl, codeSrc);
                            }
                        })
                    }
                }
            })
        },

        /**
         * 开始用canvas绘制分享海报
         * @param imageUrl 下载的商铺图片路径
         * @param codeSrc   下载的二维码图片路径
         */
        sharePosteCanvas: function(imageUrl, codeSrc) {
            wx.showLoading({
                title: '生成中...',
                mask: true,
            })
            var that = this;
            var cardInfo = that.cardInfo; //需要绘制的数据集合
            const ctx = wx.createCanvasContext('shareImg'); //创建画布
            let width = "";
            wx.createSelectorQuery().select('.canvas-warp').boundingClientRect(function(rect) {
                width = rect.width;
                const height = rect.height;
                const left = parseInt(width * 0.04);
                const bgWidth = parseInt((width - 2 * left))
                const bgHeight = parseInt((width - 2 * left) / 3 * 2)

                ctx.setFillStyle('#fff');
                ctx.fillRect(0, 0, rect.width, height);

                // 商铺图片为正方形
                if (imageUrl) {
                    ctx.drawImage(imageUrl, left, left, bgWidth , bgHeight);
                    ctx.setFontSize(14);
                    ctx.setFillStyle('#fff');
                    ctx.setTextAlign('left');
                }
                // 水印
                if (logo) {
                    ctx.drawImage(logo, width - left - 55, 20, 50, 25)
                }
                // 标签
                // if (cardInfo.company) {
                //     ctx.fillText(cardInfo.company, width - 52, width - 4);
                //     const metrics = ctx.measureText(cardInfo.company); //测量文本信息
                //     ctx.stroke();
                //     ctx.rect(width - metrics.width - 20, width - 20, metrics.width + 20, 25);
                //     ctx.setFillStyle('rgba(255,255,255,0.4)');
                //     ctx.fill();
                // }
                
                // 店铺名字
                if (cardInfo.title) {
                    ctx.setFontSize(18);
                    ctx.setFillStyle('#000');
                    ctx.setTextAlign('left');
                    ctx.fillText(cardInfo.title, left, bgHeight + left + 30);
                }

                //电话
                if (cardInfo.mobile) {
                    ctx.setFontSize(13);
                    ctx.setFillStyle('#666');
                    ctx.setTextAlign('left');
                    ctx.fillText(cardInfo.mobile, left, bgHeight + left + 58);
                }
                
                // // 地址
                // if (cardInfo.address) {
                //     ctx.setFontSize(12);
                //     ctx.setFillStyle('#666');
                //     ctx.setTextAlign('left');
                //     ctx.fillText(cardInfo.address, left, width + 80);
                // }

                // 地址
                if (cardInfo.address) {
                    const CONTENT_ROW_LENGTH = 30; // 正文 单行显示字符长度
                    let [contentLeng, contentArray, contentRows] = that.textByteLength(cardInfo.address , CONTENT_ROW_LENGTH);
                    ctx.setTextAlign('left');
                    ctx.setFillStyle('#666');
                    ctx.setFontSize(13);
                    let contentHh = 18 * 1;
                    for (let m = 0; m < contentArray.length; m++) {
                        ctx.fillText(contentArray[m], left, bgHeight + left + 84 + contentHh * m);
                    }
                }

                
                
                //  绘制二维码
                if (codeSrc) {
                    const codeWidth = height - bgHeight - left * 3
                    ctx.drawImage(codeSrc, width - codeWidth - left, bgHeight + 2 * left, codeWidth, codeWidth)
                    ctx.beginPath();
                    ctx.lineWidth = "1";
                    ctx.strokeStyle = "#e8e8e8";
                    ctx.rect(width - codeWidth - left, bgHeight + 2 * left, codeWidth, codeWidth);
                    ctx.stroke();
                }

            }).exec()

            setTimeout(function() {
                ctx.draw();
                
                wx.hideLoading();
            }, 1000)

        },

        /**
         * 多行文字处理，每行显示数量
         * @param text 为传入的文本
         * @param num  为单行显示的字节长度
         */
        textByteLength(text, num) {
            let strLength = 0; // text byte length
            let rows = 1;
            let str = 0;
            let arr = [];
            for (let j = 0; j < text.length; j++) {
                if (text.charCodeAt(j) > 255) {
                    strLength += 2;
                    if (strLength > rows * num) {
                        strLength++;
                        arr.push(text.slice(str, j));
                        str = j;
                        rows++;
                    }
                } else {
                    strLength++;
                    if (strLength > rows * num) {
                        arr.push(text.slice(str, j));
                        str = j;
                        rows++;
                    }
                }
            }
            arr.push(text.slice(str, text.length));
            return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
        },

        //点击保存到相册
        saveShareImg: function() {
            var that = this;
            wx.showLoading({
                title: '正在保存',
                mask: true,
            })
            setTimeout(function() {
                wx.canvasToTempFilePath({
                    canvasId: 'shareImg',
                    success: function(res) {
                        wx.hideLoading();
                        var tempFilePath = res.tempFilePath;
                        wx.saveImageToPhotosAlbum({
                            filePath: tempFilePath,
                            success(res) {
                                // utils.aiCardActionRecord(19);
                                wx.showModal({
                                    content: '图片已保存到相册，赶紧晒一下吧~',
                                    showCancel: false,
                                    confirmText: '好的',
                                    confirmColor: '#333',
                                    success: function(res) {
                                        if (res.confirm) {
                                            
                                        }
                                    },
                                    fail: function(res) {}
                                })
                            },
                            fail: function(res) {
                                wx.showToast({
                                    title: res.errMsg,
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        })
                    }
                });
            }, 1000);
        },
        
    },
    // onShow: function() {
    //     let that = this;
    //     wx.getSystemInfo({
    //         success: function(res) {
    //             console.log(res);
                
    //             // animationShowHeight = res.windowHeight;
    //         }
    //     });
    // },

}
</script>


<style lang="scss" scoped>
.wxshare{
    overflow: hidden;
    .close{
        position: absolute;
        width: 30rpx;
        height: 30rpx;
        right: 24rpx;
        top: 24rpx;
        border-radius: 50%;
        overflow: hidden;
    }
}
.canvas-warp{
    background: #fff;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    position: relative;
    .canvas{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        overflow: hidden;
    }
}
.btn-title{
    text-align: center;
    font-size: 14px;
    align-items: center;
    justify-content: center;
    height: 100rpx;
    display: flex;
    color: #fff;
    &::after,
    &::before{
        content: "";
        display: block;
        width: 100rpx;
        margin: 20rpx;
        border-bottom: 2px solid #fff;
    }
}
.btn-group-warp{
    width: 100%;
    display: flex;
    margin: 0 auto;
    .btn-warp{
        flex:  1;
        display: flex;
        align-items: center;
        justify-items: center;
    }
    .btn-img{
        width: 120rpx;
        height: 120rpx;
        margin-bottom: 20rpx;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        &.wx{
            background-image: url(~@/assets/img/share_wx.png);
        }
        &.down{
            background-image: url(~@/assets/img/share_down.png);
        }
    }
    .btn{
        border: 0;
        text-align: center;
        display: block;
        margin: auto;
        color: #fff;
        &::after {
            display: none;
        }
    }
}
</style>