// 这里的vm，就是我们在vue文件里面的this，所以我们能在这里获取vuex的变量，比如存放在里面的token变量
const install = (Vue, vm) => {
	// 此为自定义配置参数，具体参数见上方说明
	Vue.prototype.$u.http.setConfig({
		baseUrl: Vue.prototype.serverUrl,
		loadingText: '努力加载中~',
		loadingTime: 300,
		loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
		// ......
	});
	
	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {
		config.header.Token = vm.vuex_token;
		config.header.mid = Vue.prototype.mid;
		return config;
	}
	
	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		console.log(res)
		if(res.code == "000000") {
			return res;
		} else if(res.code == "100001") {
			//没有登录
			vm.$u.toast(res.msg);
			setTimeout(() => {
				vm.$u.route({
					type:"reLaunch",
					url:"/pages/auth/login"
				})
			}, 500)
			return false;
		} else if(res.code == "100003"){
			//需要补全手机号码
			vm.$u.toast(res.msg);
			setTimeout(() => {
				vm.$u.route({
					type:"reLaunch",
					url:"/pages/auth/updatePhone"
				})
			}, 500)
			return false;
		} else {
			vm.$u.toast(res.msg);
			return res;
		}
	}
}

export default {
	install
}