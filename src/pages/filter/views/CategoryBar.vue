<!--
 * @Author: zhangHang
 * @Date: 2019-07-20 09:53:30
 * @Description: file content
 -->
<template>
<div class="mask-warp" v-if="show">
    <div class="mask" @click="closeMask" ></div>
    <div class="mask-inner">
        <div class="bar-warp top">
            <ul class="nav-bar">
                <block  v-for="(snav, sinx) of selectNavList" :key="sinx">
                    <li class="nav"
                        :class='{active: selectNav === sinx}'
                        :data-index="sinx"
                        @tap="tabChange(sinx)"
                    >{{snav}}</li>
                </block>
            </ul>
        </div>

        <div class="list-warp">
            <ul v-if="selectNav == 0&&typeList.length"
                class="mask-list" 
            >
                <li v-for="(sort1, li1) of typeList" :key="li1"
                    :data-id='sort1.id'
                    class="mask-list-item"
                    @click="selectItem(sort1)"
                >
                    <span>{{sort1.sort_name}}</span>
                    <span v-if="sort1.count">({{sort1.count}})</span>
                </li>
            </ul>
            <ul v-if="selectNav == 1&&nearList.length"
                class="mask-list" 
            >
                <li v-for="(near, li2) of nearList" :key="li2"
                    :data-id='near.id'
                    class="mask-list-item" 
                    @click="selectItem(near)"
                >{{near.areaName}}</li>
            </ul>
            <ul v-if="selectNav == 2&&sortList.length"
                class="mask-list" 
            >
                <li v-for="(sort2, li3) of sortList" :key="li3"
                    :data-id='sort2.id'
                    class="mask-list-item" 
                    @click="selectItem(sort2)"
                >{{sort2.name}}</li>
            </ul>
        </div>
    </div>
</div>
</template>

<script>
import { apiBusinessSort } from "@/api/api";
export default {
    name: "categoryBar",
    data() {
        return {
            selectNavList: ['全部', '附近', '智能排序'],
            selectNav: '',
            sort_type: '',
            typeList: [],
            nearList: [],
            sortList: [{
                id: '0',
                name: '智能排序'
            }, {
                id: '1',
                name: '好评优先'
            }, {
                id: '2',
                name: '离我最近'
            }, {
                id: '3',
                name: '人均最低'
            }, {
                id: '4',
                name: '人均最高'
            }, {
                id: '5',
                name: '折扣由低到高'
            }, {
                id: '6',
                name: '折扣由高到低'
            }],
        };
    },
    computed: {
        appData() {
            return wx.getStorageSync('appData');
        }
    },
    props: {
        params: Object,
        select: {
            type: Number,
            default: ''
        },
        show: Boolean
    },
    onLoad () {
        const self = this;
        self.selectNav = self.select
        self.selectNavList = ['全部', '附近', '智能排序']
        apiBusinessSort({
            adCode: self.appData.currentCity.code,
            top_sort: self.params.top_sort
        }).then(res => {
            console.log(res);
            self.nearList = res.addrData
            if (self.params.list && self.params.list.length) {
                self.typeList = self.params.list
            } else {
                self.typeList = res.sortData
                let current = self.typeList.find(item => {
                    return self.params.sort_one === item.id
                })
                if (current) {
                    self.selectNavList[0] = current.sort_name
                    self.$emit('init', current.sort_name)
                }
            }
        })
    },
    watch: {
        select(newVal) {
            this.selectNav = newVal
        },
        params(newVal) {
            if (newVal.sort_one && this.typeList.length) {
                let current = this.typeList.find(item => {
                    return newVal.sort_one === item.id
                })
                if (current) {
                    this.selectNavList[0] = current.sort_name
                    this.$emit('init', current.sort_name)
                }
            }
        }
    },
    methods: {
        closeMask() {
            this.selectNav = ''
            this.$emit('close')
        },
        tabChange(index) {
            this.selectNav = index
        },
        selectItem(item) {
            const newData = JSON.parse(JSON.stringify(item))
            newData.type = this.selectNav
            console.log(newData);
            
            this.$emit('change', newData)
            this.closeMask()
        }
    }
};
</script>

<style lang="scss" scoped>
.mask-warp{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    z-index: 9999;
    justify-content: flex-start;
    .mask{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 10000;
    }
    .mask-inner{
        background: #fff;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: auto;
        min-height: 40%;
        max-height: 80%;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
    }
}

.bar-warp {
    position: relative;
    .nav-bar {
        font-size: 26rpx;
        color: #000;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1rpx solid #ededed;
        .nav{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding:  24rpx;
            &::after {
                content: '';
                display: block;
                width: 25rpx;
                height: 25rpx;
                margin-left: 10rpx;
                background-image: url(~@/assets/img/radio_right.png);
                transform: rotateZ(90deg);
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
            }
        }
        .active{
            color: #2a8cfa;
            &::after {
                content: '';
                background-image: url(~@/assets/img/radio_right.png);
                transform: rotateZ(-90deg);
            }
        }
    }
}
.list-warp{
    width: 100%;
    height: 100%;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    position: relative;
    .mask-list{
        border-top: 1rpx solid #e8e8e8;
    }
    .mask-list-item{
        border-bottom: 1rpx solid #e8e8e8;
        padding: 24rpx 30rpx;
    }
}

</style>

