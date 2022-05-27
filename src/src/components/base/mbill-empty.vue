<template>
  <view class="mbill-empty">
    <view class="iconfont icon-empty empty-no-more"></view>
    <view class="title">{{ title }}</view>
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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  .empty-no-more {
    font-size: 240rpx;
    color: $primary-color;
  }

  .title {
    color: $dark-color;
  }
}
</style>
