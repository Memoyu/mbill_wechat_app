import api from '@/common/request/index'
import store from '@/common/store'
import router from '@/common/router.js'
import tools from '@/common/utils/tools'
import {
	USER_INFO,
	LOGIN_TIP,
    OUT_LOGIN
} from '../types.js'

const state = {
    userInfo: uni.getStorageSync('userInfo') ? uni.getStorageSync('userInfo') : {},
    loginTip: false,
}

const actions = {
    //设置token并返回上次页面
    setTokenAndBack({
        commit
    }, token) {
        uni.setStorageSync('token', token);
        store.dispatch('getUserInfo');
        let fromLogin = uni.getStorageSync('fromLogin');//获取缓存的登录前的路由
        if (fromLogin) {
            tools.routerTo(fromLogin.path, fromLogin.query, true);
            uni.removeStorageSync('fromLogin')
        } else {
            //默认跳转首页S
            router.replaceAll('/pages/bill/index')
        }
    },
    // 获取用户信息
    getUserInfo({
        commit
    }) {
        return new Promise((resolve, reject) => {
            api('user.info').then(res => {
                commit('LOGIN_TIP', false);
                commit('USER_INFO', res.result);
                uni.setStorageSync('userInfo', res.result);
                resolve(res)

            }).catch(e => {
                reject(e)
            })
        })
    },
}

const mutations = {
    [USER_INFO](state, data) {
		state.userInfo = data
	},
	[LOGIN_TIP](state, data) {
		state.showLoginTip = data
	},
	[OUT_LOGIN](state, data) {
		uni.removeStorageSync('token');
		uni.removeStorageSync('userInfo');
		store.commit('USER_INFO', {});
	},
}


export default {
	state,
	mutations,
	actions
}
