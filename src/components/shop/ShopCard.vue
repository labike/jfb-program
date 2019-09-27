<!--
 * @Author: zhangHang
 * @Date: 2019-06-01 11:25:13
 * @Description: file content
 -->
<template>
<div class="shop-card" 
    v-if="shop && shop.s_id"
    @click="jumpShop(shop.s_id)"
    
>
    <div class="card other" v-if="shop.type=='other'">
        <div class="sends"  v-if='shop.indexActivity'>
            <img src="/static/img/send2.png"/>
        </div>
        <div class="title">
            <div class="name">{{shop.store_name}}</div>
            <div class="discount" v-if="discount">
                <p class="text">{{discount}}<span>折</span>买</p>
            </div>
            <!-- <div class="dishes" v-if="shop.sort_name==='美食'"></div> -->
        </div>
        <div class="rate">
            <ul class="score" :class="scoreName">
                <li class="star"></li>
                <li class="star"></li>
                <li class="star"></li>
                <li class="star"></li>
                <li class="star"></li>
                <li class="text">{{shop.score}}</li>
            </ul>
            <div class="record" v-if="shop.msgData">
                <rollnotice autoplay="2000" :rollData='shop.msgData'>
                </rollnotice>
            </div>
        </div>
        <ul class="info">
            <li>{{shop.sort_name}}</li>
            <li class="address">{{shop.address}}</li>
            <li class="distance"  v-if="shop.distance">{{shop.distance}}</li>
        </ul>
        <!-- <div class="address">{{shop.address}}</div> -->
                        
        <ul class="list-img">
            <block v-for="group of shop.headerImg" :key="group.id">
                <li class="img-warp">
                    <ImageView :src="group.img_url" mode='scaleToFill' height="210rpx" width="210rpx"></ImageView>
                </li>
            </block>
        </ul>
        <div class="vouchers" v-if="vouchers">{{vouchers}}</div>
        <div class="groupon" v-if="groupon">{{groupon}}</div>
    </div>
    <div class="card hotel" v-if="shop.type=='hotel'">
        <div class="hl-img">
            <ImageView :src="shop.headerImg[0].img_url" ></ImageView>
        </div>
        <div class="hl-content">
            <div class="title">
                <div class="name">{{shop.store_name}}</div>
            </div>
            <div class="handle">
                <div class="like" @click.stop="tapLike(shop.s_id)">
                    <div class="icon"></div>
                    <div class="num">{{shop.like_num}}</div>
                </div>
                <button open-type="share" class="share" :data-share="shop" @click.stop="tapShare">
                    <div class="icon"></div>
                    <div class="num">{{shop.share_num}}</div>
                </button>
            </div>
            <div class="score">
                <span class="num">{{shop.score}}</span>分
            </div>
            <div class="address">{{shop.address}}</div>
        </div>
    </div>
</div>
</template>

<script>
import Rollnotice from "@c/rollnotice/Rollnotice.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { likeShare, apiShareStore } from "@/api/api";
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
        Rollnotice,
        ImageView
    },
    methods: {
        jumpShop(id) {
            this.$router.push({
                path: '/pages/shop/index/main?shop_id=' + id
            })
        },
        tapLike(s_id) {
            likeShare({
                s_id,
                type: 'like'
            }).then(res => {
                // store_num: 114
                console.log(res);
                this.shop.like_num = res.store_num
                wx.showToast({
                    title: res.message,
                    icon: 'success',
                    duration: 1000
                })
            })
        },
        tapShare(e) {},
    },
};
</script>


<style lang="scss" scoped>
@import "~@/assets/styles/common/mixins.scss";
.sends{
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
    img{
        width: 110rpx;
        height: 110rpx;
    }
}
.card{
    background-color: #fff;
    margin-bottom: 14rpx;
    border-radius: 10rpx;
    padding: 40rpx 24rpx;
    position: relative;
    .title{
        display: flex;
        margin-bottom: 14rpx;
        justify-items: center;
        align-items: center;
        .name{
            font-size:11pt;
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
                font-size: 24rpx;
                span{
                    font-size: 20rpx;
                }
            }
        }
        .dishes{
            height:32rpx;
            min-width:100rpx;
            background-size:auto 32rpx;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/self_cart.png');
        }
    }
    .score{
        display: flex;
        align-items: center;
        .text{
            color:#ff1800;
            margin-left: 10rpx;
            font-size: 24rpx;
            line-height: 1;
            font-weight: 700;
        }
        .star{
            width: 28rpx;
            height: 28rpx;
            margin-right: 5rpx;
            display: inline-block;
            vertical-align: bottom;
            background-size: 28rpx 28rpx;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/star.png');
        }
        &1 .star:nth-child(1),
        &2 .star:nth-child(-n + 2),
        &3 .star:nth-child(-n + 3),
        &4 .star:nth-child(-n + 4),
        &5 .star:nth-child(-n + 5) {
            background-image: url('~@/assets/img/starSelect.png');
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
}
.other{
    background-color: #fff;
    position: relative;
    margin: 24rpx;
    border-radius: 10rpx;
    .rate{
        display: flex;
        justify-content: space-between;
    }
    .record{
        flex: 1;
        text-align: right;
        color: #f9904c;
        margin-left: 20rpx;
    }
    .info{
        display: flex;
        line-height: 1;
        margin: 20rpx 0;
        li{
            color:#818181;
            font-size: 22rpx;
            position: relative;
            padding-right: 20rpx;
            &:not(:last-child)::before {
                content: '';
                position: absolute;
                z-index: 2;
                bottom: 0;
                right: 10rpx;
                width: 1rpx;
                height: 100%;
                border-right: 1rpx solid #818181;
            }
        }
        .address{
            overflow: hidden;
            width: 200rpx;
            word-wrap: normal;
            text-overflow: ellipsis;
            white-space: nowrap;

        }
    }
    .title{
        display: flex;
        margin-bottom: 16rpx;
        justify-items: center;
        align-items: center;
        .name{
            font-size: 16px;
            font-weight: 700;
            margin-right: 10rpx;
            word-wrap: normal;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            max-width: 50%;
            width: auto;
        }
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
        .dishes{
            height:32rpx;
            min-width:100rpx;
            background-size:auto 32rpx;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/self_cart.png');
        }
    }
    .list-img{
        display: flex; 
        min-width: 100%;
        justify-content: space-between;
        .img-warp{
            width: 210rpx;
        }
    }
    .vouchers{
        font-size: 24rpx;
        margin-top: 14rpx;
        @include textOverflow;
        &::before{
            content:  '';
            width: 30rpx;
            height: 30rpx;
            flex-shrink: 0;
            margin-right: 20rpx;
            display: inline-block;
            vertical-align: bottom;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/first_code.png');
        }
    }
    .groupon{
        font-size: 24rpx;
        margin-top: 14rpx;
        @include textOverflow;
        &::before{
            content:  '';
            width: 30rpx;
            height: 30rpx;
            flex-shrink: 0;
            margin-right: 15rpx;
            display: inline-block;
            vertical-align: bottom;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/first_group.png');
        }
    }
}
.hotel{
    display: flex;
    .hl-img{
        width: 193rpx;
        height: 193rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
        img{
            width: 193rpx;
            height: 193rpx;
        }
    }
    .hl-content{
        flex: 1;
        .score{
            color: #2a8cfa;
            font-size: 24rpx;
            margin-bottom: 24rpx;
            font-weight: 400;
            .num{
                font-size: 30rpx;
                margin-right: 10rpx;
                font-weight: 700;
            }
        }
    }
}
</style>

