<!--
 * @Author: zhangHang
 * @Date: 2019-05-24 08:51:38
 * @Description: file content
 -->
<template>
	<div class='swiper'>
		<swiper :indicator-dots='true'
			indicator-color='rgba(0, 0, 0, .3)'
			indicator-active-color="#fff"
			:style="{height: sHeight}"
			:autoplay='false'
			:interval='6000'
			:duration='1000'
			:circular='true'>
			<block :key='imgindex'
				v-for='(top,imgindex) in list'>
				<swiper-item>
					<ImageView
						:src="top.img_url"
						@onClick="bookDetail(top)"
						mode='scaleToFill' :height="sHeight">
                    </ImageView>
				</swiper-item>
			</block>
		</swiper>
	</div>
</template>

<script>
import ImageView from '@c/layouts/ImageView.vue'
export default {
    components: { ImageView },
    props: {
        list: {
            type: Array
        },
        sHeight: {
            type: String
        }
    },

    methods: {
        bookDetail(item) {
            wx.navigateTo({
                url: "/pages/detail/main?id=" + item.id
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.slide-image {
	width: 100%;
	height: 100%;
}
</style>




