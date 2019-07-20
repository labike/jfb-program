<template>
<div class="shop-card" v-if="shop && shop.s_id" @click="jumpShop(shop.s_id)">
  
    <div class="card hotel" v-if="shop.type=='2'">
        <div class="hl-img">
            <img :src="shop.headerImg[0].img_url" alt="">
        </div>
        <div class="hl-content">
            <div class="title">
                <div class="name">{{shop.store_name}}</div>
            </div>
            <div class="score">
                <span class="num">{{shop.score}}</span>分
            </div>
            <div class="address">{{shop.address}}</div>
        </div>
    </div>
    <div class="card other" v-else>
        <div class="title">
            <div class="name">{{shop.store_name}}</div>
            <div class="discount" v-if="discount">
                <p class="text">{{discount}}<span>折</span>买</p>
            </div>
        </div>
        <div class="distance">
            <ul class="score" :class="scoreName">
                <li class="star"></li>
                <li class="star"></li>
                <li class="star"></li>
                <li class="star"></li>
                <li class="star"></li>
                <li class="text">{{shop.score}} 分</li>
            </ul>
            <div class="location">
                <span class="number">{{distance}}</span>
                <span class="remark" v-if="shop.type == 1">自助点餐</span>
                <span class="remark" v-if="shop.type == 3">到店消费</span>
                <span class="remark" v-if="shop.type == 4">自助养车</span>
            </div>
        </div>

        <div class="record" v-if="shop.msgData">
            <rollnotice autoplay="2000" :rollData='shop.msgData'>
            </rollnotice>
        </div>
        <ul class="list-img">
            <li class="img-warp" v-for="(imgItem, index) of shop.headerImg" :key="index">
                <img :src="imgItem.img_url" />
            </li>
        </ul>
        <div class="promotion vouchers" v-if="vouchers">{{vouchers}}</div>
        <div class="promotion groupon" v-if="groupon">{{groupon}}</div>
        <div class="handle">
            <div class="handle-item" @click.stop="tapLike('like')">
                <div class="icon like" v-if="!shop.user_is_like"></div>
                <div class="icon like_1" v-else></div>
                <div class="num">{{shop.like_num}}</div>
            </div>
            <div class="handle-item" v-if="!shop.user_is_collect" @click.stop="tapLike('collect')">
                <div class="icon collect"></div>
                <div class="num">{{shop.collect_num}}</div>
            </div>
            <div class="handle-item" v-else @click.stop="cancelCollect">
                <div class="icon collect_1" ></div>
                <div class="num">{{shop.collect_num}}</div>
            </div>
            <div class="handle-item" @click.stop="jumpShop(shop.s_id, 'rate=1')">
                <div class="icon rate"></div>
                <div class="num">{{shop.comment_num}}</div>
            </div>
            <button class="handle-item"  open-type="share" :data-share="shop" @click.stop="tapShare">
                <div class="icon share"></div>
                <div class="num">{{shop.share_num}}</div>
            </button>
        </div>
    </div>
</div>
</template>

<script>
import Rollnotice from "@c/rollnotice/Rollnotice.vue";
import { likeShare, unLikeShare, apiShareStore } from "@/api/api";
import { getDistance } from '@/utils/index';
import { mapState } from 'vuex';

export default {
    name: 'ShopCard',
    data() {
        return {
            shop: {}
        }
    },
    props: {
        shopInfo: Object
    },
    onLoad() {
        this.shop = this.shopInfo
    },
    computed: {
        ...mapState('user', [
            'lat',
            'lng',
        ]),
        scoreName() {
            if (!this.shop.score) {
                return ''
            }
            let scoreName = 'score' + this.shop.score
            const scoreDot = scoreName.indexOf('.')
            if (scoreDot > -1) {
                scoreName = scoreName.slice(0,scoreDot)
                if (Math.round(this.shop.score) > Math.floor(this.shop.score)) {
                    scoreName = scoreName + ' dot'
                }
            }
            return scoreName;
        },
        distance() {
            const _this = this
            let num = getDistance(_this.lat, _this.lng, _this.shop.lat, _this.shop.lng)
            if (num > 1000) {
                return (num / 1000).toFixed(0) + 'Km'
            } else {
                return num + 'm'
            }
        },
        
        discount() {
            if (!this.shop.proData) {
                return null
            } 
            let discount = this.shop.proData.find(item => {
                return item.type === 'check'
            });
            const check = discount ? discount.name.match(/^\d*(\.?\d{0,1})/g)[0] : null
            return check 
        },
        vouchers() {
            if (this.shop.proData) {
                let vouchers = this.shop.proData.find(item => {
                    return item.type === 'vouchers'
                })
                return vouchers ? vouchers.name : null
            }
            return null 
        },
        groupon() {
            if (this.shop.proData) {
                let groupon = this.shop.proData.find(item => {
                    return item.type === 'group'
                })
                return groupon ? groupon.name : null
            }
            return null
        }
    },
    components: {
        Rollnotice
    },
    methods: {
        jumpShop(id) {
            mpvue.navigateTo({
                url: '/pages/shop/index/main?shop_id=' + id
            }) 
        },
        tapLike(type) {
            const s_id = this.shop.s_id
            likeShare({
                s_id,
                type,
            }).then(res => {
                console.log(res);
                if (type === 'like') { 
                    this.shop.like_num = res.store_num
                    this.shop.user_is_like = !this.shop.user_is_like
                }
                if (type === 'collect') { 
                    this.shop.collect_num = Number(this.shop.collect_num) + 1
                    this.shop.user_is_collect = true
                }
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 1000
                })
            })
        },
        cancelCollect() {
            const s_id = this.shop.s_id
            unLikeShare({
                s_ids: s_id,
                type: 'collect',
            }).then(res => {
                console.log(res);
                this.shop.collect_num = Number(this.shop.collect_num) - 1
                this.shop.user_is_collect = false
                wx.showToast({
                    title: res.message,
                    icon: 'success',
                    duration: 1000
                })
            })
        },
        
        tapShare(e) {

        },
    },
};
</script>


