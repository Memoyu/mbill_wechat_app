<template>
  <view class="mbill-asset-group">
    <view v-for="(d, dind) in groups" :key="dind">
      <view class="asset-group">{{ d.name }}</view>
      <view class="asset-item">
        <view
          class="item-content"
          v-for="(item, index) in d.childs"
          :key="index"
        >
          <image class="image" :src="item.iconUrl" />
          <text class="text">{{ item.name }}</text>
        </view>
      </view>
    </view>
    <!-- TODO:完成账户的添加 -->
    <view class="to-add-asset" @tap="handlerAddAsset">添加账户</view>
  </view>
</template>

<script>
export default {
  name: "mbill-asset-group",
  props: {
    groups: {
      type: Array,
      default: [],
    },
  },
  methods: {
    handlerAddAsset() {
      uni.navigateTo({ url: "/pages/bill/asset/edit" });
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-asset-group {
  margin: 0 10px;
  .asset-group {
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 5px;
  }
  .asset-item {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    .item-content {
      width: 20%;
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .image {
        height: 35px;
        width: 35px;
      }
      .text {
        margin-top: 8px;
        color: $grey-black-text-color;
        font-size: 13px;
      }
    }
  }
  .to-add-asset {
    color: $dark-color;
    font-weight: bold;
    margin-bottom: 15px;
    text-align: center;
  }
}
</style>
