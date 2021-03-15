<template>
 <view class="category-component">
    <view wx:if="{{ !hide_frequent && frequent.length > 0 }}">
      <view class="header fs14">常用</view>
      <repeat for="{{frequent}}" key="index" index="index" item="child">
        <asset :asset.sync="child" ></asset>
      </repeat>
    </view>

    <view v-for="(item,index) in list" :key="index">
      <view class="header fs14">{{ item.name }}</view>
      <div v-for="(child,index) in item.childs" :key="index">
        <asset :asset="child"></asset>
      </div>
    </view>

    <navigator url="/pages/assets/asset_form">
      <view class="add-wallet">
        <text class="fs16" bindtap="newAsset">添加资产类型</text>
      </view>
    </navigator>

  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.header {
  color: $primaryText;
  border-bottom: 1px solid $borderColor;
  height: 64rpx;
  line-height: 64rpx;
  padding: 0 24rpx;
  margin: 0 12rpx;
  font-weight: bold;
}
.column {
  width: 20%;
  float: left;
  margin: 18rpx 0;
  .category {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .category-name {
      font-size: 24rpx;
      padding: 8rpx 0;
      color: $secondaryText;
    }
  }
  .category .money {
    font-size: 20rpx;
    color: $secondaryText;
  }
  .ljt-icon {
    width: 60rpx;
    height: 60rpx;
    margin-right: 12rpx;
  }
}
.category-component {
  > view {
    overflow: hidden;
  }
}
.add-wallet {
  display: flex;
  justify-content: center;
  padding: 8rpx 0;
  color: #999;
  margin: 8rpx 0;
}
.add-wallet image {
  width: 50rpx;
  height: 50rpx;
  display: inline-block;
  margin-right: 8rpx;
}
</style>
