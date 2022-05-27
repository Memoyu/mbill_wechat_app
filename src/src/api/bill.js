import { http } from './service.js'

const bill = {

    // 获取账单详情
    billDetail(params) {
        return http.get('bill/detail', { params: params })
    },

    // 获取指定月份账单总金额
    monthTotalStat(params) {
        return http.get('bill/stat/month-total', { params: params })
    },

    // 获取日期范围内存在账单的日期
    hasBillDays(params) {
        return http.get('bill/date/has-bill-days', { params: params })
    },

    // 获取指定月份日分组分页账单
    monthBills(params) {
        return http.get('bill/month/pages', { params: params })
    },

    // 获取指定日期账单
    dayBills(params) {
        return http.get('bill/day', { params: params })
    },
}

export default bill;