/*
 * @Author: zhangHang
 * @Date: 2019-05-23 10:15:00
 * @Description: file content
 */

import { apiWxLogin, apiBindMobile, apiReward } from '@/api/api'

const state = {
    token: '',
    lat: '',
    lng: '',
    city_id: '',
    city_name: '',
    openId: '初始openId',
    userInfo: {},
    balance: '',
    withdraw: null
}
const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
        mpvue.setStorageSync('token', token);
    },
    SET_OPEN_ID: (state, openId) => {
        state.openId = openId;
        mpvue.setStorageSync('openId', openId);
    },
    SET_LOCA_LAT: (state, lat) => {
        state.lat = lat;
    },
    SET_LOCA_LNG: (state, lng) => {
        state.lng = lng;
    },
    SET_CITY_ID: (state, city_id) => {
        state.city_id = city_id;
    },
    SET_CITY_NAME: (state, city_name) => {
        state.city_name = city_name;
    },
    SET_USER_INFO: (state, userInfo) => {
        state.userInfo = userInfo
        mpvue.setStorageSync('userData', userInfo);
    },
    SET_BALANCE: (state, balance) => {
        state.balance = balance
    },
    SET_WITHDRAW: (state, withdraw) => {
        state.withdraw = withdraw
    }
}

const actions = {
    // 登录
    async Login({ commit }, params) {
        return new Promise((resolve,reject) => {
            const info = {
                headimgurl: params.headimgurl,
                nickname: params.nickname
            }
            apiWxLogin(params).then(res => {
                commit('SET_TOKEN', res.accessToken)
                commit('SET_OPEN_ID', params.openid)
                commit('SET_USER_INFO', info) 
                resolve(res)
            }).catch(err => {
                reject(err)
            });
        })
        
    },

    
    // 绑定手机号
    bingMobile({ commit }, params) {
        return new Promise((resolve,reject) => {
            apiBindMobile(params).then(result => {
                commit('SET_TOKEN', result.accessToken)
                resolve(result)
            }).catch(err => {
                reject(err)
            });
        })
        
    },

    // 记录坐标
    setLocation({ commit }, params) {
        let appData = mpvue.getStorageSync('appData') || {}
        commit('SET_LOCA_LAT', params.latitude)
        commit('SET_LOCA_LNG', params.longitude)
        appData.currentLocation = {
            lat: params.latitude,
            lng: params.longitude
        }
        if (params.city_id) {
            commit('SET_CITY_ID', params.city_id)
            commit('SET_CITY_NAME', params.city_name)
            appData.currentCity = {
                code: params.city_id,
                name: params.city_name
            }
        }
        mpvue.setStorageSync('appData', appData);
    },
    // 更新userinfo数据
    updataUsers({ commit }, params) {
        commit('SET_USER_INFO', params)
    },

    // 获取余额
    getBalance({ commit }) {
        return new Promise((resolve,reject) => {
            apiReward().then(res => {
                commit('SET_BALANCE', res.balance)
                // commit('SET_BALANCE', 100)
                resolve(res)
            }).catch(err => {
                reject(err)
            });
        })
    },


}

export default {
    namespaced: true,
    state,
    actions,
    mutations
};
