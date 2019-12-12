<!--
 * @Author: zhangHang
 * @Date: 2019-05-14 11:58:39
 * @Description: file content
 -->
<template>
<div class="header-warp">
    <div class="location">
        <div class="icon"></div>
        <div class="address">{{address}}</div>
    </div>
    <ul class="menu">
        <li class="item" @click="codeToPay">
            <img src="/static/tabs/ic-pay.png" class="icon">
        </li>
        <li class="item" @click="codeToShop">
            <img src="/static/tabs/ic-into.png" class="icon">
        </li>
        <li class="item" @click="jumpPages('mine/patronage/main')">
            <img src="/static/tabs/ic-shop.png" class="icon">
        </li>
    </ul>
</div>
</template>

<script>
import ImageView from '@c/layouts/ImageView.vue'
import { apiStoreScan } from "@/api/api";

export default {
    name: "nearHeader",
    data() {
        return {
            address: ''
        };
    },
    computed: {
        appData() {
            return wx.getStorageSync('appData');
        }
    },
    onLoad () {
        const that = this
        let locationString = that.appData.currentLocation.lat + "," + that.appData.currentLocation.lng;
        mpvue.request({
            url: 'https://apis.map.qq.com/ws/geocoder/v1/',
            data: {
                "key": "NW5BZ-Y2WKG-3T6QC-ISBMF-MTDQF-63BGJ",
                "location": locationString
            },
            method: 'GET',
            success: function (r) {
                let result = r.data.result
                console.log(result.address_component.street);
                that.address = result.address_component.street
            }
        });
    },
    onUnload() {        
    },
    methods: {
        codeToPay () {
            var _this = this;
            mpvue.scanCode({
                onlyFromCamera: true,
                scanType: ['QR_CODE'],
                success: (confing) => {
                    var content = confing.result;
                    apiStoreScan({
                        content,
                        type: 1
                    }).then(res => {
                        console.log(res);
                        wx.navigateTo({
                            url: '/pages/shop/paythebill/main?shop_id=' + res.x_id,
                        })
                    })
                }
            })
        },
        codeToShop () {
            var _this = this;
            // 允许从相机和相册扫码
            mpvue.scanCode({
                onlyFromCamera: true,
                scanType: ['QR_CODE'],
                success: (confing) => {
                    var content = confing.result;
                    apiStoreScan({
                        content,
                        type: 2
                    }).then(res => {
                        console.log(res);
                        wx.navigateTo({
                            url: '/pages/shop/index/main?shop_id=' + res.x_id,
                        })
                    })
                }
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.header-warp{
    padding: 0 24rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
}
.location{
    color: #fff;
    position: relative;
    flex: 1;
    width: 60%;
    .icon {
        position: absolute;
        left: 0;
        top: 6rpx;
        width: 38rpx;
        height: 38rpx;
        background-size: auto 38rpx;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('~@/assets/img/location3.png');
    }
    .address{
        padding-left: 50rpx;
        font-weight: 400;
        font-size: 18px;
        word-wrap: normal;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-align: justify;
    }
}
.menu {
    font-size: 0;
    display: flex;
    align-items: center;
    .icon {
        width: 38rpx;
        height: 38rpx;
    }
    .item {
        margin-left: 40rpx;
    }
}

</style>

