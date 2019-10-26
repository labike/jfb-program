<!--
 * @Author: zhangHang
 * @Date: 2019-09-21 11:20:27
 * @Description: file content
 -->
<template>

<div  class="time-sale-warp" v-if="shopAdvt">
    <scroll-view class="time-sale"  scroll-y>
        <div class="activity" :class="{gray: shopAdvt.stopActivity}" >
            <div class="top">
                <div class="img-warp">
                    
                    <swiper :indicator-dots='true' indicator-color='rgba(0, 0, 0, .3)' indicator-active-color="#fff" :style="{height: '400rpx'}" :autoplay='false' :interval='6000' :duration='1000' :circular='true'>
                        <swiper-item>
                            <ImageView :src="shopAdvt.img" mode='scaleToFill' height="400rpx" width="750rpx"></ImageView>
                        </swiper-item>
                        <swiper-item>
                            <ImageView :src="shopAdvt.proImg" mode='scaleToFill' height="400rpx" width="750rpx"></ImageView>
                        </swiper-item>
                </swiper>
                </div>
                <div class="product">
                    <div class="info">
                        <div class="name">抢购价</div>
                        <div class="disc">
                            <p class="price">{{shopAdvt.sale_price}}</p>
                            <p class="consume">最低消费{{shopAdvt.min_consume}}元</p>
                        </div>
                    </div>
                    <div class="linetime">
                        <div class="library">
                            <div class="progress" :style="{width:(shopAdvt.sale/shopAdvt.library*100)+ '%'}"></div>
                            <p class="sale">已售 {{shopAdvt.sale}} 张</p>
                        </div>
                        
                        <div class="time">剩余 {{shopAdvt.library - shopAdvt.sale}} 张</div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="title"><i class="icon"></i>价值{{shopAdvt.buyer}}元{{shopAdvt.pro_name}}<span>{{shopAdvt.number}}{{shopAdvt.unit}}</span></div>
                <div class="location">
                    <span class="address">{{shopAdvt.storeInfo.address}}</span>
                    <span class="number">{{distance}}</span>
                </div>
            </div>
        </div>

        <div class="rule-warp">
            <div class="rule-title border-bottom">购买须知</div>
            <div class="rule-desc">
                <dl >
                    <dt>赠送商品</dt>
                    <dd>{{shopAdvt.pro_name}}</dd>
                </dl>
                <dl>
                    <dt>有效期至</dt>
                    <dd>{{shopAdvt.ruler.effective_time}}</dd>
                </dl>
                <dl>
                    <dt>不可用日期</dt>
                    <dd v-if="shopAdvt.ruler.disabled">{{shopAdvt.ruler.disabled}}</dd>
                </dl>
                <dl>
                    <dt>使用时间</dt>
                    <dd>{{shopAdvt.ruler.consume_time}}</dd>
                </dl>
                <dl>
                    <dt>使用规则</dt>
                    <dd>{{shopAdvt.ruler.bespeak}}</dd>
                    <dd>{{shopAdvt.ruler.overlying}}</dd>
                    <dd>{{shopAdvt.ruler.currency}}</dd>
                    <dd>{{shopAdvt.ruler.invoice}}</dd>
                    <dd>{{shopAdvt.ruler.refund}}</dd>
                    
                </dl>
            </div>
            
        </div>

        <div class="describe">
            <div class="title">商品描述</div>
            <div class="desc">{{shopAdvt.description}}</div>
        </div>
    </scroll-view>

    <ul class="meun-list">
        <li class="item">
            <div class="meun"  @click="jumpShop(shopAdvt.x_id)">
                <i class="icon shop"></i>
                <p class="text">进店看看</p>
            </div>
        </li>
        <li class="item">
            <div class="meun"  @click="getCallPhone(shopAdvt.storeInfo.mobile)">
                <i class="icon tel"></i>
                <p class="text">电话咨询</p>
            </div>
        </li>
        <li class="item">
            <div class="go gray" v-if="shopAdvt.stopActivity">已结束</div>
            <div class="go gray" v-else-if="shopAdvt.sale>=shopAdvt.library">已售罄</div>
            <div class="go" v-else @click="jumpItemPage(shopAdvt)">马上抢</div>
        </li>
    </ul>
