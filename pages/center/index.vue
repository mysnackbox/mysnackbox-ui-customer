<template>
	<view>
		<view class="u-flex user-box u-p-30">
			<view class="u-m-r-10 avatar" @tap="previewImage">
				<!-- #ifdef MP-WEIXIN -->
				<u-avatar :src="vuex_user.user.extInfo.wechatInfo.avatarUrl" size="140"></u-avatar>
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<u-avatar :src="vuex_user.user.extInfo.alipayInfo.avatar" size="140"></u-avatar>
				<!-- #endif -->
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{userInfo.user.userName}}</view>
				<view class="u-font-14 u-tips-color" v-if="userInfo.user.phone!=null">
					<text>{{userInfo.user.phone}}</text>
				</view>
			</view>

		</view>
		<u-cell-group title="订单">
			<u-cell-item icon="order" title="订单列表" @click="jump('/pages/order/order')"></u-cell-item>
		</u-cell-group>

		<u-cell-group title="账户">
			<u-cell-item icon="info" title="账户信息" @click="jump('/pages/center/userInfo')"></u-cell-item>
		</u-cell-group>
		<u-cell-group title="联系我们">
			<!-- #ifdef MP-WEIXIN -->
			<u-cell-item title="在线客服">
				<contact-button type="default-dark" size="100"></contact-button>
			</u-cell-item>
			<!-- #endif -->


			<!-- #ifdef MP-ALIPAY -->
			<u-cell-item title="在线客服" open-type="contact" :alipay-card-no="vuex_user.user.alipayUserid">
				<contact-button tnt-inst-id="aO1_Aofh" scene="SCE01226508"
					:alipay-card-no="vuex_user.user.alipayUserid" />
			</u-cell-item>
			<!-- #endif -->


		</u-cell-group>
		<view style="margin: 20rpx;">
			<u-button type="error" :ripple="true" shape="square" @click="showLoginout">退出登录</u-button>
		</view>
		<!-- 退出登录模态框 -->
		<u-modal v-model="isShowLoginout" content="确定退出登录吗？" :show-cancel-button="true" @confirm="loginOut"
			@cancel="showLoginout"></u-modal>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShowLoginout: false,
				userInfo: {}
			}
		},
		onLoad() {
			// 判断是否处于登录状态、如果未登录跳转登录页
			this.$u.utils.isLogin();
			// 如果已经登录，拿取信息
			this.userInfo = this.vuex_user
		},
		methods: {
			// 图像预览
			previewImage() {
				uni.previewImage({
					urls: [this.userInfo.user.extInfo.wechatInfo.avatarUrl]
				})
			},
			// 页面跳转
			jump(path) {
				this.$u.route(path)
			},

			// 出现模态框
			showLoginout() {
				this.isShowLoginout = !this.isShowLoginout
			},
			// 确定退出登录
			async loginOut() {
				// 请求api
				await this.$u.utils.logout()
				uni.showToast({
					title: "退出成功！"
				})

			},
			terminalList() {
				this.jump("/pages/terminal/terminalList")
			},
			bindTerminal() {
				this.jump("/pages/terminal/bindTerminal")
			},
			goodsList() {
				this.jump("/pages/goods/goodsList")
			},
			addGoods() {
				this.jump("/pages/goods/addGoods")
			},
			loadGoodsScan() {
				// 只允许通过相机扫码
				let that = this;
				uni.scanCode({
					success: async function(res) {
						console.log(res)
						if (res.result.length != 10) {
							that.$refs.uToast.show({
								title: '无效的设备ID',
								type: 'warning'
							})
							return;
						}
						//跳转到商品列表
						let res2 = await that.$u.api.terminalDetail({
							deviceId: res.result
						});
						if ("000000" == res2.code) {
							try {
								uni.setStorageSync('terminal_to_manage', res2.data);
							} catch (e) {
								// error
							}
							that.$u.route({
								url: '/pages/terminal/goodsList'
							})
						}

					}
				});
			},

		}
	}
</script>

<style scoped lang="scss">
	page {
		background-color: #ededed;
	}

	.avatar {}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
	}

	.share-img {
		width: 96rpx;
		height: 96rpx;
		margin-bottom: 10rpx;
		background: none;
	}

	.share-img-button {
		position: absolute;
		top: 0rpx;
		width: 96rpx;
		height: 96rpx;
		background: none;
		border: none;
	}
</style>
