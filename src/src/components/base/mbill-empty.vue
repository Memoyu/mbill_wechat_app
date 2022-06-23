<template>
  <view class="mbill-empty x-ac">
    <view class="y-f">
      <view class="iconfont icon-empty empty-no-more"></view>
      <view class="title">{{ title }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-empty",
  props: {
    title: {
      type: String,
      default: "空空如也~~",
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-empty {
  // position: absolute;
  // top: 50%;
  // left: 50%;
  // text-align: center;
  width: 100%;
  height: 100%;

  .empty-no-more {
    font-size: 240rpx;
    color: $primary-color;
  }

  .title {
    color: $dark-color;
  }
}
</style>
