<template>
  <view
    :class="['mbill-po-item', order.status == 0 ? '' : 'mbill-po-item-tag']"
    @tap="handleToDetail(order)"
  >
    <view :class="['order-icon', 'x-c']" :style="{ background: order.color }">
      <view class="icon-text"
        ><text>{{ order.description[0] }}</text></view
      >
    </view>
    <view class="order-content">
      <view class="content-title y-start">
        <text class="note">{{ order.description }}</text>
        <text class="time">{{ order.time }}</text>
      </view>
      <view class="content-amount">
        <text :class="['income-color']">
          {{ order.preAmount }}
        </text>
        <view class="line"></view>
        <text :class="['expend-color']">
          {{ order.realAmount }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-po-item",
  props: {
    order: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {};
  },
  methods: {
    handleToDetail() {
      this.$emit("select", this.order);
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-po-item {
  // background: beige;
  display: flex;
  border-radius: 20rpx;
  padding: 10rpx 34rpx;
  align-items: center;

  .order-icon {
    margin-right: 20rpx;
    border-radius: 50%;
    height: 90rpx;
    .icon-text {
      color: #fff;
      text-align: center;
      font-size: 40rpx;
      line-height: 90rpx;
      width: 90rpx;
    }
  }
  .order-content {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    .content-title {
      color: $grey-text-color;
      font-size: 26rpx;
      .time {
        margin-right: 10rpx;
      }
      .note {
        font-size: 32rpx;
      }
    }
    .content-amount {
      text-align: center;
      font-weight: bold;
      min-width: 50rpx;
      .line {
        margin: 8rpx 0;
        height: 2rpx;
        background: $light-color;
      }
    }
  }
}
.mbill-po-item-tag {
  &:before {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    border: 34rpx solid $expend-color;
    border-radius: 0 0 20rpx;
    border-top-color: transparent;
    border-left-color: transparent;
  }
}
</style>
