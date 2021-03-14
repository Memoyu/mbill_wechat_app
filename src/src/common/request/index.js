import Request from './request'
import apiList from './mbill'
import store from '@/common/store/index.js'

export default function api(url, data = {}, showToast = true) {
	const request = new Request();
	let api = getApiObj(url);
	request.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
        let tempToken = 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9naXZlbm5hbWUiOiLotoXnuqfnrqHnkIblkZgiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5pc3RyYXRvciIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluaXN0cmF0b3IiLCJDb3JlQ2xhaW1UeXBlcy5Sb2xlcyI6IjEiLCJuYmYiOjE2MTU3Mzc0MjYsImV4cCI6MTYxNTgyMzgyNiwiaXNzIjoiTWVtb3l1IiwiYXVkIjoiTWVtb3l1Lk1iaWxsLldlYkFwaSJ9.c4B9KLl8kZ6RWQZhl68UHQ2f8PfSLxq-RkiVdfPB9tV0XGm4xbpHmF-nYTyMspb0L7YZXbmLMiLmkfqvxUh2uQ'
		if (api.auth) {
			let token = tempToken;//uni.getStorageSync('token');
			if (!token) {
				//store.commit('LOGIN_TIP', true)
				//store.commit('OUT_LOGIN');
				throw ('暂未登录,已阻止此次API请求~');
			}
		}
		//if (uni.getStorageSync('token')) {
			config.header.Authorization = tempToken; //uni.getStorageSync('token');
		//}
		return config
	});

	request.interceptor.response((response) => { /* 请求之后拦截器 */
		if (response.data.code === 1) { // 服务端返回的状态码不等于200，则reject()
			if (showToast) {
				uni.showToast({
					title: response.data.msg || '请求出错,稍后重试',
					icon: 'none',
					duration: 1000,
					mask: true
				});
			}

		}

		if (response.data.code === 401) { // 服务端返回的状态码不等于200，则reject()
			uni.removeStorageSync('token');
			//store.commit('LOGIN_TIP', true)
		}
		// if (response.config.custom.verification) { // 演示自定义参数的作用
		//   return response.data
		// }
		return response
	}, (response) => { // 预留可以日志上报
		return response
	})

	return request.request({
		url: api.url,
		data,
		method: api.method
	})

}

function getApiObj(url) {
	let apiArray = url.split(".");
	let api = apiList;
	apiArray.forEach(v => {
		api = api[v];
	});
	return api;
}