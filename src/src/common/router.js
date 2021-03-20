import Vue from 'vue'
import {createRouter} from 'uni-simple-router'
import store from '@/common/store'

//初始化
const router = createRouter({
	APP: {
		holdTabbar: false,
		rewriteFun: false,
		animation: {
			animationType: 'pop-in',
			animationDuration: 300
		}
	},
	encodeURI: false,
	platform: process.env.VUE_APP_PLATFORM,
	detectBeforeLock: ()=>{ router.$lockStatus=false; },
	routes: ROUTES //路由表
});

//全局路由前置守卫
router.beforeEach((to, from, next) => {
	// console.log("全局路由前置守卫")
	// 有两个个判断条件,一个是token,还有一个路由元信息
	let token = uni.getStorageSync('token');
	let existToken = Boolean(token);
	// 权限控制登录
	if (to.meta && to.meta.auth && !existToken) {
		store.commit('LOGIN_TIP', true)
		store.dispatch('goToLogin');
	} else {	
		next()
	}

})

export default router;