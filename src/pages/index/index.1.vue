<template>
<section class="jfb-flexview">
    <lay-header></lay-header>
    <scroll-view  class="jfb-scrollview" 
        scroll-y="true"
        @scroll="getScroll"
        @scrolltoupper="upper"
        @scrolltolower="lower"
    >
        <div class="jfb-content">
            <menus v-if="banners.length" :params='banners'></menus>
            <advertise></advertise>
            <shop-list v-if="shopList.length"  :list='shopList'></shop-list>
        </div>
    </scroll-view>
    
</section>
</template>

<script>
import LayHeader from "./views/Header.vue";
import Menus from "./views/Menus.vue";
import Advertise from "./views/Advertise.vue";
import ShopList from "./views/ShopList.vue";
import { mapActions, mapState } from 'vuex';
import { shopType } from "@/config/base";
import { apiGetIndex, apiGetRecommends } from "@/api/api";
export default {
    name: "shop",
    data() {
        return {
            page: 2,
            shopType,
            scrollTop: 0,
            location: {},
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
        ...mapState(['shopInfo']),
    },
    onLoad (options) {
        const _this = this
        mpvue.getLocation({
            type: 'wgs84',
            success(res) {
                _this.location.lat = res.latitude
                _this.location.lng = res.longitude
                _this.getIndex({
                    lng: _this.location.lng, 
                    lat: _this.location.lat
                })
            }
        })
    },
    methods: {
        getIndex(params) {
            apiGetIndex(params).then(res => {
                console.log(res);
                this.location.city_id = res.city_id
                this.banners = res.banners
                this.shopList = res.stores.list
            })
        },
        getScroll(e) {
            this.scrollTop = e.target.scrollTop
        },
        getShopload() {
            const _this = this
            apiGetRecommends({
                city_id: _this.location.city_id, 
                lng: _this.location.lng,
                lat: _this.location.lat,
                page: _this.page
            }).then(res => {
                console.log(res);
                _this.page++
                _this.shopList = _this.shopList.concat(res.stores.list)
            })
        },
        upper(e) {
            console.log('upper',e);
        },
        lower(e) {
            console.log('lower',e);
            this.getShopload()
        },
    },

};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/components/layout.scss";
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
</style>

