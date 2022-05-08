<template>
  <view class="mbill-bill-item" @tap="handlerToDetail(data.id)">
    <view class="bill-icon">
      <image class="image" :src="data.icon" />
    </view>
    <view class="bill-content">
      <view class="content-title">
        <view class="title">{{ data.category }}</view>
        <view class="info">
          <text class="time">{{ data.time }}</text>
          <text class="note">{{ data.desc }}</text>
        </view>
      </view>
      <view class="content-amount">
        <text :class="[getTypeClass(data.type)]"> {{ data.amount }} </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bill-item",
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  methods: {
    getTypeClass(type) {
      switch (type) {
        case 0:
          return "expend";
        case 1:
          return "income";
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
  padding: 10px;
  align-items: center;
  .bill-icon {
    .image {
      margin-right: 10px;
      border-radius: 50%;
      background: yellow;
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
      .expend {
        color: $expend-color;
      }
      .income {
        color: $income-color;
      }
    }
  }
}
</style>
