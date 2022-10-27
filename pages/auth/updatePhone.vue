<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<!-- #ifdef MP-ALIPAY -->
			<button style="padding-left: 10px;padding-right: 10px;" type="primary" class="login-btn"
				open-type="getAuthorize" scope='phoneNumber' @getAuthorize="getPhoneNumberByAliPay"
				error="getPhoneErrorByAliPay">
				获取手机号码
			</button>

			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<u-button class="login-btn" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
				获取手机号码
			</u-button>
			<!-- #endif -->

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onShow() {
			uni.hideHomeButton();

		},
		methods: {
			async getPhoneNumber(e) {
				console.log("获取手机号码", e)
				if (e.detail.errMsg !== 'getPhoneNumber:ok') {
					this.$u.toast("拒绝手机号登录");
					return;
				}
				let res = await this.$u.api.updatePhone({
					encrypdata: e.detail.encryptedData,
					ivdata: e.detail.iv
				});
				this.$u.toast(res.msg);
				if ("000000" == res.code) {
					if (!await this.$u.utils.setUserInfo()) return;
					setTimeout(() => {
						// 回源跳转
						const url = uni.getStorageSync("currentRoute") || "/pages/index/index"
						this.$u.route({
							type: "reLaunch",
							url: url
						})
					}, 500)
				}
			},

			getPhoneNumberByAliPay() {
				uni.getPhoneNumber({
					success: async (res) => {
						console.log(res)
						let encryptedData = res.response;
						let res2 = await this.$u.api.updatePhoneByAlipay({
							encryptedData: encryptedData
						});
						
						this.$u.toast(res2.msg);
						if ("000000" == res2.code) {
							if (!await this.$u.utils.setUserInfo()) return;
							setTimeout(() => {
								// 回源跳转
								const url = uni.getStorageSync("currentRoute") || "/pages/index/index"
								this.$u.route({
									type: "reLaunch",
									url: url
								})
							}, 500)
						}
						
					},
					fail: (res) => {
						uni.showToast({
							title: "授权手机号码失败"
						});
					},
				});
			},
			getPhoneErrorByAliPay() {
				uni.showToast({
					title: "取消手机号码授权"
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
