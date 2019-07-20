<template>
<div>123</div>
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
        
        if (s_id && tjr_id) {
            apiStoreScan({
                content: options,
                type: 3
            }).then(res => {
                wx.redirectTo({
                    url: "pages/shop/index/main?shop_id=" + s_id
                });
            })
        } else {
            mpvue.switchTab({
                url: '/pages/index/main',
            }); 
        }
    }
}
</script>
