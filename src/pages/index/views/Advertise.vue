<template>
<div class="advertise">
    <div class="ad-top" @click="jumpAD(adTop)">
        <img :src="adTop.img_url" mode="widthFix">
    </div>
    <div class="ad-center"  @click="jumpAD(adCenter)">
        <img :src="adCenter.img_url" mode="widthFix">
    </div>
    <div class="ad-bottom">
        <div class="ad-item"  v-for="(item,aindex) of adBottom" :key="aindex">
            <div class="img-warp" @click="jumpAD(item)">
                <img :src="item.img_url" mode="widthFix">
            </div>
        </div>
    </div>
    
</div>
</template>

<script>
import { adFeature, WAPHOST } from "@/config/base";
export default {
    name: "Advertise",
    data() {
        return {
            adTop: {
                href: "",
                img_url: "/static/advert/one_ad.png",
                type: "stop"
            },
            adCenter: {
                href: "",
                img_url: "/static/advert/two_ad.png",
                type: "stop"
            },
            adBottom: [{
                href: "reshop",
                img_url: "/static/advert/three_ad.png",
                type: "action"
            }, {
                href: "money",
                img_url: "/static/advert/four_ad.png",
                type: "action"
            }],
        }
    },
    methods: {
        jumpAD(adObj) {
            let URL = ''
            switch (adObj.type) {
            case "shop":
                URL = '/pages/shop/index/main?shop_id=' + adObj.href    
                break;
            case "action":
                URL = adFeature[adObj.href]
                break;
            case "link":
                URL = "/pages/web/main?url=" + encodeURIComponent(adObj.href)
                break;
            default:
                break;
            }
            if (URL) {
                wx.navigateTo({
                    url: URL
                })
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.advertise{
    background: #fff;
    padding: 12rpx;
    .ad-bottom{
        overflow: hidden;
    }
    .ad-item{
        width: 50%;
        float: left;
        .img-warp{
            padding: 12rpx;
        }
    }
    img{
        display: block;
        width: 100%;
        height: 80px;
    }
}
</style>