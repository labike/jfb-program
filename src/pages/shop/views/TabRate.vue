<!--
 * @Author: zhangHang
 * @Date: 2019-05-22 09:23:41
 * @Description: file content
 -->
<template>
<!-- 网友评价 -->
<div class="comment">
    <div class="remark  border-top">
        <ul class="tag">
            <block v-for="(tag, key) of rateType" :key="key">
                <li  v-if="tag"
                    :class="{active: currentType === key }" 
                    @click="selectType(key)"
                >
                    {{ tag }}<span>({{params.nums[key+'_num']}})</span>
                </li>
            </block>
            <li v-for="(tag, index) in params.topTags" :key="tag.id" 
                :class="{active: currentType === tag.id }" 
                @click="selectTag(tag.id)" :data-index="'o_'+index"
            >
                {{ tag.type_name }}<span>({{ tag.count }})</span>
            </li>
        </ul>
        <div class="remark-list" v-if="totalPage > 0">
            <dl class="remark-item" v-for="(rate, inx) in rateList" :key="rate.id"  :data-index="'o_'+inx">
                <dt class="user">
                    <div class="avatar">
                        <img :src="rate.header_img" mode="aspectFit">
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
                        <img v-for="(img, index3) in rate.comment_img"
                             :key="img.img"
                             :src="img.img_url"
                             @click="showGallary(rate.comment_img, index3)"
                        >
                    </div>
                </dd>
                <dd class="reply" v-if="rate.is_be_reply==1">
                    <div class="text-group">
                        <p>掌柜回复 ：{{rate.reply_content}}</p>
                    </div>
                </dd>
            </dl>
        </div>
        <div class="empty" v-else>
            <div class="loading" v-if="listLoading"></div>
            <img src="/static/img/no_rate.png" mode="aspectFit" >
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
import CommonGallary from "@c/gallary/Gallary.vue";
import { apiGetShopRate } from "@/api/api.js";
import { rateType, orderType } from '@/config/base';
import { formatDate, findKey } from '@/utils/index';
export default {
    name: "shop",
    data() {
        return {
            rateType,
            rateList: [],
            totalPage: 0,
            currentPage: 1,
            currentType: 'all',
            listLoading: true,
            photoList: [],
            showGallaryIndex: 0,
            showGallaryState: false
        };
    },
    components: {
        CommonGallary
    },
    props: {
        params: Object
    },  
    onLoad (options) {
        const that = this;
        that.s_id = options.shop_id;
        this.getShopRate({
            type: that.currentType,
            page: that.currentPage,
            s_id: that.s_id
        });
    },
    methods: {
        /*获取店铺评论信息*/
        getShopRate(rateparams) {
            const _this = this
            apiGetShopRate(rateparams).then(res => {
                if (rateparams.page === 1) {
                    _this.listLoading = false;
                    _this.rateList = [];
                }
                const newList = _this._formatRateList(res.comments.list)
                _this.totalPage = res.comments.total;
                _this.rateList = _this.rateList.concat(newList);
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
        selectType(type) {
            const that = this;
            that.rateList = [];
            that.currentType = type;
            that.getShopRate({
                type: that.currentType,
                tags_id: '',
                page: that.currentPage,
                s_id: that.s_id,
                limit: 15
            });
        },
        selectTag(id) {
            const that = this;
            that.rateList = [];
            that.currentType = id;
            that.getShopRate({
                type: '',
                tags_id: id,
                page: that.currentPage,
                s_id: that.s_id,
                limit: 15
            });
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
.remark {
    position: relative;
    background: #fff;
    .tag {
        overflow: hidden;
        padding: 0.2rem 0.14rem;
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
    .remark-list {
        margin: 0 0.24rem;
    }
}
.remark-item {
    position: relative;
    padding: 0.3rem 0 0.3rem 1.28rem;
    &::before {
        content: '';
        position: absolute;
        z-index: 0;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        border-top: 1px solid #e8e8e8;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
    }
    .user {
        color: #818181;
        font-size: 12px;
        margin-top: 0.06rem;
        .nickname {
            color: #000;
            font-size: 14px;
        }
        .avatar {
            position: absolute;
            z-index: 0;
            top: 0.3rem;
            left: 0.24rem;
            width: 0.8rem;
            height: 0.8rem;
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
            top: 0.42rem;
            right: 0.24rem;
        }
    }

    .letter {
        margin-top: 0.1rem;
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
    }

    .content{
        .text-group {
            line-height: 0.4rem;
            color: #323232;
            font-size: 13px;
        }
        .img-group {
            margin-top: 0.2rem;
            overflow: hidden;
            img {
                /* display: inline-block; */
                float: left;
                width: 1.8rem;
                height: 1.8rem;
                margin: 0;
                padding: 0;
                margin-right: 0.1rem;
                margin-bottom: 0.1rem;
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
            line-height: 0.4rem;
            color: #666;
            font-size: 12px;
        }
    }
}
.rate-group {
    border: 0;
    margin-bottom: 0.1rem;
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
            padding-right: 0.1rem;
        }
    }
    .rate-item ~ .rate-item {
        margin-top: 0.2rem;
    }

    .rate {
        color: #ff9913;
        &.icon {
            width: 14px;
            height: 14px;
            margin-right: 2px;
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


.empty{
    background: #fff;
    text-align: center;
    padding: 1rem;
    position: relative;
    img{
        margin: auto;
        width: 3rem;
    }
    .text{
        font-size: .3rem;
    }
    .loading {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: #fff;
    }
}
</style>