
import api from "@/api/api"
import { ACCESS_TOKEN, LOGIN_USER } from "@/common/utils/constants"
import { SET_TOKEN, SET_USER } from "../type"

const state = {
    isLogin: uni.getStorageSync(ACCESS_TOKEN) || false, // 是否登陆
    token: '',
    refreshToken: '',
    user: {},
}

const getters = {
    isLogin: state => state.isLogin,
    token: state => state.token,
    refreshToken: state => state.refreshToken,
    user: state => state.user,
}

const mutations = {
    [SET_TOKEN]: (state, { token, refreshToken }) => {
        state.token = token
        state.refreshToken = refreshToken
    },
    [SET_USER]: (state, { avatar, nickname, lastLoginTime }) => {
        state.user.avatar = avatar
        state.user.nickname = nickname
        state.user.lastLoginTime = lastLoginTime
    }
}

const actions = {
    // 登录
    Login({ commit }, params) {
        return new Promise((resolve, reject) => {
            api.login(params).then(response => {
                console.log("登陆响应", response);
                if (response.data.success) {
                    const token = response.data.result.token;
                    const user = response.data.result.user;
                    uni.setStorageSync(ACCESS_TOKEN, token.accessToken);
                    uni.setStorageSync(LOGIN_USER, user);
                    commit(SET_TOKEN, token)
                    commit(SET_USER, user)
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
    // 登出
    Logout({ commit, state }) {
        return new Promise((resolve) => {
            let logoutToken = state.token;
            commit(SET_TOKEN, '')
            uni.removeStorageSync(ACCESS_TOKEN)
            api.logout(logoutToken).then(() => {
                resolve()
            }).catch(() => {
                resolve()
            })
        })
    },

}

export default {
    state,
    mutations,
    actions,
    getters
}
