<template>
<section class="shop-list" v-if="shopList.length">
    <shop-card :shopInfo='shop' v-for="(shop, index) of shopList" :key="index"></shop-card>
</section>
</template>

<script>
import ShopCard from "./ShopCard.vue";
export default {
    name: 'ShopList',
    data() {
        return {
            height: 0,
            shopList: []
        }
    },
    props: {
        list: Array
    },
    components: {
        ShopCard
    },
    watch: { // 使用监听的方式，监听数据的变化
        list(val) {
            this.shopList = val;
        }
    },
    onLoad() {
        const _this = this
        this.shopList = this.list
    },

}
</script>


<style lang="scss" scoped>
.shop-list {
    padding: 24rpx;
    .card {
        margin-bottom: 24rpx;
        background: #fff;
        border-radius: 10rpx;
        padding: 40rpx 24rpx;
    }
}
</style>


