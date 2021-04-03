<template>
  <view class="container">
    <view class="main">

    </view>
  </view>
</template>

<script>
export default {
  name: "weekTrendChart",
  props: {},
  data() {
    return {
      ec: {},
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
    .week-trend {
      display: block;
      width: 750rpx;
      height: 500rpx;
    }
  }
}
</style>
