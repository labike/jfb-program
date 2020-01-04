/*
 * @Author: zhangHang
 * @Date: 2019-06-05 09:33:51
 * @Description: file content
 */
import { createShop } from '@/config/class/shop';
import { apiGetShop } from "@/api/api.js";
import { saveShop, clearShop } from '@/config/cache';

const state = {
    shopInfo: null,
    currentItem: null
}

const mutations = {
    // 设置店铺信息
    SET_SHOP_INFO: (state, shopInfo) => {
        state.shopInfo = shopInfo;
    },

    // 是否收藏店铺
    SET_SHOP_COLLECT: (state, flag) => {
        state.shopInfo.infoData.is_collect = flag;
    },

    // 设置item页当前选中的信息
    SET_CURRENT_ITEM: (state, currentItem) => {
        state.currentItem = currentItem;
    },
}

const actions = {
    /**
     * 获取商铺信息并缓存
     * @param {*} shop_id 
     */
    saveShopInfo ({ commit }, shop_id) {
        return new Promise((resolve,reject) => {
            apiGetShop(shop_id).then(res => {
                const shopInfo = createShop(res);
                commit('SET_SHOP_INFO', saveShop(shopInfo));
                resolve(shopInfo)
            }).catch(err => {
                commit('SET_SHOP_INFO', clearShop());
                reject(err)
            });
        })
        
    }


}

export default {
    namespaced: true,
    state,
    actions,
    mutations
};
