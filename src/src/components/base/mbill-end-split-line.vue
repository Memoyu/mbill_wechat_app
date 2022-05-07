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
      default: 31,
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
  flex-basis: 8px;
  flex-shrink: 0;
  flex-grow: 0;
  height: 4px;
  border-radius: 6px 6px 0 0;
  margin: 0 2px;
  // background: radial-gradient(circle farthest-side at bottom, #ffffff, #ffffff);
}
</style>
