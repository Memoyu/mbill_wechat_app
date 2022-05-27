Component({
  data: {
    show: true,
    selected: 0,
    color: "#D1D1D1",
    selectedColor: "#A6B1E1",
    list: [{
      "pagePath": "/pages/index/index",
      "text": "账本"
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
      wx.navigateTo({ url: '/pages/bill/edit' })
    }
  }
})