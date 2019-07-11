<template>
<div class="advertise">
   <div class="ad-item"  v-for="item of advertise" :key="item.id">
        <div class="img-warp">
            <img :src="item.icon" alt="">
        </div>
   </div>
</div>
</template>

<script>
export default {
    name: "Advertise",
    data() {
        return {
            advertise: [{
                id: 0,
                name: '美食',
                icon: '/static/advert/one_ad.png'
            }, {
                id: 1,
                name: '酒店',
                icon: '/static/advert/two_ad.png'
            }, {
                id: 2,
                name: '休闲娱乐',
                icon: '/static/advert/three_ad.png'
            }, {
                id: 3,
                name: '爱车',
                icon: '/static/advert/four_ad.png'
            }]
        }
    },
};
</script>

<style lang="scss" scoped>
.advertise{
    background: #fff;
    overflow: hidden;
    padding: 12rpx;
    .ad-item{
        width: 50%;
        float: left;
        .img-warp{
            padding: 12rpx;
            img{
                display: block;
                width: 100%;
                height: 80px;
            }
        }
    }
}
</style>