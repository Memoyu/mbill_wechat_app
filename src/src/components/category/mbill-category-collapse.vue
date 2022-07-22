<template>
  <view class="mbill-category-collapse">
    <scroll-view
      scroll-y="true"
      class="mbill-category-collapse-scroll-view"
      :style="{ height: height - 15 + 'px' }"
    >
      <uni-collapse>
        <uni-collapse-item
          v-for="(g, index) in groups"
          :key="index"
          :border="false"
          title-border="none"
          :open="index === 0"
        >
          <template v-slot:title>
            <view class="category-group">{{ g.name }}</view>
          </template>
          <view class="category-item">
            <view
              :class="['item-content']"
              v-for="(item, index) in g.childs"
              :key="index"
              @click="handleSelectedItem(item)"
            >
              <image class="image" :src="item.iconUrl" />
              <text class="text">{{ item.name }}</text>
            </view>
            <view
              class="item-content item-add-content"
              @click="handleAddCategory(g.id)"
            >
              <image class="image" src="/static/assets/add.png" />
            </view>
          </view>
        </uni-collapse-item>
      </uni-collapse>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: "mbill-category-collapse",
  props: {
    height: {
      type: [Number, String],
      default: 300,
    },
    groups: {
      type: Array,
      default: () => [],
    },
  },
  methods: {},
};
</script>

<style lang="scss" scope>
.mbill-category-collapse {
  background: #ffffff;
  border-radius: 30rpx;
  display: flex;
  margin: 0 10rpx;
  padding: 10rpx;
  &-scroll-view {
    ::-webkit-scrollbar {
      display: none;
    }
    .category-group {
      font-weight: bold;
      padding: 20rpx 30rpx;
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
    .category-item-selected {
      background-color: $light-color;
    }
  }
}
</style>
