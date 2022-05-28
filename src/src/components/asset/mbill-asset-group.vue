<template>
  <view class="mbill-asset-group">
    <view v-for="(d, dind) in groups" :key="dind">
      <view class="asset-group">{{ d.name }}</view>
      <view class="asset-item">
        <view
          :class="[
            'item-content',
            selectedId === item.id ? 'asset-item-selected' : '',
          ]"
          v-for="(item, index) in d.childs"
          :key="index"
          @click="handlerSelectedItem(item)"
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
  data() {
    return {
      selectedId: 0,
    };
  },
  methods: {
    handlerSelectedItem(item) {
      this.selectedId = item.id;
    },
    handlerAddAsset() {
      this.$Router.push({ name: "asset-edit" });
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
    display: grid;
    grid-template-columns: repeat(auto-fill, 60px);
    grid-gap: 10px;
    justify-content: center;
    .item-content {
      display: flex;
      padding: 5px 0;
      flex-direction: column;
      align-items: center;
      border-radius: 10px;
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
  .asset-item-selected {
    background-color: $light-color;
  }
  .to-add-asset {
    color: $dark-color;
    font-weight: bold;
    margin-bottom: 15px;
    text-align: center;
  }
}
</style>
