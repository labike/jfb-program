<!--
 * @Author: zhangHang
 * @Date: 2019-05-22 09:23:41
 * @Description: file content
 -->
<template>
<div class="barcon">
    
    <div class="datum" v-if="infoData.store_type == shopType.hotel">
        <div class="pub border-top">
            <dl class="pub-item facility">
                <dt>酒店设施</dt>
                <ul class="tag">
                    <li><i class="icon i-wifi"></i>无线上网</li>
                    <li><i class="icon i-online"></i>有线上网</li>
                    <li><i class="icon i-park"></i>停车场</li>
                    <li><i class="icon i-canteen"></i>餐厅</li>
                    <li><i class="icon i-water"></i>热水服务</li>
                    <li><i class="icon i-wind"></i>电吹风</li>
                    <li><i class="icon i-awaken"></i>叫醒服务</li>
                    <li><i class="icon i-card"></i>刷卡消费</li>
                    <li><i class="icon i-wash"></i>洗漱用具</li>
                </ul>
            </dl>
            <dl class="pub-item traffic">
                <dt>交通信息</dt>
                <dd>
                    <p class="tit">市图书馆</p>直线距离2.3km
                </dd>
                <dd>
                    <p class="tit">西安站</p>直线距离2.3km
                </dd>
                <dd>
                    <p class="tit">西安南站</p>直线距离2.3km
                </dd>
                <dd>
                    <p class="tit">西安北站</p>直线距离2.3km
                </dd>
            </dl>
            <dl class="pub-item build">
                <dt>酒店情况</dt>
                <ul class="total">
                    <li>装修时间：2015年</li>
                    <li>开业时间：2015年</li>
                    <li>楼层高度：20层</li>
                    <li>房间总数：70间</li>
                </ul>
            </dl>
            <dl class="pub-item intro">
                <dt>酒店介绍</dt>
                <dd>
                    西安金地假日酒店是一家什么什么。这那那这，怎么怎么的西安金地假日酒店是一家什么什么。这那那这，怎么怎么的西安金地假日酒店是一家什么什么。这那那这，怎么怎么的。
                </dd>
            </dl>
        </div>
    </div>
    
    <div class="datum" v-else>
        <div class="pub border-top">
            <dl class="pub-item facility">
                <dt>商家设施</dt>
                <ul class="tag">
                    <li v-for="(tag,index) in otherInfo.hard_facilities" :key="index">
                        <img :src="tag.icon_url" alt="">
                        <span>{{tag.service_name}}</span>
                    </li>
                </ul>
            </dl>
            <dl class="pub-item license" @click="showLicense =true">
                <dt>营业资质</dt>
            </dl>
            <dl class="pub-item intro">
                <dt>商家介绍</dt>
                <dd>{{otherInfo.descriptions}}</dd>
            </dl>
        </div>
    </div>

    <transition name="normal" v-if="showLicense">
        <div class="normal-license">
            <div class="container" @click="showLicense =false">
                <div class="license">
                    <img :src="otherInfo.license_img" mode="widthFix" >
                </div>
            </div>
        </div>
    </transition>

</div>
</template>
<script>
import { shopType } from '@/config/base';
export default {
    data() {
        return {
            shopType,
            showLicense: false
        };
    },
    props: {
        params: Object
    },
    computed: {
        infoData() {
            return this.params.infoData;
        },
        otherInfo() {
            return this.params.otherInfo;
        }
    },
    
    onUnload() {        
        const self = this;
        self.showLicense = false
    },
};
</script>

