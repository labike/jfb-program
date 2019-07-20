<template>
<div class="container">
    <scroll-view style="height:100%" scroll-y> 
        <div  class="msg-list" v-if="msgList.length">
            <div class="msg-wrap">
                <div class="msg-icon">系</div>
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
        jumpShop(id) {
            mpvue.navigateTo({
                url: '/pages/shop/index/main?shop_id=' + id
            }) 
        },
        getMyRate() {
            const page = this.page
            apiGetMyRate({
                limit: 15,
                page
            }).then(res => {
                if (page === 1) {
                    this.msgList = []
                }
                res.list.forEach(item => {
                    this.msgList.push(item)
                });
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
.group{
    background: #fff;
    margin-top: 20rpx;
    .group-item{
        position: relative;
        display: flex;
        align-items: center;
        height: 100rpx;
        padding-right: 24rpx;
        .icon{
            width: 40rpx;
            height: 40rpx;
            margin: 0 24rpx;
            flex-grow: 0;
        }
        &::after{
            flex-grow: 0;
            content: '';
            width: 15rpx;
            height: 30rpx;
            margin-left: 20rpx;
            background-image: url(~@/assets/img/icon_click_right_list.png);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }
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
    }
    .group-item-text{
        flex: 1;
        font-size: 15px;
    }
}
</style>
