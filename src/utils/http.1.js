
import { HOST } from '@/config/base';

/**
 * 分装微信请求
 * @param {*} params
 * @params url 请求url
 * @params type 请求类型。默认GET
 * @params setUpUrl 请求不需要再次组装地址
 * @params data POST请求参数
 */
function request (params) {
    return new Promise((resolve, reject) => {
        let url = HOST + params.url;
        if (!params.type) {
            params.type = 'GET';
        }
        /* 不需要再次组装地址 */
        if (params.setUpUrl === false) {
            url = params.url;
        }
        wx.request({
            url: url,
            data: params.data,
            method: params.type,
            header: {
                'content-type': 'application/json',
                'accessToken': mpvue.getStorageSync('token')
            },
            success: function (res) {
                if (res.data.code === 200) {
                    resolve(res.data.data);
                } else {
                    reject(res.data);
                }
            },
            fail: function (err) {
                throw err;
            }
        });
    });
}

export function get(url, data) {
    const params = {
        url: url,
        data
    };
    return request(params);
}

export function post (url, data) {
    const params = {
        url,
        type: 'POST',
        data
    };
    return request(params);
}
