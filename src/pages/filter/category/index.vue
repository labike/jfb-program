<!--
 * @Author: zhangHang
 * @Date: 2019-06-24 14:39:02
 * @Description: file content
 -->
<template>
<section class="jfb-flexview">
    <div class="jfb-header">
        <lay-header></lay-header>
    </div>
    <header class="header-warp">
        <menus v-if="navList.length" 
            :name="navName"
            :params='navList'
        ></menus>
    </header>
    <category v-if="categoryStatus"
        :top_sort='top_sort'
        :list="navList"
        :page='page'
        @length='setShopPageLength'
    ></category>
</section>
</template>

<script>
import LayHeader from "@c/header/Header.vue";
import Menus from "./../views/MenuList.vue";
import Category from "./../views/Category.vue";
import { apiGetThreeSort, apiSearch } from "@/api/api";
export default {
    name: "category",
    data() {
        return {
            page: 1,
            scrollStatus: true,
            remainListsLength: 5,
            categoryStatus: false,
            scrollTop: 0,
            navName: '',
            navList: [],
            top_sort: '',
            sort_one: '',
            sort_two: '',
        };
    },
    components: {
        LayHeader,
        Menus,
        Category
    },
    onShow() {
        this.categoryStatus = false
        this.navList = []
    },
    onLoad (options) {
        this.top_sort = options.top_sort
        this.sort_one = options.sort_one || ''
        this.sort_two = options.sort_two || ''
        
        apiGetThreeSort(this.sort_one).then(res => {
            this.navList = res.map(item => {
                item.target = `/pages/filter/category/main?top_sort=${options.top_sort}&sort_one=${options.sort_one}&sort_two=${item.id}`
                return item
            })
            this.categoryStatus = true
        }).catch(err => {
            console.log(err);
            this.categoryStatus = true
        })
    },
    watch: {
        scrollTop (newY) {
            console.log(newY);
        }
    },
    methods: {
        setShopPageLength(e) {
            console.log(e);
        }
    },
    
    onPullDownRefresh () {
        this.page = 1
        this.remainListsLength = 5
        mpvue.stopPullDownRefresh()
    },
    onReachBottom () {        
        if (this.remainListsLength === 5) {
            this.page++
            this.scrollStatus = true
        } else {
            mpvue.showToast({
                title: '没有更多数据了！',
                icon: 'none',
                duration: 1000
            })
            this.scrollStatus = false
        }
    },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/components/layout.scss";
.jfb-header{
    background: $base-color;
    padding: 0 .24rem;
}
.jfb-content{
    height: 100%;
    display: flex;
    flex-direction: column;
} 
</style>

