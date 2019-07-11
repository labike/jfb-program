import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import mutations from './mutations';
import createLogger from 'vuex/dist/logger';
import { loadSearch } from '@/config/cache';
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
        searchHistory: loadSearch(),
        createOrderReturn: null,
        currentOrder: null,
    },
    mutations,
    // strict: true,
    plugins: debug ? [createLogger()] : []
})
;
