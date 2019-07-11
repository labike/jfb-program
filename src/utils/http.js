import QS from 'qs';
import Fly from 'flyio/dist/npm/wx';
import { HOST } from '@/config/base';


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
                setTimeout(() => {
                    wx.redirectTo({
                        url: '/pages/start/login/main'
                    });
                }, 300)
                break;
            case 403:
                msg = response.data.msg
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
            return Promise.reject(response);
        }
    },
    (err, promise) => {
        
        wx.hideLoading();
        let msg = '';
        if (err.response.data.msg) {
            msg = err.response.data.msg
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
    url = HOST + url
    return fly.get(url,data);
}

export function post(url, data) {
    url = HOST + url
    return fly.post(url, data);
}