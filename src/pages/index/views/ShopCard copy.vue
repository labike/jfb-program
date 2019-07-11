<template>
<div class="shop-card" v-if="shop && shop.s_id" @click="jumpShop(shop.s_id)">
  
    <div class="card hotel" v-if="shop.type=='2'">
        <div class="hl-img">
            <img :src="shop.headerImg[0].img_url" alt="">
        </div>
        <div class="hl-content">
            <div class="title">
                <div class="name">{{shop.store_name}}</div>
            </div>
            <div class="handle">
                <div class="like" @click.stop="tapLike(shop.s_id)">
                    <div class="icon"></div>
                    <div class="num">{{shop.like_num}}</div>
                </div>
                <button open-type="share" class="share" :data-share="shop" @click.stop="tapShare">
                    <div class="icon"></div>
                    <div class="num">{{shop.share_num}}</div>
                </button>
            </div>
            <div class="score">
                <span class="num">{{shop.score}}</span>分
            </div>
            <div class="address">{{shop.address}}</div>
        </div>
    </div>
    <div class="card other" v-else>
        <div class="title">
            <div class="name">{{shop.store_name}}</div>
            <div class="discount" v-if="discount">
                <p class="text">{{discount}}<span>折</span>买</p>
            </div>
            <div class="dishes" v-if="shop.sort_name==='美食'"></div>
        </div>
        <div class="handle">
            <div class="like" @click.stop="tapLike(shop.s_id)">
                <div class="icon"></div>
                <div class="num">{{shop.like_num}}</div>
            </div>
            <button open-type="share" class="share" :data-share="shop" @click.stop="tapShare">
                <div class="icon"></div>
                <div class="num">{{shop.share_num}}</div>
            </button>
        </div>
        <ul class="score" :class="scoreName">
            <li class="star"></li>
            <li class="star"></li>
            <li class="star"></li>
            <li class="star"></li>
            <li class="star"></li>
            <li class="text">{{shop.score}}分</li>
        </ul>
        <div class="record" v-if="shop.msgData">
            <rollnotice autoplay="2000" :rollData='shop.msgData'>
            </rollnotice>
        </div>
        <ul class="list-img">
            <li class="img-warp" v-for="(imgItem, index) of shop.headerImg" :key="index">
                <img :src="imgItem.img_url" />
            </li>
        </ul>
        <div class="vouchers" v-if="vouchers">{{vouchers}}</div>
        <div class="groupon" v-if="groupon">{{groupon}}</div>
    </div>
</div>
</template>

<script>
import Rollnotice from "@c/rollnotice/Rollnotice.vue";
import { likeShare, apiShareStore } from "@/api/api";
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
        discount() {
            if (!this.shop.proData) {
                return null
            } 
            let discount = this.shop.proData.find(item => {
                return item.type === 'check'
            });
            const check = discount ? discount.name.match(/^\d*(\.?\d{0,1})/g)[0] : null
            return check 
        },
        vouchers() {
            if (this.shop.proData) {
                let vouchers = this.shop.proData.find(item => {
                    return item.type === 'vouchers'
                })
                return vouchers ? vouchers.name : null
            }
            return null 
        },
        groupon() {
            if (this.shop.proData) {
                let groupon = this.shop.proData.find(item => {
                    return item.type === 'group'
                })
                return groupon ? groupon.name : null
            }
            return null
        }
    },
    components: {
        Rollnotice
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
        tapShare(e) {},
    },
};
</script>


<style lang="scss" scoped>

