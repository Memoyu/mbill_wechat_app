
import api from "@/api/api.js"
import { IS_LOGIN, USER_INFO } from "../type.js"

const state = {
    isLogin: uni.getStorageSync("isLogin") || false, // 是否登陆
}

const getters = {
    isLogin: state => state.isLogin,
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, { username, realname, welcome }) => {
        state.username = username
        state.realname = realname
        state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    // 登录态
    [IS_LOGIN](state, data) {
        state.isLogin = data;
        uni.setStorageSync('isLogin', data);
    },
}

const actions = {
    // 登录
    Login({ commit }, userInfo) {
        return new Promise((resolve, reject) => {
            api.login(userInfo).then(response => {
                if (response.data.code == 200) {
                    const result = response.data.result
                    const userInfo = result.userInfo
                    uni.setStorageSync(ACCESS_TOKEN, result.token);
                    uni.setStorageSync(USER_INFO, userInfo);
                    commit('SET_TOKEN', result.token)
                    commit('SET_AVATAR', userInfo.avatar)
                    commit('SET_NAME', { username: userInfo.username, realname: userInfo.realname })
                    resolve(response)
                } else {
                    resolve(response)
                }
            }).catch(error => {
                console.log("catch===>response", response)
                reject(error)
            })
        })
    },
    // 登出
    Logout({ commit, state }) {
        return new Promise((resolve) => {
            let logoutToken = state.token;
            commit('SET_TOKEN', '')
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
