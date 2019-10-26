<!--
 * @Author: zhangHang
 * @Date: 2019-05-16 16:04:59
 * @Description: file content
 -->
<template>
<div class="shop-card" v-if="shop && shop.x_id" @click="jumpShop(shop)">
    <div class="card hotel" v-if="shop.industry=='2'">
        <div class="hl-img">
            <img :src="shop.headerImg[0].img_url" alt="">
        </div>
        <div class="hl-content">
            <div class="title">
                <div class="name">{{shop.store_name}}</div>
            </div>
            <div class="score">
                <span class="num">{{score}}</span>分
            </div>
            <div class="address">{{shop.address}}</div>
        </div>
    </div>

    <div class="card other" v-else>
        <div class="activity"   :class="{gray: Activity}"
             v-if="shop.giveInfo">
            <div class="top">
                <div class="img-warp">
                    <ImageView :src="shop.giveInfo.img" mode='scaleToFill' height="400rpx" width="690rpx"></ImageView>
                </div>
                <div class="product">
                    <div class="icon"></div>
                    <div class="disc">
                        <p>价值{{shop.giveInfo.buyer}}元{{shop.giveInfo.pro_name}}
                            <span>{{shop.giveInfo.number}} {{shop.giveInfo.unit}}</span>
                        </p>
                    </div>
                    <div class="linetime">
                        <div class="library">
                            <div class="progress" :style="{width:(shop.giveInfo.sale/shop.giveInfo.library*100)+ '%'}"></div>
                            <p class="sale">已售 {{shop.giveInfo.sale}} 张</p>
                        </div>
                        <div class="time">剩余 {{shop.giveInfo.library - shop.giveInfo.sale}} 张</div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="info">
                    <div class="name">{{shop.store_name}}</div>
                    <ul class="score" :class="scoreName">
                        <li class="star"></li>
                        <li class="star"></li>
                        <li class="star"></li>
                        <li class="star"></li>
                        <li class="star"></li>
                        <li class="text">{{score}}</li>
                    </ul>
                    <div class="location">
                        <span class="address">{{shop.address}}</span>
                        <span class="number">{{distance}}</span>
                    </div>
                </div>
                <div class="handle">
                    <div class="price">{{shop.giveInfo.sale_price}}</div>
                    <div class="go gray" v-if="shop.giveInfo.sale>=shop.giveInfo.library">已售罄</div>
                    <div class="go" v-else @click.stop="jumpItemPage(shop.giveInfo, 'timesale')">马上抢</div>
                    
                </div>
            </div>
        </div>
        
        <div class="default" v-else>
            <div class="top">                
                <div class="logo">
                    <ImageView :src="shop.img_url" mode='scaleToFill' width='130rpx' height='130rpx'></ImageView>
                </div>
                <div class="title">
                    <div class="name">
                        <p>{{shop.store_name}}</p>
                        <div class="discount" v-if="discount">
                            <p class="text">{{discount}}<span>折</span>买</p>
                        </div>
                    </div>
                    <div class="desc">
                        <ul class="score score1">
                            <li class="star"></li>
                            <li class="text">{{score}}</li>
                        </ul>
                        <div class="location">
                            <span class="address">{{shop.address}}</span>
                            <span class="number">{{distance}}</span>
                        </div>
                    </div>
                    <ul class="vouchers" v-if="shop.vouchers">
                        <block v-for="(voucher, v_id) of shop.vouchers" :key="v_id" >
                            <li class="voucher" >
                                {{voucher.vouchers_name}}
                            </li>
                        </block>
                    </ul>
                </div>
            </div>
            <div class="bottom">                
                <ul class="groupon list-img">
                    <block v-for="group of shop.groupInfo" :key="group.id">
                        <li class="group-info"  @click.stop="jumpItemPage(group, 'combo')">
                            <ImageView :src="group.img_url" mode='scaleToFill' height="200rpx" width="200rpx"></ImageView>
                            <div class="name">{{group.group_name}}</div>
                            <p class="price">
                                <span class="new">{{group.group_price}}</span>
                                <span class="old">{{group.price}}</span>
                            </p>
                        </li>
                    </block>
                </ul>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import LastTime from "@c/shop/LastTime.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { likeShare, unLikeShare, apiShareStore } from "@/api/api";
import { getDistance } from '@/utils/index';
import { mapState } from 'vuex';

