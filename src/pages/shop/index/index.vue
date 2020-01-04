<!--
 * @Author: zhangHang
 * @Date: 2019-05-22 09:23:41
 * @Description: file content
 -->
<template>
<section class="store-info-warp" v-if="loading&&shopInfo && shopInfo.infoData">
    <scroll-view scroll-y class="store-info-scroll">
        <div class="store-info">
            <div class="mod-box"  v-if="shopInfo.infoData">
                <shop-header :infoData="shopInfo" @share='shareShop'></shop-header>
            </div>
            <div class="mod-box" v-if="shopInfo.proData.give && shopInfo.proData.give.x_id" >
                <div class="mod-box-title">
                    <div class="mod-box-name">免费赠送</div>
                    <div class="mod-box-desc">先预定，达到要求免费送</div>
                </div>
                <shop-sale :infoData="shopInfo.proData.give"></shop-sale>
            </div>

            <div class="mod-box" v-if="shopInfo.proData.vouchers && shopInfo.proData.vouchers.length" >
                <div class="mod-box-title">
                    <div class="mod-box-name">代金券</div>
                    <div class="mod-box-desc">给你最好的优惠</div>
                </div>
                <shop-voucher :voucherList="shopInfo.proData.vouchers"></shop-voucher>
            </div>

            <div class="mod-box" v-if="shopInfo.proData.group && shopInfo.proData.group.length" >
                <div class="mod-box-title">
                    <div class="mod-box-name">爆款推荐</div>
                    <div class="mod-box-desc">人气产品限时抢购</div>
                </div>
                <shop-group :groupList="shopInfo.proData.group"></shop-group>
            </div>


            <div class="mod-box" v-if="shopInfo.commentScore&&shopInfo.commentScore.nums.all_num!=='0'" >
                <div class="mod-box-title">
                    <div class="mod-box-name">最新评价</div>
                    <div class="mod-box-desc">您的满意就是我们的追求</div>
                </div>
                <shop-rate :params="shopInfo.commentScore"></shop-rate>
            </div>
            
            
            <div class="mod-box"  v-if="shopInfo.infoData.headerImgData">
                <div class="detail-group" v-if="shopInfo.infoData.headerImgData.envir.length">
                    <div class="detail-group-item" v-for="(item, index) in shopInfo.infoData.headerImgData.envir" :key="index">
                        <img :src="item.img_url" mode="widthFix">
                    </div>
                </div>
            </div>
        </div>
    </scroll-view >
    <div class="store-footer">
        <shop-footer :infoData="shopInfo.proData"></shop-footer>
    </div>

    <div class="share-warp" v-if="shareShopStatus" catchtouchmove="ture">
        <app-share :cardInfo='cardInfo' @close="shareShopStatus=false"></app-share>
	</div>
</section>
</template>

<script>
import ImageView from '@c/layouts/ImageView.vue'
import ShopHeader from "./../views/ShopHeader.vue";
import ShopSale from "./../views/ShopSale.vue";
import ShopGroup from "./../views/ShopGroup.vue";
import ShopVoucher from "./../views/ShopVoucher.vue";
import ShopRate from "./../views/ShopRate.vue";
import ShopFooter from "./../views/ShopFooter.vue";
import AppShare from './../../filter/views/AppShare.vue'

import { mapActions, mapState } from 'vuex';
import { WAPHOST } from "@/config/base";
export default {
    name: "shop",
    data() {
        return {
            loading: false,
            cardInfo: null,
            shareShopStatus: false
        };
    },
    components: {
        ShopHeader,
        ShopSale,
        ShopGroup,
        ShopRate,
        ShopVoucher,
        ShopFooter,
        ImageView,
        AppShare
    },
    computed: {
        ...mapState('shop',{
            shopInfo: state => state.shopInfo,
        }),
    },
    onLoad (options) {
        mpvue.showNavigationBarLoading()
        const s_id = options.shop_id;
        this.saveShopInfo(s_id).then(info => {
            this.loading = true
            console.log(info);
            mpvue.setNavigationBarTitle({
                title: info.infoData.store_name
            })
            mpvue.hideNavigationBarLoading()
        });
    },
    onUnload() {        
        const self = this;
        self.loading = false
        self.cardInfo = null
        self.shareShopStatus = false
    },
    methods: {
        ...mapActions('shop',['saveShopInfo']),        
        shareShop(cardInfo) {
            console.log(cardInfo);
            if (cardInfo.type === "earn" && !cardInfo.shareUrl) {
                mpvue.showToast({
                    title: '请先成为本店合伙人',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            this.cardInfo = cardInfo
            this.shareShopStatus = true
        }
    },    
    onShareAppMessage (options) {
        if (options.from === "menu") {
            return {
                title: '我发现了一款省钱的小程序',
                path: '/pages/index/main',
                imageUrl: WAPHOST + 'shareImg.png',
            }
        }
        console.log(options);
        const share = options.target.dataset.share
        return {
            title: share.storeInfo.store_name,
            path: "/pages/start/invitation/main?code=" + share.shareUrl,
            imageUrl: share.storeInfo.header_img,
        }
    },
};
</script>

<style lang="scss" scoped>

.store-info-warp{
    background: #fff;
    position: relative;
    z-index: 0;
    height: 100%;
    .store-info-scroll{
        height: 100%;
    }
    .store-info{
        padding-bottom: 110rpx;
    }
    
    .mod-box{
        margin-bottom: 50rpx;
        .mod-box-title{
            padding: 0 24rpx;
        }
        .mod-box-desc{
            color: #9c9c9c;
            font-size: 12px;
            margin-top: 10rpx;
            font-weight: 700;
        }
        .mod-box-name{
            font-size: 18px;
            color: #fd2e2d;
            font-weight: 700; 
            background-image: linear-gradient(#f16963,#f93c36); 
            background-clip:text;
            -webkit-background-clip: text; 
            -webkit-text-fill-color:transparent; 
        }
    }
    .store-footer{
        height: 100rpx;
        position: fixed;
        z-index: 9999;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .detail-group{
    margin: 24rpx;
    }
    .detail-group-item{
        font-size: 0;
        width: 100%;
        img{
            width: 100%;
            height: auto;
        }
    }
}
</style>

