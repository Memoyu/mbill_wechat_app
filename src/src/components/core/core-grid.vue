<template>
  <view class="core-grid-box mb10">
    <view
      class="tool-item y-f"
      v-for="(menu, index) in detail"
      :key="index"
      @tap="jump(menu)"
    >
      <image class="tool-img" :src="menu.image" mode="aspectFill"></image>
      <text class="item-title">{{ menu.name }}</text>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
    };
  },
  computed: {},
  props: {
    detail: {
      type: Array,
      default: null,
    },
  },
  methods: {
    jump(path) {
      this.$Router.push({
        path: path,
      });
    },
  },
};
</script>

<style lang="scss">
// 宫格
.core-grid-box {
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 40rpx;

  .tool-item {
    width: (750rpx/4);
    padding-top: 40rpx;

    .tool-img {
      width: 44rpx;
      height: 44rpx;
      // background: #ccc;
    }

    .item-title {
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(153, 153, 153, 1);
      line-height: 24rpx;
      padding-top: 30rpx;
    }
  }
}
</style>
