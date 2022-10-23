<template>
  <view class="mbill-bill-item" @click="onToDetail(bill.id)">
    <view class="bill-icon">
      <image class="image" :src="bill.categoryIcon" />
    </view>
    <view class="bill-content">
      <view class="content-title">
        <view class="content-title-text">
          <view class="title">{{ bill.category }}</view>
          <text class="time">{{
            (showdate ? (bill.date ? bill.date : "") : "") + ` ${bill.time}`
          }}</text>
        </view>
        <view class="info">
          <text class="note one-t">{{ bill.description }}</text>
        </view>
      </view>
      <view class="content-amount">
        <text :class="[getTypeClass(bill.type)]">
          {{ bill.amountFormat }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bill-item",
  props: {
    bill: {
      type: Object,
      default: {},
    },
    showdate: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getTypeClass(type) {
      switch (type) {
        case 0:
          return "expend-color";
        case 1:
          return "income-color";
      }
    },
    onToDetail(id) {
      uni.navigateTo({ url: `/pages/bill/detail?id=${id}` });
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-bill-item {
  // background: beige;
  display: flex;
  border-radius: 20rpx;
  padding: 20rpx 0;
  align-items: center;
  .bill-icon {
    .image {
      margin-right: 20rpx;
      border-radius: 50%;
      // background: yellow;
      height: 70rpx;
      width: 70rpx;
    }
  }
  .bill-content {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    .content-title {
      &-text {
        display: flex;
        align-items: center;
        .title {
          margin: 0 10rpx 10rpx 0;
          font-weight: bold;
        }
        .time {
          color: $grey-text-color;
          font-size: 25rpx;
          margin-right: 10rpx;
        }
      }
      .info {
        height: 30rpx;
        color: $grey-text-color;
        font-size: 26rpx;
        .note {
        }
      }
    }
    .content-amount {
      font-weight: bold;
    }
  }
}
</style>
