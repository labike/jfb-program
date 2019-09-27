<!--
 * @Author: zhangHang
 * @Date: 2019-09-06 13:55:03
 * @Description: 提供图片懒加载、预加载等功能
 -->
<template>
	<div class="image-view"
		@click="onClick"
		:style="{height}">
		<img :class="round ? 'round image' : 'image'"
			:src="src"
			:mode="mode"
			:lazy-load="lazyLoad"
			:style="{ height, width }"
			@load="onLoad"
			@error="onError"
			v-show="!isLoading && !error" />
        <div v-if="isLoading || error" 
            class="default"
            :class="round ? 'round image' : 'image'"
        >
		    <img 
                src="/static/img/logo.png"
                :mode="mode"
                :lazy-load="lazyLoad"
			    :style="{ height, width }"
                v-show="isLoading || error"
            />
        </div>
	</div>
</template>
<script>
export default {
    props: {
        src: {
            type: String,
            default: ""
        },
        mode: {
            type: String,
            default: "widthFix"
        },
        lazyLoad: {
            type: Boolean,
            default: true
        },
        round: {
            type: Boolean,
            default: false
        },
        height: {
            type: String,
            default: "auto"
        },
        width: String
    },
    data() {
        return {
            isLoading: true,
            error: false
        };
    },
    watch: {
        src(newValue, preValue) {
            if (newValue && newValue.length > 0 && newValue !== preValue) {
                this.$nextTick(() => {
                    this.isLoading = true;
                    this.error = false;
                });
            }
        }
    },
    methods: {
        onClick() {
            this.$emit("onClick");
        },
        onLoad() {
            this.isLoading = false;
            this.error = false;
            // console.log('isLoad')
        },
        onError() {
            this.error = true;
            this.isLoading = false;
            // console.log('isError')
        }
    }
};
</script>
<style lang="scss" scoped>
.image-view {
    width: 100%;
    display: block;
    font-size: 0;
	.image {
        width: 100%;
        flex: 1;
		&.round {
			border-radius: 50%;
		}
	}
    .default{
        background-color: #f2f2f2;
        display: flex;
        align-items: center;
        height: 100%;
        overflow: hidden;
    }
}
</style>
