<template>
	<div class="pay-wrapper">
		<div class="order-details">
			<div class="time">
				<span>剩余支付时间</span>
				<!-- <yd-countdown :time="createOrderReturn.deadlinetime"
				 timetype="timestamp"
				 format="{%m}分{%s}秒"
				 :callback='closePay'>
				</yd-countdown> -->
			</div>
			<div class="price">{{createOrderReturn.actual}}</div>
			<div class="details"
			 v-if="createOrderReturn.order_name">
				{{createOrderReturn.order_name}}
			</div>
		</div>
	</div>
</template>

<script>
import { apiOrderPay, apiPayStatus } from "@/api/api";
export default {
    created() {
        // console.log("logs");
    }
};
</script>
