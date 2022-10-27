<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<!-- #ifdef MP-WEIXIN -->
			<u-button class="login-btn" type="primary" @click="getUserInfo">
				微信一键登录
			</u-button>
			<!-- #endif -->
			<!-- #ifdef MP-ALIPAY -->

			<!-- <button style="padding-left: 10px;padding-right: 10px;" type="primary" open-type="getAuthorize" scope="userInfo"
				@getAuthorize="onGetAuthorize" @error="onAuthError">
				支付宝一键登录
			</button> -->

			<button size="default" style="padding-left: 10px;padding-right: 10px;" type="primary" @click="getAuthCode">
				支付宝一键登录
			</button>

			<!-- #endif -->

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onShow() {
			uni.hideHomeButton();

		},
		onLoad() {

		},
		onReady() {
			
		},
		methods: {
			//获取用户信息
			async getUserInfo() {
				// 展示加载框
				uni.showLoading({
					title: '加载中',
				});
				uni.getUserProfile({
					desc: '使用微信一键授权',
					success: async (obj) => {
						const nickName = obj.userInfo.nickName;
						const avatarUrl = obj.userInfo.avatarUrl;
						// 调用 action ，请求登录接口
						uni.login({
							provider: 'weixin',
							success: async (res) => {
								if (res.errMsg == 'login:ok') {
									let loginRes = await this.$u.api.loginByWx({
										code: res.code,
										userName: nickName,
										avatarUrl: avatarUrl,
										userType: "CUSTOMER"
									});
									if ("000000" == loginRes.code) {
										uni.showToast({
											title: '登录成功',
											icon: 'success',
											mask: false,
										});
										this.$u.vuex('vuex_token', loginRes.data.token);
										if (!await this.$u.utils.setUserInfo()) return;
										setTimeout(() => {
											// 回源跳转
											const url = uni.getStorageSync(
													"currentRoute") ||
												"/pages/index/index";
											this.$u.route({
												type: "reLaunch",
												url: url
											})
										}, 500)
									} else {
										uni.showToast({
											title: loginRes.msg,
											icon: 'error',
											mask: false,
										})
									}
								}
							},
						});
					},
					fail: () => {
						uni.showToast({
							title: '授权已取消',
							icon: 'error',
							mask: true,
						});
					},
					complete: () => {
						// 隐藏loading
						uni.hideLoading();
					},
				});
			},

			//支付宝小程序授权
			getAuthCode() {
				my.getAuthCode({
					scopes: 'auth_user',
					success: async ({
						authCode
					}) => {
						let loginRes = await this.$u.api.loginByAlipay({
							authCode: authCode,
							userType: "CUSTOMER"
						});
						if ("000000" == loginRes.code) {
							uni.showToast({
								title: '登录成功',
								icon: 'success',
								mask: false,
							});
							this.$u.vuex('vuex_token', loginRes.data.token);
							if (!await this.$u.utils.setUserInfo()) return;
							setTimeout(() => {
								// 回源跳转
								const url = uni.getStorageSync(
										"currentRoute") ||
									"/pages/index/index";
								this.$u.route({
									type: "reLaunch",
									url: url
								})
							}, 500)
						} else {
							uni.showToast({
								title: loginRes.msg,
								icon: 'error',
								mask: false,
							})
						}

					},
				});
			},


		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
	}

	.logo {
		height: 400rpx;
		width: 400rpx;
		margin-top: 100rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 28rpx;
		color: $u-content-color;
	}

	.link-demo {
		margin-top: 80rpx;
	}
</style>
