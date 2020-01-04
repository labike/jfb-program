/*
 * @Author: zhangHang
 * @Date: 2019-05-14 11:58:39
 * @Description: file content
 */
// 工具函数库


export function findKey(obj, value, compare = (a, b) => a === b) {
    return Object.keys(obj).find(k => compare(obj[k], value))
}


export function formatDate(value) {
    if (typeof value !== 'number') {
        value = Number(value) * 1000
    }
    let date = new Date(value);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? ('0' + month) : month;
    let day = date.getDate();
    day = day < 10 ? ('0' + day) : day;
    return year + '.' + month + '.' + day;
}

export function formatTime(value) {
    if (typeof value !== 'number') {
        value = Number(value) * 1000
    }
    let date = new Date(value);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? ('0' + month) : month;
    let day = date.getDate();
    day = day < 10 ? ('0' + day) : day;
    let hours = date.getHours();
    hours = hours < 10 ? ('0' + hours) : hours;
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? ('0' + minutes) : minutes;
    let secinds = date.getSeconds();
    secinds = secinds < 10 ? ('0' + secinds) : secinds;
    return year + '.' + month + '.' + day + '   ' + hours + ':' + minutes + ':' + secinds;
}


export function getDistance(lat1, lng1, lat2, lng2) {
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;
    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0; 
    var r = 6378137;
    return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)
}



// ----------------------------------------------小程序 -------------------------

/**
 * 打电话
 * @param {*} phoneNumber 
 */
export function callPhone(phoneNumber) {
    mpvue.makePhoneCall({
        phoneNumber: phoneNumber,
        success: function () {
            console.log("拨打电话成功！")
        },
        fail: function () {
            console.log("拨打电话失败！")
        }
    })
}

/**
 * 获取当前路由
 */
export function getCurrentPageUrlWithArgs() {
    // eslint-disable-next-line no-undef
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const url = currentPage.route
    const options = currentPage.options
    let urlWithArgs = `/${url}?`
    for (let key in options) {
        const value = options[key]
        urlWithArgs += `${key}=${value}&`
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
    return urlWithArgs
}




// ---------------------------------------------- 备用方法 -------------------------

/**
 * 倒叙插入
 * @param {*} arr
 * @param {*} val
 * @param {*} compare
 * @param {*} maxLen
 */
function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare);
    if (index === 0) {
        return;
    }
    if (index > 0) {
        arr.splice(index, 1);
    }
    arr.unshift(val);
    if (maxLen && arr.length > maxLen) {
        arr.pop();
    }
}

/**
 * 匹配删除
 * @param {*} arr
 * @param {*} compare
 */
function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare);
    if (index > -1) {
        arr.splice(index, 1);
    }
}

/**
 * 匹配替换
 * @param {*} arr
 * @param {*} compare
 */
// function replaceFromArray(arr, val, compare,) {
//   const index = arr.findIndex(compare)
//   if (index > -1) {
//     arr.splice(index, 1, val)
//   }
// }
