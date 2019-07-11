import { apiGetProDetails } from "@/api/api.js";
import { orderType } from '@/config/base';

export default class PayTheBill {
    constructor({
        name,
        isUse,
        discount, // 折扣
        periodOfValidity, //截止日期
        holidays, // 节假日
        UnavailableDate,
        UnavailableWeek,
        availableTime,
    }) {
        this.name = name;
        this.isUse = isUse === '1';
        this.discount = discount;
        this.periodOfValidity = periodOfValidity;
        this.holidays = holidays;
        this.UnavailableDate = UnavailableDate;
        this.UnavailableWeek = UnavailableWeek;
        this.availableTime = availableTime;  
    }

    getDetails(s_id) {
        const that = this;
        return new Promise(resolve => {
            apiGetProDetails({
                s_id,
                pro_type: orderType.paying,
                id: 0
            }).then(ticketData => {
                this.isUse = ticketData.isUse === '1';
                this.name = ticketData.name;
                this.discount = ticketData.discount;
                this.periodOfValidity = ticketData.periodOfValidity;
                this.holidays = ticketData.holidays;
                this.UnavailableDate = ticketData.UnavailableDate;
                this.UnavailableWeek = ticketData.UnavailableWeek;
                this.availableTime = ticketData.availableTime; 
                this.storeInfo = ticketData.storeInfo; 
                resolve(that);
            });
        });
    }
}



export function createPayTheBill (checkData) {
    if (checkData.rule === '') {
        return { unRule: '暂无折扣优惠' };
    }
    return new PayTheBill({
        name: checkData.name,
        discount: checkData.discount,
        isEffective: checkData.isEffective,
        periodOfValidity: checkData.periodOfValidity,
        holidays: checkData.holidays,
        UnavailableDate: checkData.UnavailableDate,
        availableTime: checkData.availableTime,
    });
}
