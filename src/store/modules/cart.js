import { firstToCart } from "@/config/class/foods";

const state = {
    cartList: {}, // 加入购物车的商品列表
    receiveInCart: false, //购物车组件下落的圆点是否到达目标位置
    showMoveDot: [], //控制下落的小圆点显示隐藏
    showMoveCart: [], //控制购物车动画
    elLeft: 0, //当前点击加按钮在网页中的绝对top值
    elBottom: 0, //当前点击加按钮在网页中的绝对left值
    changeSpecs: false,//控制显示食品规格
    choosedFoods: null, //当前选中商品数据
};

// getters
const getters = {
};

// actions
const actions = {
};

// mutations
const mutations = {
    
    // 设置购物车组件下落的圆点到达目标位置
    'SET_RECEIVE_IN_CART' (state, flag) {
        state.receiveInCart = flag;
    },

    // 控制下落的小圆点显示隐藏(控制原点动画)
    'SET_SHOW_MOVE_DOT'(state) {
        state.showMoveDot.push(true);
    },
    'UPDATE_SHOW_MOVE_DOT'(state) {
        state.showMoveDot = state.showMoveDot.map(() => false);
    },

    // 原点到达位置后(控制购物车动画)
    'SET_SHOW_MOVE_CART'(state) {
        state.showMoveCart.push(true);
    },

    'SET_DOT_POTION'(state, potion) {
        state.elLeft = potion.elLeft;
        state.elBottom = potion.elBottom;
    },

    //显示规格列表
    'SHOW_CHOOSE_LIST'(state, foods) {
        if (foods) {
            state.choosedFoods = foods;
        }
        state.changeSpecs = !state.changeSpecs;
    },

    //网页初始化时从本地缓存获取购物车数据
    'INIT_BUY_CART'(state) {
        let initCart = mpvue.getStorageSync('buyCart');
        if (initCart) {
            state.cartList = initCart;
        }
    },


    // 加入购物车
    'ADD_BUY_CART'(state, { 
        category_id,
        sku_id,
        foods
    }) {
        let cart = state.cartList;
        let category = cart[category_id] = (cart[category_id] || {});
        let item = category[foods.id] = (category[foods.id] || {});
        if (item[sku_id]) {
            item[sku_id]['num']++;
        } else {
            item[sku_id] = firstToCart({ 
                category_id,
                sku_id,
                foods
            });
        }
        state.cartList = { ...cart };
        mpvue.setStorageSync('buyCart', state.cartList);
    },

    // 移出购物车
    'REDUCE_BUY_CARY'(state, {
        category_id,
        food_id,
        sku_id,
    }) {
        let cart = state.cartList;
        let category = (cart[category_id] || {});
        let item = (category[food_id] || {});
        if (item && item[sku_id] && item[sku_id]['num'] > 0) {
            item[sku_id]['num']--;
            if (item[sku_id]['num'] > 0) {
                state.cartList = {...cart};
                //存入localStorage
            } else {
                item[sku_id] = null;
                delete item[sku_id];
                state.cartList = {...cart};
            }
            mpvue.setStorageSync('buyCart', state.cartList);
        }
    },
    'CLEAR_BUY_CART'(state) {
        state.cartList = {};
        mpvue.setStorageSync('buyCart', state.cartList);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
