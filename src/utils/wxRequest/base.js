
import Tip from '@/utils/tip'
import Session from '@/utils/session'

const tokenKey = Session.key.token
const userInfoKey = Session.key.userInfo
const httpHandlerError = (info, errTip = null) => {
  // console.log(info)
  var data = info.data
  /** 请求成功，退出该函数 可以根据项目需求来判断是否请求成功。这里判断的是status为200的时候是成功 */
  if (info.statusCode === 200) {
    if (data !== null && data.code === 0) {
      return false
    } else {
      Tip.error(data.Message)
    }
  } else {
    /** 401 没有权限时，重新登录 */
    if (info.statusCode === 401 || info.statusCode === 400) {
      console.log(data.Message)
      Tip.error(data.Message)
      // 清除登陆缓存
      Session.clearByKey(tokenKey)
      Session.clearByKey(userInfoKey)
      return true
    }

    /** 判断是否有自定义错误信息，如果有，优先使用自定义错误信息，其次曝出后台返回错误信息 */
    let errorInfo = ''
    if (errTip) {
      errorInfo = errTip
    } else {
      if (info.data.Message) {
        errorInfo = info.data.Message
      } else {
        errorInfo = '也许服务器忙!'
      }
    }
    Tip.error(errorInfo)
    /** 发生错误信息时，如果有回调函数，则执行回调 */
    return true
  }
}

const sendRequest = async (url, method, data, isShowLoading = true) => {
  // 显示加载状态
  isShowLoading && Tip.toast('加载中...', 'loading', 10000)
  let token = Session.getByCache(tokenKey)
  if (token !== null && token !== undefined) {
    token = 'Bearer ' + token.accessToken
  }
  return new Promise((resolve, reject) => {
    wx.request({
      header: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      data: data,
      url: url,
      method: method,

      success: res => {
        // console.log(data)
        const error = httpHandlerError(res)
        if (error) return
        resolve(res.data)
      },
      fail: err => {
        // console.log(res)
        Session.pushError({url: url, method: method, params: data, err: err.errMsg, time: new Date().toLocaleString()})
        Tip.error(err.errMsg)
        reject(err)
      },
      complete(res) {
        wx.hideToast()
        wx.stopPullDownRefresh()
      }
    })
  })
}

export default {
  sendRequest
}
