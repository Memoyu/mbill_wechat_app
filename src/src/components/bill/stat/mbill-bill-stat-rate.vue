<template>
  <view class="mbill-bill-stat-rate">
    <view class="mbill-bill-stat-rate-header"> </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bill-stat-rate",
  props: {},
  data() {
    return {
      init: false,
    };
  },
  created() {},
  methods: {
    initData() {
      if (this.init === true) return;
      this.init = true;
      // 初始化数据
      console.log("初始化数据-排行榜");
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-bill-stat-rate {
  &-header {
    padding: 15rpx;
    border-radius: 0 0 25rpx 25rpx;
    background-color: $light-color;
  }
}
</style>