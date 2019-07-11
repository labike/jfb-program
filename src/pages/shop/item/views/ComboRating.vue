<template>
<section class="model-rating" v-if="shopInfo">
    <header class="rating-header border-bottom">用户评价</header>
    <tab-rate :params='shopInfo.commentScore'></tab-rate>
</section>
</template>


<script>

import TabRate from "./../../views/TabRate.vue";
import { mapState } from 'vuex';
export default {
    name: "ComboRating",
    components: {
        TabRate
    },
    computed: {
        ...mapState('shop',['shopInfo'])
    },
}
</script>

<style lang="scss" scoped>
    .model-rating{
        background: #fff;
        .rating-header{
            padding: .24rem;
            font-size: 14px;
        }
    }
</style>

