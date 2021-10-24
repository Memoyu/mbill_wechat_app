<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    // wx.hideTabBar();
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "static/font/iconfont.css";
page {
  height: 100%;
  // overflow-y: hidden;
  background-color: #ffffff;
}
</style>
