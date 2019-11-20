<!--
 * @Author: zhangHang
 * @Date: 2019-05-14 11:58:39
 * @Description: file content
 -->
<template>
<scroll-view  class="jfb-main"  scroll-y >
    <div class="jfb-header">
        <lay-header></lay-header>
        <ul class="nav">
            <li class="item" @click="codeToPay">
                <img src="/static/tabs/ic-pay.png" class="icon">
                <div class="text">扫码买单</div>
            </li>
            <li class="item" @click="codeToShop">
                <img src="/static/tabs/ic-into.png" class="icon">
                <div class="text">扫码进店</div>
            </li>
            <li class="item" @click="jumpPages('mine/patronage/main')">
                <img src="/static/tabs/ic-shop.png" class="icon">
                <div class="text">光顾门店</div>
            </li>
        </ul>
    </div>
    <div class="jfb-warp"   v-if="user && user.city_id">
        <div class="jfb-content">
            <menus></menus>
            <advertise></advertise>
            <shop-list></shop-list>
        </div>
    </div>
</scroll-view>
</template>

<script>
import LayHeader from "@c/header/Header.vue";
import Menus from "./views/Menus.vue";
import Advertise from "./views/Advertise.vue";
import ShopList from "./views/ShopList.vue";
import { mapActions, mapState } from 'vuex';
import { WAPHOST } from "@/config/base";
import { Toast } from '@/utils/index';
import { apiGetIndex, apiGetRecommends, apiStoreScan } from "@/api/api";
import { getLocation } from '@/api/wechat'

export default {
    name: "index",

    components: {
        LayHeader,
        Menus,
        Advertise,
        ShopList,
    },
    computed: {
        ...mapState({
            "user": state => state.user 
        }),
    },
    onLoad() {
        this.getIndex()
    },
    methods: {
        ...mapActions('user', [
            'setLocation'
        ]),
        getIndex() {
            const _this = this
            getLocation(loca => {
                apiGetIndex({
                    lng: loca.longitude, 
                    lat: loca.latitude
                }).then(res => {
                    // console.log(res);
                    _this.setLocation({
                        latitude: loca.latitude,
                        longitude: loca.longitude,
                        city_id: res.city_id,
                        city_name: res.city_name,
                    })
                    // _this.shopList = res.stores.list
                })
                
            })
        },
        codeToPay () {
            console.log('codeToPay');
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
        },
        jumpPages(pageUrl) { 
            
            this.$router.push({
                path: `/pages/${pageUrl}`
            })
        },
    },
    onShareAppMessage (options) {
        if (options.from === "menu") {
            return {
                title: '我发现了一款省钱的小程序',
                path: '/pages/index/main',
                imageUrl: WAPHOST + 'shareImg.png',
            }
        }
        const share = options.target.dataset.share 
        return {
            title: share.store_name,
            path: '/pages/shop/index/main?shop_id=' + share.s_id,
            imageUrl: share.headerImg[0].img_url,
        }
    },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/components/layout.scss";
.jfb-header{
    background: $base-color;
    padding: 0 24rpx;
    .nav {
        padding: 40rpx 0;
        display: flex;
        text-align: center;
        .icon {
            width: 60rpx;
            height: 60rpx;
        }
        .item {
            flex: 1;
        }
        .text {
            margin-top: 10rpx;
            color: #fff;
            font-size: 12px;
        }
    }
}
</style>

