<template>
    <view class="container">
        <text class="iconfont icon-left back-btn" @tap="jump"></text>
        <view class="right-top-sign"></view>
        <view class="wrapper">
            <view class="left-top-sign">MBILL</view>
            <view class="welcome">LOGIN</view>
        </view>
    </view>
</template>

<script>
export default {
  name: "magicText",
  props: {
    text: {
      type: String,
      default: ""
    }
  },
  methods: {
    jump() {
        this.$Router.back();
    }
  }
};
</script>

<style lang="scss">
.container {
  padding-top: 115px;
  position: relative;
  width: 100vw;
  overflow: hidden;
  background: #fff;
  .wrapper {
    position: relative;
    z-index: 90;
    background: #fff;
    padding-bottom: 40upx;
  }
  .back-btn {
    position: absolute;
    left: 40upx;
    z-index: 9999;
    padding-top: var(--status-bar-height);
    top: 40upx;
    font-size: 40upx;
    color: black;
  }
  .right-top-sign {
    position: absolute;
    top: 80upx;
    right: -30upx;
    z-index: 95;

    &:before,
    &:after {
      display: block;
      content: "";
      width: 400upx;
      height: 80upx;
      background: #cab1b1;
    }

    &:before {
      transform: rotate(50deg);
      border-radius: 0 50px 0 0;
    }

    &:after {
      position: absolute;
      right: -198upx;
      top: 0;
      transform: rotate(-50deg);
      border-radius: 50px 0 0 0;
      /* background: pink; */
    }
  }
  .left-top-sign {
    font-size: 120upx;
    color: $divideText;
    position: relative;
    left: -16upx;
  }

  .welcome {
    position: relative;
    left: 50upx;
    top: -55upx;
    font-size: 46upx;
    color: #555;
    text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
  }
}
</style>
