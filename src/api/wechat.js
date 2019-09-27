/*
 * @Author: zhangHang
 * @Date: 2019-09-06 10:38:58
 * @Description: file content
 */

/**
 * 再次授权地理定位
 */
function again_getLocation(onSuccess) {
    mpvue.getSetting({
        success: (res) => {
            console.log(res)
            if (res.authSetting['scope.userLocation'] !== undefined && res.authSetting['scope.userLocation'] !== true) {
                //非初始化进入该页面,且未授权
                mpvue.showModal({
                    title: '是否授权当前位置',
                    content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
                    success: function (res) {
                        console.log(res)
                        if (res.cancel) {
                            mpvue.showToast({
                                title: '授权失败',
                                icon: 'none',
                                duration: 1000
                            })
                        } else if (res.confirm) {
                            mpvue.openSetting({
                                success: function (dataAu) {
                                    console.log(dataAu)
                                    if (dataAu.authSetting["scope.userLocation"] === true) {
                                        mpvue.showToast({
                                            title: '授权成功',
                                            icon: 'success',
                                            duration: 1000
                                        })
                                        getLocation(onSuccess);
                                    } else {
                                        mpvue.showToast({
                                            title: '授权失败',
                                            icon: 'none',
                                            duration: 1000
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            } else if (res.authSetting['scope.userLocation'] === undefined) { //初始化进入
                getLocation(onSuccess);
            } else { //授权后默认加载
                getLocation(onSuccess);
            }
        }
    })
}

/**
 * 授权地理定位
 */
export function getLocation (onSuccess) {
    mpvue.getLocation({
        type: 'wgs84',
        success: function (res) {
            onSuccess && onSuccess(res)
        },
        fail(err) {
            console.log(err);
            again_getLocation(onSuccess)
        }
    })
}


/**
 * 获取登陆授权
 */
export function authLogin(onSuccess) {
    mpvue.login({
        success(res) {
            onSuccess && onSuccess(res)
        },
        fail (err) {
            console.log(err) // 抛出异常
        }
    })
}
