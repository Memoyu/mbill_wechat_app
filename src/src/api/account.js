import { http } from './service.js'

const account = {
    // 登录
    login(params) {
        return http.post('account/wxlogin', params)
    }
}

export default account;