<style lang="scss" scoped>

.card{
    background: #fff;
    margin-bottom: 24rpx;
    border-radius: 10rpx;
    padding: 36rpx 24rpx;
    position: relative;
    .title{
        font-family: '.PingFang-SC-Medium';
        line-height: 1;
        display: flex;
        margin-bottom: 20rpx;
        justify-items: center;
        align-items: center;
        .name{
            font-size: 30rpx;
            font-weight:700;
            margin-right: 10rpx;
        }
        .discount{
            height: 30rpx;
            line-height: 1;
            display: flex;
            align-items: center;
            letter-spacing: 1px; 
            border-radius: 2px;
            padding-left: 15rpx;
            padding-right: 5rpx;
            margin-right: 10rpx;
            background-size: auto 30rpx;
            background-position: left center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/discount.png');
            position: relative;
            overflow: hidden;
            &::before{
                content:  '';
                position: absolute;
                left: 50%;
                top: 0;
                right: 0;
                bottom: 0;
                z-index: 1;
                background: #ff2900;
            }
            .text{
                position: relative;
                z-index: 2;
                color: #fff;
                font-size:12px;
                span{
                    font-size:9px;
                }
            }
        }
    }
    .handle{
        border-top: 1rpx dashed #e8e8e8;
        display: flex;
        height: 100rpx;
        align-items: center;
        margin-top: 20rpx;
        .handle-item{
            display: flex;
            height: 100%;
            align-items: center;
            flex: 1;
            justify-content: center;
            &::after{
                content: '';
                display: none;
            }
        }
        .num{
            font-size: 24rpx;
            color: #818181;
        }
        .icon{
            margin-right: 15rpx;
            width: 30rpx;
            height: 30rpx;
            display: inline-block;
            vertical-align: bottom;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            &.like{
                background-image: url('~@/assets/img/icon_like.png');
            }
            &.like_1{
                background-image: url('~@/assets/img/icon_like_1.png');
            }
            &.collect{
                background-image: url('~@/assets/img/icon_collect.png');
            }
            &.collect_1{
                background-image: url('~@/assets/img/icon_collect_1.png');
            }
            &.rate{
                background-image: url('~@/assets/img/icon_msg.png');
            }
            &.share{
                background-image: url('~@/assets/img/icon_share.png');
            }
        }
    }
}
.other{
    padding: 38rpx 24rpx 0;
    .title{
        margin-bottom: 20rpx;
        .discount{
            height: 30rpx;
            border-radius: 2px;
            padding-left: 15rpx;
            padding-right: 5rpx;
            margin-right: 10rpx;
            background-size: auto 30rpx;
            background-position: left center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/discount.png');
            position: relative;
            overflow: hidden;
            &::before{
                content:  '';
                position: absolute;
                left: 50%;
                top: 0;
                right: 0;
                bottom: 0;
                z-index: 1;
                background: #ff2900;
            }
            .text{
                position: relative;
                z-index: 2;
                color: #fff;
                font-size:12px;
                span{
                    font-size:9px;
                }
            }
        }
    }
    .distance{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10rpx;
    }
    .score{
        display: flex;
        align-items: center;
        .text{
            color:#818181;
            margin-left: 10rpx;
            font-size: 24rpx;
            line-height: 1;
        }
        .star{
            width: 24rpx;
            height: 24rpx;
            display: inline-block;
            vertical-align: bottom;
            background-size: 24rpx 24rpx;
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
    .location{
        color: #000;
        font-size: 22rpx;
        .number{
            padding-right: 24rpx;
            border-right: 1rpx solid #e8e8e8;
        }
        .remark{
            padding-left: 24rpx;
        }
    }
    .record{
        margin-bottom: 14rpx;
    }
    .list-img{
        display: flex;
        margin-right: -10rpx;
        .img-warp{
            width: 33.333%;
            padding-right: 10rpx;
            img{
                width: 100%;
                height: 180rpx;
                border-radius: 10rpx;
            }
        }
    }
    .promotion{
        font-size: 24rpx;
        margin-top: 15rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
         &::before{
            content:  '';
            flex-shrink: 0;
            width: 30rpx;
            height: 30rpx;
            margin-right: 20rpx;
            display: inline-block;
            vertical-align: bottom;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
        }
    }
    .vouchers{
        &::before{
            background-image: url('~@/assets/img/first_code.png');
        }
    }
    .groupon{
        &::before{
            background-image: url('~@/assets/img/first_group.png');
        }
    }
}
.hotel{
    display: flex;
    .hl-img{
        width: 1.93rem;
        height: 1.93rem;
        margin-right: .2rem;
        flex-shrink: 0;
        img{
            width: 1.93rem;
            height: 1.93rem;
        }
    }
    .hl-content{
        flex: 1;
        .score{
            color: #2a8cfa;
            font-size: .24rem;
            margin-bottom: .24rem;
            font-weight: 400;
            .num{
                font-size: .3rem;
                margin-right: .1rem;
                font-weight: 700;
            }
        }
        .address{
            color: #818181;
            font-size: .20rem;
        }
    }
}
</style>

