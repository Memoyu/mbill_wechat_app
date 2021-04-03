<template>
  <view class="container">
    <view class="main">
    </view>
  </view>
</template>

<script>
export default {
  name: "monthTrendChart",
  props: {},
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style lang="scss">
.container {
  margin-top: 30px;
  min-height: 100%;
  .main {
    width: 750rpx;
    .month-trend {
      display: block;
      width: 750rpx;
      height: 500rpx;
    }
  }
}
</style>
