<!--
 * @Author: zhangHang
 * @Date: 2019-05-22 09:23:41
 * @Description: file content
 -->
<template>
<section class="jfb-flexview" v-if="loading&&shopInfo && shopInfo.infoData">
    <section class="jfb-scrollview" id="scrollView">
        <shop-header :infoData="shopInfo.infoData"></shop-header>
        <div class="shop-navbar">
            <ul class="navbar">
                <li v-for="(nav, key) in storeNav" :key="key"
                    :class="{ cur: showView === key }"
                    @click="showView = key"
                >
                    <span> {{ nav }}</span>
                </li>
            </ul>
        </div>
        <div class="shop-content">
            <shop-home v-if="showView === 0" :params='shopInfo.proData'></shop-home>
            <shop-rate v-if="showView === 1" :params='shopInfo.commentScore'></shop-rate>
            <shop-base v-if="showView === 2" :params='shopInfo'></shop-base>
        </div>
    </section>
    <div class="shop-footer">
        <lay-footer :infoData="shopInfo.infoData"></lay-footer>
    </div>
    
</section>
</template>

<script>
import LayFooter from "@c/footer/Footer.vue";
import ShopHeader from "./../views/ShopHeader.vue";
import ShopHome from "./../views/ShopHome.vue";
import ShopRate from "./../views/TabRate.vue";
import ShopBase from "./../views/TabInfo.vue";
import { mapActions, mapState } from 'vuex';
import { shopType } from "@/config/base";
export default {
    name: "shop",
    data() {
        return {
            loading: false,
            storeNav: ['主页优惠', '网友评价', '商家信息'],
            showView: 0,
            shopType
        };
    },
    components: {
        LayFooter,
        ShopHeader,
        ShopHome,
        ShopRate,
        ShopBase
    },
    computed: {
        ...mapState('shop',{
            shopInfo: state => state.shopInfo,
        }),
    },
    onLoad (options) {
        const s_id = options.shop_id;
        this.saveShopInfo({
            s_id
        }).then(() => {
            this.loading = true
        });
    },
    onUnload() {        
        const self = this;
        self.showView = 0
        self.loading = false
    },
    methods: {
        ...mapActions('shop',['saveShopInfo'])
    }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/components/layout.scss";
.shop-navbar {
    margin-top: .1rem;
    height: 0.88rem;
    background: #fff;
    .navbar {
        height: 0.88rem;
        line-height: 0.88rem;
        font-size: 15px;
        display: flex;
        background: #fff;
        &.fiexd {
            top: 0.88rem;
            box-shadow: 0px 1px 4px #e1e1e1;
        }
        li {
            flex: 1;
            text-align: center;
            font-weight: 700;
            color: #000;
        }
        .cur {
            color: #2a8cfa;
            >*{
                display: inline-block;
                border-bottom: 3px solid #2a8cfa;
                height: 100%;
            }
        }
    }
}
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
</style>

