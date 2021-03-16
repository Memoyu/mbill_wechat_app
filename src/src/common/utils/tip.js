export default class Tips {
    /**
     * 弹出确认窗口
     */
    static choose(text, payload = {}, title = '提示') {
        return new Promise((resolve, reject) => {
            uni.showModal({
                title: title,
                content: text,
                showCancel: true,
                success: res => {
                    if (res.confirm) {
                        resolve(payload)
                    } else if (res.cancel) {
                        reject(payload)
                    }
                },
                fail: res => {
                    reject(payload)
                }
            })
        })
    }
}