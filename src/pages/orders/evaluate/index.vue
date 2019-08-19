<!--
 * @Author: zhangHang
 * @Date: 2019-06-18 08:48:51
 * @Description: file content
 -->
<template>
<div class="container" v-if="detailed">
    <div class="title">{{detailed.store_name}}</div>
    <div class="lables">
        <dl class="lbs-item">
            <dt>评星：</dt>
            <dd class="rate-warp">
                <i v-for="(imgsrc, imgx) of startTextArr" :key='imgx'
                    :data-index="imgx"
                    class="star"
                    :class="startNum>imgx?'star'+startNum :''"
                    @click="starTap"></i>
                <span class="text">{{startTextArr[startNum-1]}}</span>
            </dd>
        </dl>
        <dl class="lbs-item" v-for="(lables, labx) of rateLables" :key="lables.group_id">
            <dt>{{lables.group_name}}：</dt>
            <dd class="lable-warp">
                <div class="lable" v-for="tag of lables.group_list" :key='tag.id'
                    :class="lables.selected == tag.id? 'active':''"
                    :data-lable="labx"
                    :data-id="tag.id"
                    @click="tapLabs"
                >{{tag.name}}</div>
            </dd>
        </dl>
    </div>

    <div class="content">
        <textarea class="text" v-model="rateContent" auto-height placeholder="亲，对本次的服务您还满意吗？" />
    </div>

    <div class="upload">
        <div class="img-warp" v-for="(pic, pix) of pics" :key='pix'>
            <div class="del_img" @click="deleteImg"></div>
            <img :src="pic" alt="">
        </div>
        <div class="img-add" @click="chooseImg"></div>
    </div>


    <div class="btn-group">
        <div class="btn" @click="submitRate" >提交评价</div>
    </div>
</div>
</template>

