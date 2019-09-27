<!--
 * @Author: zhangHang
 * @Date: 2019-05-14 11:58:39
 * @Description: file content
 -->
<template>
	<div class="container" v-if="loading&&navList.length">
		<scroll-view scroll-x class="nav-bar" :scroll-into-view="currentTabId" >
		    <ul class="navs" >
                <li class="nav" v-for="(nav, oix) in navList" :key="nav.id" 
                    :id="'nav'+oix" 
                    :class="{ cur:currentTab === oix }"
                    @click="currentTab = oix"
                >{{nav.name}}</li>
		    </ul>
		</scroll-view>
        <div class="tab-content">
            <swiper class="swiper" style="width: 100%; height: 100%; overflow: visible;"
                :current='currentTab'
                @change="swiperchange($event)"
            >
                <div v-for="(item, idx) of navList" :key="idx" >
                    <swiper-item style="overflow: visible;border-radius: 50%;" class="one-scene">
                        <scroll-view style="height:100%" scroll-y v-if="item"> 
                            <div class="details" v-if="currentTab === idx">
                                <group-details v-if="title === 'combo'" :id="item.id"></group-details>
                                <vouchers-details v-if="title === 'vouchers'" :id="item.id"></vouchers-details>
                                <combo-rating :id="shop_id"></combo-rating>
                            </div>
                        </scroll-view>
                    </swiper-item>
                </div>
            </swiper>

        </div>

        <div class="foot-bar">
            <price-bar ></price-bar>
        </div>


	</div>
</template>

<script>
import { apiGetProList } from "@/api/api.js";
import { orderType } from "@/config/base";
import GroupDetails from "./views/GroupDetails.vue";
import VouchersDetails from "./views/VouchersDetails.vue";
import ComboRating from "./views/ComboRating.vue";
import PriceBar from "./views/PriceBar.vue";
import { mapMutations } from 'vuex';

export default {
    name: "ItemDetails",
    components: {
        GroupDetails,
        VouchersDetails,
        ComboRating,
        PriceBar,
    },
    data() {
        return {
            currentTab: 0,
            currentTabId: 'nav0',
            navList: [],
            title: '',
            shop_id: '',
            loading: false
        }
    },
    onLoad (options) {
        this.title = options.title
        this.shop_id = options.shop_id
        apiGetProList({
            s_id: options.shop_id,
            pro_type: orderType[options.title]
        }).then(res => {
            this.loading = true
            this.navList = this._normalizeListData(res, options)
        })
    },
    
    onUnload() {        
        const self = this;
        self.navlist = []
        self.loading = false
    },
    methods: {
        _normalizeListData(list, params) {
            let newList = []
            list.forEach((item, index) => {
                if (item.id === params.item_id) {
                    this.currentTab = index
                    this.currentTabId = 'nav' + index
                }
                if (params.title === 'vouchers') {
                    const voucher = {
                        id: item.id,
                        name: `${Number(item.buy_price)}元代${Number(item.face_val)}元券`
                    }
                    newList.push(voucher)
                }
                if (params.title === 'combo') {
                    const combo = {
                        id: item.id,
                        // name: `${Number(item.price)}元${Number(item.use_person_num)}人餐`
                        name: item.name
                    }
                    newList.push(combo)
                }
            });
            return newList
        },
        
        swiperchange(e) {
            if (e.type !== 'change') {
                return
            }
            let oIndex = e.mp.detail.current;
            console.log(oIndex);
            this.currentTab = oIndex;
            this.currentTabId = 'nav' + oIndex
        },
    }
};
</script>

<style lang="scss" scoped>
.container{
    height: 100%;
    display: flex;
    flex-direction: column;
    .nav-bar {
        border-bottom: 1rpx solid #ededed;
        background-color:#fff;
        height: 88rpx;
    }
    .tab-content{
        flex: 1;
    }
    .foot-bar{
        height: 1rem;
    }
}
.navs {
    height: 0.88rem;
    line-height: 0.88rem;
    color: #323232;
    font-size: 14px;
    white-space: nowrap;
    display: flex;
    .nav {
        padding: 0 36rpx;
        display: inline-block;
    }
    .cur{
        color: #2a8cfa;
        position: relative;
        &::after{
            content: '';
            display: block;
            left: 36rpx;
            right: 36rpx;
            height: 3px;
            position: absolute;
            bottom: 0px;
            background: #2a8cfa;
        }
    }
}
</style>

