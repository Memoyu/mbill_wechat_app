<template>
  <view class="mbill-asset-group">
    <view v-for="(d, dind) in groups" :key="dind">
      <view class="asset-group">{{ d.name }}</view>
      <view class="asset-item">
        <view
          :class="[
            'item-content',
            selectedBId === item.bId ? 'asset-item-selected' : '',
          ]"
          v-for="(item, index) in d.childs"
          :key="index"
          @click="onSelectedItem(item)"
        >
          <image class="image" :src="item.iconUrl" />
          <text class="text">{{ item.name }}</text>
        </view>
      </view>
    </view>
    <view class="to-add-asset" @click="onAddAsset">管理账户</view>
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
    select: {
      type: String,
      default: 0,
    },
  },
  data() {
    return {
      selectedBId: 0,
    };
  },
  watch: {
    select(value) {
      // console.log("账户", value);
      this.selectedBId = value;
    },
  },
  methods: {
    onSelectedItem(item) {
      this.selectedBId = item.bId;
      this.$emit("selected", item);
    },
    onAddAsset() {
      this.$Router.push({ name: "asset-manage", params: { chan: "refresh" } });
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-asset-group {
  margin: 0 20rpx;
  .asset-group {
    font-weight: bold;
    margin-top: 30rpx;
    margin-bottom: 10rpx;
  }
  .asset-item {
    display: grid;
    grid-template-columns: repeat(auto-fill, 140rpx);
    justify-content: center;
    .item-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 20rpx;
      padding: 14rpx 0;
      .image {
        height: 70rpx;
        width: 70rpx;
      }
      .text {
        margin-top: 10rpx;
        color: $grey-black-text-color;
        font-size: 26rpx;
      }
    }
  }
  .asset-item-selected {
    background-color: $light-color;
  }
  .to-add-asset {
    color: $dark-color;
    font-weight: bold;
    padding: 30rpx 0 40rpx 0;
    text-align: center;
  }
}
</style>
