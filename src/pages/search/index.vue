<!--
 * @Author: zhangHang
 * @Date: 2019-05-28 11:31:31
 * @Description: file content
 -->
<template>
<div class="search-warp">
    <div class="search-box">
        <div class="search">
            <img src="/static/img/ic-search.png" class="icon">
            <input type="text" class="keywords" :focus='true' placeholder="请输入搜索内容" v-model.trim="keywords"
                @keyup.enter="getSearchList"
            >
        </div>
        <div class="submit" @click="getSearchList">搜索</div>
    </div>
    <div class="search-key" v-if="!searchList.length">
        <div class="hot">
            <div class="title">热门搜索</div>
            <ul class="list">
                <li v-for="(hot,index) of hotList" :key="index"
                    @click="selectSuggest(hot.hot_words)"
                >{{hot.hot_words}}</li>
            </ul>
        </div>
        <div class="history">
            <div class="title">历史搜索</div>
            <div class="del" @click="clearSearchHistory">
                <img src="/static/img/ic_shopping_delete.png" class="icon">
            </div>
            <ul class="list">
                <li v-for="(history,index) of searchHistory" :key="index"
                    @click="selectSuggest(history)"
                >{{history}}</li>
            </ul>
        </div>
    </div>
    <div class="serch-list" v-else>
        <scroll-view  class="list-warp"  v-if="searchList.length"
            scroll-y="true"
            @scroll="getScroll"
            @scrolltoupper="upper"
            @scrolltolower="lower"
        >
            <div class="list-inner">
                <div class="shop-warp" >
                    <shop-card :shopInfo='shop' v-for="shop of searchList" :key="shop.s_id"></shop-card>
                </div>
            </div>
        </scroll-view>
    </div>
</div>
</template>

<script>
import { apiGetHotWords, apiSearch } from "@/api/api";
import { mapActions, mapGetters } from 'vuex';
import ShopCard from "@c/shop/ShopCard.vue";
export default {
    data() {
        return {
            page: 1,
            keywords: '',
            hotList: [],
            searchList: []
        }
    },
    components: {
        ShopCard
    },
    onLoad (options) {
        const _this = this
        _this.getHotWords()
    },
    computed: {
        ...mapGetters([
            'searchHistory'
        ]),
        appData() {
            return mpvue.getStorageSync('appData');
        }
    },
    methods: {
        ...mapActions([
            'saveSearchHistory',
            'clearSearchHistory'
        ]),
        getHotWords() {
            const _this = this
            apiGetHotWords(_this.appData.currentCity.code).then(res => {
                console.log(res);
                this.hotList = res.list
            })
        },
        getSearchList() {
            const _this = this
            if (_this.keywords === "") {
                return
            }
            _this.saveSearchHistory(_this.keywords)
            _this.searchList = []
            apiSearch({
                city_id: _this.appData.currentCity.code,
                lng: _this.appData.currentLocation.lng,
                lat: _this.appData.currentLocation.lat,
                page: _this.page,
                keywords: _this.keywords
            }).then(res => {
                console.log(res);
                _this.searchList = res.list
            })
        },
        selectSuggest(keywords) {
            this.keywords = keywords
            this.getSearchList()
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/common/variables.scss";
.search-box {
    background: $base-color;
    display: flex;
    align-items: center;
    padding: 0 .24rem;
    padding-bottom: .2rem;
    .search {
        flex: 1;
        display: flex;
        align-items: center;
        background: #fff;
        height: .56rem;
        border-radius: .56rem;
    }
    .icon {
        margin: 0 .2rem;
        width: .25rem;
        height: .25rem;
    }
    .keywords {
        height: .56rem;
        line-height: .56rem;
        background: #fff;
        color: #000;
        font-size: 12px;
    }
    .submit {
        text-align: right;
        font-size: 14px;
        border: 0;
        margin-left: .24rem;
        flex-shrink: 0;
        color: #fff;
    }
}

.search-key {
    padding:.24rem;
    .history{
        position: relative;
        .del{
            position: absolute;
            right: 0;
            top: .2rem;
        }
    }
    .title{
        padding: .2rem 0 .2rem;
        font-size: 12px;
    }
    .icon{
        margin: 0 .2rem;
        width: .3rem;
        height: .3rem;
    }
    .list{
        overflow: hidden;
        li{
            background: #ddd;
            float: left;
            line-height: .4rem;
            padding: 0 .2rem;
            margin-right: .15rem;
            margin-top: .15rem;
            border-radius: .4rem;
        }
    }
}
</style>