<style lang="scss" scoped>
.cell li .lable {
    float: left;
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
}
.cell li .input {
    flex: 1;
    width: 100%;
    text-align: right;
    font-size: 14px;
    padding-right: 0.24rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.cell li input {
    text-align: right;
    flex: 1;
    border: none;
    font-size: 14px;
    background: transparent;
    color: #323232;
    display: flex;
    justify-content: flex-start;
}

/***********************商家信息****************************/
.normal-license {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    .top{
        display: flex;
        align-items: center;
        background-color: rgb(42, 140, 250);
        height: 0.88rem;
        color:#fff;
        position: relative;
        .icon-back{
            content: ' ';
            display: block;
            height: 20px;
            width: 20px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            background-image: url('~@/assets/img/back.png');
            // transform: rotate(-90deg);
        }
        .back{
            position: absolute;
            top: 50%;
            left: .2rem;
            transform: translate(0,-50%);
        }
        .title{
            flex: 1;
            text-align: center;
            color: rgb(255, 255, 255);
            font-size: 0.3rem;
        }
    }
    .container{
        flex: 1;
        padding: .2rem .24rem;
        overflow-x: hidden;
        overflow-y: auto;
        .license img {
            width: 100%;
        }
    }
}

.datum-item {
    position: relative;
    margin-bottom: 0.2rem;
    background: #fff;
    &::after{
        content: '';
        position: absolute;
        z-index: 2;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        border-bottom: 1px solid #e8e8e8;
        transform: scaleY(0.5);
        transform-origin: 0 100%;
    }
    &::before{
        content: '';
        position: absolute;
        z-index: 0;
        left: 0;
        top: 0;
        width: 100%;
        height: 1px;
        border-top: 1px solid #e8e8e8;
        transform: scaleY(0.5); 
        transform-origin: 0 0;
    }
}
.datum{
    .basic {
        margin-top: 0.2rem;
        .input {
            color: #818181;
        }
        .icon {
            display: inline-block;
            width: 16px;
            height: 13px;
            margin-right: 0.2rem;
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
        }
    }
    .service {
        padding: 0.3rem 0.24rem;
        dt {
            font-size: 14px;
            color: #000;
            margin-bottom: 0.24rem;
        }
        dd {
            position: relative;
            font-size: 12px;
            min-height: 16px;
            color: #818181;
            margin-bottom: 0.24rem;
            &::before {
                content: '';
                position: relative;
                bottom: -1px;
                float: left;
                width: 15px;
                height: 15px;
                margin-right: 0.2rem;
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                background-image: url(~@/assets/img/minus.png)
            }
        }
    }
    .complain {
        padding: 0.16rem 0.24rem;
    }
    #complain {
        margin: 0;
        height: 0.88rem;
        line-height: 0.88rem;
        background: #fff;
        color: #818181;
        font-size: 15px;
        text-align: center;
        border: 1px solid #818181;
        border-radius: 5px;
    }
    .pub {
        background: #fff;
        padding: 0 .24rem;
    }
}
.datum .pub-item {
    padding: .6rem .24rem .3rem;
    position: relative;
    dt{
        margin-bottom: .3rem;
        font-size: 17px;
        font-weight: 700;
    }
}
.datum .pub-item ~ .pub-item:before {
    content: '';
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid #e8e8e8;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
}
.pub{
    .facility{
        .tag{
            overflow: hidden;
            li{
                float: left;
                width: 33.333%;
                height: 20px;
                margin-bottom: .3rem;
                font-size: 0;
            }
            span{
                font-size: 13px;
            }
            img{
                display: inline-block;
                width: 13px;
                height: 13px;
                margin-right: .1rem;
            }
        }
        .icon{
            display: inline-block;
            width: 13px;
            height: 13px;
            margin-right: .1rem;
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            background-image: url(~@/assets/img/i-wifi.png)
        }
    } 
    .traffic{
        dd{
            color: #818181;
            text-align: right;
            font-size: 12px;
            overflow: hidden;
            margin-bottom: .3rem;
            .tit{
                color: #323232;
                text-align: left;
                float: left;
                font-size: 14px;
            }
        }
    }
    .build .total{
        text-align: left;
        overflow: hidden;
        li{
            margin-bottom: .3rem;
            color: #818181;
            font-size: 12px;
            float: left;
            width: 50%;
        }
    }
    .intro dd{
        line-height: .4rem;
        font-size: 12px;
    }
    .license{
        &::after {
            content: ' ';
            display: inline-block;
            margin-top: -.1rem;
            height: 12px;
            width: 12px;
            background: url('~@/assets/img/right.png') no-repeat;
            background-size: contain;
            background-position: center;
            position: absolute;
            right: .3rem;
            top: 50%;
        }
    }
}

.normal-enter-active,
.normal-leave-active {
    transition: all 0.4s
}

.normal-enter,
.normal-leave-to {
    opacity: 0
}
</style>

