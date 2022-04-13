<template>
  <view class="order" @tap="editStatement(order.id)">
    <view class="information">
      <view class="icon">
        <image :src="order.categoryIconPath"></image>
      </view>
      <view class="st-title">
        <view
          v-if="order.type === 'expend' || order.type === 'income'"
          class="title"
          >{{ order.categoryName }}</view
        >
        <view class="description" v-if="order.description">{{
          order.description
        }}</view>
        <view class="time"
          >{{ order.year }}-{{ order.month }}-{{ order.day }} {{ order.time }} ·
          {{ order.assetName }}</view
        >
      </view>
    </view>
    <view :class="['amount', order.type]">
      {{ order.amount }}
    </view>
  </view>
</template>

<script>
export default {
  name: "statementItem",
  props: {
    order: {
      type: Object,
      default: {},
    },
  },
  methods: {
    editStatement(id) {
      // console.log(key, id)
      this.$Router.push({
        path: "/pages/order/detail",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.order {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px;
  border-bottom: 2rpx solid $borderColor;
  padding: 16rpx 0;
  color: $primaryText;

  .information {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .icon {
    margin-right: 16rpx;
    display: flex;
    align-items: center;

    image {
      width: 70rpx;
      height: 70rpx;
    }
  }

  .st-title {
    > view {
      margin-bottom: 4rpx;
    }

    .title {
      font-size: 28rpx;
    }

    .description {
      color: $secondaryText;
      font-size: 24rpx;
    }

    .time {
      color: $secondaryText;
      font-size: 24rpx;
    }
  }

  .amount {
    font-size: 30rpx;
    font-weight: bold;
  }

  .transfer-icon {
    margin-right: 16rpx;
    display: flex;
    align-items: center;
    width: 70rpx;
    height: 70rpx;
    border-radius: 50%;
  }
}
</style>
