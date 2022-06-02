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

    //#endregion
}

export default preOrder;