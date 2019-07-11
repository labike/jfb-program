

const mutations = {
    'SET_TOKEN'(state, token) {
        state.token = token;
    },

    // 当前订单
    'SET_CURRENT_ORDER'(state, currentOrder) {
        state.currentOrder = currentOrder;
    },

    // 订单返回值
    'SET_ORDER_RETURN'(state, createOrderReturn) {
        state.createOrderReturn = createOrderReturn;
    },

    // 购物车提交信息
    'SET_CART_ORDER_PARAM'(state, cartOrderParam) {
        state.cartOrderParam = cartOrderParam;
    },
    
    // 设置搜索记录
    'SET_SEARCH_HISTORY'(state, history) {
        state.searchHistory = history
    },
};

export default mutations;
