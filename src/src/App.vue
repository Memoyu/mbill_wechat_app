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
  height: 100%;
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .b-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    // align-items: center;
    // justify-content: center;
  }

  .bottom-operate {
    width: 100%;
    position: absolute;
    bottom: 0;
    margin-bottom: 40rpx;
  }
}

// 原型checkbox
checkbox .wx-checkbox-input {
  border-radius: 50%;
}

checkbox .wx-checkbox-input.wx-checkbox-input-checked {
  border: 1px solid $light-color;
  background: $light-color;
  color: #fff !important;
}

checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
  font-size: 18px;
}

</style>