.card{
    background: #fff;
    margin-bottom: 24rpx;
    border-radius: 10rpx;
    padding: 40rpx 24rpx;
    position: relative;
    .title{
        display: flex;
        margin-bottom: 14rpx;
        justify-items: center;
        align-items: center;
        .name{
            font-size: 11pt;
            font-weight:700;
            margin-right: 10rpx;
        }
        .discount{
            height: 30rpx;
            line-height: 1;
            display: flex;
            align-items: center;
            letter-spacing: 1px; 
            border-radius: 2px;
            padding-left: 15rpx;
            padding-right: 5rpx;
            margin-right: 10rpx;
            background-size: auto 30rpx;
            background-position: left center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/discount.png');
            position: relative;
            overflow: hidden;
            &::before{
                content:  '';
                position: absolute;
                left: 50%;
                top: 0;
                right: 0;
                bottom: 0;
                z-index: 1;
                background: #ff2900;
            }
            .text{
                position: relative;
                z-index: 2;
                color: #fff;
                font-size:12px;
                span{
                    font-size:9px;
                }
            }
        }
        .dishes{
            height:32rpx;
            min-width:100rpx;
            background-size:auto 32rpx;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/self_cart.png');
        }
    }
    .handle{
        position: absolute;
        right: .24rem;
        top: .5rem;
        display: flex;
        justify-items: center;
        min-width: 1.6rem;
        text-align: center;
        .num{
            font-size: 20rpx;
            margin-top: 10rpx;
        }
        .icon{
            width: .4rem;
            height: .4rem;
            display: inline-block;
            vertical-align: bottom;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
        }
        .like{
            flex: 1;
            .icon{
                background-image: url('~@/assets/img/icon_good.png');
            }
        }
        .share{
            border:none;
            &::after{
               border:none;
            }
            flex: 1;
            .icon{
                background-image: url('~@/assets/img/icon_share.png');
            }
        }
    }
}
.other{
    background: #fff;
    margin-bottom: 24rpx;
    border-radius: 10rpx;
    padding: 40rpx 24rpx;
    position: relative;
    .title{
        display: flex;
        margin-bottom: 14rpx;
        justify-items: center;
        align-items: center;
        .name{
            font-size:11pt;
            font-weight:700;
            margin-right: 10rpx;
        }
        .discount{
            height: 30rpx;
            border-radius: 2px;
            padding-left: 15rpx;
            padding-right: 5rpx;
            margin-right: 10rpx;
            background-size: auto 30rpx;
            background-position: left center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/discount.png');
            position: relative;
            overflow: hidden;
            &::before{
                content:  '';
                position: absolute;
                left: 50%;
                top: 0;
                right: 0;
                bottom: 0;
                z-index: 1;
                background: #ff2900;
            }
            .text{
                position: relative;
                z-index: 2;
                color: #fff;
                font-size:12px;
                span{
                    font-size:9px;
                }
            }
        }
        .dishes{
            height:32rpx;
            min-width:100rpx;
            background-size:auto 32rpx;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/self_cart.png');
        }
    }
    .score{
        display: flex;
        align-items: center;
        margin-bottom: 24rpx;
        .text{
            color:#818181;
            margin-left: 10rpx;
            font-size: 10pt;
            line-height: 1;
        }
        .star{
            width: .25rem;
            height: .25rem;
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
    .record{
        margin-bottom: 14rpx;
    }
    .list-img{
        display: flex;
        margin-right: -.24rem;
        .img-warp{
            width: 33.333%;
            padding-right: .24rem;
            img{
                width: 100%;
                height: 150rpx;
            }
        }
    }
    .vouchers{
        display: flex;
        align-items: center;
        font-size: .24rem;
        margin-top: .18rem;
        &::before{
            content:  '';
            width: .3rem;
            height: .3rem;
            margin-right: .2rem;
            display: inline-block;
            vertical-align: bottom;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/first_code.png');
        }
    }
    .groupon{
        display: flex;
        align-items: center;
        font-size: .24rem;
        margin-top: .18rem;
        &::before{
            content:  '';
            width: .3rem;
            height: .3rem;
            margin-right: .2rem;
            display: inline-block;
            vertical-align: bottom;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/first_group.png');
        }
    }
}
.hotel{
    display: flex;
    .hl-img{
        width: 1.93rem;
        height: 1.93rem;
        margin-right: .2rem;
        flex-shrink: 0;
        img{
            width: 1.93rem;
            height: 1.93rem;
        }
    }
    .hl-content{
        flex: 1;
        .score{
            color: #2a8cfa;
            font-size: .24rem;
            margin-bottom: .24rem;
            font-weight: 400;
            .num{
                font-size: .3rem;
                margin-right: .1rem;
                font-weight: 700;
            }
        }
        .address{
            color: #818181;
            font-size: .20rem;
        }
    }
}
</style>

