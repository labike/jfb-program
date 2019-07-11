<template>
<section class="jfb-flexview">
    <ul class="photo-bar">
        <block  v-for="(nav, key) in photoType" :key="key" >
            <li :class="{ cur: currentType === key }"
                @click="currentType = key"
                v-if="nav"
            >
                <span> {{ nav }}</span>
            </li>
        </block>
    </ul>
    <section class="photo-wrapper" v-if="photoList[currentType]">

        <div class="photo-list"  v-if="photoList[currentType].length">
            <ul id="photoList">
                <li class="photo-item" v-for="(imgs,index) in photoList[currentType]" :key="index">
                    <div class="img-warp" @click="showGallary(index)">
                        <img  class="photo-img" mode="aspectFit" :src="imgs">
                    </div>
                </li>
            </ul>
        </div>
        <div class="photo-empty" v-else>
            <img src="~@/assets/img/no_rate.png" alt="">
            <div class="text">暂无图片！</div>
        </div>
    </section>

    <common-gallary v-if="showGallaryState && photoList[currentType]"
        :imgs="photoList[currentType]"
        :index="showGallaryIndex"
        @close="closeGallary"
    ></common-gallary>
</section>
</template>

<script>
import { photoType } from "@/config/base";
import CommonGallary from "@c/gallary/Gallary.vue";
import { apiGetShopImg } from "@/api/api.js";
// import Loading from '@c/layouts/Loading.vue'
export default {
    name: "ShopPhotos",
    data() {
        return {
            s_id: '',
            photoType,
            currentType: 'all',
            photoList: {},
            showGallaryIndex: 0,
            showGallaryState: false
        }
    },
    components: {
        CommonGallary
    },
    onLoad (options) {
        this.s_id = options.shop_id;
        this.getShopImg({
            type: this.currentType,
            s_id: this.s_id
        })
    },
    watch: {
        currentType: function (type) {
            const that = this
            if (that.photoList[that.currentType]) {
                return
            }
            that.getShopImg({
                type,
                s_id: that.s_id
            })
        }
    },
    methods: {
        getShopImg(params) {
            const _this = this
            apiGetShopImg(params).then(res => {
                _this.photoList[params.type] = res.imgList;
                console.log(_this.photoList[params.type]);
                
            }).catch(() => {
                _this.photoList[params.type] = [];
            });
        },
        showGallary(index) {
            this.showGallaryIndex = index
            this.showGallaryState = true
        },
        closeGallary() {
            console.log(1);
            
            this.showGallaryState = false
        }
    }
};
</script>

<style lang="scss" scoped>
.photo-bar {
    height: 0.88rem;
    line-height: 0.88rem;
    font-size: 14px;
    display: flex;
    background: #fff;
    li {
        flex: 1;
        text-align: center;
        >span{
            display: block;
            height: 100%;
            width: 100%;
             border-bottom: 3px solid transparent;
        }
        &.cur {
            font-weight: 400;
            color: #2a8cfa;
            >span{
                border-bottom: 3px solid #2a8cfa;
            }
        }
        
    }
}
.photo-wrapper{
    height: 100%;
    margin-bottom: -.5rem;
    .photo-empty{
        height: 100%;
        background: #FFF;
        text-align: center;
        img{
            margin: auto;
            width: 3rem;
        }
    }
    .photo-list{
        min-height: 100%;
        ul{
            padding: .12rem;
            overflow: hidden;
            .photo-item{
                width: 30%;
                padding: .12rem;
                float: left;
                .img-warp{
                    width: 100%;
                    height: 0;
                    padding-bottom: 100%;
                    position: relative;
                    overflow: hidden;
                }
                .photo-img{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
</style>


