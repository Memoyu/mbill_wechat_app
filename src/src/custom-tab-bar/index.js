Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      "pagePath": "/pages/index/index",
      "text": "账目"
    },
    {
      "bulge": true,
      "pagePath": "/pages/bill/index",
      "iconPath": "/static/assets/tabbar/plus.png",
      "selectedIconPath": "/static/assets/tabbar/plus.png"
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
      console.log(data.index)
      this.setData({
        selected: data.index
      })
    }
  }
})