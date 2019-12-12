/*
 * @Author: zhangHang
 * @Date: 2019-05-14 16:43:36
 * @Description: file content
 */
import { get, get2, post, post2 } from "../utils/http";

/***************************************** 首页接口 *****************************************/

/**
 * 2.1.1 banner广告默认和5条推荐数据
 * @method GET https://clients.qmw111.com/v1/index
 * @params city_id:城市id (非必填，如果没有填写 ，根据ip获取当前城市) 
 * @params lng: 经度 
 * @params lat: 纬度
 * @return {}
 */
export const apiGetIndex = params => {
    return get(`index`, params).then(res => {        
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};



/********************************************** 广告位 ******************************************** */


// /**
//  * 2.1.1 advert数据附近顶部
//  * @method GET https://clients.qmw111.com/v1/adverts/nearbyTop
//  * @return {}
//  */
// export const apiGetAdvert = () => {
//     return get(`adverts/nearbyTop`).then(res => {        
//         return Promise.resolve(res.data); 
//     }).catch(err => {
//         if (err.code === 0) {
//             return Promise.reject(err);
//         } else {
//             throw err.msg;
//         }
//     });
// };

/** 获取广告
 *  首页【顶部】（名称暂定活动宝） position 1 industry 0
 *  附近【顶部】（名称暂定曝光栏） position 4 industry 0
 *  美食【顶部】（名称暂定活动宝） position 1 industry 1
 *  酒店【顶部】（名称暂定活动宝） position 1 industry 2
 *  休闲娱乐【顶部】（名称暂定活动宝）position 1 industry 3
 *  爱车【顶部】（名称暂定活动宝） position 1 industry 4
 *   
 * @method GET  https://clients.qmw111.com/v1/advert/index?city_id=2809&position=1&industry=0
 * @params  city_id
 * @params  position
 * @return  industry
 */
export const apiGetAdvert = params => {
    return get('advert/index', params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        throw err;
    });
};


/**
 * 2.3 附近商家数据 
 * @method GET https://clients.qmw111.com/v1/nearbys 
 * @params lng:经度
 * @params lat：纬度
 * @params page:页码
 * @params top_sort:(非必填项)顶级分类id
 * @params sort_one:(非必填项)一级分类id
 * @params sort_two:(非必填项)二级分类id
 * @return {}
 */
export const apiGetNearbys = params => {
    return get(`nearbys`, params).then(res => {        
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};


/**
 * 2.3 附近爆品数据 
 * @method GET https://clients.qmw111.com/v1/nearbys/burst
 * @params lng:经度
 * @params lat：纬度
 * @params page:页码
 * @params top_sort:(非必填项)顶级分类id
 * @params limit
 * @return {}
 */
export const apiGetBurstByNear = params => {
    return get(`nearbys/burst`, params).then(res => {        
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};

/**
 * 2.6 首页分类 
 * @method POST https://clients.qmw111.com/v1/index-sort
 */
export const apiGetSort = () => {
    return post(`index-sort`).then(res => {        
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};

/**
 * 3.1.1.1 分类搜索店铺列表
 * @method POST https://clients.qmw111.com/v1/stores
 * @params city_id:必须填写当前城市所在id
 * @params top_sort:(非必填项)顶级分类id
 * @params sort_one:(非必填项)一级分类id
 * @params sort_two:(非必填项)二级分类id
 * @params lng:经度 (非必填项)，用到距离排序的时候为必填项
 * @params lat：纬度 (非必填项) ，用到距离排序的时候为必填项
 * @params sort_type:排序方式（0:智能排序，1:好评优先，2:离我最近 3:人均最低 4：人均最高 5：折扣由低到高 6 折扣由高到低）
 * @params area_code:区域id（0：全城 ，街道id）
 * @params keywords：搜索关键词  (非必填项) 例如：葡萄酒
 */
export const apiSearch = params => {
    return post('stores', params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};

/**
 * 3.1.1.2 热门词
 * @method GET https://clients.qmw111.com/v1/city/hotwords
 * @params city_id:城市id
 * @return {}
 */
export const apiGetHotWords = city_id => {
    return get(`city/hotwords`, {city_id}).then(res => {        
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};

/***************************************** 店铺详情接口 *****************************************/
/**
 * 3.2 门店详情
 * @method GET https://clients.qmw111.com/v1/store-details?s_id=31
 * @params s_id:门店id
 * @return {}
 */
export const apiGetShop = params => {
    return get(`store-details`,params).then(res => {        
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};


/**
 * 4.7.1 评价标签 
 * @method GET https://clients.qmw111.com/v1/comment/lables
 * @params s_id 
 * @return []
 */
export const apiGetRateLables = s_id => {
    return get(`comment/lables`,{ s_id }).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};


/**
 * 4.7.2 订单评价
 * @method GET https://clients.qmw111.com/v1/comment/order
 * @params order_id:订单号码 
 * @params start_num:选择星数字(1-5)
 * @params tags_ids:选择标签id(多个用,隔开)
 * @params centent:评论内容 
 * @params img[]
 * @return []
 */
export const apiRateData = params => {
    return post('comment/order', params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};

/**
 * 4.7.3 门店评价列表 
 * @method GET
 * @params type 评论类型【all:全部,img:晒图,nice：好评,bed：差评】
 * @params page 页码
 * @params s_id
 * @return []
 */
export const apiGetShopRate = params => {
    return get(`store/comments`,params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};


/**
 * 4.7.4 我的评价(获取我的评论)
 * @method GET https://clients.qmw111.com/v1/comment/my
 * @params page 页码
 * @params limit 
 * @return list：[]
 */
export const apiGetMyRate = params => {
    return get(`comment/my`,params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};


/**
 * 3.3 门店相册
 * @params img_type:图片类型【all:全部  pro：商品  scen：环境  license：资质】
 * @params s_id:门店id
 * @method GET
 * @return {"imgList":[]}
 */
export const apiGetShopImg = params => {
    return get(`store-img/${params.type}/${params.s_id} `).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};


/**
 * 3.4 获取门店商品数据
 * @method GET https://clients.qmw111.com/v1/pro-list/2/31 【参数顺序：pro_type / s_id】
 * @params pro_type：商品类型【1：代金券2：团购4：购物车】
 * @params s_id
 * @return []
 */
export const apiGetProList = params => {
    return get(`pro-list/${params.pro_type}/${params.s_id} `).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};

/**
 *3.5 商品详情数据(获取门店商品详情)
 * @method GET https://clients.qmw111.com/v1/pro-details?s_id=31&id=10&pro_type=1
 * @params pro_type:商品类型【1：代金券2：团购3：买单】
 * @params s_id:门店id
 * @params id:商品id
 * @return {}
 */
export const apiGetProDetails = params => {
    return get(`pro-details`, params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};

/***************************************** 登录 *****************************************/
/*登陆验证码*/
export const apiGetCodeByLogin = mobile => get(`sends/${mobile}`);

/**
 * 1.2 手机登录&注册
 * @method POST https://clients.qmw111.com/v1/logins
 * @params mobile:手机号
 * @params sms_code:手机验证码
 */
export const apiUserLogin = params => {
    return post(`logins`, params);
};


/**
 * 3.1.2 减付宝扫描二维码,分享用户绑定关系
 * @method POST https://clients.qmw111.com/v1/store-scan
 * @params content: 扫描获取到的内容（type=3tjinfo 给content）
 * @params type: 1-买单 2-门店 3-客户邀请
 */
export const apiStoreScan = params => {
    return post(`store-scan`, params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};


/**
 * 1.4 第三方登录--获取微信用户信息unionid
 * @method GET https://clients.qmw111.com/v1/user-info?code=001fJpOk0ul7vr1n5UQk0qHkOk0fJpOk
 * @params code : code码 
 * @params type : 2 小程序登陆 
 */
export const apiGetOpenId = code => {
    return get(`user-info`, {code, type: 2}).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};

/**
 * 1.4 第三方登录--微信登陆
 * @method POST https://clients.qmw111.com/v1/unifylogin
 * @params unifyid : unionid
 * @params ltype: 1 web微信 2微信公众号登陆 3小程序 
 */
export const apiWxLogin = other_info => {
    const params = {
        unifyid: other_info.unionid,
        ltype: 3,
        other_info: JSON.stringify(other_info)
    }
    return post(`unifylogin`, params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};




/**
 * 1.5.1 获取手机号
 * @method POST https://clients.qmw111.com/v1/get-mobile
 */
export const apiGetMobileByWx = params => {
    return post('get-mobile', params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};

/**
 * 1.5 绑定手机号
 * @method POST https://clients.qmw111.com/v1/binds
 * @params mobile:手机号
 * @params sms_code:手机验证码
 */
export const apiBindMobile = params => {
    return post('binds', params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};


/**
 * 1.6 个人中心
 * @method GET https://clients.qmw111.com/v1/users
 * @params mobile:手机号
 * @params sms_code:手机验证码
 */
export const apiGetUsers = () => {
    return get(`users`).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};


/**
 * 1.5 修改昵称
 * @method POST https://clients.qmw111.com/v1/users-nickname
 * @params nickname:昵称
 */
export const apiEditNickname = nickname => {
    return post('users-nickname', { nickname }).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};

/***************************************** 订单 *****************************************/
/**
 *4.1 创建订单
 * @method POST https://clients.qmw111.com/v1/order-create
 * 公共必填
 * @params s_id: 门店id
 * @params type:订单类型（1：代金券 2：团购 3：买单 4：购物车）
 * 买单
 * @params total：买单金额
 * 代金券
 * @params p_id:商品id
 * @params number: 数量
 * 购物车
 * @params activity_id: 优惠活动id (0-无优惠)
 * @params carts:购物车内容 [{
        "pid": "203",
        "sku": "",
        "num": 2 
    }}
 * @return {}
 */
export const apiCreateOrder = params => {
    return post(`order-create`, params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};

/**
 *4.2 订单支付
 * @method POST https://clients.qmw111.com/v1/order-pay
 * @params order_id:订单号
 * @params actual: 实际支付金额
 * @params pay_method:支付方式 [3-支付宝支付  4-jsapi微信支付]
 * @return confing
 */
export const apiOrderPay = params => {
    return post(`order-pay`, params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};

/**
 * 2.4 门店点赞 & 分享 &收藏 &浏览 &加入分享 
 * @method POST https://clients.qmw111.com/v1/like-share
 * @params s_id: 门店ID
 * @params type: 操作类型 【like-点赞 collect-收藏 share-分享  browser-浏览 attend-加入分享 】
 */ 
export const likeShare = params => {
    return post(`like-share`, params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};

/**
 * 2.5 商圈以及分类 
 * @method GET https://clients.qmw111.com/v1/business-sort/
 * @params adCode:城市编码
 * @params top_sort：分类
 */ 
export const apiBusinessSort = params => {
    return get(`business-sort/${params.adCode}/${params.top_sort}`).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};


/**
 * 2.6 首页分类 
 * @method POST https://clients.qmw111.com/v1/index-sort
 * @return {}
 */
export const apiGetAllSort = () => {
    return post('index-sort').then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err.data);
        } else {
            throw err.msg;
        }
    })
}

/**
 * 2.7 三级分类数据 
 * @method POST https://clients.qmw111.com/v1/three-sort
 * @return {}
 */
export const apiGetThreeSort = sort_id => {
    return post('three-sort', { sort_id }).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err.data);
        } else {
            throw err.msg;
        }
    })
}


/**
 * 1.10.1 光顾店铺列表 
 * @method GET https://clients.qmw111.com/v1/contact/comes
 * @params limit: 每页显示条数
 * @params page: 页码 
 * @params type: all-全部  1-已加入（返佣好店） 2-未加入
 */ 
export const visitedShop = params => {
    return get(`contact/comes`, params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};


/**
 * 1.10.2 用户收藏店铺 
 * @method GET https://clients.qmw111.com/v1/contact/collects
 * @params limit: 每页显示条数
 * @params page: 页码
 */ 
export const collectsShop = params => {
    return get('contact/collects', params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};

/**
 * 1.10.3 批量取消店铺操作 
 * @method POST https://clients.qmw111.com/v1/contact/cancels
 * @params s_ids:店铺ids(多个店铺用,隔开) 
 * @params type:操作类型【collect-收藏 browser-浏览 attend-加入分享 】
 */ 
export const unLikeShare = params => {
    return post(`contact/cancels`, params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};



/**
 * 1.10.4 用户浏览过店铺列表 
 * @method GET https://clients.qmw111.com/v1/contact/browsers 
 * @params limit: 每页显示条数
 * @params page: 页码 
 */ 
export const browsersShop = params => {
    return get('contact/browsers', params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};

/**
 *微信分享sdk
 * @method POST https://clients.qmw111.com/v1/user/wxsignature
 * @params s_id: 门店ID
 * @return confing
 */ 
export const shareSDK = share_url => {
    return post(`user/wxsignature`, { share_url }).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};


/**
 *4.2.2 订单支付成功后分享店铺
 * @method POST https://clients.qmw111.com/v1/share-store
 * @params s_id: 门店ID
 * @return confing
 */ 
export const apiShareStore = s_id => {
    return post(`share-store`, {
        s_id,
        is_wx_small: 1
    }).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};


/**
 *4.2.3 取消未付款订单
 * @method POST https://clients.qmw111.com/v1/order-cancel
 * @params order_id:订单号码
 * @return confing
 */ 
export const apiOrderCancel = order_id => {
    return post('order-cancel', {order_id}).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};

/**
 *4.3.1 订单退款 
 * @method POST https://clients.qmw111.com/v1/order-return
 * @params order_id:订单号码
 * @params refund_reason：退款原因
 * @return confing
 */ 
export const apiOrderRefund = params => {
    return post(`order-return`, params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        return Promise.reject(err);
    });
};


/**
 *4.4.1  订单分类列表
 * @method GET https://clients.qmw111.com/v1/orders
 * @params nav_type:订单类型【全部：all,0:待付款1:待使用2：待评价3：退款/售后】
 * @return s_id:店铺id(不是必填参数，不带入表示所有店铺订单)
 * @return  limit: 每页显示条数
 * @return  page: 页码
 */
export const apiOrderList = params => {
    return get(`orders`, params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};


/**
 *4.4.2 订单列表可用消费码
 * @method GET https://clients.qmw111.com/v1/order/coupons
 * @return s_id:店铺id(不是必填参数，不带入表示所有店铺订单)
 */
export const apiOrderCoupons = s_id => {
    return get(`order/coupons`, {s_id}).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};


/**
 * 
 *4.4.3 用户店铺订单列表-已支付订单
 * @method GET https://clients.qmw111.com/v1/order/payall
 * @return s_id:店铺id(不是必填参数，不带入表示所有店铺订单)
 */
export const apiOrderPayList = s_id => {
    return get(`order/payall`, {s_id}).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};



/**
 *4.5订单详情
 * @method GET https://clients.qmw111.com/v1/order-details/201901181703544213826428
 * @params order_id:订单号
 */
export const apiOrderDetails = orderId => {
    return get(`order-details/${orderId}`).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        throw err;
    });
};



/**
 *4.5.2 订单状态
 * @method GET https://clients.qmw111.com/v1/order-status/201902162143321426866724
 * @params order_id:订单号
 * @return  is_pay_success  0-未支付 1-支付成功
 * @return  store_id //商家id
 */
export const apiPayStatus = orderId => {
    return get(`order-status/${orderId}`).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        throw err;
    });
};



/***************************************** 点餐 *****************************************/

/**
 *4.1.3.1 获取订单-购物车-优惠列表
 * @method POST  https://clients.qmw111.com/v1/order-discount
 * @params s_id:门店id  
 * @params type:订单类型（1：代金券2：团购3：买单4：购物车下单） 
 * @params carts:购物车内容 [{
                "pid": "203",
                "sku": "",
                "num": 2 
            },{
                "pid": 202,
                "sku": "164_167",
                "num": 1 
            }]
 * @return  reduce_list []
 */
export const apiOrderDiscount = params => {
    return post(`order-discount`, params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        throw err;
    });
};



/******************************************** 我的钱包 ******************************************* */

/**
* reward 我的钱包
* @method GET  https://clients.qmw111.com/v1/reward/statistics
* @return  total：总收益 balance：余额 arrival_account：已提现
*/
export const apiReward = params => {
    return get('reward/statistics', params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        throw err;
    });
};
/**
* reward 返佣店铺详情
* @method GET  https://clients.qmw111.com/v1/reward/list
* @params  limit: 每页显示条数
* @params  page: 页码
* @return  total：总收益 balance：余额 arrival_account：已提现
*/
export const apiRewardList = params => {
    return get('reward/list', params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        throw err;
    });
};


/**
*  提现记录列表
* @method GET  https://clients.qmw111.com/v1/reward/cashes
* @params  limit: 每页显示条数
* @params  page: 页码
* @return  total：总数量 list：
*/
export const apiRewardCashes = params => {
    return get('reward/cashes', params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};


/**
*  微信提现
* @method POST  https://clients.qmw111.com/v1/wechats
* @params openid： 提现账户 
* @params amount （最低金额为1元，最高10万元）
* @return userid
*/
export const apiMoneyByWx = params => {
    return post('wechats', params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};

/**
*  支付宝提现
* @method POST  https://clients.qmw111.com/v1/ailis
* @params account 提现账户 
* @params amount 单位：元,只支持2位小数，小数点前最大支持13位，金额必须大于等于0.1元。
* @return order_id
*/
export const apiMoneyByAlipay = params => {
    return post('ailis', params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};

/**
*  支付宝提现验证码
* @method POST  https://clients.qmw111.com/v1/verify
* @params phone phone
* @params money 金额
* @return order_id
*/
export const apiVerifyByAlipay = params => {
    return post('verify', params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};


/**********************************v2******************/


/**
 * 2.1.2 首页推荐店铺或产品上拉请求
 * @method GET https://clients.qmw111.com/v2/index/recommends 
 * @method GET https://clients.qmw111.com/v2/index/recommendv2 
 * @params city_id:城市id (非必填，如果没有填写 ，根据ip获取当前城市) 
 * @params lng: 经度 
 * @params lat: 纬度
 * @params page:页码
 * @return {}
 */
export const apiGetRecommends = params => {
    return post2(`index/recommendv2`, params).then(res => {        
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};

/**
* 美食点击进去【活动分类列表】
* @method GET  https://clients.qmw111.com/v2/category/range
* @params lng: 经度 
* @params lat: 纬度
* @params industry_id: 行业id
*/
export const apiSalesType = params => {
    return post2('category/range', params).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        throw err;
    });
};

/**
* 分类接口【首页七大类】
* @method GET  https://clients.qmw111.com/v2/nav/list
* @params  path: index(首页index,)
*/
export const apiNavList = type => {
    return get2('nav/list', {path: type}).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        throw err;
    });
};

/**
* 分类接口【二级页面】
* @method GET  https://clients.qmw111.com/v2/nav/industry
* @params  path: index(首页index,)
*/
export const apiNavTwoList = industry_id => {
    return get2('nav/industry', { industry_id }).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        throw err;
    });
};

/**
* 优质门店【首页】
* @method GET  https://clients.qmw111.com/v2/index/good
* @params  path: index(首页index,)
*/
export const apiSuperStores = () => {
    return get2('index/good').then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        throw err;
    });
};

/**
* 优惠专区【首页】 已删除
* @method GET  http://clients.qmw111.com/v2/index/discount
* @params  path: index(首页index,)

export const apiSuperDiscount = () => {
    return get2('index/discount').then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        throw err;
    });
};
*/


/**
 * 活动列表页
 * @method GET https://clients.qmw111.com/v2/give/list
 * @params industry_id: 1 
 * @params give_category: 4【活动分类】
 * @params lng: 经度 
 * @params lat: 纬度
 * @params page:页码
 * @return {}
 */
export const apiGiveList = params => {
    return post2('give/list', params).then(res => {        
        return Promise.resolve(res.data); 
    }).catch(err => {
        if (err.code === 0) {
            return Promise.reject(err);
        } else {
            throw err.msg;
        }
    });
};



/**
* 活动详情页
* @method GET  https://clients.qmw111.com/v2/give/detail?gid=14
* @params  path: index(首页index,)
*/
export const apiGiveDetail = gid => {
    return get2('give/detail', { gid }).then(res => {
        return Promise.resolve(res.data); 
    }).catch(err => {
        throw err;
    });
};



