<template>
<section class="jfb-flexview">
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
    <div  class="jfb-warp">
        <div class="jfb-content">
            <menus v-if="banners.length" :params='banners'></menus>
            <advertise></advertise>
            <shop-list v-if="shopList.length"  :list='shopList'></shop-list>
        </div>
    </div>
</section>
</template>

<script>
import LayHeader from "@c/header/Header.vue";
import Menus from "./views/Menus.vue";
import Advertise from "./views/Advertise.vue";
import ShopList from "./views/ShopList.vue";
import { mapActions, mapState } from 'vuex';
import { shopType } from "@/config/base";
import { Toast } from '@/utils/index';
import { apiGetIndex, apiGetRecommends, apiStoreScan } from "@/api/api";
export default {
    name: "index",
    data() {
        return {
            page: 1,
            shopType,
            scrollTop: 0,
            scrollStatus: true,
            remainListsLength: 5,
            banners: [],
            shopList: []
        };
    },
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
    onLoad (options) {
        // console.log(this.user);
        const _this = this
        _this.getIndex()
    },
    onPageScroll (e) {
        this.scrollTop = e.scrollTop
    },
    methods: {
        ...mapActions('user', [
            'setLocation'
        ]),
        getIndex() {
            const _this = this
            mpvue.getLocation({
                type: 'wgs84',
                success(loca) {
                    apiGetIndex({
                        lng: loca.longitude, 
                        lat: loca.latitude
                    }).then(res => {
                        console.log(res);
                        _this.setLocation({
                            latitude: loca.latitude,
                            longitude: loca.longitude,
                            city_id: res.city_id,
                        })
                        _this.banners = res.banners
                        _this.shopList = res.stores.list
                    })
                },
                fail(err) {
                    console.log(err);
                }
            })
        },
        getShopload() {
            const _this = this
            apiGetRecommends({
                city_id: _this.user.city_id, 
                lng: _this.user.lng,
                lat: _this.user.lat,
                page: _this.page
            }).then(res => {
                _this.shopList = _this.shopList.concat(res.stores.list)
                _this.remainListsLength = res.stores.list.length
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
            mpvue.navigateTo({
                url: `/pages/${pageUrl}`
            }) 
        },
    },
    onPullDownRefresh () {
        this.getIndex()
        this.page = 1
        this.remainListsLength = 5
        mpvue.stopPullDownRefresh()
    },
    onReachBottom () {
        if (this.remainListsLength === 5) {
            this.page++
            this.getShopload()
            this.scrollStatus = true
        } else {
            Toast("没有更多数据了！");
            this.scrollStatus = false
        }
    },
    onShareAppMessage (options) {
        if (options.from === "menu") {
            return {
                title: '减付宝',
                path: '/pages/start/login/main',
                imageUrl: '',
            }
        }
        console.log(options);
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
    padding: 0 .24rem;
    .nav {
        margin: .4rem 0;
        display: flex;
        text-align: center;
        .icon {
            width: .6rem;
            height: .6rem;
        }
        .item {
            flex: 1;
        }
        .text {
            margin-top: .1rem;
            color: #fff;
            font-size: 12px;
        }
    }
}
</style>

