<template>
  <view class="container">
    <text class="iconfont icon-left back-btn" @tap="jump"></text>
    <view class="right-top-sign"></view>
    <view class="left-top-sign"></view>
    <view class="wrapper">
      <view class="left-bottom-sign">MBILL记账</view>
      <view class="welcome">记录点滴</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "magicText",
  props: {
    text: {
      type: String,
      default: "",
    },
  },
  methods: {
    jump() {
      this.$Router.back();
    },
  },
};
</script>

<style lang="scss">
.container {
  padding-top: 215px;
  position: relative;
  width: 100vw;
  overflow: hidden;
  background: #fff;
  .wrapper {
    margin-left: 80upx;
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
    right: -20upx;
    z-index: 95;

    &:before,
    &:after {
      display: block;
      content: "";
      width: 700upx;
      height: 80upx;
      background: #cab1b1;
    }
    &:before {
      transform: rotate(50deg);
      border-radius: 0 50px 0 0;
    }
    &:after {
      position: absolute;
      right: -390upx;
      top: 0;
      transform: rotate(-50deg);
      border-radius: 50px 0 0 0;
    }
  }
  .left-top-sign {
    position: absolute;
    top: 1rpx;
    left: -340rpx;
    z-index: 95;
    &:before {
      transform: rotate(50deg);
      border-radius: 0 50px 0 0;
      display: block;
      content: "";
      width: 700upx;
      height: 80upx;
      background: #cab1b1;
    }
    &:after {
      position: absolute;
      right: -65upx;
      top: 143upx;
      transform: rotate(-50deg);
      border-radius: 50px 0 0 0;
      display: block;
      content: "";
      width: 290upx;
      height: 80upx;
       background: linear-gradient(90deg, $darkPrimaryColor, $primaryColor);
      background: #cab1b1;
    }
  }
  .left-bottom-sign {
    font-weight: bold;
    font-size: 70upx;
    color: #555;
    position: relative;

    &:before {
      content: "";
      position: absolute;
      background: $primaryColor;
      width: 40px;
      height: 40px;
      bottom: -10px;
      left: 90px;
      border-radius: 20px;
      z-index: -1;
    }
  }

  .welcome {
    position: relative;
    left: 150upx;
    font-size: 30upx;
    text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
  }
}
</style>
