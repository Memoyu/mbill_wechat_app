<template>
  <view class="mbill-bill-month-group">
    <view v-for="(d, dind) in data" :key="dind">
      <view class="group-year">{{ d.year }}</view>
      <view class="group-year-item">
        <view class="group-month-items" v-for="(m, mind) in d.items" :key="mind">
          <view class="group-month-items-date">{{ m.date }}</view>
            <view class="group-month-items-item">
          <mb-b-item
            v-for="(item, index) in m.items"
            :key="index"
            :bill="item"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bill-month-group",
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-bill-month-group {
  margin: 0 20rpx;
  .group-year {
    padding: 20rpx 40rpx;
    font-weight: bold;
  }
  .group-year-item {
    padding: 10rpx 0;
    border-radius: 26rpx;
    background: white;
    .group-month-items {
      &-date {
        padding: 20rpx 40rpx;
        color: $grey-black-text-color;
        font-weight: 600;
      }
      &-item {
        padding: 0 30rpx;
      }
    }
  }
}
</style>
