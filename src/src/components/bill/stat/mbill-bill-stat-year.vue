<template>
  <view class="mbill-bill-stat-year">
    <view class="mbill-bill-stat-year-header">
      <mb-ba-date-scroll type="year" v-model="active" />
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bill-stat-year",
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
      console.log("初始化数据-年数据");
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-bill-stat-year {
  &-header {
    padding: 15rpx;
    margin: 20rpx;
    border-radius: 25rpx;
    background-color: white;
  }
}
</style>
