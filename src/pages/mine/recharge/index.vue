<!--
 * @Author: zhangHang
 * @Date: 2019-06-21 17:28:50
 * @Description: file content
 -->
<template>

<div  class="recharge-warp" v-if="currentList">
    <div class="recharge-balance">
        <div class="title">增值余额</div>
        <div class="balance"><span>{{balance}}</span>元</div>
        <ul class="handle">
            <block  v-for="(emun, index) of emunList" :key="index">
                <li class="emun" :class="{active: currentSelect === index}"
                    @click="swithType(index)"
                >{{emun.name}}</li>
            </block>
        </ul>
    </div>

    <section class="recharge-list" >
        <div class="title">增值余额明细</div>
        <div class="date"></div>
        <ul class="recharge" v-if="currentList.length">
            <li class="item"  v-for="recharge of currentList" :key="recharge.id">
                
                <div class="store">
                    <div class="store-img">
                        <ImageView  :src="recharge.storeInfo.header_img" mode='aspectFill'  width='80rpx' height='80rpx'
                        ></ImageView>
                    </div>
                    <div class="store-name">{{recharge.storeInfo.store_name}}</div>
                    <div class="store-date">{{recharge.time}}</div>
                </div>
                <div class="price increment" v-if="recharge.increment">+{{recharge.increment}}</div>
                <div class="price" v-if="recharge.money">-{{recharge.money}}</div>
                <ul class="order cell" v-if="recharge.total_amount">
                    <li>
                        <p class="lable">订单编号：</p>
                        <p class="text">{{recharge.order_id}}</p>
                    </li>
                    <li>
                        <p class="lable">消费金额：</p>
                        <p class="text">￥{{recharge.total_amount}}</p>
                    </li>
                    <li>
                        <p class="lable">移动支付：</p>
                        <p class="text">￥{{recharge.pay_amount}}</p>
                    </li>
                    <li>
                        <p class="lable">支付方式：</p>
                        <p class="text">{{recharge.payMethod}}</p>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="empty" v-if="emunListEmpty">
            <ImageView src="/static/img/no_list.png" width='320rpx'></ImageView>
            <div class="text">暂无相关数据！</div>
        </div>
    </section>
</div>

</template>

<script>
import LaySwiper from "@c/swiper/Advertise.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { apiRechargeDetail, apiRechargeBalance } from "@/api/api";
import { WAPHOST } from "@/config/base";
import { mapGetters } from 'vuex';
export default {
    name: "recharge",
    data() {
        return {
            balance: 0,
            limitLength: 10,
            currentSelect: 0,
            currentList: null,
            emunListEmpty: false,
            emunList: [{
                type: 'income',
                name: '充值记录',
                page: 1,
                list: []
            }, {
                type: 'expend',
                name: '消费记录',
                page: 1,
                list: []
            }],
        };
    },
    components: {
        LaySwiper,
        ImageView
    },
    computed: {
        appData() {
            return mpvue.getStorageSync('appData');
        }
    },
    onLoad (options) {
        this.currentSelect = options.select || 0
        this.initDate(1)
        apiRechargeBalance().then(res => {
            this.balance = res.balance
        })
    },
    onUnload() {        
        const that = this;
        that.balance = 0
        that.currentSelect = 0
        that.currentList = null
        that.emunListEmpty = false
        that.emunList[0].page = 1
        that.emunList[0].list = []
        that.emunList[1].page = 1
        that.emunList[1].list = []
    },
    methods: {
        initDate(page) {
            const that = this
            let currentEmun = that.emunList[that.currentSelect]
            if (page === 1) {
                currentEmun.list = []
                apiRechargeBalance().then(res => {
                    that.balance = res.balance
                })
            }
            apiRechargeDetail({
                type: currentEmun.type,
                params: {
                    page,
                    limit: that.limitLength,
                    start_time: '',
                    end_time: ''
                }
            }).then(list => {
                currentEmun.page = page
                if (!list.length && page === 1) {
                    that.emunListEmpty = true
                }
                list.forEach(dataInfo => {
                    currentEmun.list.push(dataInfo)
                });
                that.currentList = currentEmun.list
                console.log(list);
            })
        },
        swithType(index) {
            let currentEmun = this.emunList[index]
            this.currentSelect = index
            this.emunListEmpty = false
            this.currentList = currentEmun.list
            if (!currentEmun.list.length) {
                this.initDate(1)
            }
        },
        jumpPages(pageUrl) {
            this.$router.push({
                path: pageUrl
            }) 
        },
        jumpListPages(advers) {
            this.$router.push({
                path: `/pages/shop/salelist/main?industry=${advers.industry_id}&gcid=${advers.gcid}`
            }) 
        }
    },
    onPullDownRefresh () {
        const that = this
        that.initDate(1)
        mpvue.stopPullDownRefresh()
    },
    onReachBottom () {
        if (this.scrollStatus) {
            this.page++
        } else {
            mpvue.showToast({
                title: '没有更多数据了！',
                icon: 'none',
                duration: 1000
            })
        }
    },
};
</script>

