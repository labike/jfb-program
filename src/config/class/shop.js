// import { orderType } from '@/config/base'
import { createCombo } from '@/config/class/combo';
import { createVoucher } from '@/config/class/voucher';
import { createPayTheBill } from '@/config/class/pay_the_bill';


export default class Shop {
    constructor({
        infoData,
        otherInfo,
        commentScore,
        proData
    }) {
        this.infoData = infoData;
        this.otherInfo = otherInfo;
        this.commentScore = commentScore;
        this.proData = proData;
    }
}

export function createShop (shopData) {
    
    return new Shop({
        infoData: shopData.infoData,
        otherInfo: shopData.otherInfo,
        commentScore: shopData.comment,
        proData: _normalizeProData(shopData.proData)
    });
}


function _normalizeProData(params) {
    // console.log('Class shop',params);

    if (params.check) {
        params.check = createPayTheBill(params.check);
    }
    
    if (params.vouchers) {
        let ret = [];
        params.vouchers.forEach(voucherData => {
            if (voucherData.id && voucherData.buy_price) {
                ret.push(createVoucher(voucherData));
            }
        });
        params.vouchers = ret;
    }
    
    if (params.group) {
        let ret = [];
        params.group.forEach(comboData => {
            if (comboData.id && comboData.price) {
                ret.push(createCombo(comboData));
            }
        });
        params.group = ret;
    }

    
    return params;
}
