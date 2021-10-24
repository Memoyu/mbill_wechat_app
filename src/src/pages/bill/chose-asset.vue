<template>
  <view class="category-component">
    <view v-if="!hide_frequent && frequent.length > 0">
      <view class="header fs14">常用</view>
      <repeat v-for="(child, index) in frequent" :key="index">
        <mbill-core-asset-item :asset="child" @choseItem="setAsset"></mbill-core-asset-item>
      </repeat>
    </view>

    <view v-for="(item, id) in list" :key="id">
      <view class="header fs14">{{ item.name }}</view>
      <div v-for="(child, index) in item.childs" :key="index">
        <mbill-core-asset-item :asset="child" @choseItem="setAsset"></mbill-core-asset-item>
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
    return {
      frequent: [],
      last: null,
      list: [],
      type: "expend",
      asset_type: null,
      hide_frequent: false,
    };
  },
  onLoad(options) {
    this.type = options.type;
    if (typeof options.asset_type !== "undefined") {
      this.asset_type = options.asset_type;
    }
    if (Number.parseInt(options.hide_frequent) === 1) {
      this.hide_frequent = true;
    }
    this.getAsset();
  },
  methods: {
    //获取分组后的资产数据
    getAsset() {
      var that = this;
      let parame = this.asset_type !== null ? { type: this.asset_type } : {};
      that.$api("asset.group", parame).then((res) => {
        debugger
        this.list = res.result;
      });
    },
    //触发选中资产后赋值
    setAsset(asset) {
      let pages = getCurrentPages();
      let beforePage = pages[pages.length - 2];
      // console.log(beforePage)
      let refs = beforePage.$vm.$refs;
      switch (this.type) {
        case "expend":
          refs.expend.setAsset(asset);
          break;
        case "income":
          refs.income.setAsset(asset);
          break;
        case "transfer":
          refs.transfer.setAsset(asset);
          break;
        case "repayment":
          refs.repayment.setAsset(asset);
          break;
      }
      uni.navigateBack({
        delta: 1,
      });
    },
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
