<!--
 * @Author: zhangHang
 * @Date: 2019-06-24 12:03:04
 * @Description: file content
 -->
<template>
<div class="mod-comment-warp" :class="{myrate: !shop_id}">
    <div class="mod-comment">
        <div class="mod-comment_navlist" v-if="shop_id">
            <block v-for="(tag, key) of rateType" :key="key">
                <div v-if="tag" class="mod-comment_nav"
                    :class="{active: currentType === key }" 
                    @click="selectType(key)"
                >
                    {{ tag }}
                    <span v-if="commentScore">({{commentScore.nums[key+'_num']}})</span>
                </div>
            </block>
        </div>
        <ul class="mod-comment_taglist border-bottom" v-if="shop_id && commentScore.topTags">
            <block v-for="(tag, index) in commentScore.topTags" :key="tag.id" >
                <li 
                    :class="{active: currentType === tag.id }" 
                    @click="selectTag(tag.id)" :data-index="'o_'+index"
                >
                    {{ tag.type_name }}<span>({{ tag.count }})</span>
                </li>
            </block>
        </ul>
        <ul class="mod-comment_list" v-if="rateList.length" >
            <li class="mod-comment_item"
                v-for="(rate, inx) in rateList" :key="rate.id"  :data-index="'o_'+inx"
            >
                <div class="mod-comment_store" v-if="rate.store_base_info" @click="jumpShop(rate.x_id)">
                    <div class="store-img">
                        <ImageView :src="rate.store_base_info.header_img"
                            mode='aspectFill'  width='80rpx' height='80rpx'
                        ></ImageView>
                    </div>
                    <div class="store-name">{{rate.store_base_info.store_name}}</div>
                    <div class="store-jump">进店看看</div>
                </div>
                <div class="mod-comment_main border-top">
                    <div class="user">
                        <div class="avatar">
                            <ImageView  picture='/static/img/avatar.png' :src="rate.header_img"
                                mode='aspectFill'  width='100%' height='100%'
                            ></ImageView>
                        </div>
                        <div class="nickname">{{rate.nickname}}</div>
                        <div class="date">{{rate.add_time}}</div>
                    </div>
                    <div class="letter">
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

                    </div>
                    <div class="content">
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
                    </div>
                    <div class="reply" v-if="rate.is_be_reply==1">
                        <div class="text-group">
                            <p><span>掌柜回复 ：</span>{{rate.reply_content}}</p>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="mod-comment_empty" v-if="listEmpty">
            <div class="icon">
                <ImageView src="/static/img/no_rate.png" mode='aspectFill'  width='300rpx' height='300rpx'
                ></ImageView>
            </div>
            <div class="text">暂无评价！</div>
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
import ImageView from '@c/layouts/ImageView.vue'
import CommonGallary from "@c/gallary/Gallary.vue";
import { rateType, orderType } from '@/config/base';
import { formatTime, findKey } from '@/utils/index';
import { apiGetShopRate, apiGetMyRate } from "@/api/api.js";
import { mapState } from 'vuex';
export default {
    data() {
        return {
            rateType,
            shop_id: 0,
            currentPage: 1,
            currentTag: 0,
            currentType: 'all',
            listEmpty: false,
            scrollStatus: true,
            showGallaryState: false,
            remainListsLength: 5,
            rateList: [],
            photoList: []
        }
    },
    components: {
        ImageView,
        CommonGallary
    },
    onLoad (options) {
        mpvue.showNavigationBarLoading()
        const that = this
        that.shop_id = options.shop_id ? options.shop_id : 0;
        that.rateList = []
        that.photoList = []
        that.updateRate()
        console.log(that.storeInfo);
    },
    onUnload() {        
        const self = this;
        self.shop_id = 0
        self.currentPage = 1
        self.currentTag = 0
        self.currentType = 'all'
        self.listEmpty = false
        self.scrollStatus = false
        self.showGallaryState = false
    },
    computed: {
        ...mapState('shop',{
            commentScore: state => (state.shopInfo && state.shopInfo.commentScore)
        }),
    },
    methods: {
        jumpShop(id) {
            this.$router.push({
                path: '/pages/shop/index/main?shop_id=' + id
            }) 
        },
        
        selectTag(id) {
            const that = this;
            that.currentPage = 1
            that.rateList = [];
            that.currentType = '';
            that.currentTag = id;
            that.updateRate();
        },
        selectType(type) {
            const that = this;
            that.currentPage = 1
            that.rateList = [];
            that.currentType = type;
            that.currentTag = 0;
            that.updateRate();
        },
        updateRate() {
            const that = this
            if (that.shop_id) {
                return that.getShopRate({
                    type: that.currentType,
                    tags_id: that.currentTag,
                    page: that.currentPage,
                    s_id: that.shop_id,
                    limit: that.remainListsLength
                }).then(() => {
                    if (that.currentPage <= 1) {
                        mpvue.setNavigationBarTitle({
                            title: '商家评论列表'
                        })
                        mpvue.hideNavigationBarLoading()
                    }
                });
            } else {
                return that.getMyRate({
                    page: that.currentPage,
                    limit: that.remainListsLength
                }).then(res => {
                    if (that.currentPage <= 1) {
                        mpvue.setNavigationBarTitle({
                            title: '我的评价'
                        })
                        mpvue.hideNavigationBarLoading()
                    }
                })
            }

        },
        getMyRate(rateparams) {
            const _this = this
            return apiGetMyRate(rateparams).then(res => {
                _this.totalPage = res.total;
                _this._formatRateList(res.list)
            })
        },
        /*获取店铺评论信息*/
        getShopRate(rateparams) {
            const _this = this
            return apiGetShopRate(rateparams).then(res => {
                _this.totalPage = res.comments.total;
                _this._formatRateList(res.comments.list)
            }).catch(err => {
                _this.rateList = [];
                console.log(err);
            });
        },
        _formatRateList(list) {
            const that = this;
            that.listEmpty = !(list && list.length) && (that.currentPage === 1)
            const newList = list.map(item => {
                if (item.type) {
                    item.type_name = findKey(orderType,item.type)
                }
                if (item.add_time) {
                    item.add_time = formatTime(item.add_time)
                }
                that.rateList.push(item)
                return item
            })
            that.scrollStatus = newList.length >= that.remainListsLength
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
        this.currentPage = 1
        this.rateList = [];
        this.updateRate()
        mpvue.stopPullDownRefresh()
    },
    onReachBottom () {
        if (this.scrollStatus) {
            this.currentPage++
            this.updateRate()
        } else {
            mpvue.showToast({
                title: "没有更多数据了",
                icon: 'none',
                duration: 2000
            })
                
        }
    },
}
</script>

<style lang="scss" scoped>

.mod-comment-warp{
    position: relative;
}
.mod-comment_navlist{
    z-index: 9999;
    top: 0;
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: #323232;
    font-weight: 700;
    position: sticky;
    background-color: #fff;
    box-shadow: 1px 1px 4px #f2f2f2;
}
.mod-comment_taglist{
    overflow: hidden;
    background: #fff;
    li {
        background: #ebf5ff;
        float: left;
        font-size: 13px;
        padding: 0.2rem;
        margin: 0.12rem;
        border-radius: 3px;
        &.active {
            color: #fff;
            background: #2f81f9;
        }
    }
}
.mod-comment_nav{
    flex: 1;
    text-align: center;
    &.active{
        color: #2a8cfa;
    }
}
.mod-comment_item{
    background: #fff;
    position: relative;
    padding: 30rpx;
    padding-top: 0;
    .user {
        color: #818181;
        font-size: 12px;
        .nickname {
            color: #000;
            font-size: 14px;
            margin-right: 200rpx;
            overflow: hidden;
        }
        .avatar {
            position: absolute;
            z-index: 0;
            top: 30rpx;
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
            top: 30rpx;
            right: 24rpx;
            font-size: 10px;
        }
    }

    .letter {
        margin-top: 10rpx;
        margin-bottom: 20rpx;
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
                margin-top: 10rpx;
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
        margin-top: 20rpx;
        padding: 15rpx;
        position: relative;
        &::after{
            content: "";
            position: absolute;
            top: -12px;
            left: 40rpx;
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
            margin-left: 10rpx;
        }
        .name {
            border: 0;
            padding-left: 0;
            padding-right: 10rpx;
        }
    }
    .rate-item ~ .rate-item {
        margin-top: 20rpx;
    }

    .rate {
        color: #ff9913;
        font-size: 0;
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
.mod-comment_main{
    padding-top: 30rpx;
    padding-left: 104rpx;
}
.mod-comment_store{
    display: none;
    color: #000;
    .store-img{
        width: 80rpx;
        height: 80rpx;
        border-radius: 6rpx;
        overflow: hidden;
    }
    .store-name{
        font-size: 13px;
        margin-left: 35rpx;
        flex: 1;
        font-weight: 700;
    }
    .store-jump{
        font-size: 12px;
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
}
.myrate{
    .mod-comment_store{
        display: flex;
        align-items: center;
        padding-bottom: 30rpx;
    }
    .mod-comment_main{
        padding: 24rpx;
        background: #f2f2f2;
        border-radius: 10rpx;
        margin-top: 20rpx;
        &::before{
            top: -20rpx;
        }
    }
    .mod-comment_item{
        margin: 24rpx;
        padding: 30rpx;
        .user{
            margin-left: 70rpx;
            .avatar {
                width: 50rpx;
                height: 50rpx;
                left: 24rpx;
            }
            .nickname {
                font-size: 12px;
                font-weight: 400;
            }

        }
        .letter{
            margin-left: 70rpx;
            margin-bottom: 10rpx;
            span {
                font-size: 10px;
                line-height: 1.3;
            }
            .icon {
                width: 22rpx;
                height: 22rpx;
                margin-right: 10rpx;
            }
            .rate{
                margin: 0;
            }
            .rate-group {
                margin-bottom: 6rpx;
            }
            .tag-group{
                display: flex;
                align-items: center;
            }
        }
        .text-group{
            color: #919191;
            font-weight: 400;
        }
        .reply{
            border-radius: 10rpx;
            border: 1rpx solid #e7e7e7;
            .text-group{
                line-height: 30rpx;
                font-size: 10px;
                color: #31bbac;
            }
            
        }
    }
}

.mod-comment_empty{
    text-align: center;
    padding: 100rpx;
    position: relative;
    .icon{
        margin: auto;
        width: 300rpx;
    }
    .text{
        font-size: 15px;
    }
}
</style>
