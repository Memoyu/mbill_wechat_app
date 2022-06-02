import { http } from './service.js'

const preOrder = {

    // 新增预购分组
    addPreOrderGroup(params) {
        return http.post('pre-order/group', params)
    },

    //#endregion
}

export default preOrder;