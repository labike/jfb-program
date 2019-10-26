/*
 * @Author: zhangHang
 * @Date: 2019-05-14 11:58:39
 * @Description: main
 */
import Vue from 'vue';
import App from './App';
import store from './store';
import './assets/styles/base.scss';

import MpvueRouterPatch from 'mpvue-router-patch'
Vue.use(MpvueRouterPatch)

// Vue.config._mpTrace = true
Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$store = store;
const app = new Vue(App);
app.$mount();






