import { http } from './service.js'

const bill = {
    // 登录
    hasBillDays(params) {
        return http.get('bill/date/has-bill-days', { params: params })
    }
}

export default bill;