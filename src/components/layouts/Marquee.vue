<template>
<div class="marquee_wrap">
    <div class="marquee" ref="marquee">
        <div ref="text">{{text}}</div>
        <div ref="copy"></div>
    </div>
</div>
</template>
<script>
export default {
    name: "Marquee",
    props: {
        lists: Array
    },
    data() {
        return {
            text: "",
            timer: null,
        };
    },
    methods: {
        move() {
            // 获取文字text 的计算后宽度  （由于overflow的存在，直接获取不到，需要独立的node计算）
            let width = this.$refs.text.offsetWidth;
            let box = this.$refs.marquee;
            let copy = this.$refs.copy;
            copy.innerText = this.text; // 文字副本填充
            let distance = 0; // 位移距离
            //设置位移
            this.timer = setInterval(function() {
                distance = distance - 1;
                // 如果位移超过文字宽度，则回到起点
                if (-distance >= width) {
                    distance = 16;
                }
                box.style.transform = "translateX(" + distance + "px)";
            }, 50);
        }
    },
    // 把父组件传入的arr转化成字符串
    mounted: function() {
        for (let i = 0; i < this.lists.length; i++) {
            this.text += " " + this.lists[i];
        }
    },
    // 更新的时候运动
    updated: function() {
        this.move();
    },
    beforeDestroy() {
        clearInterval(this.timer);
    }
};
</script>
<style scoped lang="scss">
.marquee_wrap {
    overflow: hidden;
    .marquee{
        width: 99999px;
        overflow: hidden;
        div {
            float: left;
            font-size: 13px;
            white-space: nowrap;
            margin: 0 8px;
            color: #000;
        }
    }
}
</style>