<!--
 * @Author: zhangHang
 * @Date: 2019-07-01 15:40:58
 * @Description: file content
 -->
<template>
<div class="group-wrapper">
    <div class="group-details" v-if="currentItem">
        <div class="gds-name">{{currentItem.name}}</div>
        <div class="other-info">
        
            <ul class="rules">
                <li v-if="currentItem.rules.overlying">{{ currentItem.rules.overlying }}</li>
                <li v-if="currentItem.rules.refund">{{ currentItem.rules.refund }}</li>
            </ul>
            <div class="num">
                已售 {{ currentItem.sale_num }} 份
            </div>
        </div>

        <div class="gds-img" v-if="currentItem.imgUrl">
            <div class="wrapper" @click="showGallary(currentItem.imgUrl.imgList)">
                  <swiper :indicator-dots='true' indicator-color='rgba(0, 0, 0, .3)' indicator-active-color="#fff" :style="{height: '100%'}" :autoplay='false' :interval='6000' :duration='1000' :circular='true'>
                    <block v-for="(item, index) of currentItem.imgUrl.imgList" :key="index">
                        <swiper-item>
                            <img class='img' mode="aspectFill" :src="item.img">
                        </swiper-item>
                    </block>
                </swiper>
                <p class="num">共 {{ currentItem.imgUrl.count }} 张</p>
            </div>
        </div>
        
        <div class="gds-details">
            <dl v-for="(group, ginx) in currentItem.groupContent" :key="ginx">
                <dt>{{ group.sort_name }} <span v-if=" group.selectType != 0">({{ group.selectType }})</span></dt>
                <dd v-for="(item, cinx) in group.content" :key="cinx">
                    <div class="name">{{ item.name }}</div>
                    <div class="num">{{ item.num }}份</div>
                    <div class="price">{{ item.price }}</div>
                </dd>
            </dl>
        </div>

        <other-rules :rulesData="currentItem.rules"></other-rules>

        <div class="other-description">
            <dl v-if="currentItem.description">
                <dt>团购介绍</dt>
                <dd>{{ currentItem.description }}</dd>
            </dl>
        </div>
    </div>

</div>
</template>

<script>
import OtherRules from './OtherRules.vue'
import CommonGallary from "@c/gallary/Gallary.vue";
import { mapState, mapMutations } from "vuex";
import Combo from '@/config/class/combo';
export default {
    name: 'GroupDetails',
    data() {
        return {
            gallarList: [],
            showGallaryState: false,
        };
    },
    components: {
        OtherRules,
        CommonGallary
    },
    props: {
        id: String
    },
    onLoad (options) {
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
            let combo = new Combo({id})
            combo.getComboDetails(shopID).then(res => {
                this.SET_CURRENT_ITEM(res)
            })
        },
        showGallary(list) {
            let imgList = []
            list.forEach(element => {
                imgList.push(element.img)
            });
            this.showGallaryState = true
            this.gallarList = imgList
        },
        closeGallary() {
            this.showGallaryState = false
        }
    }
}
</script>

<style lang="scss" scoped>
.group-wrapper {
    padding: .24rem;
    background: #fff;
    margin-bottom: .24rem;
}

.gds-name {
    margin-top: .2rem;
    font-size: 18px;
    font-weight: 700;
}

.other-info {
    margin-top: .2rem;
    color: #818181;
    .rules {
        float: left;
        display: flex;
        li {
            margin-right: .2rem;
            &::before{
                content: '';
                margin-right: .1rem;
                display: inline-block;
                margin-bottom: -2px;
                height: 12px;
                width: 12px;
                background: url('~@/assets/img/selected@g.png') no-repeat;
                background-size: contain;
                background-position: center;
            }
        }
    }
    .num {
        text-align: right;
    }
}

.gds-details,
.other-rules {
    margin-top: .6rem;
    dl {
        margin-bottom: .3rem;
        dt {
            margin-bottom: .3rem;
            font-size: 13px;
            font-weight: 700;
        }
        dd {
            font-size: 13px;
            margin-bottom: .15rem;
            &::before {
                content: '';
                display: inline-block;
                width: 0;
                height: 0;
                border: 2px solid #000;
                vertical-align: middle;
                margin-right: .1rem;
                border-radius: 50%;
            }
        }
    }
}

.gds-details {
    margin-top: .4rem;
    dd {
        display: flex;
        align-items: center;
        .name {
            flex: 1;
        }
        .num {
            width: 15%;
            text-align: right
        }
        .price {
            width: 30%;
            text-align: right;
            &::before{
                content: '￥';
                font-size: 10px;
            }
        }
    }
}

.gds-img {
    margin-top: .2rem;
    width: 100%;
    height: 0;
    padding-bottom: 66.666%;
    overflow: hidden;
    position: relative;
    .wrapper {
        width: 100%;
        position: absolute;
        bottom: 0;
        top: 0;
        left: 0;
        right: 0;
        .swiper-container {
            height: 100%;
        }
        .img {
            width: 100%;
            min-height: 100%
        }
    }
    .num{
        position: absolute;
        right: 0.2rem;
        bottom: 0.2rem;
        color: #fff;
        padding: 3px 6px;
        text-align: center;
        font-size: 10px;
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.6);
        z-index: 10;
    }
}

.other-description{
    margin-top: .4rem;
    dl{
        margin-bottom: .3rem;
        dt{
            margin-bottom: .3rem;
            font-size: 13px;
            font-weight: 700;
        }
        dd{
            font-size: 13px;
            margin-bottom: .15rem;
            &::before {
                content: '';
                display: inline-block;
                width: 0;
                height: 0;
                border: 2px solid #000;
                vertical-align: middle;
                margin-top: -2px;
                margin-right: .15rem;
                border-radius: 50%;
            }
        }
    }
}
</style>


