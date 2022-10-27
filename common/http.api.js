// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
let loginByWxUrl = '/login/loginByWx';
let loginByAlipayUrl = '/login/loginByAlipay';
let logoutUrl = '/login/logout';
let getUserInfoUrl = '/user/userInfo';
let updatePhoneUrl = '/login/updateUserInfoByWx';
let updatePhoneByAlipayUrl = '/login/updateUserInfoByAlipay';

let terminalDetailUrl = '/customer/terminal/terminalDetail';
let pageQueryGoodsUrl = '/customer/goods/pageQueryGoods';

let placeOrderUrl = '/customer/order/placeOrder';
let orderPageListUrl = '/customer/order/pageList';

let createOrderPayRequestUrl = "/customer/order/createOrderPayRequest"


// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {

	// 微信登录
	let loginByWx = (params = {}) => vm.$u.post(loginByWxUrl, params).catch(res => {
		uni.showToast({
			title: res == null ? "网络异常" : res.msg == null ? "网络异常" : res.msg,
			icon: "error",
			mask: true
		});
	});

	// 支付宝登录
	let loginByAlipay = (params = {}) => vm.$u.post(loginByAlipayUrl, params).catch(res => {
		uni.showToast({
			title: res == null ? "网络异常" : res.msg == null ? "网络异常" : res.msg,
			icon: "error",
			mask: true
		});
	});
	// 登出
	let logout = () => vm.$u.get(logoutUrl).catch(res => {
		uni.showToast({
			title: res == null ? "网络异常" : res.msg == null ? "网络异常" : res.msg,
			icon: "error",
			mask: true,
			mid: Vue.prototype.mid
		});
	});
	//获取用户信息
	let getUserInfo = (params = {}) => vm.$u.get(getUserInfoUrl, params).catch(res => {
		uni.showToast({
			title: res == null ? "网络异常" : res.msg == null ? "网络异常" : res.msg,
			icon: "error",
			mask: true,
			mid: Vue.prototype.mid
		});
	});
	//微信补全用户手机号
	let updatePhone = (params = {}) => vm.$u.post(updatePhoneUrl, params).catch(res => {
		uni.showToast({
			title: res == null ? "网络异常" : res.msg == null ? "网络异常" : res.msg,
			icon: "error",
			mask: true,
			mid: Vue.prototype.mid
		});
	});
	//支付宝补全用户手机号
	let updatePhoneByAlipay = (params = {}) => vm.$u.post(updatePhoneByAlipayUrl, params).catch(res => {
		uni.showToast({
			title: res == null ? "网络异常" : res.msg == null ? "网络异常" : res.msg,
			icon: "error",
			mask: true,
			mid: Vue.prototype.mid
		});
	});
	
	//获取设备详情
	let terminalDetail = (params = {}) => vm.$u.get(terminalDetailUrl, params, {
		'Content-Type': 'application/x-www-form-urlencoded'
	}).catch(res => {
		uni.showToast({
			title: res == null ? "网络异常" : res.msg == null ? "网络异常" : res.msg,
			icon: "error",
			mask: true
		});
	});
	
	//获取设备中的商品
	let pageQueryGoods = (params = {}) => vm.$u.get(pageQueryGoodsUrl, params, {
		'Content-Type': 'application/x-www-form-urlencoded'
	}).catch(res => {
		uni.showToast({
			title: res == null ? "网络异常" : res.msg == null ? "网络异常" : res.msg,
			icon: "error",
			mask: true
		});
	});
	
	//下单
	let placeOrder = (params = {}) => vm.$u.post(placeOrderUrl, params).catch(res => {
		uni.showToast({
			title: res == null ? "网络异常" : res.msg == null ? "网络异常" : res.msg,
			icon: "error",
			mask: true
		});
	});
	
	//订单列表
	let orderPageList = (params = {}) => vm.$u.get(orderPageListUrl, params,{
		'Content-Type': 'application/x-www-form-urlencoded'
	}).catch(res => {
		uni.showToast({
			title: res == null ? "网络异常" : res.msg == null ? "网络异常" : res.msg,
			icon: "error",
			mask: true
		});
	});
	
	//创建支付单
	let createOrderPayRequest = (params = {}) => vm.$u.post(createOrderPayRequestUrl, params).catch(res => {
		uni.showToast({
			title: res == null ? "网络异常" : res.msg == null ? "网络异常" : res.msg,
			icon: "error",
			mask: true
		});
	});



	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		loginByWx,
		loginByAlipay,
		getUserInfo,
		updatePhone,
		updatePhoneByAlipay,
		logout,
		terminalDetail,
		pageQueryGoods,
		placeOrder,
		orderPageList,
		createOrderPayRequest
	};
}

export default {
	install
}
