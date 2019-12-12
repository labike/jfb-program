<!--
 * @Author: zhangHang
 * @Date: 2019-05-16 16:01:57
 * @Description: file content
 -->
<template>
<div class="advertise">

    
    
    <div class="menu-mode"  v-if="menuMode.length">
        <div class="ad">
            <div class="ad-item"  v-for="(item,aindex) of menuMode" :key="aindex">
                <div class="img-warp"
                    @click="jumpAD(item)"
                >
                    <ImageView :src="item.img_url" height="100%"></ImageView>
                </div>
            </div>
        </div>
    </div>
    


    
    <div class="merit-mode"  v-if="meritMode.length">
        <div class="title">
            <span class="name">优质门店</span>
        </div>
        <div class="ad">
            <div class="ad-item"  
                v-for="(item,bindex) of meritMode" 
                :key="bindex"
                :class="{big:bindex<=1}"
            >
                <div class="img-warp"
                    @click="jumpAD(item)"
                >
                    <ImageView :src="item.img" height="100%"></ImageView>
                </div>
            </div>
        </div>
    </div>

</div>
</template>

<script>
import ImageView from '@c/layouts/ImageView.vue'
import { adFeature, WAPHOST } from "@/config/base";
import { apiSuperStores } from "@/api/api";

export default {
    name: "Advertise",
    components: { ImageView },
    data() {
        return {
            menuMode: [{
                href: "reshop",
                img_url: WAPHOST + "static/advert/my_reshop.png",
                type: "action"
            }, {
                href: "money",
                img_url: WAPHOST + "static/advert/my_money.png",
                type: "action"
            }],
            meritMode: []
        }
    },
    onLoad() {
        apiSuperStores().then(mList => {
            this.meritMode = mList.map(item => {
                item.type = 'shop'
                return item
            })
        })
    },
    methods: {
        jumpAD(adObj) {
            let URL = ''
            switch (adObj.type) {
            case "action":
                URL = adFeature[adObj.href]
                break;
            case "link":
                URL = "/pages/web/main?url=" + encodeURIComponent(adObj.href)
                break;
            default:
                URL = '/pages/shop/index/main?shop_id=' + adObj.href
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
    padding: 24rpx;
    overflow-y:scroll;
    > div{
        margin-bottom: 24rpx;
    }
    .title{
        padding: 12rpx 0;
        text-align: right;
        display: flex;
        justify-content:space-between;
        vertical-align: bottom;
        align-items:flex-end;
        color: #818181;
        .name{
            font-weight: 700;
            font-size: 16px;
            color: #323232;
        }
    }
    .ad{
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        flex: 1;
        padding: 12rpx 0;
        .ad-item{
            overflow: hidden;
        }
        .img-warp{
            height: 100%;
        }
    }
    .menu-mode{
        .ad-item{
            width: 346rpx;
            min-height: 130rpx;
        }
    }
    .live-mode{
        .ad-item{
            width: 346rpx;
            min-height: 216rpx;
        }
    }
    .merit-mode{
        .ad{  
            flex-wrap: wrap;
        }
        .ad-item{
            width: 168rpx;
            height: 224rpx;
            margin-top: 10rpx;
            &.big{
                width: 346rpx;
                height: 274rpx;
            }
        }
    }
}
</style>