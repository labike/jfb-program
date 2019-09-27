<!--
 * @Author: zhangHang
 * @Date: 2019-06-20 10:28:46
 * @Description: 返佣店铺
 -->
<template>
<div class="shop-card" v-if="shop && shop.id" @click="jumpShop(shop.id)">

    <div class="card">
        <div class="img-warp">
            <img :src="shop.store_img" alt="">
        </div>
        <div class="cancel" v-if="handle && shop.user_is_attend == 1" @click.stop="cancelShare(shop.id)"></div>
        <div class="title">{{shop.store_name}}</div>
        <ul class="score" :class="scoreName">
            <li class="star"></li>
            <li class="star"></li>
            <li class="star"></li>
            <li class="star"></li>
            <li class="star"></li>
            <li class="text">{{shop.score}}分</li>
        </ul>
        <div class="type">{{shop.type_name}}</div>
        <div class="handle" v-if="handle">
            <div class="btn" v-if="shop.user_is_attend == 1"  @click.stop="goShare(shop)">去分享</div>
            <div class="btn join" v-if="shop.user_is_attend == 0" @click.stop="joinShare(shop.id)">加入分享</div>
        </div>
    </div>
    
    <footer class="datum" v-if="shop.new_reward">
        <div class="record" v-if="record">{{record}}</div>
        <div class="scale" v-if="scale">返佣
            <span class="red" >{{scale}}</span>
        </div>
    </footer>
</div>
</template>

<script>
import { likeShare, apiShareStore, unLikeShare } from "@/api/api";
export default {
    name: 'ShopCard',
    data() {
        return {
            shop: {}
        }
    },
    props: {
        shopInfo: Object,
        handle: {
            type: Boolean,
            default: false
        }
    },
    onLoad() {
        this.shop = this.shopInfo
    },
    computed: {
        scoreName() {
            if (!this.shop.score) {
                return ''
            }
            let scoreName = 'score' + this.shop.score
            const scoreDot = scoreName.indexOf('.')
            if (scoreDot > -1) {
                scoreName = scoreName.slice(0,scoreDot)
                if (Math.round(this.shop.score) > Math.floor(this.shop.score)) {
                    scoreName = scoreName + ' dot'
                }
            }
            return scoreName;
        },
        record() {
            const new_reward = this.shop.new_reward
            if (!new_reward) {
                return null
            } 
            let record = ''
            record = new_reward.minute + new_reward.username + '返佣' + new_reward.money
            return record 
        },
        scale () {
            const new_reward = this.shop.new_reward
            if (new_reward && new_reward.shareInfo.sharePermit) {
                return new_reward.shareInfo.range 
            }
            return null
        }
    },
    methods: {
        jumpShop(id) {            
            this.$router.push({
                path: '/pages/shop/index/main?shop_id=' + id
            })  
        },
        joinShare(s_id) {
            const that = this
            likeShare({
                s_id,
                type: 'attend'
            }).then(res => {
                wx.showToast({
                    title: res.message,
                    icon: 'success',
                    duration: 1000
                })
                that.$emit('refresh')
            })
        },
        cancelShare(s_id) {
            const that = this
            wx.showModal({
                title: '是否取消分享店铺',
                content: '取消了就不能获得这家店铺的返佣了，您确定要取消吗？',
                success: function (result) {
                    if (result.confirm) {
                        unLikeShare({
                            s_ids: s_id,
                            type: 'attend'
                        }).then(res => {
                            wx.showToast({
                                title: '已取消该分享店铺',
                                icon: 'success',
                                duration: 1000
                            })
                            that.$emit('refresh')
                        })
                    }
                }
            })
            
        },
        goShare(shop) {
            const that = this
            apiShareStore(shop.id).then(result => {
                if (result.shareInfo.sharePermit) {
                    if (result.userShareStoreNum < 50) {
                        const cardInfo = {
                            code: result.shareUrl,
                            title: result.storeInfo.store_name,
                            qrCode: result.shareQrImg,
                            imageUrl: result.storeInfo.header_img,
                            address: result.storeInfo.address,
                            mobile: result.storeInfo.store_mobile,
                        }
                        this.$emit('share', cardInfo)
                    } else {
                        wx.showModal({
                            content: '您分享的店铺已到达上限',
                            showCancel: false,
                            // confirmText: '好的',
                            confirmColor: '#333',
                        })
                    }
                }
            })
            
        },
    },
};
</script>


<style lang="scss" scoped>
.shop-card{
    background: #fff;
    margin: 24rpx 30rpx;
    padding: 24rpx;
    border-radius: 10rpx;
    position: relative;
    .img-warp{
        position: absolute;
        left: 24rpx;
        top: 24rpx;
        width: 160rpx;
        height: 160rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
        img{
            display: block;
            width: 160rpx;
            height: 160rpx;
        }
    }
    .cancel{
        position: absolute;
        right: 0;
        top: 0;
        width: 80rpx;
        height: 80rpx;
        background-size: 24rpx 24rpx;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('~@/assets/img/ic_dialog_close.png');
    }
    
    .handle{
        position: absolute;
        right: 24rpx;
        top: 134rpx;
        .btn{
            min-width: 100rpx;
            text-align: center;
            color: #fff;
            border: 1px solid #fff;
            background: #ff2900;
            height: 50rpx;
            line-height: 50rpx;
            border-radius: 50rpx;
            padding: 0 20rpx;
            font-size: 11px;
            &.join{
                border: 1px solid #ff2900;
                background: #fff;
                color: #ff2900;
            }
        }
    }
}
.card{
    margin-left: 200rpx;
    min-height: 160rpx;
    .title{
        font-size: 15px;
        font-weight: 700;
        margin-right: 70rpx;
        margin-bottom: 15rpx;
        word-wrap: normal;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .score{
        display: flex;
        align-items: center;
        margin-bottom: 15rpx;
        .text{
            color:#818181;
            margin-left: 10rpx;
            font-size: 12px;
            line-height: 1;
        }
        .star{
            width: 25rpx;
            height: 25rpx;
            display: inline-block;
            vertical-align: bottom;
            background-size: 25rpx 25rpx;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/icon_rating_bar_secondary_progress.png');
        }
        &1 .star:nth-child(1),
        &2 .star:nth-child(-n + 2),
        &3 .star:nth-child(-n + 3),
        &4 .star:nth-child(-n + 4),
        &5 .star:nth-child(-n + 5) {
            background-image: url('~@/assets/img/icon_rating_bar_progress.png');
        }
        &1.dot .star:nth-child(2),
        &2.dot .star:nth-child(3),
        &3.dot .star:nth-child(4),
        &4.dot .star:nth-child(5) {
            position: relative;
            &::after{
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                width: 50%;
                height: 100%;
                vertical-align: bottom;
                background-size: 25rpx 25rpx;
                background-position: 0 0;
                background-repeat: no-repeat;
                background-image: url('~@/assets/img/icon_rating_bar_progress.png');
            }
            
        }
    }
    .type{
        color: #818181;
        font-size: 12px;
    }
}
.datum{
    border-top:  1rpx solid #dededd;
    color: #818181;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24rpx;
    padding-top: 15rpx;
    .record {
        word-wrap: normal;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .scale {
        flex-shrink: 0;
        .red {
            color: #ff2900;
        }
    }
}
</style>

