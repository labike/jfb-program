<!--
 * @Author: zhangHang
 * @Date: 2019-06-24 12:03:04
 * @Description: file content
 -->
<template>
<div class="container" >
    <div class="rate-list" v-if="rateList.length">
        <div class="rate-warp" v-for="rate of rateList" :key="rate.id">
            <div class="img-warp">
                <img :src="rate.header_img">
            </div>
            <div class="rate-inner">
                <div class="title">
                    <div class="nickname">{{rate.nickname}}</div>
                    <div class="add_time">{{rate.add_time}}</div>
                </div>
                <div class="score">
                    <div class="text">评分：</div>
                    <ul :class="rate.scoreName">
                        <li class="star"></li>
                        <li class="star"></li>
                        <li class="star"></li>
                        <li class="star"></li>
                        <li class="star"></li>
                    </ul>
                </div>

                <div class="tag-group" v-if="rate.type_name == 'vouchers' || rate.type == 'combo'">
                    <i class="icon" :class="rate.type_name"></i>
                    <div class="name">{{rate.pd_info}}</div>
                    <div class="labels">
                        <i class="icon label"></i>
                        <span  v-for="(tag,index1) in rate.tags" :key="index1" >{{tag}}、</span>
                    </div>
                </div>

                    
                <div class="tag-group" v-else>
                    <i class="icon" :class="rate.type_name"></i>
                    <i class="icon label"></i>
                    <span  v-for="(tag, index2) in rate.tags" :key="index2" >{{tag}}、</span>
                </div>

                <div class="content">
                    <div class="text-group">
                        <p>{{rate.comment_text}}</p>
                    </div>
                    <div class="img-group" v-if="rate.comment_img && rate.comment_img.length">
                        <img v-for="(img, index3) in rate.comment_img"
                             :key="img.img"
                             :src="img.img_url"
                             @click="showGallary(rate.comment_img, index3)"
                        >
                    </div>
                </div>

                <div class="shop-warp">
                    <div class="img-warp">
                        <img :src="rate.store_base_info.header_img">
                    </div>
                    <div class="shop-inner">
                        <div class="name">{{rate.store_base_info.store_name}}</div>
                        <div class="address">{{rate.store_base_info.address}}</div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div class="empty" v-else>
        <div class="loading" v-if="listLoading"></div>
        <img src="/static/img/no_rate.png" mode="aspectFit" >
        <div class="text">暂无评价！</div>
    </div>
    
    <common-gallary v-if="showGallaryState && photoList.length"
        :imgs="photoList"
        :index="showGallaryIndex"
        @close="closeGallary"
    ></common-gallary>
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
            rateList: [],
            photoList: []
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
            this.$router.push({
                path: '/pages/shop/index/main?shop_id=' + id
            }) 
        },
        getMyRate() {
            const page = this.page
            apiGetMyRate({
                limit: 15,
                page
            }).then(res => {
                if (page === 1) {
                    this.rateList = []
                }
                res.list.forEach(item => {
                    if (item.type) {
                        item.type_name = findKey(orderType,item.type)
                    }
                    if (item.add_time) {
                        item.add_time = formatTime(item.add_time)
                    }
                    if (item.Star_num) {
                        let scoreName = 'score' + item.Star_num
                        const scoreDot = scoreName.indexOf('.')
                        if (scoreDot > -1) {
                            scoreName = scoreName.slice(0,scoreDot)
                        }
                        item.scoreName = scoreName
                    }
                    this.rateList.push(item)
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
.rate-list{
    background: #fff;
}
.rate-warp{
    padding: 30rpx 24rpx;
    border-bottom:  1rpx solid #e8e8e8;
    position: relative;
    >.img-warp{
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        overflow: hidden;
        position: absolute;
        left: 24rpx;
        top: 30rpx;
        background: #f5f5f5;
        img{
            width: 80rpx;
            height: 80rpx;
        }
    }
    .rate-inner{
        margin-left: 120rpx;
        >.title{
            padding: 10rpx 0;
            display: flex;
            justify-content: space-between;
        }
    }
    .nickname{
        font-size: 26rpx;
        color: #000;
    }
    .add_time{
        font-size: 24rpx;
        color: #818181;
    }
    .score{
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
        .text{
            color:#818181;
            margin-right: 10rpx;
            font-size: 24rpx;
            line-height: 1;
        }
        .star{
            width: 25rpx;
            height: 25rpx;
            display: inline-block;
            vertical-align: bottom;
            background-size: 25rpx 25rpx;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/icon_rating_bar_secondary_progress.png');
        }
        &1 .star:nth-child(1),
        &2 .star:nth-child(-n + 2),
        &3 .star:nth-child(-n + 3),
        &4 .star:nth-child(-n + 4),
        &5 .star:nth-child(-n + 5) {
            background-image: url('~@/assets/img/icon_rating_bar_progress.png');
        }
        &1.dot .star:nth-child(2),
        &2.dot .star:nth-child(3),
        &3.dot .star:nth-child(4),
        &4.dot .star:nth-child(5) {
            position: relative;
            &::after{
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                width: 50%;
                height: 100%;
                vertical-align: bottom;
                background-size: 25rpx 25rpx;
                background-position: 0 0;
                background-repeat: no-repeat;
                background-image: url('~@/assets/img/icon_rating_bar_progress.png');
            }
            
        }
    }
    
    .tag-group{
        margin-bottom: 10rpx;
        font-size: 0;
        span{
            font-size: 11px;
            color: #818181;
        }
        .name{
            font-size: 11px;
            color: #818181;
            line-height: 1.4;
            margin-bottom: 10rpx;
        }
        .labels{
            clear: both;
            display: flex;
        }
    }

    
    .icon {
        float: left;
        width: 14px;
        height: 14px;
        margin-right: .2rem;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        &.vouchers {
            background-image: url(~@/assets/img/vouchers.png);
        }
        &.combo {
            background-image: url(~@/assets/img/combo.png);
        }
        &.paying {
            background-image: url(~@/assets/img/paying.png);
        }
        &.goods {
            background-image: url(~@/assets/img/goods.png);
        }
        &.label {
            background-image: url(~@/assets/img/label.png);
        }
    }

    .content{
        .text-group {
            line-height: 40rpx;
            color: #323232;
            font-size: 13px;
        }
        .img-group {
            margin-top: 20rpx;
            overflow: hidden;
            img {
                /* display: inline-block; */
                float: left;
                width: 180rpx;
                height: 180rpx;
                margin: 0;
                padding: 0;
                margin-right: 10rpx;
                margin-bottom: 10rpx;
                background-color: #f2f2f2;
            }
        }
    }
}
.shop-warp{
    background: #f5f5f5;
    padding: 10rpx;
    display: flex;
    .img-warp{
        width: 80rpx;
        height: 80rpx;
        margin-right: 24rpx;
        img{
            width: 80rpx;
            height: 80rpx;
        }
    }
    .shop-inner{
        .name{
            font-size: 30rpx;
            color: #000;
        }
        .address{
            font-size: 26rpx;
            color: #818181;
        }
    }
}
.empty{
    text-align: center;
    img{
        width: 300rpx;
        height: 300rpx;
        margin-top: 100rpx;
    }
    .text{
        margin-top: 15rpx;
        font-size: 24rpx;
        color: #818181;
        text-shadow: 1px 1px 1px #e8e8e8;
    }
}  
</style>
