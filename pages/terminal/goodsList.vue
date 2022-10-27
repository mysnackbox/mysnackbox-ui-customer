<template>
	<view>
		<u-sticky>
			<view style="background-color: #ffffff;">
				<uni-section :title="terminal.deviceId+'('+terminal.name+')设备信息'" :subTitle="terminal.location"
					type="line">
					<view>
						<u-tag style="margin-left: 10px;" v-if="terminal.online" text="在线" type="success" />
						<u-tag style="margin-left: 10px;" v-if="!terminal.online" text="离线" type="error" />
						<u-tag style="margin-left: 10px;" v-if="terminal.terminalOpened" text="营业" type="success" />
						<u-tag style="margin-left: 10px;" v-if="!terminal.terminalOpened" text="维护" type="error" />
					</view>
				</uni-section>
				<uni-notice-bar showIcon scrollable v-if="terminal.notice!=null" single :text="terminal.notice" />
			</view>
		</u-sticky>

		<u-empty v-if="(terminalGoodsList==null||terminalGoodsList.length==0)&&loadMoreStatus!='loading'" mode="list"
			text="没有添加任何商品"></u-empty>
		<view class="uni-product-list" style="margin-bottom: 50px;">

			<view class="uni-product" v-for="(product,index) in terminalGoodsList" :key="index">
				<view class="image-view">
					<image v-if="renderImage" class="uni-product-image"
						:src="cosUrl+'/goods_images/'+product.goods.goodsImage">
					</image>
				</view>
				<view class="uni-product-title">{{product.goods.goodsName}}</view>

				<view class="uni-product-price">
					<text class="uni-product-price-original">￥{{product.price*1.00/100}}</text>
					<!-- <text style="margin-left: 10px;">
						<u-tag type="primary" :text="'库存:'+product.stockNum" />
					</text> -->
					<text class="uni-product-tip">{{product.goods.specs}}</text>
				</view>
				<view class="uni-product-title title">保质期至：{{product.expireDate.replace("00:00:00", "")}}</view>

			</view>
			<uni-load-more :status="loadMoreStatus"></uni-load-more>
			<view class="goods-carts">
				<uni-goods-nav :options="options" :fill="true" :button-group="buttonGroup" @click="onClick"
					@buttonClick="placeOrder" />
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				cosUrl: this.cosUrl,
				title: 'product-list',
				terminalGoodsList: [],
				renderImage: true,
				deviceId: "",
				terminal: "",
				options: [],
				buttonGroup: [{
					text: '开门选取商品',
					backgroundColor: 'linear-gradient(90deg, #1E83FF, #0053B8)',
					color: '#fff'
				}],
				pageNo: 1,
				pageSize: 10,
				loadMoreStatus: "loading",
				totalPage: 0,
			};
		},
		methods: {
			async placeOrder() {
				// #ifdef MP-WEIXIN
				let payType = "wxpay";
				// #endif
				// #ifdef MP-ALIPAY
				let payType = "alipay";
				// #endif
				let res = await this.$u.api.placeOrder({
					deviceId: this.deviceId,
					payType: payType
				});
				if ("000000" == res.code) {
					this.$u.route({
						url: '/pages/order/order'
					})
				}
				console.log(res)
			},
			async loadData() {
				let terminal = await this.$u.api.terminalDetail({
					deviceId: this.deviceId
				});
				this.terminal = terminal.data;
				if (this.terminal == null) {
					uni.showToast({
						title: "找不到该设备",
						icon: "error"
					})
					uni.navigateBack({
						delta: 1
					})
					return;
				}
				this.$u.api.pageQueryGoods({
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					deviceId: this.deviceId
				}).then(res => {
					if (this.pageNo == 1) {
						this.terminalGoodsList = res.data.records;
					} else
						this.terminalGoodsList = [...this.terminalGoodsList, ...res.data.records];
					this.totalPage = res.data.pages;
					this.loadMoreStatus = "more";
					if (this.pageNo < this.totalPage) {
						this.loadMoreStatus = "more";
					} else {
						this.loadMoreStatus = "noMore";
					}
					uni.stopPullDownRefresh();
				});
			}
		},
		onLoad(options) {
			console.log(this.cosUrl)
			this.deviceId = options.deviceId;
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
	};
</script>

<style>
	/* product */
	page {
		background: #F8F8F8;
	}

	view {
		font-size: 28upx;
	}

	.goods-carts {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		left: var(--window-left);
		right: var(--window-right);
		/* #endif */
		bottom: 0;
	}

	.uni-product-list {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		flex-direction: row;
	}

	.uni-product {
		padding: 20upx;
		display: flex;
		flex-direction: column;
	}

	.image-view {
		height: 330upx;
		width: 330upx;
		margin: 12upx 0;
	}

	.uni-product-image {
		height: 330upx;
		width: 330upx;
	}

	.uni-product-title {
		width: 300upx;
		word-break: break-all;
		display: -webkit-box;
		overflow: hidden;
		line-height: 1.5;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.uni-product-price {
		margin-top: 10upx;
		font-size: 28upx;
		line-height: 1.5;
		position: relative;
	}

	.uni-product-price-original {
		color: #e80080;
	}

	.uni-product-price-favour {
		color: #888888;
		text-decoration: line-through;
		margin-left: 10upx;
	}

	.uni-product-tip {
		position: absolute;
		right: 10upx;
		background-color: #1E83FF;
		color: #ffffff;
		padding: 0 10upx;
		border-radius: 5upx;
	}

	.title {
		font-size: 24rpx;
	}
</style>
