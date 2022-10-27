<template>
	<view>

		<u-sticky>
			<u-tabs :list="tabList" :is-scroll="false" :current="currentTab" @change="tabChange"></u-tabs>
		</u-sticky>
		<view class="page-box">
			<view class="order" v-for="(order, index) in orderList" :key="order.oid">
				<view class="top">
					<view class="left">

						<view class="store">订单号：{{ order.oid }}</view>

					</view>
					<view v-if="'CREATED'==order.status" class="right">
						新建
					</view>
					<view v-if="'PICKING'==order.status" class="right">
						选购中
					</view>
					<view v-if="'CALC_PRICE'==order.status" class="right">
						价格计算中
					</view>
					<view v-if="'TO_PAID'==order.status" class="right">
						待支付
					</view>
					<view v-if="'PAID'==order.status" class="right">
						已支付
					</view>
					<view v-if="'NO_PAY'==order.status" class="right">
						无需支付
					</view>
					<view v-if="'COMPLETE'==order.status" class="right">
						完成
					</view>
					<view v-if="'CLOSE'==order.status" class="right">
						关闭 ({{order.closeReason}})
					</view>
				</view>
				<view
					v-if="order.extInfo.orderGoodsItems!=null && order.extInfo.orderGoodsItems.filter(item => item.selected == true).length>0">
					<view class="item" v-for="(item, index) in order.extInfo.orderGoodsItems" :key="index"
						v-if="item.selected">
						<view class="left">
							<image v-if="item.tgid!=0" style="width: 60px;height: 60px;"
								:src="cosUrl+'/goods_images/'+ item.goodsImage" mode="widthFix"></image>
							<image v-if="item.tgid==0" style="width: 60px;height: 60px;" src="/static/goods.png"
								mode="widthFix"></image>
						</view>
						<view class="content">
							<view class="title u-line-2">{{ item.goodsName}}</view>
							<view class="type">
								<view class="price">
									￥{{ item.price*1.00/100}}
								</view>
								<view class="number">x{{ item.num }}</view>
							</view>
							<!--<view class="delivery-time">发货时间 {{ item.deliveryTime }}</view> -->
						</view>
						<view class="right">

						</view>

					</view>
					
					<view class="total">
						共{{ order.extInfo.goodsNum }}件商品
						合计：
						<text class="total-price">
							￥{{ order.totalAmount*1.00/100}}元
						</text>
					</view>
				</view>
				<view class="total">
					服务设备:{{ order.terminal.deviceId}}
				</view>
				<view v-if="order.payStatus" class="total">
					<view class="total">
						支付方式：{{ Object.values(order.extInfo.mainPayInfoMap).filter(payInfo=>payInfo.success == true)[0].payType}}
					</view>
					<view class="total">
						支付金额：{{ Object.values(order.extInfo.mainPayInfoMap).filter(payInfo=>payInfo.success == true)[0].amount*1.00/100}}元
					</view>
					<view class="total">
						支付时间：{{ order.payTime}}
					</view>

				</view>
				<view class="total">
					创建时间：{{ order.addTime}}
				</view>

				<view v-if="order.extInfo.review!=null&&(order.extInfo.review.extraPay||order.extInfo.review.refund)">

					<view class="total" style="color: #e5d001;">
						审核结果：<text
							v-if="order.extInfo.review.extraPay">补款{{order.extInfo.review.extraPayAmount*1.00/100}}元</text>
						<text
							v-if="order.extInfo.review.refund">退款{{order.extInfo.review.refundAmount*1.00/100}}元</text>

					</view>
					<view class="total" style="color: #e5d001;">
						审核备注：{{order.extInfo.review.reviewRemark}}
					</view>
					<view class="total" style="color: #e5d001;">
						审核执行状态：<text v-if="order.extInfo.review.success">已执行</text><text
							v-if="!order.extInfo.review.success">未执行</text>
					</view>
				</view>

				<view class="bottom">
					<view v-if="'TO_PAID'==order.status" @click="createOrderPayRequest($event,order,'main')"
						class="logistics btn">支付</view>
					<view v-if="order.needExtraPay" @click="createOrderPayRequest($event,order,'review')"
						class="logistics btn">补款支付</view>
					<!-- <view v-if="'PAID'==order.status" class="exchange btn">申请售后</view> -->
				</view>
			</view>
			<uni-load-more :status="loadMoreStatus"></uni-load-more>
		</view>
	</view>
</template>

