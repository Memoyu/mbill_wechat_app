// 引入 wepy
import wepy from 'wepy'
import Session from '@/utils/session'

const tokenKey = Session.key.token
const userInfoKey = Session.key.userInfo
const httpHandlerError = (info, errTip = null) => {
  wepy.hideLoading()
  var data = info.data
  /** 请求成功，退出该函数 可以根据项目需求来判断是否请求成功。这里判断的是status为200的时候是成功 */
  if (info.statusCode === 200) {
    if (data !== null && data.code === 0) {
      return false
    } else {
      wx.showToast({
        title: data.message,
        icon: 'none',
        duration: 3000
      })
    }
  } else {
    /** 401 没有权限时，重新登录 */
    if (info.statusCode === 401 || info.statusCode === 400) {
      wx.showToast({
        title: data.message,
        icon: 'none',
        duration: 3000
      })
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
      if (info.data.errMsg) {
        errorInfo = info.data.errMsg
      } else {
        errorInfo = '也许服务器忙!'
      }
    }
    wepy.showToast({
      title: errorInfo,
      icon: 'loading',
      duration: 3000
    })
    /** 发生错误信息时，如果有回调函数，则执行回调 */
    return true
  }
}

const sendRequest = async (url, method, params, callback) => {
  let token = Session.getByCache(tokenKey)
  if (token !== null && token !== undefined) {
    token = 'Bearer ' + token.accessToken
  }

  return wepy.request({
    header: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    data: params,
    url: url,
    method: method
  }).then((response) => {
    const error = httpHandlerError(response)
    if (error) return
    const result = response.data

    if (typeof callback !== 'undefined') {
      callback(result)
    }

    return result
  }, (err) => {
    Session.pushError({url: url, method: method, params: params, err: err.message, time: new Date().toLocaleString()})
    wx.showToast({
      title: '请求失败！',
      icon: 'none',
      duration: 3000
    })
  })
}

export default {
  sendRequest
}
