<template>
<div class="barcon home border-top">
    <!-- 美食 -->
    <dl class="pay" v-if="params.check">
        <dt class="title">
        <i class="icon"></i>买单
      </dt>
        <dd>
            <div class="time">
                <div class="mes" v-if="params.check.discount">{{params.check.name}}</div>
                <div class="mes" v-else>暂无折扣优惠</div>
            </div>
        </dd>
        <dd>
            <a :href="'/pages/shop/paythebill/main?shop_id=' + s_id" class="btn">买 单</a>
        </dd>
    </dl>

    <dl class="vouchers" v-if="params.vouchers">
        <dt class="title">
        <i class="icon"></i>代金券
      </dt>
        <ul class="vouchers-list">
            <li class="vouchers-item" v-for="vouchers in params.vouchers" :key="vouchers.id"
                @click="jumpCombo('vouchers',vouchers.id)" >
                <img src="/static/img/ticket.png" alt="" class="bg">
                <div class="vs-warp">
                    <div class="msg">
                        <div class="name">
                            <span>{{ vouchers.old_price  }}</span> 元 代金券
                        </div>
                        <div class="overlay" v-if="vouchers.rules">{{ vouchers.rules.overlying }}</div>
                    </div>
                    
                    <div class="price">
                        <span class="new">{{ vouchers.price }}</span>
                    </div>
                    <div class="handle">
                        <div class="btn" @click.stop="jumpConfirm('vouchers',vouchers.id)">抢 单</div>
                    </div>
                </div>
            </li>
        </ul>
    </dl>

    <dl class="combo" v-if="params.group">
        <dt class="title">
            <i class="icon"></i>本店套餐
        </dt>
        <ul class="combo-list">
            <li class="combo-item" @click="jumpCombo('combo',combo.id)" v-for="combo in params.group" :key="combo.id">
                <div class="food">
                    <div class="food-img">
                        <img :src="combo.imgUrl" :alt="combo.name">
                        <!-- <img src="http://shop.qmwjj.cc/storeImg/Atlas/20190322084831_955.jpg" alt=""> -->
                    </div>
                    <div class="food-info">
                        <div class="name">{{ combo.name }}</div>
                        <div class="msg">
                            <span>{{ combo.description }}</span>
                        </div>
                        <div class="price">
                            <span class="new">{{ combo.price }}</span>
                            <span class="old">原价 ￥{{ combo.old_price }}</span>
                        </div>
                    </div>
                    <div class="food-handle">
                        <div class="btn" @click.stop="jumpConfirm('combo',combo.id)">购 买</div>
                        <p>已售 {{ combo.sale_num }} 份</p>
                    </div>
                </div>
            </li>
        </ul>
    </dl>

    <!-- 酒店 -->
    <dl class="calendar" v-if="params.allData">
        <dt class="title">
        <div class="selee-time">
          <p class="start">
            <span class="time">12月27日</span>入住
          </p>
          <p class="center">
            共<span class="num">1</span>晚
          </p>
          <p class="end">
            <span class="time">12月28日</span>离店
          </p>
        </div>
      </dt>
        <dd class="tag">
            <span class="active">含早餐</span>
            <span>可取消</span>
            <span>大床房</span>
            <span>双床房</span>
            <span>三人间</span>
        </dd>
    </dl>

    <dl class="combo" v-if="params.hourData">
        <dt class="title">钟点房</dt>
        <ul class="combo-list">
            <li class="combo-item" v-for="room in params.hourData" :key="room.id">
                <div class="room">
                    <div class="room-img">
                        <img :src="room.header_img" alt="">
                    </div>
                    <div class="room-info">
                        <div class="name">{{ room.room_name}}</div>
                        <div class="describe">
                            <ul>
                                <li>{{ room.bedType}}</li>
                                <li>{{ room.is_Window}}</li>
                                <li>{{ room.floor_num}}层</li>
                                <li>{{ room.acreage}}㎡</li>
                            </ul>
                            <ul>
                                <li>{{ room.refundType}}</li>
                                <li>{{ room.useTime}}</li>
                            </ul>
                        </div>
                        <div class="price">
                            <span class="new">{{room.price}}</span>起
                        </div>
                    </div>
                    <div class="room-handle" :data-room='room.room_id'>
                        <p class="btn">预定</p>
                        <p>在线付</p>
                    </div>
                </div>
            </li>
        </ul>
    </dl>

    <dl class="combo" v-if="params.allData">
        <dt class="title">全天房</dt>
        <ul class="combo-list">
            <li class="combo-item" v-for="room in params.hourData" :key="room.id">
                <div class="room">
                    <div class="room-img">
                        <img :src="room.header_img" alt="">
                    </div>
                    <div class="room-info">
                        <div class="name">{{ room.room_name}}</div>
                        <div class="describe">
                            <ul>
                                <li>{{ room.bedType}}</li>
                                <li>{{ room.is_Window}}</li>
                                <li>{{ room.floor_num}}层</li>
                                <li>{{ room.acreage}}㎡</li>
                            </ul>
                            <ul>
                                <li>{{ room.refundType}}</li>
                                <li>{{ room.useTime}}</li>
                            </ul>
                        </div>
                        <div class="price">
                            <span class="new">{{room.price}}</span>起
                        </div>
                    </div>
                    <div class="room-handle" :data-room='room.room_id'>
                        <p class="btn">预定</p>
                        <p>在线付</p>
                    </div>
                </div>
            </li>
        </ul>
    </dl>

</div>
</template>

<script>
export default {
    name: "TabHome",
    data() {
        return {
            s_id: 0
        }
    },
    props: {
        params: Object
    },
    onLoad (options) {
        this.s_id = options.shop_id;
    },
    methods: {
        jumpCombo(title, id) {
            const that = this
            mpvue.navigateTo({
                url: `/pages/shop/item/main?shop_id=${that.s_id}&title=${title}&item_id=${id}`
            })
        },
        jumpConfirm(title, id) {
            const that = this 
            mpvue.navigateTo({
                url: `/pages/orders/confirm/main?shop_id=${that.s_id}&title=${title}&item_id=${id}`
            }) 
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/components/shop-body.scss";
</style>