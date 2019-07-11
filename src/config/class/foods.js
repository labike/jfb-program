export default class Foods {
    constructor({
        id,
        proName,
        img_url,
        price,
        now_price,
        sales_num,
        like_num,
        is_hot,
        is_activity,
        specData,
        defaultPriceKey,
    }) {
        this.id = id;
        this.name = proName;
        this.img = img_url;
        this.old_price = price;
        this.price = now_price;
        this.sales_num = sales_num;
        this.like_num = like_num;
        this.is_hot = is_hot;
        if (is_activity === 1) {
            this.is_jion_activity = true;
        } else {
            this.is_jion_activity = false;
        }

        if (specData) {
            this.specData = specData;
            this.defaultPriceKey = defaultPriceKey;
        }
        
    }
}



export function createFoods (foods) {
    return new Foods({
        id: foods.id,
        proName: foods.proName,
        img_url: foods.img_url,
        price: foods.price,
        now_price: foods.now_price,
        sales_num: foods.sales_num,
        like_num: foods.like_num,
        specData: foods.specData,
        is_hot: foods.is_hot,
        is_activity: foods.is_activity,
        defaultPriceKey: foods.defaultPriceKey
    });
}


export function firstToCart ({ sku_id, foods }) {
    if (!foods) {
        return null;
    }
    const newfood = JSON.parse(JSON.stringify(foods));
    if (!newfood.num) {
        newfood.num = 1;
    }
    if (foods.specData) {
        delete newfood.specData;
        delete newfood.defaultPriceKey;
    }
    newfood.sku_id = sku_id === '0_0' ? '' : sku_id;      
    return newfood;
}
