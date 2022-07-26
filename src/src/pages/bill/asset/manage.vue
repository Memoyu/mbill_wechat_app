<template>
  <view class="bill-asset-manage">
    <view class="asset-collapse-content">
      <uni-collapse>
        <uni-collapse-item
          v-for="(g, index) in groups"
          :key="index"
          :border="false"
          title-border="none"
          :open="index === 0"
        >
          <template v-slot:title>
            <view class="asset-group">{{ g.name }}</view>
          </template>
          <view class="asset-item">
            <view
              :class="['item-content']"
              v-for="(item, index) in g.childs"
              :key="index"
              @click="onSelectedItem(item)"
            >
              <image class="image" :src="item.iconUrl" />
              <text class="text">{{ item.name }}</text>
            </view>
            <view
              class="item-content item-add-content"
              @click="onAddAsset(g.id)"
            >
              <image class="image" src="/static/assets/add.png" />
            </view>
          </view>
        </uni-collapse-item>
      </uni-collapse>
    </view>
    <view class="add-asset-group" @click="onAddGroup">添加分组</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      groups: [],
    };
  },
  onLoad() {
    this.getAssetGroups();
  },
  onShow() {},
  methods: {
    // 选中账户
    onSelectedItem(asset) {},

    // 添加分类
    onAddAsset(groupId) {
      console.log(groupId, "分组Id");
      this.$tip.toast("开发中，敬请期待");
    },

    // 添加分组
    onAddGroup() {
      this.$tip.toast("开发中，敬请期待");
    },

    // 获取账单账户
    getAssetGroups() {
      this.$api.assetGroups().then((res) => {
        if (res.data.code === 0) {
          this.groups = res.data.result;
        }
      });
    },
  },
};
</script>

<style lang="scss" scope>
.bill-asset-manage {
  padding-top: 102rpx;
  .asset-collapse-content {
    background: #ffffff;
    border-radius: 30rpx;
    margin: 0 10rpx;
    padding: 10rpx;
    .asset-group {
      font-weight: bold;
      padding: 20rpx 30rpx;
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
          font-size: 28rpx;
        }
      }
      .item-add-content {
        display: flex;
        justify-content: center;
        flex-direction: unset;
        align-items: center;
      }
    }
  }

  .add-asset-group {
    color: $dark-color;
    font-weight: bold;
    margin: 40rpx 0;
    text-align: center;
  }
}
</style>
