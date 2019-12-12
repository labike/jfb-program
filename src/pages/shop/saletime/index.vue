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
                            <ImageView :src="shopAdvt.img" mode='aspectFill' height="400rpx" width="750rpx"></ImageView>
                        </swiper-item>
                        <swiper-item>
                            <ImageView :src="shopAdvt.proImg" mode='aspectFill' height="400rpx" width="750rpx"></ImageView>
                        </swiper-item>
                    </swiper>
                </div>

                <div class="product">
                    <div class="info">
                        <div class="disc">
                            <p class="price">{{shopAdvt.sale_price}}</p>
                            <p class="tag">抢购价</p>
                            <p class="sale">已售: {{shopAdvt.sale}}</p>
                        </div>
                        <div class="consume">最低消费{{shopAdvt.min_consume}}元可用此券</div>
                    </div>
                </div>

            </div>

            <div class="bottom">
                <div class="title">
                    <i class="icon">赠送</i>价值{{shopAdvt.buyer}}元{{shopAdvt.pro_name}}
                    <span>{{shopAdvt.number}}{{shopAdvt.unit}}</span>
                </div>
                <div class="location">{{distance}}</div>
                <div class="description">{{shopAdvt.description}}</div>
            </div>
            <div class="linetime">
                <ul class="avatar-group">
                    <li class="avatar" v-for="(item, index) in shopAdvt.buyList" :key="index">
                        <ImageView  picture='/static/img/avatar.png' :src="item.header_img"
                            mode='aspectFill'  width='50rpx' height='50rpx'
                        ></ImageView>
                    </li>
                </ul>
                <div class="progress-group">
                    <div class="progress" :style="{width:(shopAdvt.sale/shopAdvt.library*100)+ '%'}"></div>
                </div>
                
                <div class="library">
                    <p class="left">限售 {{shopAdvt.library}}</p>
                    <p class="center">已抢 {{shopAdvt.sale}}</p>
                    <p class="right">剩余 {{shopAdvt.library - shopAdvt.sale}}</p>
                </div>
            </div>
        </div>


        <div class="shop-info">
            <div class="location"></div>
            <div class="info">
                <div class="title">{{shopAdvt.storeInfo.store_name}}</div>
                <div class="address">{{shopAdvt.storeInfo.address}}</div>
            </div>
            <div class="tel"  @click="getCallPhone(shopAdvt.storeInfo.mobile)"></div>
        </div>



        <div class="rule-warp">
            <div class="rule-desc">
                <dl>
                    <dt>有效期</dt>
                    <dd><span>期限</span>{{shopAdvt.ruler.effective_time}}</dd>
                </dl>
                <dl>
                    <dt>使用时间</dt>
                    <dd><span>可用</span>{{shopAdvt.ruler.consume_time}}</dd>
                </dl>
                <dl>
                    <dt>不可用日期</dt>
                    <dd>
                        <div><span>日期</span>{{shopAdvt.ruler.disabled}}</div>
                        <div><span>按周</span>{{shopAdvt.ruler.week}}</div>
                    </dd>
                </dl>
                <dl>
                    <dt>使用规则</dt>
                    <dd>
                        <div>{{shopAdvt.ruler.bespeak}}</div>
                        <div>{{shopAdvt.ruler.overlying}}</div>
                        <div>{{shopAdvt.ruler.currency}}</div>
                        <div>{{shopAdvt.ruler.invoice}}</div>
                        <div>{{shopAdvt.ruler.refund}}</div>
                    </dd>
                </dl>
            </div>
        </div>

        <div class="describe" v-if="shopAdvt.give_description">
            <div class="title">商品详情</div>
            <div class="desc">
                <div v-html="shopAdvt.give_description"></div>
            </div>
        </div>
    </scroll-view>

    <ul class="meun-list">
        <li class="item">
            <div class="meun"  @click="getCallPhone(shopAdvt.storeInfo.mobile)">
                <i class="icon tel"></i>
                <p class="text">电话咨询</p>
            </div>
        </li>
        <li class="item">
            <div class="shop" @click="jumpShop(shopAdvt.x_id)">进店看看</div>
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
        // ...mapState('user', [
        //     'lat',
        //     'lng',
        // ]),
        
        lat() {
            return wx.getStorageSync('appData').currentLocation.lat
        },
        lng() {
            return wx.getStorageSync('appData').currentLocation.lng
        },
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
        apiGiveDetail(options.gid).then(res => {
            that.shopAdvt = that.formatData(res)
        }) 
    },
    methods: {
        stopActivity(shop) {
            shop.stopActivity = true
        },
        formatData (res) {
            res.library = parseFloat(res.library)
            res.sale = parseFloat(res.sale)
            if (res.give_description) {
                let reg = /<img (src=[\'\"]?(?:[^\'\"]*)[\'\"]?).*?(?:>|\/>)/ig;
                res.give_description = res.give_description.replace(reg, (...ary) => {
                    let tepm = `<img class="img" ${ary[1]} style="max-width:100%;height:auto"/>`
                    return tepm
                })
            }
            res.buyList = Array.from({length: 9}).map((item, index) => {
                let avatar = {}
                avatar.header_img = res.buyList[index] ? res.buyList[index].header_img : ''
                return avatar;
            });
            
            return res
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
            font-size: 13px;
        }
        font-size: 30px;
        color: #fff;
        font-weight: 700;
    }
    .activity{
        background: #fff;
        box-shadow: 1px 1px 1px #efefef;
        &.gray{
            filter: grayscale(100%);
            -webkit-filter: grayscale(100%);
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
            padding: 30rpx 30rpx 10rpx 30rpx;
            line-height: 1;
            position: relative;
            .icon{
                background: #ff4400;
                font-size: 24rpx;
                color: #fff;
                padding: 4rpx 8rpx;
                border-radius: 4rpx;
                margin-right: 10rpx;
                position: relative;
                top: -1rpx;
                line-height: 1;
            }
            .title{
                font-size: 17px;
                color: #000;
                font-weight: 700;
                margin-bottom: 20rpx;
                display: flex;
                align-items: center;
                margin-right: 100rpx;
            }
            .location{
                font-size: 12px;
                color: #818181;
                position: absolute;
                right: 30rpx;
                top: 40rpx;
            }
            .description{
                font-size: 13px;
                color: #818181;
                line-height: 20px;
            }
        }
        .product{
            height: 130rpx;
            width: 100%;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-color: #ff2d00;
            background-image: url('~@/assets/img/salebg.png');
            display: flex;
            color: #fff;
            .name{
                font-size: 13px;
                color: #fff;
            }
            .disc{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .tag{
                    margin-left: 10rpx;
                    font-size: 13px;
                    background: #ffe7cf;
                    height: 36rpx;
                    line-height: 36rpx;
                    border-radius: 36rpx 36rpx 36rpx 0;
                    text-align: center;
                    color: #ff2d00;
                    min-width: 120rpx;
                    font-weight: 400;
                }
                .sale{
                    flex: 1;
                    color: #fff;
                    text-align: right;
                    font-size: 13px;
                }
            }
            .consume{
                font-size: 12px;
                margin-top: 10rpx;
            }
        }
        
        .linetime{
            border-top: 1rpx solid #f2f2f2;
            .avatar-group{
                margin: 20rpx 30rpx;
                display: flex;
                justify-content: space-between;
            }
            .avatar{
                width: 60rpx;
                height: 60rpx;
                border-radius: 50%;
                overflow: hidden;
            }
            .progress-group{
                min-width: 110rpx;
                margin: 0 30rpx;
                height: 14rpx;
                line-height: 14rpx;
                background: #ffeadd;
                border-radius: 14rpx;
                position: relative;
                overflow: hidden;
                z-index: 3;
                .progress{
                    position:absolute;
                    left: 0;
                    top: 0;
                    width: 0;
                    height: 14rpx;
                    z-index: 8;
                    background-color: #ff2d00;
                    background-image: linear-gradient(to right, #ff6600, #ff2d00);
                    border-radius: 14rpx;
                }
                .sale{
                    position: relative;
                    text-align: center;
                    z-index: 10;
                    color: #fff;
                }
            }
            .library{
                padding: 24rpx 30rpx;
                color: #818181;
                font-size: 12px;
                display: flex;
                text-align: left;
                justify-content: space-between;
                .right{
                    text-align: right;
                }
                .sale{
                    flex: 1;
                    text-align: center;
                }
            }
        }
    }

    .shop-info {
        height: 110rpx;
        background: #fff;
        margin-top: 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .location{
            margin-left: 30rpx;
            width: 46rpx;
            height: 46rpx;
            background-size: auto 46rpx;
            background-position:center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/location2.png');
        }
        .tel{
            margin-right: 30rpx;
            width: 38rpx;
            height: 38rpx;
            background-size: auto 38rpx;
            background-position:center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/tel2.png');
        }
        .info{
            margin-left: 24rpx;
            flex: 1;
            line-height: 1.3;
        }
        .title {
            color: #323232;
            font-size: 12px;
        }
        .address{
            margin-top: 5rpx;
            color: #818181;
            font-size: 11px;
        }
    }

    .rule-warp{
        margin-top: 20rpx;
        background: #fff;
        .rule-desc{
            padding: 40rpx 30rpx 0;
            color: #323232;
        }
        dl{
            display: flex;
            font-weight: 400;
            line-height: 1;
            dt{
                font-size: 12px;
                width: 150rpx;
                color: #818181;
            }
            dd{
                color: #323232;
                font-size: 12px;
                margin-bottom: 20rpx;
                min-height: 60rpx;
                span{
                    padding: 4rpx 10rpx;
                    font-size: 10px;
                    background: #fff0ec;
                    color: #ff3100;
                    margin-right: 20rpx;
                }
                div{
                    margin-bottom: 30rpx;
                }
            }

        }
    }
    .describe{
        background: #fff;
        .title{
            height: 100rpx;
            line-height: 100rpx;
            color: #323232;
            font-weight: 700;
            font-size: 17px;
            padding-left: 30rpx;
            background: #f2f2f2;
        }
        .desc{
            padding: 40rpx;
            line-height: 1.4;
            .img{
                width: 100%;
            }
        }
    }

}

.meun-list{
    background: #fff;
    height: 100rpx;
    position: fixed;
    left:0;
    bottom:0;
    right: 0;
    border-top: 1px solid #f2f2f2;
    display: flex;
    align-items: center;
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
        .tel{
            background-image: url('~@/assets/img/tel1.png');
        }
        .text{
            font-size: 11px;
            color: #818181;
        }
    }
    .shop{
        background: #0085ff;
        color: #fff;
        font-size: 15px;
        font-weight: 400;
        height: 100rpx;
        width: 280rpx;
        line-height: 100rpx;
        text-align: center;
    }
    .go{
        background: #ff4400;
        color: #fff;
        font-size: 15px;
        font-weight: 400;
        height: 100rpx;
        width: 280rpx;
        line-height: 100rpx;
        text-align: center;
        &.gray{
            filter: grayscale(100%);
            -webkit-filter: grayscale(100%);
        }
    }
}
</style>

