<template>
  <view class="container">
    <view class="main">
    </view>
  </view>
</template>

<script>
export default {
  name: "categoryChart",
  props: {
    date: {
      type: Object
    },
  },
  data() {
    return {
    };
  },
  components: {},
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
    .category-pie {
      display: block;
      width: 750rpx;
      height: 500rpx;
    }
    .category-bar {
      display: block;
      width: 750rpx;
      height: 900rpx;
    }
  }
}
</style>
