<template>
<div class="shop-card" v-if="shop && shop.id" @click="jumpShop(shop.id)">

    <header class="hd">
        <div class="record" v-if="record">{{record}}</div>
        <div class="scale">返佣
            <span class="red" >{{shop.reward_ammount}}</span>
        </div>
    </header>
    <div class="bd">
        <div class="img-warp">
            <img :src="shop.store_img" alt="">
        </div>
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
        <div class="handle" v-if="shop.user_is_attend">
            <div class="btn" v-if="shop.user_is_attend == 1"  @click.stop="goShare(shop)">去分享</div>
            <div class="btn join" v-else @click.stop="joinShare(shop.id)">加入分享</div>
        </div>
    </div>
</div>
</template>

<script>
// address: "陕西省西安市阎良区"
// average_fee: "0"
// collect_num: "0"
// comment_num: "0"
// do_business: "1"
// id: "13"
// lat: "34.662141"
// license_img: "http://store.qmwjj.cc/storeImg/License/20190704092410_823.jpg"
// like_num: "0"
// lng: "109.228020"
// one_sort: "718"
// open_end: "1562252400"
// open_start: "1562198400"
// reward_ammount: "0.03"
// reward_time: "1562221270"
// score: "0"
// share_num: "5"
// shopping_open: "1"
// store_img: "http://store.qmwjj.cc/storeImg/Atlas/20190704092241_350.jpg"
// store_name: "程小龙会所"
// top_sort: "3"
// two_sort: "0"
// type_name: "休闲娱乐"
// user_is_like: 0
import { likeShare, apiShareStore } from "@/api/api";
import { formatTime } from '@/utils/index'
export default {
    name: 'ShopCard',
    data() {
        return {
            shop: {}
        }
    },
    props: {
        shopInfo: Object
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
            const reward_time = this.shop.reward_time
            if (!reward_time) {
                return null
            }
            return formatTime(reward_time) 
        },
    },
    methods: {
        jumpShop(id) {
            mpvue.navigateTo({
                url: '/pages/shop/index/main?shop_id=' + id
            }) 
        },
        tapLike(s_id) {
            likeShare({
                s_id,
                type: 'like'
            }).then(res => {
                // store_num: 114
                console.log(res);
                this.shop.like_num = res.store_num
                wx.showToast({
                    title: res.message,
                    icon: 'success',
                    duration: 1000
                })
            })
        },
        goShare(shop) {
            this.$emit('share', shop)
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
        left: -200rpx;
        top: 0;
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
                color: #fff;
            }
        }
    }
}
.hd{
    border-bottom:  1rpx solid #dededd;
    color: #818181;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    padding-bottom: 15rpx;
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
.bd{
    margin-left: 200rpx;
    min-height: 160rpx;
    position: relative;
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

</style>

