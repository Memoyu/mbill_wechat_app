import { http } from './service.js'

const preOrder = {

    // 新增预购分组

    addPreOrderGroup(params) {
        return http.post('pre-order/group', params)
    },

    // 获取指定月份日分组分页账单
    monthPreOrderGroups(params) {
        return http.get('pre-order/group/month/pages', { params: params })
    },

    // 获取指定分组预购清单统计
    groupPreOrderStat(params) {
        return http.get('pre-order/group/order/stat', { params: params })
    },

    //#endregion

    // 新增预购

    // 新增预购

    addPreOrder(params) {
        return http.post('pre-order', params)
    },

    // 编辑预购
    editPreOrder(params) {
        return http.put('pre-order', params)
    },

    // 获取指定分组分页预购
    groupPreOrders(params) {
        return http.get('pre-order/pages', { params: params })
    },

    //#endregion

}

export default preOrder;