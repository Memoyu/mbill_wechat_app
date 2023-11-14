import { http } from './service.js'

const notice = {
    // 获取最新公告
    getNotice() {
        return http.get('notice/latest', {})
    },
}

export default notice;