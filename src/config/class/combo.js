import { apiGetProDetails } from "@/api/api.js";
import { orderType } from '@/config/base';

export default class Combo {
    constructor({
        id,
        name,
        imgUrl,
        price,
        old_price,
        sale_num,
        description
    }) {
        this.id = id;
        this.name = name;
        this.imgUrl = imgUrl;
        this.price = parseFloat(price);
        this.old_price = parseFloat(old_price);
        this.sale_num = sale_num;
        this.description = description;        
    }


    getComboDetails(s_id) {
        const that = this;
        if (that.rules) {
            return Promise.resolve(that);
        }
        return new Promise(resolve => {
            apiGetProDetails({
                s_id,
                pro_type: orderType.combo,
                id: that.id
            }).then(ticketData => {
                that.name = ticketData.topData.group_name;
                that.imgUrl = ticketData.topData.imgUrl;
                that.headerImg = ticketData.topData.imgUrl.imgList[0].img;
                that.price = ticketData.topData.price;
                that.old_price = ticketData.topData.old_price;
                that.sale_num = ticketData.topData.sales_num;
                that.groupContent = ticketData.topData.groupContent;
                that.rules = _normalizeRules(ticketData.rulesData);
                resolve(that);
            });
        });
    }
}



export function createCombo (comboData) {
    return new Combo({
        id: comboData.id,
        name: comboData.name,
        imgUrl: comboData.headerImg,
        price: comboData.price,
        old_price: comboData.old_price,
        sale_num: comboData.buy_num,
        description: comboData.description
    });
}

export function reCombo (comboData) {
    return new Combo(comboData);
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