export default {
    name: 'ShopCard',
    components: {
        ImageView,
        LastTime
    },
    data() {
        return {
            Activity: false,
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
        score() {
            let score = parseFloat(this.shop.star)
            if (score !== 0) {
                score = score.toFixed(1);
            }
            return score;
        },
        scoreName() {
            if (!this.shop.star) {
                return ''
            }
            let scoreName = 'score' + this.shop.star
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
            let num = _this.shop.distance
            if (num > 1000) {
                return (num / 1000).toFixed(1) + 'km'
            } else {
                return num + 'm'
            }
        },
        discount() {
            if (!this.shopInfo.check) {
                return null
            } 
            let discount = this.shopInfo.check;
            const check = discount ? discount / 10 : null
            return check 
        },
    },
    methods: {
        jumpShop(shop) {
            if (shop.giveInfo) {
                this.$router.push({
                    path: '/pages/shop/saletime/main?gid=' + shop.giveInfo.gid
                })
            } else {    
                this.$router.push({
                    path: '/pages/shop/index/main?shop_id=' + shop.x_id
                })
            }
            
        },
        jumpItemPage(item, title) {
            let pathUrl = ''
            switch (title) {
            case 'combo':
                pathUrl = `/pages/shop/item/main?shop_id=${item.x_id}&title=${title}&item_id=${item.id}`
                break;
            case 'timesale':
                if (!this.Activity) {
                    pathUrl = `/pages/orders/confirm/main?shop_id=${item.x_id}&title=${title}&item_id=${item.gid}`
                }
                break;
            }
            if (pathUrl !== '') {
                this.$router.push({
                    path: pathUrl
                })
            }
            
        },
        stopActivity() {
            this.Activity = true
        }
    },
};
</script>


<style lang="scss" scoped>
.shop-card{
    padding:20rpx 30rpx;
    font-family: '.PingFang-SC-Medium';
}
.card{
    background: #fff;
    border-radius: 10rpx;
    padding: 36rpx 24rpx;
    position: relative;
    box-shadow: 1px 4px 10px #ddd;
    .score{
        display: flex;
        align-items: center;
        .text{
            color:#ff5100;
            margin-left: 10rpx;
            font-size: 12px;
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
}
.other{
    padding: 0;
    overflow: hidden;
    .title{
        margin-bottom: 20rpx;
        .discount{
            height: 30rpx;
            line-height: 30rpx;
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
    
    .location{
        font-size: 12px;
        color: #818181;
        display: flex;
        .address{
            max-width: 200rpx;
            min-width: 100rpx;
            width: auto;
            word-wrap: normal;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            padding-right: 24rpx;
            border-right: 1rpx solid #e8e8e8;
        }
        .number{
            padding-left: 24rpx;
        }
    }
}
.activity{
    &.gray{
        -webkit-filter: grayscale(100%)
    }
    .top{
        position: relative;
    }
    .bottom{
        padding: 30rpx;
        display: flex;
        line-height: 1;
        .info{
            flex: 1;
        }
        .name{
            font-size: 16px;
            color: #000;
            font-weight: 700;
            margin-bottom: 20rpx;
        }
        .location{
            margin-top: 30rpx;
        }
        .price{
            &::before{
                content: "￥";
                font-size: 16px;
            }
            font-size: 27px;
            color: #323232;
            font-weight: 700;
            text-align: center;
        }
        .go{
            background: #ff1800;
            color: #fff;
            font-size: 14px;
            font-weight: 700;
            height: 60rpx;
            min-width: 88rpx;
            line-height: 60rpx;
            border-radius: 60rpx;
            margin-top: 10px;
            padding: 0 24rpx;
            text-align: center;
            &.gray{
                -webkit-filter: grayscale(100%)
            }
        }
    }
    .product{
        position: absolute;
        bottom: 0;
        height: 100rpx;
        width: 100%;
        background: rgba(0, 0, 0, .6);
        display: flex;
        color: #fff;
        .icon{
            margin-left: 30rpx;
            width: 108rpx;
            height: 108rpx;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/send.png');
            position: relative;
            top: -24rpx;
        }
        .disc{
            font-size: 15px;
            font-weight: 400;
            margin: 0 10rpx;
            flex: 1;
            display: flex;
            align-items: center;
            line-height: 1.4;
        }
        .linetime{
            font-size: 12px;
            background-size: auto 100rpx;
            background-position: left center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/linetime.png');
            padding: 0 24rpx 0 30rpx;
            position: relative;
            &::after{
                content: '';
                position:absolute;
                right: 0;
                top: 0;
                left: 50rpx;
                height: 100%;
                z-index: 1;
                background: #ff5100;
            }
            .library{
                font-size: 10px;
                min-width: 100rpx;
                padding: 0 24rpx;
                margin: 20rpx auto 10rpx;
                height: 30rpx;
                line-height: 30rpx;
                background: #fde7d8;
                border-radius: 30rpx;
                position: relative;
                overflow: hidden;
                z-index: 3;
                .progress{
                    position:absolute;
                    left: 0;
                    top: 0;
                    width: 0;
                    height: 30rpx;
                    z-index: 8;
                    background: #ffde00;
                }
                .sale{
                    position: relative;
                    text-align: center;
                    z-index: 10;
                    color: #13100c;
                }
            }
            .time{
                position: relative;
                z-index: 4;
                text-align: center;
            }
        }
    }
}
.default{
    padding: 30rpx;
    .top{
        display: flex;
    }
    .bottom{
        margin-top: 30rpx;
        overflow-x: auto;
    }
    .logo{
        width: 130rpx;
        height: 130rpx;
        border-radius: 10rpx;
        overflow: hidden;
        margin-right: 24rpx;
    }
    .title{
        flex: 1;
        margin: 0;
        .desc{
            display: flex;
            margin-top: 10rpx;
        }
        .score{
            margin-right: 10rpx;
        }
    }
    .name{
        font-weight: 700;
        color: #000;
        font-size: 16px;
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
        margin-left: 10rpx;
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
    .vouchers{
        margin-top: 15rpx;
        display: flex;
        .voucher{
            border: 1rpx solid #ffd4ce;
            border-radius: 2px;
            padding: 7rpx;
            margin-right: 10rpx;
            color: #ff5100;
            font-size: 9px;
            line-height: 1;
        }
    }
    .groupon{
        display: flex; 
        min-width: 100%;
        justify-content: space-between;
        .group-info{
            width: 200rpx;
            overflow: hidden;
            border-radius: 10rpx;
            line-height: 1.3;
        }
        .name{
            font-size: 12px;
            margin-top: 15rpx;
            word-wrap: normal;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
        .price{
            margin-top: 25rpx;
            .new{
                &::before{
                    content: "￥";
                    margin-right: -2rpx;
                }
                color: #ff1800;
                font-size: 15px;
                margin-right: 8rpx;
                font-weight: 700;
            }
            .old{
                &::before{
                    content: "￥";
                    margin-right: -2rpx;
                }
                font-size: 10px;
                color: #818181;
            }
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

