const install = (Vue, vm) => {

	// 是否登录
	const isLogin = () => {
		const token = vm.vuex_token
		// 没有token，跳转登录页面
		if (!token) {
			uni.showToast({
				title: "请先登入",
				icon: "error",
				mask: true
			})
			setTimeout(() => {
				// 跳转登录页
				vm.$u.route({
					type: "reLaunch",
					url: '/pages/auth/login'
				})
			}, 500)
			return false
		}
		return true
	}

	
	/**
	 * 登出
	 */
	const logout = () => {
		vm.$u.vuex("vuex_token", null);
		vm.$u.vuex("vuex_user", null);
		vm.$u.api.logout();
		setTimeout(() => {
			// 跳转登录页
			vm.$u.route({
				type: "reLaunch",
				url: '/pages/auth/login'
			})
		}, 2500)
	}

	// 更新用户信息
	const setUserInfo = async () => {
		// 更新vuex用户信息
		const userInfo = await vm.$u.api.getUserInfo()
		if (userInfo && userInfo.data != null) {
			vm.$u.vuex('vuex_user', userInfo.data)
			return true;
		}
		return false;
	}

	vm.$u.utils = {
		isLogin,
		setUserInfo,
		logout,

	}
}

export default {
	install
}
