const KEY = {
  token: '@access_refresh_token@',
  userInfo: '@user_info@'
}

module.exports = {
  key: KEY,

  get: function (key) {
    return wx.getStorageSync(key) || null
  },

  set: function (key, value) {
    wx.setStorageSync(key, value)
  },

  clear: function (key) {
    wx.removeStorageSync(key)
  },

  // 获取缓存,默认缓存时长 1 天
  getByCache: function (cacheKey) {
    const cacheValue = wx.getStorageSync(cacheKey)
    const onday = 86400
    // console.log(cacheValue)
    if (cacheValue === null || cacheValue === 'undefined') {
      return false
    } else if ((new Date().getTime() - Number.parseInt(cacheValue.createTime)) / 1000 > onday) {
      return false
    }
    return cacheValue.value
  },

  // 设置缓存
  setByCache: function (cacheKey, cacheVal) {
    if (typeof cacheKey !== 'undefined') {
      if (Array.isArray(cacheVal) && cacheVal.length === 0) return false
      let localTime = new Date().getTime()
      wx.setStorageSync(cacheKey, {
        createTime: localTime,
        value: cacheVal
      })
    }
  },

  // 排查为何频繁拉取失败
  pushError: function (err) {
    let kV = wx.getStorageSync(KEY['errorKey']) || null
    if (kV === null) {
      kV = [err]
    } else {
      kV.push(err)
    }
    wx.setStorageSync(KEY['errorKey'], kV)
  },

  getErrors: function () {
    return wx.getStorageSync(KEY['errorKey']) || null
  },

  // 由于网络原因导致账单提交失败的一律先存储到缓存,下次再重新提交
  pushFailStatement: function (statement) {
    let kV = wx.getStorageSync(KEY['localStatementKey']) || null
    if (kV === null) {
      kV = [statement]
    } else {
      kV.push(statement)
    }
    wx.setStorageSync(KEY['localStatementKey'], kV)
  },

  getStatements: function () {
    return wx.getStorageSync(KEY['localStatementKey']) || null
  },

  clearByKey(key) {
    wx.removeStorageSync(key)
  },

  clearAll: function () {
    wx.clearStorage()
  }
}
