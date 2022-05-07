<script>
export default {
  globalData: {
    tabbarHeight: 48,
  },
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
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
@import "@/static/styles/utils.scss";

page {
  background-color: $grey-bright-color;
}
</style>
