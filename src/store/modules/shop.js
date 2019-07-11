import { createShop } from '@/config/class/shop';
import { apiGetShop } from "@/api/api.js";
import { saveShop, clearShop } from '@/config/cache';

const state = {
    shopInfo: null,
    currentItem: null
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
        mpvue.setStorageSync('token', token);
    },
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
     * @param {*} params 
     */
    saveShopInfo ({ commit }, params) {
        apiGetShop(params).then(res => {
            const shopInfo = createShop(res);
            commit('SET_SHOP_INFO', saveShop(shopInfo));
        }).catch(() => {
            commit('SET_SHOP_INFO', clearShop());
        });
    }


}

export default {
    namespaced: true,
    state,
    actions,
    mutations
};
