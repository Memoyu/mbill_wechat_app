<template>
  <view>
    <view class="content">
      <view class="key-board">
        <view class="text">
          <view class="x-start">
            <i class="iconfont icon-assets" />
            <text>选择资产</text>
            <i class="iconfont icon-to" />
          </view>
          <view class="x-start">
            <i class="iconfont icon-assets" />
            <text>选择资产</text>
            <i class="iconfont icon-to" />
          </view>
        </view>
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
  },
};
</script>

<style lang="scss">
.text {
  background: $primary-color;
}

.choose-asset {
  display: flex;
  flex-direction: row;
}
.key-board {
  position: absolute;
  bottom: 0;
}
</style>
