<script>
export default {
    created() {
        // 调用API从本地缓存中获取数据
        /*
         * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
         * 微信：mpvue === wx, mpvuePlatform === 'wx'
         * 头条：mpvue === tt, mpvuePlatform === 'tt'
         * 百度：mpvue === swan, mpvuePlatform === 'swan'
         * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
         */
        const self = this;
        console.log('created');
        // mpvue.login({
        //     success(res) {
        //         console.log('login',res);
                
        //         // if (res.code) {
        //         //     self.code = res.code;
        //         //     self.wxGetUserInfo(res.code);
        //         // }
        //         if (res.code) {
        //             // 发起网络请求
                    
        //         } else {
        //             console.log('登录失败！' + res.errMsg)
        //         }
        //     },
        //     fail(err) {
        //         console.log('err',err);
        //     }
        // })
    },
    methods: {
        // wxGetUserInfo(code) {
        //     console.log('code', code);
            
        //     const self = this;
        //     mpvue.getUserInfo({
        //         withCredentials: true,
        //         success(res) {
        //             console.log(res);
        //             let {
        //                 encryptedData,
        //                 userInfo,
        //                 iv
        //             } = res;
        //             self.post('api', {
        //                 code,
        //                 encryptedData,
        //                 iv,
        //             }).then(res => {
        //                 console.log(`后台交互拿回数据:`, res);
        //                 // 获取到后台重写的session数据，可以通过vuex做本地保存
        //             }).catch(err => {
        //                 console.log(`自动请求api失败 err:`, err);
        //             })
        //         },
        //         fail(err) {
        //             console.log('自动wx.getUserInfo失败:', err);
        //             // 显示主动授权的button
        //             self.buttonVisible = true;
        //         }
        //     })
        // },
        bindGetUserInfo(e) {
            // console.log('回调事件后触发')
            const self = this;
            if (e.mp.detail.userInfo) {
                console.log('用户按了允许授权按钮')
                let {
                    encryptedData,
                    userInfo,
                    iv
                } = e.mp.detail;
                self.post('api', {
                    // 这里的code就是通过wx.login()获取的
                    code: self.code,
                    encryptedData,
                    iv,
                }).then(res => {
                    console.log(`后台交互拿回数据:`, res);
                    // 获取到后台重写的session数据，可以通过vuex做本地保存
                }).catch(err => {
                    console.log(`api请求出错:`, err);
                })
            } else {
                //用户按了拒绝按钮
                console.log('用户按了拒绝按钮');
            }
        },
    }
};
</script>

<style>
.cell {
    background: #fff;
    text-align: right;
}
.cell li {
    position: relative;
    display: flex;
    padding-left: 0.24rem;
    overflow: hidden;
    font-size: 14px;
    line-height: 1rem;
}
.cell li:not(:last-child)::before {
    content: '';
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2rpx;
    border-bottom: 2rpx solid #e8e8e8;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
}

</style>
