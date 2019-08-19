<!--
 * @Author: zhangHang
 * @Date: 2019-06-24 12:01:43
 * @Description: file content
 -->
<template>
<div class="container">
    <scroll-view style="height:100%" scroll-y> 
        <div  class="msg-list" v-if="msgList.length">
            <div class="msg-wrap">
                <div class="msg-icon col1">系</div>
                <div class="msg-inner">
                    <div class="title">获得积分</div>
                    <div class="msg">恭喜您在山城串串获得10积分</div>
                </div>
            </div>
            <div class="msg-wrap">
                <div class="msg-icon col2">券</div>
                <div class="msg-inner">
                    <div class="title">获得积分</div>
                    <div class="msg">恭喜您在山城串串获得10积分</div>
                </div>
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
import CommonGallary from "@c/gallary/Gallary.vue";
import { rateType, orderType } from '@/config/base';
import { Toast, formatTime, findKey } from '@/utils/index';
import { apiGetMyRate } from "@/api/api.js";
export default {
    data() {
        return {
            page: 1,
            scrollTop: 0,
            scrollStatus: true,
            showGallaryState: false,
            remainListsLength: 15,
            msgList: [],
        }
    },
    components: {
        CommonGallary
    },
    onLoad (options) {
        this.getMyRate()
    },
    methods: {
        getMyRate() {
            const page = this.page
            apiGetMyRate({
                limit: 15,
                page
            }).then(res => {
                if (page === 1) {
                    this.msgList = []
                }
                // res.list.forEach(item => {
                //     this.msgList.push(item)
                // });
                this.remainListsLength = res.list.length
            })
        },
        showGallary(imgs, index) {
            let imglist = [];
            imgs.forEach(element => {
                imglist.push(element.img_url);
            });
            this.photoList = imglist;
            this.showGallaryIndex = index;
            this.showGallaryState = true;
        },
        closeGallary() {
            this.photoList = [];
            this.showGallaryState = false;
        }
    },
    onPullDownRefresh () {
        this.page = 1
        this.getMyRate()
        this.remainListsLength = 15
        mpvue.stopPullDownRefresh()
    },
    onReachBottom () {
        if (this.remainListsLength === 15) {
            this.page++
            this.getMyRate()
            this.scrollStatus = true
        } else {
            Toast("没有更多数据了！");
            this.scrollStatus = false
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
.msg-wrap{
    background: #fff;
    position: relative;
    padding: 24rpx;
    overflow: hidden;
    &:not(:last-child)::before {
        content: '';
        position: absolute;
        z-index: 2;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        border-bottom: 1px solid #e8e8e8;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        -webkit-transform-origin: 0 100%;
        transform-origin: 0 100%;
    }
    .msg-icon{
        width: 80rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        font-size: 20px;
        font-weight: 700;
        color: #fff;
        border-radius: 50%;
        float: left;
        &.col1{
            background: #3aa4f8;
        }
        &.col2{
            background: #feb729;
        }
        &.col3{
            background: #fe5a03;
        }
    }
    .msg-inner{
        margin-left: 104rpx;
        .title{
            font-size: 14px;
            font-weight: 400;
            margin-bottom: 10rpx;
        }
    }
}
</style>