<style lang="scss" scoped>
.recharge-warp{
    padding: 24rpx;
}
.recharge-balance{
    margin-bottom: 24rpx;
    background: #0085ff;
    box-shadow: 1px 1px 10px #d4e4f4;
    border-radius: 10rpx;
    overflow: hidden;
    color: #fff;
    line-height: 1;
    .title{
        font-size: 15px;
        padding-top: 40rpx;
        padding-left: 55rpx;
    }
    .balance{
        font-size: 16px;
        padding-top: 40rpx;
        padding-left: 55rpx;
        font-family:Helvetica;
        span{
            font-size: 50px;
            margin-right: 10rpx;
        }
    }
    .handle{
        background: #fff;
        height: 110rpx;
        line-height: 110rpx;
        margin-top: 68rpx;
        color: #c0c0c0;
        font-size: 15px;
        font-weight: 700;
        .emun{
            float: left;
            width: 50%;
            text-align: center;
            position: relative;
            &.active{
                color: #4d4d4d;
            }
            &:not(:last-child)::after{
                content: '';
                position: absolute;
                right: 0;
                top: 50%;
                margin-top: -25rpx;
                width: 1rpx;
                height: 50rpx;
                background-color: #c0c0c0;
                box-shadow: 1rpx 1rpx 1rpx #cfcfcf;
            }
        }
    }
}
.recharge-list{
    position: relative;
    .title{
        margin: 40rpx 24rpx;
        color: #4d4d4d;
        font-weight: 700;
        font-size: 15px;
        line-height: 1;
        padding-left: 22rpx;
        &::after{
            content: '';
            position: absolute;
            left: 24rpx;
            top: 0;
            width: 6rpx;
            height: 30rpx;
            background-color: #0085ff;
        }
    }
    .date{
        position: absolute;
        right: 54rpx;
        top: -7rpx;
        width: 44rpx;
        height: 44rpx;
        background-image: url(~@/assets/img/date.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }
    .empty{
        text-align: center;
        padding-top: 160rpx;
        .text{
            margin-top: 15rpx;
            font-size: 24rpx;
            color: #818181;
            text-shadow: 1px 1px 1px #e8e8e8;
        }
    }
    .recharge{
        .item{
            background: #fff;
            border-radius: 10rpx;
            padding: 30rpx 0;
            position: relative;
            margin-bottom: 24rpx;
        }
        .store{
            position: relative;
            padding-left: 100rpx;
            line-height: 1;
            margin: 0 30rpx;
            .store-img{
                width: 80rpx;
                height: 80rpx;
                border-radius: 80rpx;
                overflow: hidden;
                position: absolute;
                left: 0;
                top: 0;
            }
            .store-name{
                font-size: 15px;
                color: #4d4d4d;
                padding-top: 8rpx;
                margin-bottom: 20rpx;
            }
            .store-date{
                font-size: 12px;
                color: #818181;
            }
        }
        
        .price{
            font-size: 17px;
            font-weight: 700;
            color: #323232;
            position: absolute;
            right: 30rpx;
            top: 30rpx;
            &.increment{
                color: #ff6300;
            }
        }
        .order{
            margin-top: 30rpx;
            border-top: 1rpx solid #f2f2f2;
            li{
                line-height: 1.1;
                font-size: 13px;
                padding-left: 30rpx;
                margin-top: 20rpx;
                &::before{
                    display: none;
                    opacity: 0;
                }
                .lable{
                    color: #818181;
                }
                .text{
                    color: #4d4d4d;
                }
            }
        }
    }
}
</style>

