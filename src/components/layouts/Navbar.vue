<template>
    <header class="jfb-navbar" :class="classes" :style="{backgroundColor: bgcolor, height: height, color: borderColor}">
        <div class="jfb-navbar-center-box" :style="{height: height}">
            <div class="jfb-navbar-center">
                <span class="jfb-navbar-center-title"
                    :style="{color: color, fontSize: fontsize}"
                >{{title}}</span>
            </div>
        </div>
        <div class="jfb-navbar-item">
            <slot name="right"></slot>
        </div>
    </header>
</template>

<script>
    import {isColor} from '@/utils/index';
    export default {
        name: 'jfb-navbar',
        props: {
            title: String,
            fixed: Boolean,
            bgcolor: {
                validator(value) {
                    if (!value) return true;
                    return isColor(value);
                },
                default: '#2a8cfa'
            },
            color: {
                validator(value) {
                    if (!value) return true;
                    return isColor(value);
                },
                default: '#fff'
            },
            borderColor: {
                validator(value) {
                    if (!value) return true;
                    return isColor(value);
                },
                default: '#E4E4E4'
            },
            fontsize: {
                validator(value) {
                    return /^(\.|\d+\.)?\d+(px|rpx)$/.test(value);
                },
                default: '26rpx'
            },
            height: {
                validator(value) {
                    return /^(\.|\d+\.)?\d+(px|rpx)$/.test(value);
                },
                default: '90rpx'
            }
        },
        computed: {
            classes() {
                return this.fixed ? 'jfb-navbar-fixed' : '';
            }
        }
    };
</script>

<style lang="scss">
@import "~@/assets/styles/components/navbar.scss";
</style>