<script>
	export default {
		computed: {

		},
		data() {
			return {
				cosUrl: this.cosUrl,
				pageNo: 1,
				pageSize: 10,
				loadMoreStatus: "loading",
				totalPage: 0,
				tabList: [{
						name: '全部'
					}, {
						name: '待付款/补款',
						count: 0
					},
					/* {
										name: '售后',
										count: 0
									} */
				],
				currentTab: 0,
				orderList: [],
				afterSale: "",
				needExtraPay: ""
			}
		},
		methods: {
			tabChange(index) {
				this.currentTab = index;
				if (index == 0) {
					this.afterSale = "";
					this.needExtraPay = "";
				}
				if (index == 1) {
					this.afterSale = "";
					this.needExtraPay = "true";
				}
				if (index == 2) {
					this.afterSale = "true";
					this.needExtraPay = "";
				}
				this.pageNo = 1;
				this.loadData();
			},
			async loadData() {

				let orderPageListRes = await this.$u.api.orderPageList({
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					afterSale: this.afterSale,
					needExtraPay: this.needExtraPay
				});
				if ("000000" == orderPageListRes.code) {
					if (this.pageNo == 1) {
						this.orderList = orderPageListRes.data.records;
					} else
						this.orderList = [...this.orderList, ...orderPageListRes.data.records];
					this.totalPage = orderPageListRes.data.pages;
					this.loadMoreStatus = "more";
					if (this.pageNo < this.totalPage) {
						this.loadMoreStatus = "more";
					} else {
						this.loadMoreStatus = "noMore";
					}
				}

				this.$u.api.orderPageList({
					pageNo: 1,
					pageSize: 1,
					afterSale: "",
					needExtraPay: true
				}).then(res => {
					if ("000000" == res.code) {
						this.tabList[1].count = res.data.total;
					}
				});

				this.$u.api.orderPageList({
					pageNo: 1,
					pageSize: 1,
					afterSale: true,
					needExtraPay: ""
				}).then(res => {
					if ("000000" == res.code) {
						this.tabList[2].count = res.data.total;
					}
				});
				uni.stopPullDownRefresh();
			},

			async createOrderPayRequest(e, order, payFor) {
				// #ifdef MP-WEIXIN
				let payType = "wxpay";
				// #endif
				// #ifdef MP-ALIPAY
				let payType = "alipay";
				// #endif
				let createOrderPayResp = await this.$u.api.createOrderPayRequest({
					oid: order.oid,
					payFor: payFor,
					payType: payType
				});
				if ("000000" == createOrderPayResp.code) {
					//拉起支付界面
					if ("wxpay" == payType) {
						let that = this;
						wx.requestPayment({
							timeStamp: createOrderPayResp.data.timeStamp,
							nonceStr: createOrderPayResp.data.nonceStr,
							package: createOrderPayResp.data.package,
							signType: createOrderPayResp.data.signType,
							paySign: createOrderPayResp.data.paySign,
							success(res) {
								// 1s后触发回调
								uni.showLoading({
									title: "系统处理中"
								})
								setTimeout(() => {
									that.loadData();
									uni.hideLoading();
								}, 3000);
							},
							fail(res) {
								that.$refs.uToast.show({
									title: res.errMsg,
									type: 'error'
								});
							},
							complete(res) {
							}
						})
					} else if ("alipay" == payType) {
						my.tradePay({
							// 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
							tradeNO: createOrderPayResp.data.tradeNO,
							success: (res) => {
								if ("9000" == res.resultCode) {
									// 1s后触发回调
									uni.showLoading({
										title: "系统处理中"
									})
									setTimeout(() => {
										this.loadData();
										uni.hideLoading();
									}, 3000);
								} else {
									my.alert({
										content: JSON.stringify(res),
									});
								}
							},
							fail: (res) => {
								my.alert({
									content: JSON.stringify(res),
								});
							}
						});
					}
				}
			}
		},
		onLoad() {
			this.loadData();
		},
		onPullDownRefresh() {
			this.pageNo = 1;
			this.loadData();
		},
		onReachBottom() {
			if (this.pageNo < this.totalPage) {
				this.loadMoreStatus = "loading";
				this.pageNo++;
				this.loadData();
			} else {
				this.loadMoreStatus = "noMore";
			}
		}
	}
</script>

<style>
	/* #ifndef H5 */
	page {
		height: 100%;
		background-color: #f2f2f2;
	}

	/* #endif */
</style>

<style lang="scss" scoped>
	.order {
		width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;

		.top {
			display: flex;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;

				.store {
					margin: 0 10rpx;
					font-size: 32rpx;
					font-weight: bold;
				}
			}

			.right {
				color: $u-type-warning-dark;
			}
		}

		.item {
			display: flex;
			margin: 20rpx 0 0;

			.left {
				margin-right: 20rpx;

				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 10rpx;
				}
			}

			.content {
				.title {
					font-size: 28rpx;
					line-height: 50rpx;
				}

				.type {
					margin: 10rpx 0;
					font-size: 24rpx;
					color: $u-tips-color;
				}

				.delivery-time {
					color: #e5d001;
					font-size: 24rpx;
				}
			}

			.right {
				margin-left: 10rpx;
				padding-top: 20rpx;
				text-align: right;

				.decimal {
					font-size: 24rpx;
					margin-top: 4rpx;
				}

				.number {
					color: $u-tips-color;
					font-size: 24rpx;
				}
			}
		}

		.total {
			margin-top: 20rpx;
			text-align: right;
			font-size: 24rpx;

			.total-price {
				font-size: 32rpx;
			}
		}

		.bottom {
			display: flex;
			margin-top: 40rpx;
			padding: 0 10rpx;
			justify-content: space-between;
			align-items: center;

			.btn {
				line-height: 52rpx;
				width: 160rpx;
				border-radius: 26rpx;
				border: 2rpx solid $u-border-color;
				font-size: 26rpx;
				text-align: center;
				color: $u-type-info-dark;
			}

			.evaluate {
				color: $u-type-warning-dark;
				border-color: $u-type-warning-dark;
			}
		}
	}

	.centre {
		text-align: center;
		margin: 200rpx auto;
		font-size: 32rpx;

		image {
			width: 164rpx;
			height: 164rpx;
			border-radius: 50%;
			margin-bottom: 20rpx;
		}

		.tips {
			font-size: 24rpx;
			color: #999999;
			margin-top: 20rpx;
		}

		.btn {
			margin: 80rpx auto;
			width: 200rpx;
			border-radius: 32rpx;
			line-height: 64rpx;
			color: #ffffff;
			font-size: 26rpx;
			background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
		}
	}

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}
</style>
