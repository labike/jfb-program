<template>
<div class="share_container">

	<div class="mask-warp" v-if="showShowShare">
		<div class="mask" @click="showShowShare=false"
            :class="{orange: showWxShare}"
        ></div>
		<div class="mask-inner" >
            <div class="card-share" v-if="showWxShare" >
                <header class="base-info">
                    <div class="avater">
                        <img :src="userInfo.headimgurl">
                    </div>
                    <div class="nickname">{{userInfo.nickname}}</div>
                    <div class="close" @click="showShowShare=false"></div>
                </header>
			    <app-share :cardInfo='cardInfo'></app-share>
            </div>
			<div class="content" v-else>
				<div class="hd border-bottom" v-if="storeInfo">
					<div class="img-warp">
						<img :src="storeInfo.header_img"  mode="aspectFit" >
					</div>
					<div class="info">
						<div class="name">{{storeInfo.store_name}}</div>
						<div class="score" :class="storeInfo.className">
							<i class="rate"></i>
							<i class="rate"></i>
							<i class="rate"></i>
							<i class="rate"></i>
							<i class="rate"></i>
							<span class="text">{{storeInfo.score}} 分</span>
						</div>
						<div class="address">{{storeInfo.address}}</div>
					</div>
				</div>
				<div class="bd" v-if="shareScale">
					<div class="tit">分享这家店铺有机会获得返佣哦</div>
					<div class="msg">
						你可以将这家店铺分享给好友，<br/>
						有好友通过你的分享购消费了商品，<br/>
						您即可获得核单返佣
					</div>
					<div class="scale">
						<ul>
							<li>团购   {{shareScale[orderType.combo]}}%</li>
							<li>买单   {{shareScale[orderType.paying]}}%</li>
							<li>代金券 {{shareScale[orderType.vouchers]}}%</li>
							<li>购物车 {{shareScale[orderType.goods]}}%</li>
						</ul>
					</div>
				</div>
				<div  class="share-btn" @tap="showWxShare=true">立即分享</div>
			</div>
			
		</div>
	</div>
</div>
</template>

<script type="text/babel">
import LayModel from "@c/layouts/Model.vue";
import AppShare from "./AppShare.vue";
import { orderType } from '@/config/base'
import { apiShareStore, likeShare } from "@/api/api";
import { mapState } from 'vuex';
export default {
    name: 'Share',
    components: {
        LayModel,
        AppShare
    },
    data() {
        const that = this
        return {
            orderType,
            storeInfo: null,
            shareInfo: null,
            showShowShare: false,
            showWxShare: false,
            cardInfo: {
                code: '',
                title: '',
                imageUrl: "", 
                qrCode: "", 
                address: "",
                mobile: "",
                company: "", 
            },
        }
    },
    props: {
        store_id: String
    },
    onLoad() {
        const that = this
        apiShareStore(that.store_id).then(result => {
            let storeInfo = result.storeInfo
            storeInfo.className = 'score' + parseInt(storeInfo.score) 
            that.storeInfo = storeInfo
            that.shareInfo = result.shareInfo
            let shareQrImg = result.shareQrImg.replace("http://", "https://")
            console.log(result);
            if (result.shareInfo.sharePermit) {
                if (result.userShareStoreNum < 50) {
                    that.cardInfo.title = result.storeInfo.store_name
                    that.cardInfo.desc = result.storeInfo.address + '\n我在减付宝发现一家好店，快来看看吧'
                    that.cardInfo.qrCode = shareQrImg
                    that.cardInfo.imageUrl = result.storeInfo.header_img
                    that.cardInfo.address = storeInfo.address
                    that.cardInfo.mobile = storeInfo.store_mobile
                    that.cardInfo.code = result.shareUrl
                    console.log(that.cardInfo);
                    
                    that.showShowShare = true
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
    computed: {
        ...mapState({
            "userInfo": state => state.user.userInfo 
        }),
        shareScale() {
            if (this.shareInfo && this.shareInfo.info) {
                let oType = {};
                this.shareInfo.info.forEach(scale => {
                    oType[scale.type] = scale.ratio
                });
                return oType
            }
            return null
        }
    },
    methods: {
        closeShowShare() {
            this.showShowShare = false;
        },
    }
}
</script>


<style lang="scss" scoped>
.share_container {
	.score{
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        .text{
            color:#818181;
            margin-left: 10rpx;
            font-size: 12px;
            line-height: 1;
        }
        .rate{
            width: .25rem;
            height: .25rem;
            display: inline-block;
            vertical-align: bottom;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('~@/assets/img/star2.png');
        }
        &1 .rate:nth-child(1),
        &2 .rate:nth-child(-n + 2),
        &3 .rate:nth-child(-n + 3),
        &4 .rate:nth-child(-n + 4),
        &5 .rate:nth-child(-n + 5) {
            background-image: url('~@/assets/img/starSelect2.png');
        }
    }
	.content {
		background: #fff;
		.hd{
			display: flex;
			padding: 24rpx;
			.img-warp{
				display: flex;
				align-items: center;
				flex-shrink: 0;
				margin-right: 20rpx;
				img{
					width: 140rpx;
					height: 140rpx;
				}
			}
			.info{
				flex: 1;
				.name{
					color: #000;
					font-size: 15px;
					margin-bottom: 20rpx;
				}
				.address{
					color: #aeaeae;
					font-size: 11px;
				}
			}
		}
		.bd{
			text-align: center;
			.tit{
				color: #323232;
				font-size: 14px;
				margin: 40rpx 10rpx 20rpx;
			}
			.msg{
				color: #818181;
				font-size: 11px;
				margin: 40rpx 10rpx;
				line-height: 1.6;
			}
			.scale{
				display: flex;
				justify-content: center;
				ul{
					display: flex;
					flex-wrap: wrap;
				}
				li{
					text-align: left;
					color: #000;
					font-size: 13px;
					font-weight: 700;
					width: 50%;
					margin-bottom: 40rpx;
				};
			}
		}
		.share-btn {
			text-align: center;
			letter-spacing: 1px;
			font-size: 14px;
			line-height: 100rpx;
			background: #2e80f9;
			color: #fff;
		}
	}
	.mask-warp{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        z-index: 9999;
        justify-content: flex-start;
        .mask{
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.4);
            z-index: 10000;
            &.orange{
                background-color: #ff8b28;
            }
        }
        .mask-inner{
            position: absolute;
            top: 50%;
            left: 50%;
            width: 90%;
            height: auto;
            z-index: 10001;
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            transform: translate(-50%, -50%);
        }
    }
    .base-info{
        height: 85px;
        position: relative;
        .avater{
            margin: auto;
            width: 120rpx;
            height: 120rpx;
            background: #f5f5f5;
            border-radius: 50%;
            overflow: hidden;
            img{
                width: 120rpx;
                height: 120rpx;
            }
        }
        .nickname{
            text-align: center;
            margin: 15rpx;
            color: #fff;
            font-size: 14px
        }
    }
    .close{
        position: absolute;
        right: 0;
        bottom: 10rpx;
        width: 60rpx;
        height: 60rpx;
        margin: auto;
        background-repeat: no-repeat;
        background-size: 40rpx;
        background-position: center;
        background-image: url(~@/assets/img/close.png);
    }
}
</style>
