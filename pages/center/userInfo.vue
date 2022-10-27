<template>
	<view>
		<uni-section title="用户信息" type="line">
			<uni-list>
				<uni-list-item title="昵称" :rightText="vuex_user.user.userName" />
				<uni-list-item title="手机号" :rightText="vuex_user.user.phone" />
				<uni-list-item title="注册时间" :rightText="vuex_user.user.addTime" />
				<!-- #ifdef MP-WEIXIN -->
				<uni-list-item title="微信openid" :rightText="vuex_user.user.wechatOpenid" />
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<uni-list-item title="支付宝userId" :rightText="vuex_user.user.alipayUserid" />
				<!-- #endif -->
			</uni-list>
		</uni-section>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>

</style>
