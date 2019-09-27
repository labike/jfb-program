<!--
 * @Author: zhangHang
 * @Date: 2019-05-16 10:28:57
 * @Description: file content
 -->
<template>
    <ul class="footer border-top" >
        <li v-if="cart==='open'"  @click="jumpGoods">
            <div class="cart"
                v-if="infoData.store_type == shopType.repast">立即点餐</div>
            <div class="cart"
                v-if="infoData.store_type == shopType.pastime">立即选购</div>
            <div class="cart"
                v-if="infoData.store_type == shopType.icar">立即选购</div>
        </li>
        <li v-else @click="jumpGoods">
            <div class="cart"
                v-if="infoData.store_type == shopType.repast">到店点餐</div>
            <div class="cart"
                v-if="infoData.store_type == shopType.pastime">到店消费</div>
            <div class="cart"
                v-if="infoData.store_type == shopType.icar">到店消费</div>
        </li>
    </ul>
</template>

<script type="text/babel">
import { mapState } from 'vuex';
import { WAPHOST, shopType } from "@/config/base";
export default {
    name: 'footer',
    data() {
        return {
            shopType,
            shop_id: ''
        };
    },
    props: {
        infoData: Object
    },
    onLoad (options) {
        this.shop_id = options.shop_id;
        console.log(options);
    },
    methods: {
        
        jumpGoods() {
            const page = WAPHOST + "goods?shop_id=" + this.shop_id + "&token=" + wx.getStorageSync('token')
            this.$router.push({
                path: `/pages/web/main?url=${encodeURIComponent(page)}`
            })
        },
    },
};
</script>


<style lang="scss" scoped>
ul.footer{
    height: 1rem;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    li {
        flex: 1;
        .cart{
            margin: auto;
            width: 250px;
            height: 1rem;
            color: #fff;
            font-size: 13px;
            line-height: 1rem;
            text-align: center;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/btn_b.png');
        }
        .text{
            margin-top: 2px;
            font-size: 12px;
            text-align: center;
        }
    }
    img{
        margin: auto;
        width: 18px;
        height: 18px;
        display: block;
    }
}
</style>


