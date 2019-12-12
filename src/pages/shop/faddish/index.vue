<!--
 * @Author: zhangHang
 * @Date: 2019-09-21 11:20:27
 * @Description: file content
 -->
<template>

<div  class="time-sale-warp" v-if="shopAdvt">
    <scroll-view class="time-sale"  scroll-y v-if="shopAdvt.topData" >
        <div class="activity" >
            <div class="top">
                <div class="img-warp">
                    
                    <swiper :indicator-dots='true' indicator-color='rgba(0, 0, 0, .3)' indicator-active-color="#fff" :style="{height: '400rpx'}" :autoplay='false' :interval='6000' :duration='1000' :circular='true'>
                         <block v-for="(item, index) of shopAdvt.topData.imgUrl.imgList" :key="index">
                            <swiper-item>
                                <ImageView :src="item.img" mode='aspectFill' height="400rpx" width="750rpx"></ImageView>
                            </swiper-item>
                        </block>
                </swiper>
                </div>
                <div class="product">
                    <div class="info">
                        <div class="disc">
                            <p class="price">{{shopAdvt.topData.price}}</p>
                            <p class="tag">特惠价</p>
                            <p class="old-price">{{shopAdvt.topData.old_price}}</p>
                            <p class="sale">已售: {{shopAdvt.topData.sales_num}}</p>
                        </div>
                        <div class="consume">{{shopAdvt.topData.discount}} 折优惠</div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="title">
                    <i class="icon">爆款</i>
                    <span>{{shopAdvt.topData.group_name}}</span>
                </div>
                <div class="location">{{distance}}</div>
                <div class="description">{{shopAdvt.topData.description}}</div>
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
                    <dd><span>期限</span>{{shopAdvt.rulesData.periodOfValidity}}</dd>
                </dl>
                <dl>
                    <dt>使用时间</dt>
                    <dd><span>可用</span>{{shopAdvt.rulesData.availableTime}}</dd>
                </dl>
                <dl>
                    <dt>不可用日期</dt>
                    <dd>
                        <div><span>日期</span>{{shopAdvt.rulesData.UnavailableDate}}</div>
                        <div><span>按周</span>{{shopAdvt.rulesData.UnavailableWeek}}</div>
                    </dd>
                </dl>
                <dl>
                    <dt>使用规则</dt>
                    <dd>
                        <div>{{shopAdvt.rulesData.bespeak}}</div>
                        <div>{{shopAdvt.rulesData.overlying}}</div>
                        <div>{{shopAdvt.rulesData.currency}}</div>
                        <div>{{shopAdvt.rulesData.invoice}}</div>
                        <div>{{shopAdvt.rulesData.refund}}</div>
                    </dd>
                </dl>
            </div>
        </div>

        <div class="describe" v-if="shopAdvt.topData.group_description">
            <div class="title">商品详情</div>
            <div class="gds-details">
                <dl v-for="(group, ginx) in shopAdvt.topData.groupContent" :key="ginx">
                    <dt>{{ group.sort_name }} <span v-if=" group.selectType != 0">（{{ group.selectType }}）</span></dt>
                    <dd v-for="(item, cinx) in group.content" :key="cinx">
                        <div class="name">{{ item.name }}</div>
                        <div class="num">{{ item.num }}份</div>
                        <div class="price">{{ item.price }}</div>
                    </dd>
                </dl>
            </div>
            <div class="desc">
                <div v-html="shopAdvt.topData.group_description"></div>
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
            <div class="shop" @click="jumpShop(shop_id)">进店看看</div>
        </li>
        <li class="item">
            <div class="go gray" v-if="!shopAdvt.topData">已结束</div>
            <div class="go" v-else @click="jumpItemPage(shopAdvt)">马上抢</div>
        </li>
    </ul>
</div>

</template>

