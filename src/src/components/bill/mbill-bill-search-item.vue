<template>
  <view class="searh-bill-item" @click="onToDetail(bill.id)">
    <view class="searh-bill-item-main x-bc">
      <view class="searh-bill-item-main-content">
        <view :class="['searh-bill-item-main-type', getTypeClass(bill.type)]">
          {{ getType(bill.type) }}
        </view>
        <view :class="['searh-bill-item-main-amount', getTypeClass(bill.type)]">
          {{ bill.amountFormat }}￥
        </view>
      </view>
      <view class="searh-bill-item-main-time">
        {{ bill.timeFormat }}
      </view>
    </view>
    <view class="x-f">
      <view class="x-f searh-bill-item-sub">
        <view class="searh-bill-item-sub-title">分类：</view>
        <view class="searh-bill-item-sub-icon">
          <image class="image" :src="bill.categoryIcon" />
        </view>
        <view class="searh-bill-item-sub-item">{{ bill.category }}</view>
      </view>
      <view class="x-f searh-bill-item-sub">
        <view class="searh-bill-item-sub-title">账户：</view>
        <view class="searh-bill-item-sub-icon">
          <image class="image" :src="bill.assetIcon" />
        </view>
        <view class="searh-bill-item-sub-item">{{ bill.asset }}</view>
      </view>
    </view>
    <view class="x-f searh-bill-item-desc">
      <i class="iconfont icon-note-text searh-bill-item-icon" />
      <view class="searh-bill-item-desc-text text-display">{{
        bill.description
      }}</view>
    </view>
    <view class="x-f searh-bill-item-addr">
      <i class="iconfont icon-dizhi searh-bill-item-icon" />
      <view class="searh-bill-item-addr-text text-display">{{
        bill.address
      }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bill-search-item",
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
    getType(type) {
      switch (type) {
        case 0:
          return "支出";
        case 1:
          return "收入";
      }
    },
    onToDetail(id) {
      uni.navigateTo({ url: `/pages/bill/detail?id=${id}` });
    },
  },
};
</script>

<style lang="scss" scope>
.searh-bill-item {
  &-main {
    display: flex;
    align-items: baseline;
    margin-bottom: 20rpx;
    &-content {
      display: flex;
      align-items: flex-end;
      font-size: 40rpx;
      font-weight: bold;
    }
    &-type {
      margin-right: 20rpx;
    }
    &-amount {
      font-size: 30rpx;
    }
    &-time {
      font-size: 27rpx;
    }
  }

  &-sub {
    margin-bottom: 20rpx;
    margin-right: 40rpx;
    &-icon {
      display: flex;
      .image {
        margin-right: 10rpx;
        border-radius: 50%;
        height: 40rpx;
        width: 40rpx;
      }
    }
    &-title {
      font-weight: bold;
    }
  }
  &-desc {
    margin-bottom: 15rpx;
    &-text {
    }
  }
  &-addr {
    &-text {
    }
  }

  &-icon {
    margin-right: 15rpx;
    font-size: 35rpx;
  }

  .text-display {
    display: -webkit-box; /*弹性伸缩盒子模型显示*/
    -webkit-box-orient: vertical; /*排列方式*/
    -webkit-line-clamp: 1; /*显示文本行数(这里控制多少行隐藏)*/
    overflow: hidden; /*溢出隐藏*/
  }
}
</style>
