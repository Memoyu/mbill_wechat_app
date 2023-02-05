
import api from "@/api/api"
import { router } from '@/router'
import { LOGIN_STATUS, ACCESS_TOKEN, REFRESH_TOKEN, LOGIN_USER } from "@/common/utils/constants"
import { IS_LOGIN, SET_TOKEN, SET_USER, INIT_BILL } from "../type"
import datetime from "@/common/utils/datetime";

const state = {
    token: uni.getStorageSync(ACCESS_TOKEN) || '', // token
    refreshToken: uni.getStorageSync(REFRESH_TOKEN) || '', // refreshToken
    defUser: {
        avatarUrl: "/static/assets/avatar.png",
        nickname: "请先登录",
    },
    user: uni.getStorageSync(LOGIN_USER) || {
        avatarUrl: "/static/assets/avatar.png",
        nickname: "请先登录",
    },
    isLogin: uni.getStorageSync(LOGIN_STATUS) || false,
}

const getters = {
    token: state => state.token,
    refreshToken: state => state.refreshToken,
    user: state => {
        let days = state.user.createTime == undefined ? 0 : datetime.getDays(state.user.createTime, datetime.getCurDateTime());
        //console.log("总天数", days);
        return { ...state.user, days }
    },
    isLogin: state => state.isLogin
}

const mutations = {
    [IS_LOGIN]: (state, isLogin) => {
        state.isLogin = isLogin
        uni.setStorageSync(LOGIN_STATUS, isLogin);
    },
    [SET_TOKEN]: (state, { token, refreshToken }) => {
        state.token = token
        state.refreshToken = refreshToken
    },
    [SET_USER]: (state, { avatarUrl, nickname }) => {
        state.user.avatarUrl = avatarUrl
        state.user.nickname = nickname
    }
}

const actions = {
    // 登录
    Login({ commit }, params) {
        return new Promise((resolve, reject) => {
            api.login(params).then(response => {
                // console.log("登陆响应", response);
                if (response.data.success) {
                    const token = response.data.result.token;
                    const user = response.data.result.user;
                    uni.setStorageSync(ACCESS_TOKEN, token.accessToken);
                    uni.setStorageSync(REFRESH_TOKEN, token.refreshToken);
                    uni.setStorageSync(LOGIN_USER, user);
                    commit(SET_TOKEN, token)
                    commit(SET_USER, user)
                    commit(IS_LOGIN, true)
                    resolve(response)
                } else {
                    resolve(response)
                }
            }).catch(error => {
                console.log(error);
                reject(error)
            })
        })
    },
    // 刷新token
    RefreshToken({ commit, state }) {
        return new Promise((resolve, reject) => {
            api.refreshToken({ "refresh-token": state.refreshToken }).then(response => {
                // console.log("刷新token响应", response);
                if (response.data.success) {
                    const token = response.data.result;
                    uni.setStorageSync(ACCESS_TOKEN, token.accessToken);
                    uni.setStorageSync(REFRESH_TOKEN, token.refreshToken);
                    commit(SET_TOKEN, token)
                    commit(IS_LOGIN, true)
                    resolve(response)
                } else {
                    // console.log("抛出去");
                    resolve(response)
                }
            }).catch(e => {
                reject(e);
            });
        })
    },
    // 更新用户信息
    UpdateUser({ commit }, user) {
        uni.setStorageSync(LOGIN_USER, user);
        commit(SET_USER, user)
    },
    // 登出
    Logout({ commit }) {
        commit(SET_TOKEN, {})
        uni.removeStorageSync(ACCESS_TOKEN)
        uni.removeStorageSync(REFRESH_TOKEN)
        uni.removeStorageSync(LOGIN_USER)
        commit(SET_USER, state.defUser)
        commit(SET_TOKEN, {})
        commit(IS_LOGIN, false)

        // 初始化账单数据
        commit(INIT_BILL)
        router.replaceAll({ name: "login" });
    },

}

export default {
    state,
    mutations,
    actions,
    getters
}
