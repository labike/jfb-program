
/**
 *  proxy HOST
 */
// export const HOST = 'http://clients.qmwjj.cc/v1/';
export const APIHOST = 'https://clients.qmw111.com/v1/';
export const WAPHOST = 'https://wap2.qmw111.com/';
/**
 *  门店类型 （1-餐饮 2-酒店 3-休闲娱乐4-爱车）
 */
export const shopType = {
    repast: 1,
    hotel: 2,
    pastime: 3,
    icar: 4
};

/**
 *  相册类型 【all:全部  pro：商品  scen：环境  license：资质】
 */
export const photoType = {
    all: '全部',
    pro: '商品',
    scen: '环境',
    license: '资质'
};

/**
*  评论类型 all-全部 haveimg-有图 good-好评 bad-差评
*/
export const rateType = {
    all: '全部',
    haveimg: '晒图',
    good: '好评',
    bad: '差评',
};

/**
 *  type:订单类型（1：代金券 2：团购 3：买单 4：购物车）
 */
export const orderType = {
    vouchers: '1',
    combo: '2',
    paying: '3',
    goods: '4'
};

/**
 *  mobile_isbind：是否已绑定手机号【1：是0：否】
 */
export const mobileIsBind = {
    NONE: 0,
    OK: 1,
};


/**
 *  is_pay_success：支付是否成功【1：是 0：否】
 */
export const payIsSuccess = {
    NONE: '0',
    OK: '1',
};

/**
 *  活动类型
 */
export const activityTag = {
    new: '首单',
    full: '满减',
};

/**
 *  tabbar
 */
export const tabbar = [
    "pages/index/main", 
    "pages/filter/near/main",
    "pages/orders/list/main",
    "pages/mine/index/main"
];
