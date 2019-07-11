<template>
    <div class="vouchers-wrapper">
        <div class="vouchers-details" v-if="currentItem">
            <div class="shop-name">{{currentItem.storeInfo.store_name}}</div>
            <div class="vouchers">
                <img src="/static/img/ticket.png" alt="" class="bg">
                <div class="inner">
                    <div class="name">
                        <span>{{ currentItem.old_price }}</span> 元 代金券
                    </div>
                    <div class="rules">
                        <span>{{ currentItem.rules.overlying }}</span>
                    </div>
                </div>
            </div>
            
            <div class="other-info">
                <ul class="rules">
                    <li class="item" v-if="currentItem.rules.bespeak">
                        <i class="icon"></i>{{ currentItem.rules.bespeak }}
                    </li>
                    <li class="item"  v-if="currentItem.rules.refund">
                        <i class="icon"></i>{{currentItem.rules.refund}}
                    </li>
                </ul>
                <div class="num">
                    已售 {{ currentItem.sale_num }} 份
                </div>
            </div>
            <other-rules :rulesData="currentItem.rules"></other-rules>
            
        </div>
    </div>
</template>

<script>
import OtherRules from './OtherRules.vue'
import Voucher from '@/config/class/voucher';
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'VouchersDetails',
    components: {
        OtherRules
    },
    props: {
        id: String
    },
    onLoad (options) {
        console.log(options.shop_id, this.id);
        this.getDetails(options.shop_id, this.id)
    },
    computed: {
        ...mapState('shop',['currentItem']),
    },
    methods: {
        ...mapMutations('shop', [
            'SET_CURRENT_ITEM'
        ]),
        getDetails(shopID, id) {
            let voucher = new Voucher({id})
            voucher.getVoucherRules(shopID).then(res => {
                this.SET_CURRENT_ITEM(res)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.vouchers-wrapper{
    padding: .24rem;
    padding-bottom: 0;
    background: #fff;
    margin-bottom: .24rem;
    .vouchers-details{
        overflow: hidden;
        .shop-name{
            color: #000;
            font-size: 20px;
            font-weight: 700;
            margin-top: 0.1rem;
            margin-bottom: 0.2rem;
        }
    }
}
.vouchers {
    padding: 0.4rem;
    position: relative;
    margin-top: 0.3rem;
    .bg{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }
    .inner{
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
    }
    .name{
        flex: 1;
        color: #323232;
        font-size: .24rem;
        span{
            font-size: .6rem;
        }
    }
    .rules{
        font-size: 12px;
        color: #818181;
    }
}
.other-info{
    margin-top: .2rem;
    color: #818181;
    .rules{
        float: left;
        display: flex;
    }
    .item{
        margin-right: .2rem;
        .icon{
            margin-right: .1rem;
            display: inline-block;
            margin-bottom: -2px;
            height: 12px;
            width: 12px;
            background-image: url(~@/assets/img/selected@b.png);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }
    }
    .num{
        text-align: right;
    }
}
</style>



