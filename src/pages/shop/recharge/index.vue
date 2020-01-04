<!--
 * @Author: zhangHang
 * @Date: 2019-05-14 11:58:39
 * @Description: file content
 -->
<template>
<section class="recharge">
    <div class="store-info" v-if="storeInfo">
        <div class="store-info_logo">
            <ImageView :src="storeInfo.img" mode='aspectFill'  width='90rpx' height='90rpx'></ImageView>
        </div>
        <div class="store-info_name">{{storeInfo.storeName}}</div>
        <div class="store-info_balance">当前余额： <span>{{balance}}</span></div>
        <div class="store-info_desc">消费买单，本店可抵折扣{{vipPayPro}}%</div>
    </div>

    <ul class="recharge-list  border-top" v-if="priceData.length">
        <li class="recharge-list_item"
            v-for="(recharge,index) of  priceData" :key="index"
            :class="{select: index === selectPriceIndex}"
            @click="selectPriceIndex = index"
        >
            <p class="recharge-list_tag">消费余额</p>
            <p class="recharge-list_price">{{recharge.money}}</p>
            <p class="recharge-list_fee">售价<span>{{recharge.charge}}</span>元</p>
        </li>
    </ul>


    <div class="recharge-btn" v-if="priceData.length">
        <div class="recharge-btn_ok" 
            @click="goPay">确认充值￥{{priceData[selectPriceIndex].money}}元</div>

        <div class="recharge-btn_deal" @click.stop="agree = !agree">
            <span class="icon" :class="{agree: agree}"></span>
            <span>阅读并同意</span>
            <span class="recharge-btn_a" @click.stop="jumpWeb">《减付宝平台服务协议》</span>
        </div>

    </div>
    
</section>
</template>

<script>
import ImageView from '@c/layouts/ImageView.vue'
import { mapActions, mapState } from "vuex";
import { orderType, WAPHOST } from '@/config/base';
import { apiGetRechargeList, apiCreateRecharge } from "@/api/api.js";

export default {
    name: "recharge",
    components: {
        ImageView,
    },
    data() {
        return {
            shop_id: 0,
            balance: 0,
            agree: true,
            vipPayPro: 0,
            selectPriceIndex: 0,
            storeInfo: null,
            priceData: []
        };
    },
    onUnload() {        
        const self = this;
        self.shop_id = 0
        self.balance = 0
        self.agree = true
        self.vipPayPro = 0
        self.selectPriceIndex = 0
        self.priceData = []
        self.storeInfo = null
    },
    computed: {
        ...mapState('shop',{
            storeInfo: state => state.shopInfo,
        })
    },
    onLoad (options) {
        const that = this
        that.shop_id = options.shop_id;
        apiGetRechargeList(options.shop_id).then(res => {
            console.log(res);
            that.priceData = res.recharge || []
            that.storeInfo = res.storeInfo || null
            that.balance = res.user.balance || 0
            that.vipPayPro = parseInt(res.ratio) >= 100 ? 0 : parseInt(res.ratio);
        })
        
    },
    methods: {
        ...mapActions(['createOrder']),
        goPay() {
            const that = this;
            if (!that.agree) {
                mpvue.showModal({
                    title: '友情提示',
                    content: '请勾选减付宝平台余额购买协议！',
                    showCancel: false
                })
                return; 
            }
            // 创建订单
            let money = that.priceData[that.selectPriceIndex].charge
            that.createOrder({
                x_id: that.shop_id,
                money,
                type: 0
            }).then(res => {
                that.$router.push({
                    path: `/pages/shop/pay/main?order_id=${res.order_id}`
                })
            });
        },
        jumpWeb() {
            this.$router.push({
                path: `/pages/web/main?url=${encodeURIComponent(WAPHOST + "protocol.html")}`
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.recharge{
    height: 100%;
    background: #fff;
}
.store-info{
    position: relative;
    z-index: 0;
    padding: 40rpx;
    margin-left: 110rpx;
    font-weight: 700;
}
.store-info_logo{
    position: absolute;
    left: -70rpx;
    top: 50%;
    width: 90rpx;
    height: 90rpx;
    margin-top: -45rpx;
    background: #f2f2f2;
    border-radius: 50%;
    box-shadow: 1px 1px 10px #ccc;
    overflow: hidden;
}
.store-info_name{
    font-size: 15px;
    color: #000;
    margin-bottom: 15rpx;
}
.store-info_balance{
    font-size: 11px;
    color: #818181;
    margin-bottom: 15rpx;
    span{
        color: #b72821;
    }
}
.store-info_desc{
    font-size: 12px;
    color: #b72821;
}
.recharge-list{
    padding: 24rpx 0;
    display: flex;
    flex-wrap: wrap;
    left: 24rpx;

}
.recharge-list_item{
    border-radius: 16rpx;
    border: 1px solid #f2f2f2;
    padding: 30rpx 20rpx;
    float: left;
    width: 295rpx;
    margin-right: 24rpx;
    margin-bottom: 24rpx;
    font-weight: 700;
    &.select{
        border: 1px solid #f74b3f;
        position: relative;
        z-index: 0;
        overflow: hidden;
        &::before{
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            width: 60rpx;
            height: 60rpx;
            background-position: center;
            background-image: url(~@/assets/img/selected@r.png);
            background-size: contain;
            background-repeat: no-repeat;
        }
        .recharge-list_price{
            color: #f74b3f;
        }
    }
    .recharge-list_tag{
        font-size: 12px;
        color: #818181;
    }
    .recharge-list_price{
        color: #000;
        text-align: center;
        font-size: 25px;
        margin-top: 20rpx;
    }
    .recharge-list_fee{
        font-size: 12px;
        color: #818181;
        text-align: right;
        margin-top: 20rpx;
        span{
            font-size: 14px;
            color: #323232;
            margin: -1px 1px;
        }
    }
}
.recharge-btn{
    position: relative;
    font-weight: 700;
    text-align: center;
}
.recharge-btn_ok{
    margin: 40rpx;
    height: 90rpx;
    line-height: 90rpx;
    box-shadow: 1px 1px 10px #ccc;
    background: #e9090a;
    text-align: center;
    font-size: 15px;
    color: #fff;
    border-radius: 90rpx;
    background: linear-gradient(to right,#fa5d16, #e9090a);
}
.recharge-btn_deal{
    display: inline-block;
    color: #bababa;
    .icon{
        border: 2px solid #bababa;
        width: 20rpx;
        height: 20rpx;
        border-radius: 50%;
        margin-right: 15rpx;
        float: left;
        margin-top: 4rpx;
        position: relative;
    }
    .agree{
        border: 2px solid #f74b3f;
        &::before{
            content: '';
            background: #f74b3f;
            position: absolute;
            left: 50%;
            top: 50%;
            width: 10rpx;
            height: 10rpx;
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
    }
    .recharge-btn_a{
        color: #e9090a;
        margin-left: 10rpx;
    }
}
</style>
