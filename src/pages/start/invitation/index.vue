<!--
 * @Author: zhangHang
 * @Date: 2019-07-20 09:53:30
 * @Description: 邀请
 -->
<template>
<div style="heigth:100%;width:100%;background:#fff;"></div>
</template>
<script>
import { apiStoreScan } from "@/api/api.js";
export default {
    name: 'Invitation',
    onLoad (options) {
        console.log(options);
        // const scene = decodeURIComponent(options.scene)
        const s_id = options.x_id;
        const tjr_id = options.tjr_id
        const code = options.code
        const _this = this
        if (code) {
            apiStoreScan({
                content: code,
                type: 3
            }).then(res => {
                _this.$router.push({
                    path: "/pages/shop/index/main?shop_id=" + res.x_id,
                    reLaunch: true
                })
            })
        } else if (s_id && tjr_id) {
            apiStoreScan({
                content: options,
                type: 3
            }).then(res => {
                _this.$router.push({
                    path: "/pages/shop/index/main?shop_id=" + res.x_id,
                    reLaunch: true
                })
            })
        } else {
            _this.$router.push({
                path: '/pages/index/main',
                reLaunch: true
            })
        }
    }
}
</script>