<script>
import { formatTime } from '@/utils/index'
import { APIHOST, orderType } from "@/config/base";
import { apiGetRateLables, apiRateData } from "@/api/api.js";
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            orderType,
            order_id: null,
            detailed: null,
            startNum: 0,
            startTextArr: ['很差','不好','一般','满意','超赞'],
            rateLables: [],
            selectLables: [],
            rateContent: '',
            pics: [],
        }
    },
    onLoad (options) {
        this.order_id = options.order_id;
        this.getCurrentOrder(this.order_id).then(res => {
            this.detailed = res
            this.getRateLables(res.x_id)
        })
    },
    methods: {
        ...mapActions(['getCurrentOrder']),
        jumpShop(id) {
            mpvue.navigateTo({
                url: '/pages/shop/index/main?shop_id=' + id
            }) 
        },
        getRateLables(shop_id) {
            apiGetRateLables(shop_id).then(res => {
                this.selectLables = res.map(() => '')
                this.rateLables = res.map(item => {
                    item.selected = ''
                    return item
                })
            })
        },
        starTap: function (e) {
            const that = this;
            const index = e.mp.currentTarget.dataset.index - 0;
            that.startNum = index + 1
        },
        tapLabs(e) {
            const that = this;
            const lable = e.mp.currentTarget.dataset.lable - 0;
            const id = e.mp.currentTarget.dataset.id - 0;
            this.rateLables[lable].selected = id
            this.selectLables[lable] = id
        },
        chooseImg: function (e) { //这里是选取图片的方法
            const that = this;
            let pics = that.pics;
            wx.chooseImage({
                count: 5 - pics.length, // 最多可以选择的图片张数，默认9
                sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
                sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
                success: function (res) {
                    var imgsrc = res.tempFilePaths;
                    pics = pics.concat(imgsrc);
                    that.pics = pics
                },
                fail: function () {
                    // fail
                },
                complete: function () {
                    // complete
                }
            })

        },
        // 删除图片
        deleteImg(e) {
            var pics = this.pics;
            var index = e.currentTarget.dataset.index;
            pics.splice(index, 1);
            this.pics = pics
        },
        checkData() {
            if (this.startNum < 1) {
                this.errTxt = '请添加评星！'
                return
            } 
            const flag = this.selectLables.some(item => {
                return item === ''
            })
            if (flag) {
                this.errTxt = '请选择标签！'
                return
            } 
            if (this.rateContent.length < 1) {
                this.errTxt = '评论内容不能为空'
                return
            }
            this.errTxt = false
            this.formData = {
                order_id: this.order_id,
                start_num: this.startNum,
                tags_ids: this.selectLables.join(','),
                centent: this.rateContent
            }
        },
        submitRate() {
            const _this = this 
            _this.checkData()
            if (_this.errTxt) {
                wx.showToast({
                    title: _this.errTxt,
                    icon: 'none',
                    duration: 1000
                })
                return
            }
            if (this.pics.length) {
                _this.uploadImg()
            } else {
                _this.uploadData()
            }

        },
        uploadImg () { //这里触发图片上传的方法
            const pics = this.pics;
            const formData = this.formData;
            wx.uploadFile({
                url: APIHOST + 'comment/order',
                filePath: pics[0],
                name: 'img[]',
                header: {
                    "Content-Type": "multipart/form-data",
                    'accessToken': wx.getStorageSync('token')
                },
                formData,
                success: function(res) {
                    const data = JSON.parse(res.data)
                    if (data.code === "200") {
                        wx.showToast({
                            title: '评论成功',
                            icon: 'success',
                            duration: 1000
                        })
                        setTimeout(() => {
                            wx.navigateBack({//返回
                                delta: 1
                            })
                        }, 1000)
                        
                    }
                    if (data.code === "0") {
                        wx.showToast({
                            title: '评论失败！',
                            icon: 'none',
                            duration: 1000
                        })
                    }
                }
            })
        },
        uploadData() {
            console.log(this.formData);
            apiRateData(this.formData).then(res => {
                wx.showToast({
                    title: '评论成功',
                    icon: 'success',
                    duration: 1000
                })
                setTimeout(() => {
                    wx.navigateBack({//返回
                        delta: 1
                    })
                }, 1000)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.title{
    background: #fff;
    text-align: center;
    font-size: 28rpx;
    padding: 24rpx 150rpx;
    line-height: 40rpx;
    border-bottom: 1rpx solid #e8e8e8;

}
.lables{
    background: #fff;
    padding: 0 24rpx 24rpx;
    .lbs-item{
        display: flex;
        padding-top: 24rpx;
        align-items: center;
        dt{
            color: #000;
            font-size: 26rpx;
        }
        dd{
            flex: 1;
            color: #818181;
        }
    }
    .lable-warp{
        display: flex;
        flex-wrap: wrap;
        .lable{
            cursor: pointer;
            border:  1rpx solid #e8e8e8;
            border-radius: 37rpx;
            height: 37rpx;
            min-width: 110rpx;
            text-align: center;
            margin-right: 10rpx;
            margin-top: 10rpx;
            padding: 0 10rpx;
            &.active{
                border:  1rpx solid #ecf4ff;
                background: #ecf4ff;
                color: #2a8cfa;
            }
        }
    }
}
.rate-warp{
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
    .text{
        color:#818181;
        margin-left: 30rpx;
        font-size: 26rpx;
        line-height: 1;
    }
    .star{
        cursor: pointer;
        width: 94rpx;
        height: 54rpx;
        display: inline-block;
        vertical-align: bottom;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('~@/assets/img/star_0.png');
        &.star1 {
            background-image: url('~@/assets/img/star_1.png');
        }
        &.star2 {
            background-image: url('~@/assets/img/star_2.png');
        }
        &.star3 {
            background-image: url('~@/assets/img/star_3.png');
        }
        &.star4 {
            background-image: url('~@/assets/img/star_4.png');
        }
        &.star5 {
            background-image: url('~@/assets/img/star_5.png');
        }
    }
}

.content{
    margin-top: 10rpx;
    background: #fff;
    padding: 24rpx;
    .text{
        width: 100%;
        min-height: 240rpx;
        border-bottom:  2px solid #2a8cfa;
    }
}
.upload{
    margin-top: 10rpx;
    background: #fff;
    padding: 0 24rpx 24rpx 0;
    display: flex;
    flex-wrap: wrap; 
    .img-add{
        width: 156rpx;
        height: 156rpx;
        margin-left: 24rpx;
        margin-top: 24rpx;
        background-image: url(~@/assets/img/add_img.png);
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }
    
    .img-warp{
        position: relative;
        .del_img{
            width: 30rpx;
            height: 30rpx;
            position: absolute;
            left: 10rpx;
            top: 10rpx;
            background-image: url(~@/assets/img/del_photo.png);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }
        img{
            width: 156rpx;
            height: 156rpx;
            margin-left: 24rpx;
            margin-top: 24rpx;
        }
    }
    
}
.btn-group{
    margin-top: 50rpx;
    padding: 24rpx;
    .btn{
        background: #2a8cfa;
        text-align: center;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 80rpx;
        color: #fff;
        &.unable{
            background: #666;
        }
    }
}
        
</style>
