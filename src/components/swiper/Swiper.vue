<template>
<div class='swiper'>
  <swiper :indicator-dots='true' indicator-color='rgba(0, 0, 0, .3)' indicator-active-color="#fff" :style="{height: sHeight}" :autoplay='false' :interval='6000' :duration='1000' :circular='true'>
    <div :key='imgindex' v-for='(top,imgindex) in list'>
      <swiper-item>
        <img @click='bookDetail(top)' class='slide-image' mode="aspectFill" :src="top.img_url">
      </swiper-item>
    </div>
  </swiper>
</div>
</template>

<script>
export default {
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
                url: '/pages/detail/main?id=' + item.id
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.slide-image{
  width: 100%;
  height: 100%;
}
</style>




