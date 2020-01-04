<!--
 * @Author: zhangHang
 * @Date: 2019-05-22 09:23:41
 * @Description: file content
 -->
<template>
<!-- 网友评价 -->
<div class="mod-comment-warp">
    <div class="mod-comment">
        <div class="mod-comment_all" @click="jumpAllRate()">全部评价</div>
        <div class="mod-comment_list" v-if="rateList.length">
            <dl class="mod-comment_item" v-for="(rate, inx) in rateList" :key="rate.id"  :data-index="'o_'+inx">
                <dt class="user">
                    <div class="avatar">
                        <ImageView  picture='/static/img/avatar.png' :src="rate.header_img"
                            mode='aspectFill'  width='80rpx' height='80rpx'
                        ></ImageView>
                    </div>
                    <div class="nickname">{{rate.nickname}}</div>
                    <div class="date">{{rate.add_time}}</div>
                </dt>
                <dd class="letter">
                    <ul class="rate-group">
                        <li class="rate-item">
                            <span class="name">评分</span>
                            <div class="rate" :class="'rate'+rate.Star_num">
                                <i class="icon rate"></i>
                                <i class="icon rate"></i>
                                <i class="icon rate"></i>
                                <i class="icon rate"></i>
                                <i class="icon rate"></i>
                            </div>
                        </li>
                    </ul>
                    <div class="tag-group" v-if="rate.type_name == 'vouchers' || rate.type == 'combo'">
                        <i class="icon" :class="rate.type_name"></i>
                        <div class="name">{{rate.pd_info}}</div>
                        <div class="title">
                            <i class="icon label"></i>
                            <span  v-for="(tag,index1) in rate.tags" :key="index1" >{{tag}}、</span>
                        </div>
                    </div>
                    
                    <div class="tag-group" v-else>
                        <i class="icon" :class="rate.type_name"></i>
                        <i class="icon label"></i>
                        <span  v-for="(tag,index2) in rate.tags" :key="index2" >{{tag}}、</span>
                    </div>

                </dd>
                <dd class="content">
                    <div class="text-group">
                        <p>{{rate.comment_text}}</p>
                    </div>
                    <div class="img-group" v-if="rate.comment_img && rate.comment_img.length">
                        <li class="img-group-item"  v-for="(img, index3) of rate.comment_img"
                            :key="img.img"
                            @click="showGallary(rate.comment_img, index3)"
                        >   
                            <ImageView :src="img.img_url" mode='aspectFill'  width='180rpx' height='180rpx'
                            ></ImageView>
                        </li>
                    </div>
                </dd>
                <dd class="reply" v-if="rate.is_be_reply==1">
                    <div class="text-group">
                        <p>掌柜回复 ：{{rate.reply_content}}</p>
                    </div>
                </dd>
            </dl>
        </div>
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
import ImageView from '@c/layouts/ImageView.vue'
import { apiGetShopRate } from "@/api/api.js";
import { orderType } from '@/config/base';
import { formatDate, findKey } from '@/utils/index';
export default {
    name: "shop",
    data() {
        return {
            rateList: [],
            shop_id: 0,
            totalPage: 0,
            currentPage: 1,
            currentType: 'all',
            photoList: [],
            showGallaryIndex: 0,
            showGallaryState: false
        };
    },
    components: {
        CommonGallary,
        ImageView
    },
    props: {
        params: Object
    },  
    onLoad (options) {
        const that = this;
        that.shop_id = options.shop_id;
        this.getShopRate({
            type: that.currentType,
            page: that.currentPage,
            s_id: that.shop_id,
            limit: 2
        });
    },
    methods: {
        jumpAllRate() {
            this.$router.push({
                path: `/pages/mine/evaluate/main?shop_id=${this.shop_id}`
            })
        },
        /*获取店铺评论信息*/
        getShopRate(rateparams) {
            const _this = this
            apiGetShopRate(rateparams).then(res => {
                if (rateparams.page === 1) {
                    _this.rateList = [];
                }
                _this.totalPage = res.comments.total;
                _this.rateList = _this._formatRateList(res.comments.list)
            }).catch(err => {
                _this.rateList = [];
                console.log(err);
            });
        },
        _formatRateList(list) {
            const that = this;
            const newList = list.map(item => {
                if (item.type) {
                    item.type_name = findKey(orderType,item.type)
                }
                if (item.add_time) {
                    item.add_time = formatDate(item.add_time)
                }
                return item
            })
            return newList
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
    }
};
</script>


<style lang="scss" scoped>
.mod-comment-warp{
    margin: 24rpx;
    padding-top: 40rpx;
    position: relative;
    background: #fff;
    z-index: 0;
}
.mod-comment_all{
    position: absolute;
    right: 0;
    top: -60rpx;
    z-index: 100;
    font-size: 12px;
    font-weight: 700;
    color: #666;
    &::after{
        content: '';
        width: 13rpx;
        height: 32rpx;
        background-image: url(~@/assets/img/right.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        display: block;
        float: right;
        margin-left: 10rpx;
    }
}
.mod-comment_item{
    position: relative;
    padding-left: 104rpx;
    margin-bottom: 30rpx;
    .user {
        color: #818181;
        font-size: 12px;
        .nickname {
            color: #000;
            font-size: 14px;
        }
        .avatar {
            position: absolute;
            z-index: 0;
            top: 0;
            left: 0;
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            background-color: #f2f2f2;
            overflow: hidden;
        }
        img{
            width: 100%;
            height: 100%;
        }
        .date {
            position: absolute;
            z-index: 0;
            top: 0;
            right: 24rpx;
            font-size: 10px;
        }
    }

    .letter {
        margin-top: 10rpx;
        margin-bottom: 0.2rem;
        span {
            font-size: 11px;
            color: #818181;
            line-height: 1.4;
        }
        .tag-group{
            font-size: 0;
            .name{
                font-size: 11px;
                color: #818181;
                line-height: 1.4;
            }
            .title{
                clear: both;
                margin-top: .1rem;
            }
        }
        .icon {
            float: left;
            width: 28rpx;
            height: 28rpx;
            margin-right: 20rpx;
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
            &.vippay {
                background-image: url(~@/assets/img/vip_pay.png);
            }
            &.goods {
                background-image: url(~@/assets/img/goods.png);
            }
            &.timesale {
                background-image: url(~@/assets/img/timesale.png);
            }
            &.label {
                background-image: url(~@/assets/img/label.png);
            }
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
            .img-group-item {
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
    .reply{
        background: #f2f2f2;
        margin-top: .2rem;
        padding: .15rem;
        position: relative;
        &::after{
            content: "";
            position: absolute;
            top: -12px;
            left: .4rem;
            width: 0;
            height: 0;
            border-width: 6px;
            border-style: solid;
            border-color: transparent transparent #f2f2f2 transparent;
        }
        .text-group {
            line-height: 40rpx;
            color: #666;
            font-size: 12px;
        }
    }
}
.rate-group {
    border: 0;
    margin-bottom: 10rpx;
    .rate-item {
        display: flex;
        font-size: 12px;
        color: #818181;
        .rate-title {
            color: #ffb400;
            margin-left: .1rem;
        }
        .name {
            border: 0;
            padding-left: 0;
            padding-right: 10rpx;
        }
    }
    .rate-item ~ .rate-item {
        margin-top: 0.2rem;
    }

    .rate {
        color: #ff9913;
        &.icon {
            width: 28rpx;
            height: 28rpx;
            margin-right: 1rpx;
            display: inline-block;
            vertical-align: text-bottom;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/star2.png');
        }
    }
    .rate1 .icon:nth-child(1) {
        background-image: url('~@/assets/img/starSelect2.png');
    }
    .rate2 .icon:nth-child(-n + 2) {
        background-image: url('~@/assets/img/starSelect2.png');
    }
    .rate3 .icon:nth-child(-n + 3) {
        background-image: url('~@/assets/img/starSelect2.png');
    }
    .rate4 .icon:nth-child(-n + 4) {
        background-image: url('~@/assets/img/starSelect2.png');
    }
    .rate5 .icon:nth-child(-n + 5) {
        background-image: url('~@/assets/img/starSelect2.png');
    }

    
}


</style>