<template>
  <view
    :class="[
      'mbill-po-group-item',
      group.billId == 0 ? '' : ' mbill-po-group-item-tag',
    ]"
  >
    <view class="group-item-content" @click="onToList(group)">
      <view class="group-item-title">
        <view class="title">{{ group.name }}</view>
        <view class="info">
          <text class="time">{{ group.time }}</text>
          <text class="note">{{ group.description }}</text>
        </view>
      </view>
      <view class="group-item-stat">
        <!-- <view class="item-amount">
          <view class="char">￥</view>
          <view class="amount">{{ group.amount }}</view>
        </view> -->
        <view class="item-status">
          <text class="expend-color done">
            {{ group.done }}
          </text>
          <text class="income-color un-done">
            {{ group.unDone }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-po-group-item",
  props: {
    group: {
      type: Object,
      default: {},
    },
  },
  methods: {
    onToList(group) {
      uni.navigateTo({
        url: `/pages/bill/pre-order/list?id=${group.id}`,
      });
    },
    onEdit(group) {
      this.$emit("edit", group);
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-po-group-item {
  display: flex;
  border-radius: 20rpx;
  padding: 20rpx 36rpx;
  align-items: center;
  .group-item-content {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    .group-item-title {
      .title {
        margin-bottom: 10rpx;
        font-weight: bold;
      }
      .info {
        color: $grey-text-color;
        font-size: 26rpx;
        .time {
          margin-right: 10rpx;
        }
        .note {
        }
      }
    }
    .group-item-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      .item-amount {
        display: flex;
        align-items: baseline;
        .char {
          font-size: 26rpx;
        }
        .amount {
          font-size: 34rpx;
          font-weight: bold;
          text-align: center;
        }
      }
      .item-status {
        margin-top: 10rpx;
        font-weight: bold;
        font-size: 32rpx;
        .done {
          padding-right: 18rpx;
        }
        .un-done {
          padding-left: 18rpx;
          border-left: solid $light-color 2rpx;
        }
      }
    }
  }
}
.mbill-po-group-item-tag {
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
