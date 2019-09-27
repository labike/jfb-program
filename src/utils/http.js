/*
 * @Author: zhangHang
 * @Date: 2019-05-14 14:40:47
 * @Description: file content
 */
import QS from 'qs';
import Fly from 'flyio/dist/npm/wx';
import { APIHOST,APIHOST2 } from '@/config/base';


const fly = new Fly();

//设置超时
fly.config.timeout = 20000;

//添加请求拦截器
fly.interceptors.request.use(config => {
    config.timeout = 30000;
    wx.showLoading({
        'title': '加载中',
        'mask': true
    });
    config.headers["X-Tag"] = "flyio";
    if (config.method === 'POST') {
        config.data = QS.stringify(config.data);
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    const token = wx.getStorageSync('token');
    token && (config.headers['accessToken'] = token);
    return config;
}, (error, promise) => {
    console.log(error);
    promise.reject(error)
});

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
    response => {
        wx.hideLoading();
        if (response.data.code === 200 || response.data.code === "200") {
            return Promise.resolve(response.data);
        } else {
            let msg = '';
            switch (response.data.code) {
            case 401:
                msg = '登录过期或未登录，请重新登录'
                jumpLogin()
                break;
            case 403:
                msg = response.data.msg
                jumpLogin()
                break;
            case 500:
                msg = '服务器错误，请联系管理员'
                break;
            default:
                msg = response.data.msg
            }
            wx.showToast({
                title: msg,
                icon: 'none',
                duration: 2000
            });
            return Promise.reject(response.data);
        }
    },
    (err, promise) => {
        
        wx.hideLoading();
        let msg = '';
        if (err.message) {
            msg = err.message
        } else {
            msg = '请求数据失败,请稍后再试'
        }
        wx.showToast({
            title: msg,
            icon: 'none',
            duration: 2000
        });
        return promise.reject(err)
    }
);

export default fly

export function get(url, data) {
    url = APIHOST + url
    return fly.get(url,data);
}

export function get2(url, data) {
    url = APIHOST2 + url
    return fly.get(url,data);
}

export function post(url, data) {
    url = APIHOST + url
    return fly.post(url, data);
}


export function post2(url, data) {
    url = APIHOST2 + url
    return fly.post(url, data);
}

function jumpLogin() {
    
    // eslint-disable-next-line no-undef
    const pages = getCurrentPages() //获取加载的页面
    const currentPage = pages[pages.length - 1] //获取当前页面的对象
    const options = currentPage.options   
    let urlWithArgs = ""
    if (currentPage.route.indexOf("pages/start/login/main") > -1) {
        urlWithArgs = "pages/index/main"
    } else {
        urlWithArgs = currentPage.route + '?'
        for (let key in options) {
            let value = options[key]
            urlWithArgs += key + '=' + value + '&'
        }
        urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
    }
    console.log(urlWithArgs);
    mpvue.setStorageSync('loginBefore', urlWithArgs);
    setTimeout(() => {
        wx.redirectTo({
            url: '/pages/start/login/main'
        });
    }, 300)
}
