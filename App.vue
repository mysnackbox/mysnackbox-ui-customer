<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// if (this.$u.utils.isLogin()) {
			// 	//获取用户信息
			// 	this.$u.utils.setUserInfo();
			// 	this.$u.utils.isMerchant();
			// }
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/*每个页面公共css */
</style>
