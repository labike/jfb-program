/*
 * @Author: zhangHang
 * @Date: 2019-09-24 10:09:22
 * @Description: file content
 */
import { apiGiveDetail } from "@/api/api.js";

export default class Timesale {
    constructor({
        id,
        name,
        price,
        headerImg,
        rules
    }) {
        this.id = id;
        this.name = name;
        this.headerImg = headerImg;
        this.price = parseFloat(price);
        this.rules = rules;
        
    }


    getTimesaleRules() {
        const that = this;
        if (that.rules) {
            return Promise.resolve(that);
        }
        return new Promise((resolve,reject) => {
            apiGiveDetail(that.id).then(ticketData => {
                if (!ticketData.pro_name) {
                    reject(new Error("该产品已下架或者被删除"))
                } else {
                    that.name = ticketData.pro_name;
                    that.headerImg = ticketData.img;
                    that.price = ticketData.sale_price;
                    that.sale_num = ticketData.sale;
                    that.rules = ticketData.ruler;
                    that.storeInfo = ticketData.storeInfo;
                    resolve(that);
                }
            });
        });
    }
}



export function createTimesale (timesale) {
    return new Timesale({
        id: timesale.id,
        name: timesale.pro_name,
        price: timesale.sale_price,
        headerImg: timesale.headerImg,
        rules: timesale.rules
    });
}
