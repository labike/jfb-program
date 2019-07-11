<template>
<div class="gallary">
    <swiper class='wrapper' indicator-color='rgba(0, 0, 0, .3)'
        indicator-active-color="#fff" 
        :autoplay='false'  :indicator-dots='true' 
        :interval='6000'  :duration='1000' 
        :circular='true' :current='current'
    >
        <block v-for='(top,imgindex) in imgs' :key='imgindex'>
            <swiper-item>
                <div class="gallary-img">
                    <img class='slide-image' @click="close" mode="aspectFit" :src="top">
                </div>
            </swiper-item>
        </block>
    </swiper>
</div>
</template>

<script>
export default {
    name: "CommonGallary",
    data() {
        return {
            current: 0
        }
    },
    onLoad () {
        this.current = this.index;
    },
    props: {
        imgs: {
            type: Array,
            default () {
                return []
            }
        },
        index: {
            type: Number,
            default () {
                return 0
            }
        },
    },
    methods: {
        close() {
            this.$emit('close')
        },
    }
};
</script>

<style lang="scss">
.gallary {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: fixed;
    z-index: 99;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #000;
    .wrapper {
        width: 100%;
        height: 100%;
        .gallary-img {
            width: 100%;
            height: 100%;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .swiper-container {
        overflow: inherit;
        height: 100%;
        .swiper-slide{
            display: flex;
            align-items: center;
        }
        .swiper-pagination {
            color: #fff;
        }
    }
}
</style>



