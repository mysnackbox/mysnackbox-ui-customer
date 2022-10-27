<template>
	<view>
		<u-sticky>
			<!-- 只能有一个根元素 -->
			<view class="sticky u-margin-10" style="background-color: white;">
				<u-search placeholder="输入商品名称模糊搜索" v-model="goodsNameKeyword" action-text="搜索" :animation="true"
					@search="search" @custom="search"></u-search>
			</view>
		</u-sticky>

		<scroll-view>

			<uni-list>

				<uni-list-item v-for="goods in goodsList" :key="goods.gid" :title="goods.goodsName"
					:note="'条码:'+goods.barCode" showArrow clickable @click="goodsListItemClick($event,goods)">
					<template v-slot:header>
						<view class="slot-box">
							<image style="width: 200upx; height: 200upx;" mode="widthFix"
								:src="Vue.prototype.serverUrl+'/goods_images/'+goods.goodsImage">
							</image>

						</view>
					</template>

					<!-- 自定义 body -->
					<!-- <template v-slot:body>
							<view class="uni-list-item__content">
								<text class="uni-list-item__content-title">{{goods.goodsName}}</text>
								
							</view>
						</template> -->

					<!-- 自定义 footer-->
					<template v-slot:footer>
						<view class="u-margin-bottom-10">
							<u-tag v-if="goods.categoryName!=null" :text="'分类:'+goods.categoryName" type="info" />
						</view>

						<view class="u-margin-bottom-10">
							<u-tag v-if="goods.specs!=null" :text="'规格:'+goods.specs" type="info" />
						</view>

						<view class="u-margin-bottom-10">
							<u-tag v-if="goods.packageType!=null" :text="'包装:'+goods.packageType" type="info" />
						</view>

						<view class="u-margin-bottom-10">
							<u-tag v-if="goods.suggestPrice!=null" :text="'零售价:'+(goods.suggestPrice*1.0/100)+'元'"
								type="info" />
						</view>

						<view>
							<u-tag type="info" v-if="goods.brandName" :text="'品牌:'+goods.brandName"></u-tag>
						</view>

					</template>
				</uni-list-item>

			</uni-list>


			<uni-load-more :status="loadMoreStatus"></uni-load-more>
		</scroll-view>
		<u-action-sheet :list="actionList" v-model="actionSheetShow" @click="actionSheetClick"></u-action-sheet>
		<u-modal v-model="modelShow" title="选择目标设备" @confirm="selectTerminalConfirm" :show-cancel-button="true"
			:show-confirm-button="false">
			<view class="slot-content">
				<scroll-view style="height: 400upx" scroll-y="true">
					<u-empty v-if="terminalList==null||terminalList.length==0" mode="list"></u-empty>
					<uni-list>
						<uni-list-item v-for="terminal in terminalList" :key="terminal.deviceId"
							:title="terminal.deviceId+'('+terminal.name+')'" :note="terminal.location" showArrow
							clickable @click="terminalListItemClick($event,terminal)">
						</uni-list-item>
					</uni-list>
				</scroll-view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsList: [],
				pageNo: 1,
				pageSize: 10,
				loadMoreStatus: "loading",
				totalPage: 0,
				goodsNameKeyword: '',
				actionList: [{
					text: '添加到',
					subText: '将该商品添加到指定的设备中'
				}],
				actionSheetShow: false,
				modelShow: false,
				terminalList: [],
				actionSheetGoods: {},
				useCacheTerminal: false,
			}
		},
		mounted() {
			this.getData();
		},
		methods: {
			getData() {
				this.$u.api.goodsList({
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					goodsName: this.goodsNameKeyword
				}).then(res => {
					if (this.pageNo == 1) {
						this.goodsList = res.data.records;
						uni.stopPullDownRefresh();
					} else
						this.goodsList = [...this.goodsList, ...res.data.records];
					this.totalPage = res.data.pages;
					this.loadMoreStatus = "more";
					if (this.pageNo < this.totalPage) {
						this.loadMoreStatus = "more";
					} else {
						this.loadMoreStatus = "noMore";
					}
				});
			},
			search(keyword) {
				this.goodsNameKeyword = keyword;
				this.pageNo = 1;
				this.getData();
			},
			async actionSheetClick(index) {
				if (index == 0) {
					//上架商品
					this.terminalList = [];
					this.modelShow = true;
					let res = await this.$u.api.terminalList({
						pageNo: 1,
						pageSize: 99999999
					});
					this.terminalList = res.data.records;
				}
			},
			goodsListItemClick(e, goods) {
				this.actionSheetGoods = goods;
				if (this.useCacheTerminal) {
					//直接跳转到编辑商品页面
					let terminal = uni.getStorageSync('terminal_to_manage');
					this.terminalListItemClick({},terminal)
				} else {
					this.actionSheetShow = true;
				}

			},
			terminalListItemClick(e, terminal) {
				this.modelShow = false;
				try {
					uni.setStorageSync('terminal_to_manage', terminal);
					uni.setStorageSync('goods_to_manage', this.actionSheetGoods);
				} catch (e) {
					// error
				}
				this.$u.route({
					url: '/pages/terminal/addGoods'
				})
			}
		},
		onReachBottom() {
			console.log("onReachBottom")
			if (this.pageNo < this.totalPage) {
				this.loadMoreStatus = "loading";
				this.pageNo++;
				this.getData();
			} else {
				this.loadMoreStatus = "noMore";
			}
		},
		onPullDownRefresh() {
			this.pageNo = 1;
			this.getData();
		},
		onLoad(option) {
			if (option.useCacheTerminal) {
				this.useCacheTerminal = true;
			}
		}
	}
</script>

<style>
	.chat-custom-right {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;
	}

	.chat-custom-text {
		font-size: 12px;
		color: #999;
	}
</style>
