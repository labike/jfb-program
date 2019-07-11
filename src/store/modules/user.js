
import { apiWxLogin } from '@/api/api'

const state = {
    token: '',
    lat: '',
    lng: '',
    city_id: '',
    openId: '初始openId',
    userInfo: {}
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
        mpvue.setStorageSync('lat', lat);
    },
    SET_LOCA_LNG: (state, lng) => {
        state.lng = lng;
        mpvue.setStorageSync('lng', lng);
    },
    SET_CITY_ID: (state, city_id) => {
        state.city_id = city_id;
    },
    SET_USER_INFO: (state, userInfo) => {
        state.userInfo = userInfo
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

                if (res.mobile_isbind !== 0) {
                    commit('SET_TOKEN', res.accessToken)
                    commit('SET_OPEN_ID', params.openid)
                    commit('SET_USER_INFO', info)
                    mpvue.switchTab({
                        url: '/pages/index/main',
                    });
                } 
                resolve(res)
            }).catch(err => {
                reject(err)
            });
        })
        
    },
    // 记录坐标
    setLocation({ commit }, params) {
        commit('SET_LOCA_LAT', params.latitude)
        commit('SET_LOCA_LNG', params.longitude)
        if (params.city_id) {
            commit('SET_CITY_ID', params.city_id)
        }
    },
    // 更新userinfo数据
    updataUsers({ commit }, params) {
        commit('SET_USER_INFO', params)
    }


}

export default {
    namespaced: true,
    state,
    actions,
    mutations
};
