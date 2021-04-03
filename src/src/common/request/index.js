import Request from './request'
import apiList from './mbill'
import store from '@/common/store/index'
import Tip from '@/common/utils/tip'

/**
 * 
 * @param {String} url 地址
 * @param {Object} data Body
 * @param {Object} params Query
 * @param {Boolean} showToast 显示清求错误提示
 * @returns 
 */
export default function api(url, data = {}, params = {}, loading = true, showToast = true) {
	const request = new Request();
	let api = getApiObj(url);
	request.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
		if (api.auth) {
			let token = uni.getStorageSync('token');
			if (!token) {
				store.commit('LOGIN_TIP', true)
				store.commit('OUT_LOGIN');

				throw ({errMsg: '暂未登录，请先登陆后再操作~'});
			}
		}
		if (uni.getStorageSync('token')) {
			config.header.Authorization = "Bearer " + uni.getStorageSync('token');
		}
		return config
	});

	request.interceptor.response((response) => { /* 请求之后拦截器 */
		var code = response.data.code;
		if (code === 10000 || code === 10040 || code === 10050) { // 授权失败则登陆，则reject()
			uni.removeStorageSync('token');
			store.commit('LOGIN_TIP', true)
			// store.dispatch('goToLogin');//******不应该跳转登陆界面，如果两个请求同时发起，这会跳转多次！！！*******
		}
		// if (response.config.custom.verification) { // 演示自定义参数的作用
		//   return response.data
		// }
		return response
	}, (response) => { // 预留可以日志上报
		return response
	})

	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: "加载中...",
			duration: 30000,
			mask: true
		});
		request.request({
			url: api.url,
			data,
			params,
			method: api.method
		}).then(res => {
			uni.hideLoading();
			if (res.code !== 0) { // 服务端返回的状态码不等于0，则reject()
				if (showToast) {
					Tip.toast(res.message || '请求出错,稍后重试', 3000);
				}
			}
			resolve(res);
		}).catch(err => {
			uni.hideLoading();
			if (showToast) {
				if(err.errMsg === undefined) {
					err.errMsg = "请求异常，请联系管理员！"
				} else if(err.errMsg !== undefined && err.errMsg == "request:fail "){
					err.errMsg = "请求异常，请检查您的网络情况！"
				}
				Tip.toast(err.errMsg, 3000)
			}
			reject(err);
		});
	});
}

function getApiObj(url) {
	let apiArray = url.split(".");
	let api = apiList;
	apiArray.forEach(v => {
		api = api[v];
	});
	return api;
}