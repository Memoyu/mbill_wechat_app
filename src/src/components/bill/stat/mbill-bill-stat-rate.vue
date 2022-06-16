<template>
  <view class="mbill-bill-stat-rate">
    <view class="mbill-bill-stat-rate-header">
      <view class="mbill-bill-stat-rate-header-tab"> </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bill-stat-rate",
  props: {},
  data() {
    return {
      init: false,
      active: 0,
      list: [
        {
          title: "支出",
        },
        {
          title: "收入",
        },
      ],
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
    height: 75px;
    border-radius: 0 0 25rpx 25rpx;
    background-color: $light-color;
    display: flex;
    justify-content: center;
    &-tab {
      width: auto;
      margin-bottom: 10rpx;
    }
  }
}
</style>