<script>
import ImageView from '@c/layouts/ImageView.vue'
import { WAPHOST, orderType } from "@/config/base";
import { getDistance, callPhone } from '@/utils/index';
import { apiGetProDetails } from "@/api/api.js";
export default {
    name: "time-sale",
    data() {
        return {
            shop_id: 0,
            scrollTop: 0,
            scrollStatus: true,
            shopAdvt: null
        };
    },
    components: {
        ImageView,
    },        
    computed: {
        
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
            let num = getDistance(_this.lat, _this.lng, _this.shopAdvt.storeInfo.gps.lat, _this.shopAdvt.storeInfo.gps.lng)
            if (num > 1000) {
                return (num / 1000).toFixed(1) + 'km'
            } else {
                return num + 'm'
            }
        },
    },
    onLoad (options) {
        const that = this
        that.shop_id = options.shop_id
        apiGetProDetails({
            s_id: options.shop_id,
            pro_type: orderType.combo,
            id: options.gid
        }).then(res => {
            console.log(res);
            if (!res.topData) {
                mpvue.showModal({
                    content: '该产品已经下架，或者被删除',
                    showCancel: false,
                    confirmText: '好的',
                    confirmColor: '#333',
                    success: function(res) {
                        if (res.confirm) {
                            wx.navigateBack()            
                        }
                    },
                    fail: function(res) {}
                })
            }
            that.shopAdvt = that.formatData(res)
        })
    },
    methods: {
        formatData (res) {
            if (!res.topData || !res.rulesData) {
                return res
            }
            if (res.rulesData.availableTime === "") {
                res.rulesData.availableTime = '24小时可用'
            }
            if (res.rulesData.UnavailableDate === "") {
                res.rulesData.UnavailableDate = '不限'
            }
            if (res.rulesData.UnavailableWeek === "") {
                res.rulesData.UnavailableWeek = '不限'
            }
            if (res.topData.old_price) {
                res.topData.old_price = parseFloat(res.topData.old_price)
                res.topData.price = parseFloat(res.topData.price)
                let discount = (res.topData.price / res.topData.old_price).toFixed(1)
                res.topData.discount = discount * 10
            }
            
            if (res.topData.group_description) {
                let reg = /<img (src=[\'\"]?(?:[^\'\"]*)[\'\"]?).*?(?:>|\/>)/ig;
                res.topData.group_description = res.topData.group_description.replace(reg, (...ary) => {
                    let tepm = `<img class="img" ${ary[1]} style="max-width:100%;height:auto"/>`
                    return tepm
                })
            }            
            return res
        },

        jumpShop(id) {
            this.$router.push({
                path: '/pages/shop/index/main?shop_id=' + id
            })
        },
        jumpItemPage(shop) {
            console.log(shop);
            const that = this
            if (!shop.topData) {
                return
            }
            that.$router.push({
                path: `/pages/orders/confirm/main?shop_id=${that.shop_id}&title=combo&item_id=${shop.topData.id}`
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
                margin-right: 12rpx;
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
                .old-price{
                    margin: 0 10rpx;
                    color: #fff;
                    font-size: 12px;
                    font-weight: 400;
                    text-decoration:line-through;
                    &::before{
                        content: '￥';
                    }
                }
            }
            .consume{
                font-size: 12px;
                margin-top: 10rpx;
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
            font-weight: 400;
            font-size: 17px;
            padding-left: 30rpx;
            background: #f2f2f2;
        }
        .gds-details {
            margin: 30rpx;
            color: #323232;
            font-weight: 400;
            dl {
                margin-bottom: 30rpx;
                dt {
                    color: #000;
                    margin-bottom: 30rpx;
                    font-size: 14px;
                }
                dd {
                    font-size: 13px;
                    margin-bottom: 15rpx;
                    display: flex;
                    align-items: center;
                    &::before {
                        content: '';
                        display: inline-block;
                        width: 0;
                        height: 0;
                        border: 2px solid #000;
                        vertical-align: middle;
                        margin-right: 10rpx;
                        border-radius: 50%;
                    }
                    .name {
                        flex: 1;
                    }
                    .num {
                        width: 15%;
                        text-align: right
                    }
                    .price {
                        width: 35%;
                        text-align: right;
                        font-size: 13px;
                        color: #323232;
                        font-weight: 400;
                        &::before{
                            content: '￥';
                            font-size: 10px;
                        }
                    }
                }
            }
        }
        .desc{
            padding: 40rpx 30rpx;
            line-height: 1.6;
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

