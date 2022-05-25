import { http } from './service.js'

const bill = {
    // 获取日期范围内存在账单的日期
    hasBillDays(params) {
        return http.get('bill/date/has-bill-days', { params: params })
    },

    // 获取指定月份账单总金额
    monthTotalStat(params) {
        return http.get('bill/stat/month-total', { params: params })
    }
}

export default bill;