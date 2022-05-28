<template>
  <view class="mbill-bill-item" @tap="handlerToDetail(bill.id)">
    <view class="bill-icon">
      <image class="image" :src="bill.categoryIcon" />
    </view>
    <view class="bill-content">
      <view class="content-title">
        <view class="title">{{ bill.category }}</view>
        <view class="info">
          <text class="time">{{ bill.time }}</text>
          <text class="note">{{ bill.description }}</text>
        </view>
      </view>
      <view class="content-amount">
        <text :class="[getTypeClass(bill.type)]"> {{ bill.amount }} </text>
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
.mbill-bill-item {
  // background: beige;
  display: flex;
  border-radius: 10px;
  padding: 10px 18px;
  align-items: center;
  .bill-icon {
    .image {
      margin-right: 10px;
      border-radius: 50%;
      // background: yellow;
      height: 35px;
      width: 35px;
    }
  }
  .bill-content {
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