</div>

</template>

<script>
import ImageView from '@c/layouts/ImageView.vue'
import { apiGiveDetail } from "@/api/api";
import { WAPHOST, shopType } from "@/config/base";
import { getDistance, callPhone } from '@/utils/index';
import { mapState } from 'vuex';
export default {
    name: "time-sale",
    data() {
        return {
            params: {},
            scrollTop: 0,
            scrollStatus: true,
            remainListsLength: 5,
            shopAdvt: null
        };
    },
    components: {
        ImageView,
    },        
    computed: {
        ...mapState('user', [
            'lat',
            'lng',
        ]),
        
        distance() {
            const _this = this
            if (!_this.lat || !_this.shopAdvt) {
                return ''
            }
            let num = getDistance(_this.lat, _this.lng, _this.shopAdvt.storeInfo.lat, _this.shopAdvt.storeInfo.lng)
            if (num > 1000) {
                return (num / 1000).toFixed(0) + 'km'
            } else {
                return num + 'm'
            }
        },
    },
    onLoad (options) {
        const that = this
        console.log(options);
        apiGiveDetail(options.gid).then(res => {
            console.log(res);
            that.shopAdvt = res
        }) 
    },
    methods: {
        stopActivity(shop) {
            shop.stopActivity = true
        },
        
        jumpShop(id) {
            this.$router.push({
                path: '/pages/shop/index/main?shop_id=' + id
            })
        },
        jumpItemPage(shop) {
            if (shop.stopActivity) {
                return
            }
            this.$router.push({
                path: `/pages/orders/confirm/main?shop_id=${shop.x_id}&title=timesale&item_id=${shop.gid}`
            })
        },
        
        getCallPhone(phone) {
            callPhone(phone)
        },
    },
};
</script>

