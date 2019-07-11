<template>
    <div class="swiperview swiper-position">
      <swiper class="swiperitem" :autoplay="autoplay" :vertical="true" :circular="true">
        <div :key='index' v-for='(item,index) in rollData'>
          <swiper-item >
            <text class="swiper-txt">{{item}}</text>
          </swiper-item>
        </div>
      </swiper>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'rollnotice',
        props: {
            autoplay: {
                validator(val) {
                    return /^\d*$/.test(val);
                },
                default: 3000
            },
            rollData: {
                type: Array,
                default: []
            }
        },
    }
</script>


<style lang="scss" scoped>
.swiper-position {
  height: 30rpx;
  width: 100%;
  overflow: hidden;
}

.swiperitem {
  height: 100%;
}

.swiperview .wx-swiper-dots {
  display: none;
}

.swiper-txt {
  font-size: 24rpx;
  color: inherit;
  line-height: 1;
}
</style>

