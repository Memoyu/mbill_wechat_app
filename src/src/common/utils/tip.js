export default class Tips {
    /**
     * 弹出确认、取消窗口
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
    /**
    * 弹出确认窗口
    */
    static confirm(text, payload = {}, title = '提示') {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: title,
                content: text,
                showCancel: false,
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
    /**轻提示 */
    static toast(title, duration = 2000) {
        uni.showToast({
            title: title,
            icon: 'none',
            mask: false,
            duration: duration
        })
    }
}