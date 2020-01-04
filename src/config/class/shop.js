
import { createCombo } from '@/config/class/combo';
import { createVoucher } from '@/config/class/voucher';


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
        proData: _normalizeProData(shopData)
    });
}


function _normalizeProData(shopData) {
    console.log('Class shop',shopData);
    let params = shopData.proData
    let is_paying_pro = parseInt(shopData.recharge)
    if (is_paying_pro && is_paying_pro !== 100) {
        params.is_paying_pro = is_paying_pro
    } else {
        params.is_paying_pro = 0
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
