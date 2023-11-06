<template>
  <view class="mbill-bill-date-group">
    <view v-for="(g, dind) in groups" :key="dind">
      <view class="group-date">{{ g.day }}日 {{ g.week }}</view>
      <view class="group-items">
        <view class="group-items-item">
          <mb-b-item
            v-for="(item, index) in g.items"
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
  name: "mbill-bill-date-group",
  props: {
    groups: {
      type: Array,
      default: [],
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-bill-date-group {
  margin: 0 20rpx;
  .group-date {
    padding: 20rpx 40rpx;
    font-weight: bold;
  }
  .group-items {
    padding: 10rpx 0;
    border-radius: 26rpx;
    background: white;
    &-item {
      padding: 0 30rpx;
    }
  }
}
</style>
