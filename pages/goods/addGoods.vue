<template>
	<view class="wrap">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item :label-position="labelPosition" label="设备ID" prop="deviceId" label-width="150">
				<u-input :border="border" placeholder="请输入设备id" v-model="model.deviceId" type="text"></u-input>
				<u-button slot="right" type="success" size="mini" @click="getCode">扫码输入</u-button>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="商品图片" prop="mainPic" label-width="150">
				<u-upload :auto-upload="false" max-count=1 width="160" height="160"></u-upload>
			</u-form-item>

		</u-form>
		<u-button @click="submit" type="primary">提交</u-button>

		<u-toast ref="uToast" />

	</view>
</template>

<script>
	export default {
		data() {
			let that = this;
			return {
				model: {
					deviceId: '',
					goodsName:'',
					brandName:'',
					specs:'',
					packageType:'',
					unit:'',
					categoryName:'',
					mainPic:null
				},
				rules: {
					deviceId: [{
							required: true,
							message: '请输入设备ID',
							trigger: 'blur',
						},
						{
							min: 10,
							max: 10,
							message: '设备id为10位的字符串',
							trigger: ['change','blur'],
						},
					]
				},
				errorType: ['message'],
				labelPosition: 'left',
				border: false,
			};
		},
		onLoad() {

		},
		computed: {
			borderCurrent() {
				return this.border ? 0 : 1;
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						let res = await this.$u.api.addGoods(this.model);
						if ("000000" == res.code) {
							this.$refs.uToast.show({
								title: '新设备绑定成功',
								type: 'success',
								url: '/pages/terminal/terminalList'
							})
						}
					} else {
						console.log('验证失败');
					}
				});
			},
			// 获取验证码
			getCode() {
				var that = this;
				// 允许从相机和相册扫码
				uni.scanCode({
					success: function(res) {
						that.model.deviceId=res.result;
					}
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	.wrap {
		padding: 30rpx;
	}

	.agreement {
		display: flex;
		align-items: center;
		margin: 40rpx 0;

		.agreement-text {
			padding-left: 8rpx;
			color: $u-tips-color;
		}
	}
</style>
