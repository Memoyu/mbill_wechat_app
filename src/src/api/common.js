import { http } from './service.js'

const common = {
    // 获取图标分页数据
    getIconPage(params) {
        return http.get('file/media-image/pages', { params: params })
    },
}

export default common;