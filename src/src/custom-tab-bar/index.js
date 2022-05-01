Component({
  data: {
    selected: 0,
    lastUrl: '/pages/index/index',
    color: "#7A7E83",
    selectedColor: "#8552a1",
    list: [{
      "pagePath": "/pages/index/index",
      "text": "账目"
    },
    {
      "pagePath": "/pages/profile/index",
      "text": "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index,
      })
    },
    toadd() {
      wx.navigateTo({ url: '/pages/bill/index' })
    }
  }
})