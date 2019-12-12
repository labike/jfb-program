import { apiGetProDetails } from "@/api/api.js";
import { orderType } from '@/config/base';

export default class Voucher {
    constructor({
        id,
        name,
        price,
        old_price,
        sale_num,
        overlying
    }) {
        this.id = id;
        this.name = name;
        this.price = parseFloat(price);
        this.old_price = parseFloat(old_price);
        this.nickName = `${Number(this.old_price)}元代金券`;
        this.sale_num = sale_num;
        if (overlying) {
            const rules = {
                overlying
            };
            this.rules = rules;
        }
        
    }


    getVoucherRules(s_id) {
        const that = this;
        if (that.rules) {
            return Promise.resolve(that);
        }
        return new Promise((resolve,reject) => {
            apiGetProDetails({
                s_id,
                pro_type: orderType.vouchers,
                id: that.id
            }).then(ticketData => {
                if (!ticketData.topData) {
                    reject(new Error("该产品已下架或者被删除"))
                } else {
                    that.price = ticketData.topData.price;
                    that.old_price = ticketData.topData.old_price;
                    that.nickName = that.name = `${Number(this.old_price)}元代金券`;
                    that.sale_num = ticketData.topData.sales_num;
                    that.rules = _normalizeRules(ticketData.rulesData);
                    that.storeInfo = ticketData.storeInfo;
                    that.headerImg = ticketData.storeInfo.headerImg;
                    resolve(that);
                }
            });
        });
    }
}



export function createVoucher (voucher) {
    return new Voucher({
        id: voucher.id,
        name: voucher.name,
        price: voucher.buy_price,
        old_price: voucher.face_val,
        sale_num: voucher.sale_num,
        overlying: voucher.overlying
    });
}

export function reVoucher (voucher) {
    return new Voucher(voucher);
}

function _normalizeRules(rules) {

    if (rules.UnavailableDate === '' && rules.UnavailableWeek === '') {
        rules.UnavailableDate = '不限';
    }
    if (rules.availableTime === '') {
        rules.availableTime = '24小时可用';
    }
    return rules;
}
