/*
 * @Author: zhangHang
 * @Date: 2019-05-15 10:02:02
 * @Description: file content
 */
import { saveSearch, clearSearch, deleteSearch, saveIndustry } from '@/config/cache';
import { apiCreateOrder, apiOrderDetails, apiCreateRecharge, apiNavList } from "@/api/api.js";

/**
 * 保存搜索记录
 * @param {*} query 
 */
export const saveSearchHistory = function ({commit}, query) {
    commit('SET_SEARCH_HISTORY', saveSearch(query))
}

/**
 * 删除搜索记录
 * @param {*} query 
 */
export const deleteSearchHistory = function ({commit}, query) {
    commit('SET_SEARCH_HISTORY', deleteSearch(query))
}

/**
 * 清空搜索记录
 */
export const clearSearchHistory = function ({commit}) {
    commit('SET_SEARCH_HISTORY', clearSearch())
}


/**
 * 查詢全部行業 saveIndustry
 * @param refresh<false> 
 */
export const queryIndustry = function ({state, commit}, refresh) {
    return new Promise(resolve => {
        if (state.storeIndustry && !refresh) {
            resolve(state.storeIndustry)
        } else {
            apiNavList('index').then(mList => {
                let IndustryList = saveIndustry(mList)
                commit('SET_ALL_INDUSTRY', IndustryList)
                resolve(IndustryList)
            })  
        }
    })    
}



/**
 * 创建订单缓存返回信息
 * @param {*} params 
 */
export const createOrder = function ({commit}, params) {
    if (params.type === 0) {
        return new Promise(resolve => {
            apiCreateRecharge(params).then(res => {
                commit('SET_ORDER_RETURN', {
                    order_id: res.order_id,
                    order_name: '充值',
                    actual: params.money,
                    deadlinetime: null,
                    recharge: true
                });
                resolve(res)
            })
        })
    }
    return new Promise(resolve => {
        apiCreateOrder(params).then(res => {
            commit('SET_ORDER_RETURN', {
                order_id: res.order_id,
                order_name: res.order_name,
                actual: res.ammount,
                deadlinetime: res.deadlinetime
            });
            resolve(res)
        })
    })
}

/**
 * 订单列表选择订单信息
 * @param {*} order_id 
 */
export const getCurrentOrder = function ({state, commit}, order_id) {    
    return new Promise((resolve,reject) => {
        if (state.currentOrder && state.currentOrder.order_id === order_id) {
            resolve(state.currentOrder)
        } else {
            apiOrderDetails(order_id).then(res => {
                commit('SET_CURRENT_ORDER', res.baseInfo);
                resolve(res.baseInfo)
            }).catch(err => {
                reject(err)
            })
        }
    })
}

/**
 * 支付页面获取订单信息
 * @param {*} order_id 
 */
export const updateOrderReturn = function ({commit}, order_id) {
    return new Promise((resolve,reject) => {
        apiOrderDetails(order_id).then(res => {
            const deadlinetime = Number(res.baseInfo.create_time) + 60 * 60 * 24
            commit('SET_ORDER_RETURN', {
                order_id: res.baseInfo.order_id,
                order_name: res.baseInfo.title,
                actual: res.baseInfo.pay_amount,
                deadlinetime
            });
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
