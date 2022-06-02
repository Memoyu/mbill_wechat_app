<template>
  <view class="mbill-po-item" @tap="handlerToDetail(order.id)">
    <view class="order-icon">
      <image class="image" :src="order.categoryIcon" />
    </view>
    <view class="order-content">
      <view class="content-title">
        <view class="title">{{ order.category }}</view>
        <view class="info">
          <text class="time">{{ order.time }}</text>
          <text class="note">{{ order.description }}</text>
        </view>
      </view>
      <view class="content-amount">
        <text :class="[getTypeClass(order.type)]">
          {{ order.amountFormat }}
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
  methods: {
    getTypeClass(type) {
      switch (type) {
        case 0:
          return "expend-color";
        case 1:
          return "income-color";
      }
    },
    handlerToDetail(id) {
      uni.navigateTo({ url: `/pages/bill/detail?id=${id}` });
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-po-item {
  // background: beige;
  display: flex;
  border-radius: 10px;
  padding: 10px 18px;
  align-items: center;
  .order-icon {
    .image {
      margin-right: 10px;
      border-radius: 50%;
      // background: yellow;
      height: 35px;
      width: 35px;
    }
  }
  .order-content {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    .content-title {
      .title {
        margin-bottom: 5px;
        font-weight: bold;
      }
      .info {
        color: $grey-text-color;
        font-size: 13px;
        .time {
          margin-right: 5px;
        }
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
