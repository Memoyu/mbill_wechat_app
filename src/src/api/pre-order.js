import { http } from './service.js'

const preOrder = {

    //#region 预购分组

    // 新增预购分组
    addPreOrderGroup(params) {
        return http.post('pre-order/group', params)
    },

    // 编辑预购分组
    editPreOrderGroup(params) {
        return http.put('pre-order/group', params)
    },

    // 新增预购分组
    delPreOrderGroup(params) {
        return http.delete('pre-order/group', params)
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

    //#region 预购

    // 新增预购
    addPreOrder(params) {
        return http.post('pre-order', params)
    },

    // 编辑预购
    editPreOrder(params) {
        return http.put('pre-order', params)
    },

    // 编辑预购状态
    editPreOrderStatus(params) {
        return http.put('pre-order/status', params)
    },

    // 编辑预购状态
    delPreOrder(params) {
        return http.delete('pre-order', params)
    },

    // 获取预购信息
    getPreOrder(params) {
        return http.get('pre-order', { params: params })
    },

    // 获取指定分组分页预购
    groupPreOrders(params) {
        return http.get('pre-order/pages', { params: params })
    },

    // 获取指定分组预购清单统计
    indexPreOrderStat(params) {
        return http.get('pre-order/index/stat', { params: params })
    },

    //#endregion

}

export default preOrder;