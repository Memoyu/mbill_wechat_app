<template>
  <view class="mbill-bill-stat-month">
    <view class="mbill-bill-stat-month-header">
      <mb-ba-date-scroll type="month" v-model="active" />
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bill-stat-month",
  props: {},
  data() {
    return {
      init: false,
      active: 0,
    };
  },
  created() {},
  methods: {
    initData() {
      if (this.init === true) return;
      this.init = true;
      // 初始化数据
      console.log("初始化数据-月数据");
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-bill-stat-month {
  &-header {
    padding: 15rpx;
    margin: 20rpx;
    border-radius: 25rpx;
    background-color: white;
  }
}
</style>
