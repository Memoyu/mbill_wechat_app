<template>
  <view class="mbill-end-split-line">
    <view
      v-for="(item, index) in Array(count).fill(1)"
      :key="index"
      class="item"
      :style="{
        background: `radial-gradient(circle farthest-side at bottom, ${lightColor}, ${deepColor})`,
      }"
    >
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-end-split-line",
  props: {
    count: {
      type: Number,
      default: 41,
    },
    deepColor: {
      type: String,
      default: "#f6f6f6",
    },
    lightColor: {
      type: String,
      default: "#f6f6f6",
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-end-split-line {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
}
.item {
  flex-basis: 16rpx;
  flex-shrink: 0;
  flex-grow: 0;
  height: 8rpx;
  border-radius: 12rpx 12rpx 0 0;
  margin: 0 4rpx;
  // background: radial-gradient(circle farthest-side at bottom, #ffffff, #ffffff);
}
</style>
