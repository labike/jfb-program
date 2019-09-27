/*
 * @Author: zhangHang
 * @Date: 2019-05-14 14:40:32
 * @Description: file content
 */

/**************************************************/
const CURRENT_SHOP_KEY = '__CURRENT_SHOP__';
const CART_ORDER_PARAM_KEY = '__CART_ORDER_PARAM__';

const SEARCH_KEY = '__JFB_SEARCH__'
const SEARCH_MAX_LEN = 15


function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare)
    if (index === 0) {
        return
    }
    if (index > 0) {
        arr.splice(index, 1)
    }
    arr.unshift(val)
    if (maxLen && arr.length > maxLen) {
        arr.pop()
    }
}
  
function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}




export function loadAppData() {
    return mpvue.getStorageSync('appData') || {};
}


/** ***************************** shop *********************************/
export function saveShop(shopInfo) {
    mpvue.setStorageSync(CURRENT_SHOP_KEY, shopInfo);
    return shopInfo;
}

export function loadShop() {
    return mpvue.getStorageSync(CURRENT_SHOP_KEY);
}

export function clearShop() {
    mpvue.clearStorageSync(CURRENT_SHOP_KEY);
    return null;
}

export function saveCartOrderParam(orderParam) {
    mpvue.setStorageSync(CART_ORDER_PARAM_KEY, orderParam);
    return orderParam;
}
export function loadCartOrderParam() {
    return mpvue.getStorageSync(CART_ORDER_PARAM_KEY);
}

/** ***************************** Search *********************************/


export function loadSearch() {
    return mpvue.getStorageSync(SEARCH_KEY) || [];
}
  
export function saveSearch(query) {
    let searches = mpvue.getStorageSync(SEARCH_KEY) || [];
    insertArray(searches, query, (item) => {
        return item === query
    }, SEARCH_MAX_LEN)    
    mpvue.setStorageSync(SEARCH_KEY, searches)
    return searches
}
  
export function deleteSearch(query) {
    let searches = mpvue.getStorageSync(SEARCH_KEY) || [];
    deleteFromArray(searches, (item) => {
        return item === query
    })
    mpvue.setStorageSync(SEARCH_KEY, searches)
    return searches
}
  
export function clearSearch() {
    mpvue.clearStorageSync(CURRENT_SHOP_KEY);
    return []
}
