import { http } from './service.js'

const account = {
    // 预登录
    preLogin(params) {
        return http.get('account/wx-pre-login', { params: params })
    },

    // 登录
    login(params) {
        return http.post('account/wxlogin', params)
    },

    // 刷新token
    refreshToken(header) {
        return http.get('account/refresh', { header: header })
    },

    // 获取用户详情
    userDetail(params) {
        return http.get('account/user', { params: params })
    },

    // 更新用户信息
    updateUser(params) {
        return http.put('account', params)
    },
}

export default account;