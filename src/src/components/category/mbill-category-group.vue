<template>
  <view class="mbill-category-group">
    <view v-for="(d, dind) in groups" :key="dind">
      <view class="category-group">{{ d.name }}</view>
      <view class="category-item">
        <view
          :class="[
            'item-content',
            selectedBId === item.bId ? 'category-item-selected' : '',
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
    <view class="to-add-category" @click="onAddCategory">管理分类</view>
  </view>
</template>

<script>
export default {
  name: "mbill-category-group",
  props: {
    groups: {
      type: Array,
      default: [],
    },
    type: {
      type: Number,
      default: 0,
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
      // console.log("分类", value);
      this.selectedBId = value;
    },
  },
  methods: {
    onSelectedItem(item) {
      this.selectedBId = item.bId;
      this.$emit("selected", item);
    },

    // 跳转新增分类页面
    onAddCategory() {
      this.$Router.push({
        name: "category-manage",
        params: { type: this.type, chan: "refresh" },
      });
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-category-group {
  margin: 0 20rpx;
  .category-group {
    font-weight: bold;
    margin-top: 30rpx;
    margin-bottom: 10rpx;
  }
  .category-item {
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
  .category-item-selected {
    background-color: $light-color;
  }
  .to-add-category {
    color: $dark-color;
    font-weight: bold;
    padding: 30rpx 0 40rpx 0;
    text-align: center;
  }
}
</style>
