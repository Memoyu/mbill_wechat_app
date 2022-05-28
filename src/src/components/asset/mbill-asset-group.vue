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
    select: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      selectedId: 0,
    };
  },
  watch: {
    select(value) {
      // console.log("账户", value);
      this.selectedId = value;
    },
  },
  methods: {
    handlerSelectedItem(item) {
      this.selectedId = item.id;
      this.$emit("selected", item);
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
    margin-top: 15px;
    margin-bottom: 5px;
  }
  .asset-item {
    display: grid;
    grid-template-columns: repeat(auto-fill, 70px);
    justify-content: center;
    .item-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 10px;
      padding: 7px 0;
      .image {
        height: 35px;
        width: 35px;
      }
      .text {
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
