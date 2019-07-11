// 工具函数库


export function showModal(title, content) {
    wx.showModal({
        title,
        content,
        showCancel: false
    });
}

export function showSuccess(text) {
    wx.showToast({
        title: text,
        icon: 'success'
    });
}

export function Toast(text) {
    wx.showToast({
        title: text,
        icon: 'none'
    });
};

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

export function isColor(value) {
    const colorReg = /^#([a-fA-F0-9]){3}(([a-fA-F0-9]){3})?$/;
    const rgbaReg = /^[rR][gG][bB][aA]\(\s*((25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*){3}\s*(\.|\d+\.)?\d+\s*\)$/;
    const rgbReg = /^[rR][gG][bB]\(\s*((25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*){2}(25[0-5]|2[0-4]\d|1?\d{1,2})\s*\)$/;

    return colorReg.test(value) || rgbaReg.test(value) || rgbReg.test(value);
};

export function findKey(obj, value, compare = (a, b) => a === b) {
    return Object.keys(obj).find(k => compare(obj[k], value))
}



// ----------------------------------------------用户是否登录 未登录跳转到登录页面 -------------------------

export function toLogin() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
        wx.navigateTo({
            url: '/pages/start/login/main'
        });
    } else {
        return true;
    }
}

export function login() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
        return userInfo;
    }
}

// ----------------------------------------------用户是否登录 未登录跳转到登录页面 -------------------------

export function getStorageOpenid() {
    const openId = wx.getStorageSync('openId');
    if (openId) {
        return openId;
    } else {
        return '';
    }
}

export function getOpenid() {
    // wx.login({
    //   success: res => {
    //     if (res.code) {
    //       //发起网络请求
    //       wx.request({
    //         url: 'https://api.weixin.qq.com/sns/jscode2session',
    //         data: {
    //           "appid": "wx601ce71bde7b9add",
    //           "secret": "abed5421d88eb8236e933c6e42d5c14e",
    //           "js_code": res.code,
    //           "grant_type": "authorization_code"
    //         },
    //         success: function (data) {
    //           var openid = data.data.openid;
    //           wx.setStorageSync("openid", openid);
    //         }
    //       })
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }

    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });
}

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
