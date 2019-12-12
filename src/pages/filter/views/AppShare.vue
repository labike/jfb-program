<!--
 * @Author: zhangHang
 * @Date: 2019-07-20 09:53:30
 * @Description: file content
 -->
<template>
<div class="mask-warp" v-if="cardInfo">
    <div class="mask" @click="closeMask"></div>
    <div class="mask-info">
        <div class="wxshare" v-if="shareImgHidden">
            <div class="share-show" >
                <div class="logo"></div>
                <div class="top">

                    <ImageView :src="cardInfo.shareImg"   width='540rpx'></ImageView>
                </div>
                <div class="bottom">
                    <div class="qr">
                        <ImageView :src="cardInfo.shareQrImg"  width='90rpx'></ImageView>
                    </div>
                    <div class="info">
                        <div class="title">长按二维码进入本商家店铺</div>
                        <div class="tel">电话 :{{cardInfo.storeInfo.store_mobile}}</div>
                        <div class="address">地址 :{{cardInfo.storeInfo.address}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="join" v-else>
            
            <div class="img-warp">
                <div v-if="cardInfo.shareQrImg" class="tag">已成为本店合伙人</div>
                <ImageView :src="cardInfo.storeInfo.header_img"  mode='aspectFill'  width='658rpx' height='462rpx'></ImageView>
            </div>
            <div class="scale-warp" v-if="shareScale">
                <ul class="scale">
                    <li class="paying">
                        <div class="icon"></div>
                        <div class="name">分享买单</div>
                        <div class="num">{{shareScale[orderType.paying]}}%</div>
                    </li>
                    <li class="vouchers">
                        <div class="icon"></div>
                        <div class="name">分享代金券</div>
                        <div class="num">{{shareScale[orderType.vouchers]}}%</div>
                    </li>
                    <li class="goods">
                        <div class="icon"></div>
                        <div class="name">分享购物车</div>
                        <div class="num">{{shareScale[orderType.goods]}}%</div>
                    </li>
                    <li class="combo">
                        <div class="icon"></div>
                        <div class="name">分享团购</div>
                        <div class="num">{{shareScale[orderType.combo]}}%</div>
                    </li>
                </ul>
            </div>
            <div class="explain">
                <span class="title">说明 : </span>{{explain}}
                <span class="btn" @click="jumpPages(`money/index/main`)"
                >查看钱包</span>
            </div>
        </div>
    </div>
    <div class="mask-btn" v-if="shareImgHidden">
        <!-- <div class="btn-title">分享到</div> -->
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
    <div class="canvas" style="width:0;height:0;overflow: hidden;opacity:0;position:absolute;left:-750px;top:0;">
        <canvas canvas-id="shareImg"  style='width:750px;height:1000px;' ></canvas>
    </div>
</div>

</template>

<script type="text/babel">
// import drawQrcode from 'weapp-qrcode'
import logo from '../../../../static/img/logo_t.png'
import ImageView from '@c/layouts/ImageView.vue'
import { orderType } from '@/config/base'
export default {
    components: {
        ImageView
    },
    data() {
        return {
            orderType,
            shareImgHidden: false,
            shareImgSrc: '', // 画布转成图片的临时地址
            explain: '在本店消费即可成为合伙人，可获得本店以上推荐比例收益（秒到账）',
            saveImgObj: {}
        }
    },
    props: {
        cardInfo: Object
    },
    computed: {
        shareScale() {
            if (this.cardInfo && this.cardInfo.shareInfo && this.cardInfo.shareInfo.info) {
                let oType = {};
                this.cardInfo.shareInfo.info.forEach(scale => {
                    oType[scale.type] = scale.ratio
                });
                return oType
            }
            return null
        }
    },
    onLoad: function() {
        const that = this
        if (that.cardInfo.type === 'earn') {
            let storeInfo = that.cardInfo.storeInfo
            if (typeof that.cardInfo.userShareStoreNum === 'undefined') {
                return
            }
            let shareQrImg = that.cardInfo.shareQrImg.replace("http://", "https://")
            if (that.cardInfo.shareInfo.sharePermit) {
                if (that.cardInfo.userShareStoreNum < 50) {
                    that.cardInfo.shareQrImg = shareQrImg
                    that.cardInfo.shareImg = that.cardInfo.storeInfo.share_img || that.cardInfo.storeInfo.header_img
                    that.shareImgHidden = true
                } else {
                    wx.showModal({
                        content: '您分享的店铺已到达上限',
                        showCancel: false,
                        // confirmText: '好的',
                        confirmColor: '#333',
                    })
                }
            }
        }
    },
    onUnload() {        
        const self = this;
        self.shareImgHidden = false;
        self.shareImgSrc = '';
        self.explain = '在本店消费即可成为合伙人，可获得本店以上推荐比例收益（秒到账）';
        self.saveImgObj = {};
    },
    methods: {
        closeMask() {
            this.$emit('close')
        },
        jumpPages(pageUrl) {
            this.$router.push({
                path: `/pages/${pageUrl}`
            })
        },
        /**
         * 先下载商铺图片
         */
        getAvaterInfo: function() {
            wx.showLoading({
                title: '正在下载素材...',
                mask: true,
            });
            var that = this;
            that.saveImgObj.onload = false
            wx.downloadFile({
                url: that.cardInfo.shareImg, //商铺图片路径
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
                title: '二维码生成中...',
                mask: true,
            });
            var that = this;

            //已有二维码
            wx.downloadFile({
                url: that.cardInfo.shareQrImg, //二维码路径
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
                title: '海报生成中...',
                mask: true,
            })
            let that = this;
            let cardInfo = that.cardInfo; //需要绘制的数据集合
            cardInfo.company = "长按二维码进入本商家店铺"
            const ctx = wx.createCanvasContext('shareImg'); //创建画布
            const ctxW = 750;
            const ctxH = 1000;
            const codeWidth = 140
            const query = wx.createSelectorQuery();
            query.select(".top").boundingClientRect();
            query.exec(function(rect) {
                let [ imgObj ] = rect;
                const scale = ctxW / imgObj.width
                const bgHeight = parseInt(imgObj.height * scale)
                const left = parseInt(ctxW * 0.04);
                that.saveImgObj.width = ctxW;
                that.saveImgObj.height = ctxH;
                
                ctx.setFillStyle('#fff');
                ctx.fillRect(0, 0, ctxW, ctxH);

                // 商铺图片为正方形
                if (imageUrl) {
                    ctx.drawImage(imageUrl, 0, 0, ctxW , bgHeight);
                    ctx.setFillStyle('#fff');
                    ctx.setTextAlign('left');
                }
                if (logo) {
                    ctx.drawImage(logo, 25, 40, 180, 50)
                }

                // 标签
                if (cardInfo.company) {
                    ctx.setFontSize(24)
                    const metrics = ctx.measureText(cardInfo.company); //测量文本信息
                    ctx.setFillStyle('#005db3');
                    ctx.fillRect(codeWidth + left * 2, bgHeight + left, metrics.width + 20, 50);
                    ctx.setFillStyle('#fff');

                    ctx.font = 'normal 24px sans-serif';
                    ctx.setTextBaseline('middle')
                    ctx.fillText(cardInfo.company, codeWidth + left * 2 + 10, bgHeight + left + 28);
                    ctx.stroke();
                }

                //电话
                if (cardInfo.storeInfo.store_mobile) {
                    ctx.setFillStyle('#666');
                    ctx.setTextAlign('left');
                    ctx.fillText('电话 : ' + cardInfo.storeInfo.store_mobile, codeWidth + left * 2, bgHeight + left + 88);
                }
                let addressTop = 0
                
                // 地址
                if (cardInfo.storeInfo.address) {
                    const CONTENT_ROW_LENGTH = 44; // 正文 单行显示字符长度
                    let [contentLeng, contentArray, contentRows] = that.textByteLength('地址 : ' + cardInfo.storeInfo.address, CONTENT_ROW_LENGTH);
                    ctx.setTextAlign('left');
                    ctx.setFillStyle('#666');
                    let contentHh = 34 * 1;
                    for (let m = 0; m < contentArray.length; m++) {
                        ctx.fillText(contentArray[m], codeWidth + left * 2, bgHeight + left + 128 + contentHh * m);
                        addressTop += contentHh
                    }
                    addressTop += left
                }

                //  绘制二维码
                if (codeSrc) {
                    let codeTop = parseInt(addressTop / 2);
                    ctx.drawImage(codeSrc, left, bgHeight + codeTop, codeWidth, codeWidth)
                    that.saveImgObj.height = bgHeight + codeWidth + addressTop;
                }
                
            })
            ctx.save()
            setTimeout(function() {
                ctx.draw()
                that.saveImgObj.onload = true
                that.downShareImg()
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
        
        //保存到相册
        downShareImg: function() {
            var that = this;             
            wx.showLoading({
                title: '正在保存',
                mask: true,
            })
            setTimeout(function() {
                wx.canvasToTempFilePath({
                    canvasId: 'shareImg',
                    x: 0,
                    y: 0,
                    width: that.saveImgObj.width,
                    height: that.saveImgObj.height,
                    destWidth: that.saveImgObj.width,
                    destHeight: that.saveImgObj.height,
                    success: function(res) {
                        wx.hideLoading();
                        var tempFilePath = res.tempFilePath;
                        wx.saveImageToPhotosAlbum({
                            filePath: tempFilePath,
                            success(res) {
                            // utils.aiCardActionRecord(19);
                                wx.showModal({
                                    content: '保存成功，从相册中分享到朋友圈吧',
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
            }, 1000)
            
        },
        //点击保存到相册
        saveShareImg: function() {
            let that = this;             
            if (that.saveImgObj.onload) {
                that.downShareImg()
            } else {
                that.getAvaterInfo()
            }
           
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

.mask-warp{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    z-index: 9999;
    justify-content: flex-start;
    .mask{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 10000;
    }
    .mask-info{
        position: relative;
        width: 100%;
        flex: 1;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .mask-btn{
        position: fixed;
        right: 0;
        left: 0;
        bottom: 0;
        height: 150rpx;
        z-index: 10002;
        background: #ededf5;
        padding-top: 20rpx;
    }
}
.join,
.wxshare{
    position: fixed;
    top: 30%;
    left: 50%;
    min-width: 10%;
    height: auto;
    z-index: 10001;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    transform: translate(-50%, -30%);
}
.join{
    background: #fff;
    padding: 20rpx;
    border-radius: 10rpx;
    width: 658rpx;
    top: 50%;
    transform: translate(-50%, -50%);
    .img-warp{
        width: 658rpx;
        height: 462rpx;
        overflow: hidden;
        border-radius: 10rpx;
        position: relative;
    }
    .tag{
        background: #fb2b0c;
        color: #fff;
        height: 50rpx;
        line-height: 50rpx;
        text-align: center;
        border-radius: 10rpx 0 10rpx 0;
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 24rpx;
    }
    .scale-warp{
        margin: 30rpx;
        .scale{
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-align: center;
        }
        .name{
            color: #323232;
            font-size: 12px;
            font-weight: 400;
            margin-bottom: 20rpx;
        }
        .num{
            background: #fff3eb;
            border-radius: 6rpx;
            color: #ff6300;
            font-size: 17px;
            font-weight: 700;
            height: 90rpx;
            line-height: 90rpx;
            min-width: 94rpx;
            padding: 0 10rpx;
        }
        .icon {
            width: 76rpx;
            height: 76rpx;
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            margin: 0 auto 20rpx;
        }
        .paying{
            .icon{
                background-image: url(~@/assets/img/share_paying.png);
            }
        }
        .vouchers{
            .icon{
                background-image: url(~@/assets/img/share_vouchers.png);
            }
        }
        .goods{
            .icon{
                background-image: url(~@/assets/img/share_goods.png);
            }
        }
        .combo{
            .icon{
                background-image: url(~@/assets/img/share_combo.png);
            }
        }
    }
    .explain{
        background: #f4faff;
        padding: 10rpx 20rpx;
        margin: 20rpx 30rpx;
        border-radius: 10rpx;
        color: #323232;
        font-size: 12px;
        line-height: 1.6;
        font-weight: 400;
        .title{
            color: #ff2711;
        }
        .btn{
            margin-left: 30rpx;
            color: #0085ff;
        }
    }
}
.share-show{
    background: #fff;
    position: relative;
    .logo{
        position: absolute;
        z-index: 999;
        left: 20rpx;
        top: 30rpx;
        width: 130rpx;
        height: 40rpx;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        background-image: url(../../../../static/img/logo_t.png);
    }
    .bottom{
        display: flex;
        align-items: center;
        padding: 20rpx;
    }
    .qr{
        width: 90rpx;
        height: 90rpx;
        margin-right: 20rpx;
    }
    .info{
        flex: 1;
        font-size: 9px;
        color: #000;
        line-height: 1;
        .title{
            background: #005db3;
            color: #fff;
            padding: 8rpx;
            display: inline-block;
        }
        .tel{
            margin-top: 10rpx;
        }
        .address{
            margin-top: 10rpx;
        }
    }
}
.btn-title{
    text-align: center;
    font-size: 14px;
    align-items: center;
    justify-content: center;
    height: 50rpx;
    display: flex;
    color: #323232;
    &::after,
    &::before{
        content: "";
        display: block;
        width: 100rpx;
        margin: 20rpx;
        border-bottom: 2px solid #323232;
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
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 10rpx;
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
        color: #000;
        &::after {
            display: none;
        }
    }
}
</style>