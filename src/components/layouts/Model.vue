<template>
<section class='modele' v-if="show" :class="position">
    <div class="mask"  @click="clickMask"></div>
    <section class="modal-content"
        :style="{height: height,width: width}"
    >
        <scroll-view scroll-y class='main-content'>
            <slot></slot>
        </scroll-view>

        <div class='modal-btn-wrapper' v-if="!btnhide">
            <div class='cancel-btn' style='color:rgba(7,17,27,0.6)' @click='cancel'>取消</div>
            <div class='confirm-btn' style='color:#13b5f5' @click='confirm'>确定</div>
        </div>
    </section>
</section>
</template>

<script>
export default {
    name: "LayoutModel",
    props: {
        show: Boolean,
        height: {
            type: String,
            default: '60%'
        },
        width: {
            type: String,
            default: '90%'
        },
        position: {
            type: String,
            default: 'center'
        },
        btnhide: {
            type: Boolean,
            default: false
        },
        btnObj: {
            type: Object,
            default: () => {
                return {
                    cancel: '取消',
                    confirm: '确定'
                }
            }
        }
    },
    methods: {
        clickMask() {
            this.$emit('close')
        },
        cancel() {
            this.$emit('cancel')
        }
    },
};
</script>

<style lang="scss" scoped>
.modele {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    z-index: 9999;
    .mask{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 10000;
    }
    &.top{
        justify-content: flex-start;
        .modal-content{
            position: absolute;
            width: 100%;
            top: 0;
        }
    }
    &.center{
        justify-content: center;
        .modal-content{
            width: 90%;
            border-radius: 10rpx;
        }
    }
}

.modal-content {
    position: relative;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

.modal-btn-wrapper {
    position: relative;
    z-index: 10000;
    display: flex;
    flex-direction: row;
    height: 100rpx;
    line-height: 100rpx;
    border-top: 2rpx solid rgba(7, 17, 27, 0.1);
}

.cancel-btn,
.confirm-btn {
    flex: 1;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    font-size: 32rpx;
}

.cancel-btn {
    border-right: 2rpx solid rgba(7, 17, 27, 0.1);
}

.main-content {
    flex: 1;
    height: 100%;
    overflow-y: hidden;
}
</style>
