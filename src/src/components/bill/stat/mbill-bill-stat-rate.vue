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
      range: [
        {
          value: 0,
          text: "支出",
        },
        {
          value: 1,
          text: "收入",
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
    display: flex;
    justify-content: center;
    &-tab {
      width: auto;
      margin-bottom: 10rpx;
    }
  }
}
</style>