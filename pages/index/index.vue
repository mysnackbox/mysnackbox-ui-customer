<template>
	<view class="content u-flex">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">
				扫码开门，关门自动结算，智能AI售货柜
			</text>
		</view>
		<view style="margin-top: 50px;">
			<u-button type="primary" size="default" :ripple="true" shape="square" @click="loadGoodsScan">扫码开门</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',

			}
		},
		onLoad(options) {
			console.log(options)
			let qrUrl = options.query.qrCode;
			let deviceId = qrUrl.substring(qrUrl.indexOf("deviceId=") + "deviceId=".length)
			console.log(options)
			if (6 != deviceId.length) {
				this.$refs.uToast.show({
					title: '无效的设备ID',
					type: 'warning'
				})
				return;
			}
			this.$u.route({
				url: '/pages/terminal/goodsList',
				params: {
					deviceId: deviceId
				}
			})
		},
		methods: {
			loadGoodsScan() {
				// 只允许通过相机扫码
				let that = this;
				uni.scanCode({
					success: async function(res) {
						console.log(res)
						let deviceId = res.result.substring(res.result.indexOf("deviceId=") + "deviceId=".length)
						console.log(deviceId)
						if (deviceId.length != 6) {
							that.$refs.uToast.show({
								title: '无效的设备ID',
								type: 'warning'
							})
							return;
						}
						that.$u.route({
							url: '/pages/terminal/goodsList',
							params: {
								deviceId: deviceId
							}
						})
					}
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

	.button-demo {
		margin-top: 80rpx;
	}

	.link-demo {
		margin-top: 80rpx;
	}
</style>
