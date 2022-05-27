import { http } from './service.js'

const account = {
    // 登录
    login(params) {
        return http.post('account/wxlogin', params)
    },
    // 刷新token
    refreshToken(header) {
        return http.get('account/refresh', { header: header })
    }
}

export default account;