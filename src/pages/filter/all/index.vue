<!--
 * @Author: zhangHang
 * @Date: 2019-06-24 09:25:19
 * @Description: file content
 -->
<template>
<div class="listview">
    <div  class="container">
        <scroll-view class="list-shortcut" 
            :scroll-into-view="navId"
            scroll-with-animation="true"
            scroll-y 
        >
            <ul class="menu-ul">
                <li class="menu-item"
                    v-for="(item, sinx) in classify" :key="sinx"
                    :id="'nav_'+sinx"
                    :class="{'current': currentIndex === sinx}"
                    @tap="selectMenu(sinx)"
                >{{item.sort_name}}</li>
            </ul>
        </scroll-view>

        <scroll-view class="list-catalogue"
            scroll-y
            @scroll="onScroll"
            :scroll-into-view="contentId"
            scroll-with-animation="true"
        >
            <div class="classify" v-for="(catalogue, inx1) in classify" :key="catalogue.id"  
                :id="'con_'+inx1" ref="listGroup"
            >
                <h2 class="list-group-title" :style="'height:'+titleHeight+'rpx'">
                    <div class="icon">
                        <ImageView :src="catalogue.img" height="100%"></ImageView>
                    </div>
                    <div class="name">{{catalogue.sort_name}}</div>
                    <div class="go"  @click="selectGroup(catalogue)">去频道</div>
                </h2>

                <ul class="list-group">
                    <li class="list-group-item" :style="'height:'+listHeight+'rpx'"
                        v-for="(group, inx2) in catalogue.childData" :key="group.id" :data-index="inx2"
                        @click="selectGroup(group)"
                    >
                        <div class="icon">
                            <ImageView :src="group.img"  mode="aspectFit"  height="120rpx" width="100%"></ImageView>
                        </div>
                        <div class="name">{{group.sort_name}}</div>
                    </li>
                </ul>
            </div>
        </scroll-view>
    </div>
</div>
</template>

<script>
import LayHeader from "@c/header/Header.vue";
import ImageView from '@c/layouts/ImageView.vue'
import { apiGetAllSort, apiSearch } from "@/api/api";
export default {
    name: "shop",
    data() {
        return {
            contentId: '', // 每个food-list的id，scroll-into-view滚动到对应的id
            navId: '', // 导航模块对应的id，用来联动内容区域
            currentIndex: 0,
            titleHeight: 100,
            listHeight: 180,
            contentHeight: [], // 内容区域scroll-view高度
            classify: [],
        };
    },
    components: {
        LayHeader,
        ImageView
    },
    onLoad (options) {
        this.getAllSort()
    },
    methods: {
        getAllSort() {
            apiGetAllSort().then(res => {
                this.classify = res
                this._calculateHeight(res)
            }).catch(err => {
                throw err
            })
        },
        selectMenu(index) {
            this.navId = `nav_${index}`
            this.contentId = `con_${index}`
            this.currentIndex = index
        },
        onScroll(e) {
            this.contentId = ''
            let scrollTop = e.target.scrollTop
            let length = this.contentHeight.length
                      
            if (scrollTop >= this.contentHeight[length - 1]) {
                return
            } else if (scrollTop > 0 && scrollTop < this.contentHeight[0]) {
                this.currentIndex = 0
            }
            for (let i = 0; i < length; i++) {
                if (scrollTop >= this.contentHeight[i - 1] && scrollTop < this.contentHeight[i]) {
                    this.currentIndex = i
                }
            }
            
        },
        _calculateHeight(list) {
            const rat = wx.getSystemInfoSync().windowWidth
            let titleHeight = parseInt(this.titleHeight / 750 * rat) 
            let listHeight = parseInt(this.listHeight / 750 * rat)
            let h = 0
            list.forEach(item => {
                let len = Math.ceil(item.childData.length / 3)
                h += (titleHeight + len * listHeight)
                this.contentHeight.push(h)
            })
        },

        selectGroup(group) {
            console.log(group);
            let pageUrl = '/pages/filter/all/main'
            if (Number(group.parent_id) === 0) {
                let ary = ['','repast','hotel','pastime','icar','health','education','fransnana']
                pageUrl = `/pages/filter/${ary[group.id]}/main`
            } else {
                pageUrl = `/pages/filter/category/main?top_sort=${group.parent_id}&sort_one=${group.id}`
            }
            this.$router.push({
                path: pageUrl
            })
        },
    }
};
</script>

<style lang="scss" scoped>
.listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #f2f2f2;
    .container{
        width: 100%;
        height: 100%;
        display: flex;
    }
    .list-shortcut {
        position: fixed;
        left: 0;
        top: 0;
        width: 180rpx;
        height: 100%;
        background-color: #fff;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        z-index: 1;
        .menu-item {
            color: #323232;
            padding: 0 30rpx;
            height: 100rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 1;
            font-size: 14px;
            position: relative;
            &.current{
                background: #f2f2f2;
                font-weight: 700;
                &::after{
                    content: '';
                    position: absolute;
                    left: 0;
                    height: 100%;
                    border-left: 5px solid #3281fa;
                }
            }
        }
    }
    .list-catalogue{
        margin-left: 204rpx;
        margin-right: 24rpx;
        height: 100%;
    }
    .fixed-title,
    .list-group-title {
        // position: sticky;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 100rpx;
        font-size: 13px;
        color: #000;
        position: sticky;
        background-color: #f2f2f2;
        top: 0;
        .icon {
            height: 34rpx;
            width: 34rpx;
            line-height: 0;
            margin-right: 10rpx;
        }
        .name {
            flex: 1;
            font-weight: 700;
        }
        .go{
            color: #818181;
            display: flex;
            align-items: center;      
            &::after{
                content: '';
                display: inline-block;
                width: .24rem;
                height: .24rem;
                margin-left: .1rem;
                background-image: url(~@/assets/img/radio_right.png);
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
            }
        }
    }
    .list-group {
        background-color: #fff;
        display: flex;
        flex-wrap: wrap;
        .list-group-item {
            width: 33.333%;
            .icon {
                margin-top: 10rpx;
                height: 120rpx;
                width: 100%;
                line-height: 0;
            }
            .name{
                font-size: 12px;
                color: #656565;
                text-align: center;
                margin: 0rpx 10rpx 10rpx 10rpx;
            }
        }
    }
    .list-fixed {
        position: fixed;
        top: 0;
        left: 204rpx;
        right: 24rpx;
        .fixed-title{
            background: #f2f2f2;
        }
    }
    .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%)
    }
}
</style>
