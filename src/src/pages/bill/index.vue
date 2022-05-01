<template>
  <view>
    <view class="content">
      <view @tap="goBack">返回</view>
      <view class="key-board">
        <view></view>
        <mbill-keyboard
          ref="keyboard"
          :pnum="pnum"
          @getnum="handlerConfirmNum"
          @ongetnum="handlerInputNum"
        />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pnum: 0,
    };
  },
  onLoad() {},
  methods: {
    handlerInputNum(e) {
      console.log("in" + e);
    },
    handlerConfirmNum(e) {
      console.log("cof" + e);
    },
    goBack() {
      console.log("打印");
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
  },
};
</script>

<style>
.key-board {
  position: absolute;
  bottom: 0;
}
</style>