<style lang="scss" scoped>
.time-sale{
    background: #f2f2f2;
    position: relative;
    height: 100%;
    padding-bottom: 130rpx;
    .price{
        &::before{
            content: "￥";
            font-size: 15px;
            margin-right: -4rpx;
        }
        font-size: 25px;
        color: #fff;
        font-weight: 700;
    }
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
    .activity{
        background: #fff;
        box-shadow: 1px 1px 1px #efefef;
        &.gray{
            -webkit-filter: grayscale(100%)
        }
        .top{
            position: relative;
            .info{
                flex: 1;
                padding: 14rpx 24rpx;
                line-height: 1;
            }
        }
        .bottom{
            padding: 30rpx;
            line-height: 1;
            .icon{
                margin-right: 16rpx;
                width: 68rpx;
                height: 38rpx;
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
                background-image: url('~@/assets/img/send1.png');
            }
            .title{
                font-size: 17px;
                color: #000;
                font-weight: 700;
                margin-bottom: 20rpx;
                display: flex;
                align-items: center;
            }
            .location{
                font-size: 12px;
                color: #818181;
                margin-top: 30rpx;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .address{
                position: relative;
                padding-left: 40rpx;
                &:before {
                    content: ' ';
                    position: absolute;
                    display: block;
                    left: 0;
                    top: -2px;
                    height: 15px;
                    width: 15px;
                    background-image: url('~@/assets/img/location1.png');
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: 0 0;
                    margin: auto 30rpx auto auto;
                }
            }
        }
        .product{
            height: 110rpx;
            width: 100%;
            background-image: linear-gradient(to bottom , #ff7c00, #ff2d00);
            display: flex;
            color: #fff;
            .name{
                font-size: 13px;
                color: #fff;
            }
            .disc{
                display: flex;
                align-items: center;
                margin-top: 10rpx;
            }
            .consume{
                font-size: 12px;
                margin-left: 20rpx;
                background: #fff;
                height: 40rpx;
                line-height: 40rpx;
                border-radius: 40rpx;
                text-align: center;
                color: #ff2d00;
                padding: 0 16rpx;
                min-width: 200rpx;
                font-weight: 400;
            }
            .linetime{
                font-size: 12px;
                background-size: auto 110rpx;
                background-position: left center;
                background-repeat: no-repeat;
                background-image: url('~@/assets/img/linetime1.png');
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
                    background: #ffe5b6;
                }
                .library{
                    font-size: 10px;
                    min-width: 110rpx;
                    padding: 0 24rpx;
                    margin: 20rpx auto 10rpx;
                    height: 34rpx;
                    line-height: 34rpx;
                    background: #ffb77c;
                    border-radius: 34rpx;
                    position: relative;
                    overflow: hidden;
                    z-index: 3;
                    .progress{
                        position:absolute;
                        left: 0;
                        top: 0;
                        width: 0;
                        height: 34rpx;
                        z-index: 8;
                        background: #ffde00;
                    }
                    .sale{
                        position: relative;
                        text-align: center;
                        z-index: 10;
                        color: #fff;
                    }
                }
                .time{
                    position: relative;
                    z-index: 4;
                    color: #ff2d00;
                    font-weight: 700;
                    text-align: center;
                }
            }
        }
    }
    .rule-warp{
        margin-top: 20rpx;
        background: #fff;
        .rule-title{
            height: 80rpx;
            line-height: 80rpx;
            padding: 0 24rpx;
            font-size: 14px;
        }
        .rule-desc{
            padding: 30rpx 24rpx;
            color: #323232;
        }
        dl{
            margin-bottom: 24rpx;
            dt{
                margin-bottom: 20rpx;
                font-size: 13px;
                font-weight: 700;
            }
            dd{
                font-size: 13px;
                margin-bottom: 15rpx;
                &::before {
                    content: '';
                    display: inline-block;
                    width: 0;
                    height: 0;
                    border: 2px solid #323232;
                    vertical-align: middle;
                    margin-top: -2px;
                    margin-right: 15rpx;
                    border-radius: 50%;
                }
            }
        }
    }
    .describe{
        background: #fff;
        padding: 40rpx 24rpx;
        margin-top: 20rpx;
        .title{
            color: #323232;
            font-weight: 700;
            font-size: 17px;
            margin-bottom: 24rpx;
        }
        .desc{
            padding: 28rpx;
            line-height: 1.4;
            border-radius: 10rpx;
            border: 1rpx solid #c0c0c0;
        }
    }
}

.meun-list{
    background: #f2f2f2;
    height: 130rpx;
    position: fixed;
    left:0;
    bottom:0;
    right: 0;
    box-shadow: 1px 1px 1px #efefef;
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    .item{
        flex: 1;
    }
    .meun{
        text-align: center;
        .icon{
            width: 40rpx;
            height: 40rpx;
            background-size: auto 40rpx;
            background-position:center;
            background-repeat: no-repeat;
            margin: 0 auto 8rpx;
        }
        .shop{
            background-image: url('~@/assets/img/stores1.png');
        }
        .tel{
            background-image: url('~@/assets/img/tel1.png');
        }
        .text{
            font-size: 11px;
            color: #818181;
        }
    }
    .go{
        background-image: linear-gradient(to bottom , #ff6300, #ff583f);
        color: #fff;
        font-size: 20px;
        font-weight: 400;
        height: 88rpx;
        width: 290rpx;
        line-height: 88rpx;
        border-radius: 88rpx;
        text-align: center;
        margin-left: 60rpx;
        &.gray{
            -webkit-filter: grayscale(100%)
        }
    }
}
</style>

