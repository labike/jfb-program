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
                <h2 class="list-group-title">{{catalogue.sort_name}}</h2>
                <ul v-if="catalogue.childData">
                    <li class="list-group" v-for="(group, inx2) in catalogue.childData" :key="group.id" :data-index="inx2">
                        <div class="list-group-title">
                            <span class="name">{{group.sort_name}}</span>
                            <span class="go"  @click="selectGroup(group)">去频道</span>
                        </div>
                        <ul v-if="group.childData">
                            <li class="list-group-item" v-for="(item, inx3) in group.childData" :key="item.id"  :data-index="inx3"
                                @click="selectItem(group.parent_id, item, inx)">
                                <span class="name" v-text="item.sort_name"></span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </scroll-view>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
        <h1 class="fixed-title" v-text="fixedTitle"></h1>
    </div>
</div>
</template>

<script>
import LayHeader from "@c/header/Header.vue";
import ShopCard from "@c/shop/ShopCard.vue";
import { apiGetAllSort, apiSearch } from "@/api/api";
export default {
    name: "shop",
    data() {
        return {
            goods: [],
            contentId: '', // 每个food-list的id，scroll-into-view滚动到对应的id
            navId: '', // 导航模块对应的id，用来联动内容区域
            currentIndex: 0,
            listHeight: [], // foods内部块的高度
            contentHeight: [], // 内容区域scroll-view高度
            classify: [],
        };
    },
    components: {
        LayHeader,
        ShopCard
    },
    onLoad (options) {
        this.getAllSort()
    },
    computed: {
        fixedTitle() {
            if (this.scrollY > 0) {
                return ''
            }
            return this.classify[this.currentIndex] ? this.classify[this.currentIndex].sort_name : ''
        }
    },
    watch: {
        classify() {
            setTimeout(() => {
                this._calculateHeight()
            }, 60)
        }
    },
    methods: {
        getAllSort() {
            apiGetAllSort().then(res => {
                this.classify = res
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
            let length = this.listHeight.length
                      
            if (scrollTop >= this.listHeight[length - 1] - this.contentHeight) {
                return
            } else if (scrollTop > 0 && scrollTop < this.listHeight[0]) {
                this.currentIndex = 0
            }
            for (let i = 0; i < length; i++) {
                if (scrollTop >= this.listHeight[i - 1] && scrollTop < this.listHeight[i]) {
                    this.currentIndex = i
                }
            }
        },
        _calculateHeight() {
            const _this = this
            var query = wx.createSelectorQuery()
            let h = 0
            query.selectAll('.classify').boundingClientRect((rects) => {
                rects.forEach((rect) => {
                    h += rect.height
                    _this.listHeight.push(Math.floor(h))
                })
            })
            query.select('.list-catalogue').boundingClientRect((rect) => {
                _this.contentHeight = rect.height
            }).exec()
        },
        selectGroup(group) {
            console.log(group);
            let pageUrl = '/pages/filter/all/main'
            switch (group.parent_id) {
            case "1":
                pageUrl = `/pages/filter/repast/main?sort_one=${group.id}`
                break;
            case "2":
                pageUrl = `/pages/filter/hotel/main?sort_one=${group.id}`
                break;
            case "3":
                pageUrl = `/pages/filter/pastime/main?sort_one=${group.id}`
                break;
            case "4":
                pageUrl = `/pages/filter/icar/main?sort_one=${group.id}`
                break;
            default:
                pageUrl = `pages/filter/category/main?top_sort=${group.parent_id}&sort_one=${group.id}`
                break;
            }
            
            this.$router.push({
                path: pageUrl
            })
        },
        selectItem(o_id, item, inx) {
            // console.log(o_id, item, inx);
            this.$router.push({
                path: `/pages/filter/category/main?top_sort=${o_id}&sort_one=${item.parent_id}&sort_two=${item.id}`
            })
        },
        normalFrom(list) {
            let newList = []
            list.forEach(element => {
                const type = {
                    id: element.id,
                    params: {
                        page: 1,
                        sort_one: 0
                    },
                    name: element.sort_name,
                    sortList: element.childData,
                    shopList: null
                }
                newList.push(type)
            });
            return newList
        }
    }
};
</script>

<style lang="scss" scoped>
.listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
    .container{
        width: 100%;
        height: 100%;
        display: flex;
    }
    .list-shortcut {
        position: fixed;
        left: 0;
        top: 0;
        width: 1.8rem;
        height: 100%;
        background-color: #f5f5f5;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        z-index: 1;
        .menu-item {
            color: #000;
            padding: 0 .3rem;
            height: .8rem;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 1;
            font-size: 14px;
            position: relative;
            &.current{
                background: #fff;
                color: #3281fa;
                &::after{
                    content: '';
                    position: absolute;
                    left: 0;
                    height: 50%;
                    border-left: 3px solid #3281fa;
                }
            }
        }
    }
    .list-catalogue{
        background-color: #fff;
        // position: relative;
        margin-left: 2rem;
        height: 100%;
        .list-group-title {
            margin-right: 3%;
            display: flex;
            justify-content: space-between;
            height: .8rem;
            line-height: .8rem;
            font-size: 13px;
            color: #000;
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
    }
    .list-group {
        padding-bottom: .4rem;
        
        >ul{
            display: flex;
            flex-wrap: wrap;
        }
        .list-group-item {
            font-size: 13px;
            padding: .1rem;
            background-color: #f5f5f5;
            width: 27%;
            line-height: 1.2;
            margin-bottom: 2%;
            margin-right: 2%;
            display: flex;
            justify-content: center;
            text-align: center;
            height: .8rem;
            align-items: center;
        }
    }
    .list-fixed {
        position: fixed;
        top: 0;
        left: 2rem;
        right: 0;
        .fixed-title{
            background: #fff;
            height: .8rem;
            line-height: .8rem;
            font-size: 13px;
            color: #000;
            border-bottom: 1px solid #ededed;
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
