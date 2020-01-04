/*
 * @Author: zhangHang
 * @Date: 2019-05-15 10:02:02
 * @Description: file content
 */
import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import mutations from './mutations';
import createLogger from 'vuex/dist/logger';
import { loadSearch, loadIndustry } from '@/config/cache';
import cart from './modules/cart';
import user from './modules/user';
import shop from './modules/shop';
Vue.use(Vuex);

const debug = process.env.NODE_DEV !== 'production';

export default new Vuex.Store({
    modules: {
        cart,
        user,
        shop
    },
    actions,
    getters,
    state: {
        storeIndustry: loadIndustry(),
        searchHistory: loadSearch(),
        createOrderReturn: null,
        currentOrder: null,
    },
    mutations,
    // strict: true,
    plugins: debug ? [createLogger()] : []
})
;
