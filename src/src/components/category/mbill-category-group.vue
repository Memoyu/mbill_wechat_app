<template>
  <view class="mbill-category-group">
    <view v-for="(d, dind) in groups" :key="dind">
      <view class="category-group">{{ d.name }}</view>
      <view class="category-item">
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
    <!-- TODO:完成分类的添加 -->
    <view class="to-add-category" @tap="handlerAddCategory">添加分类</view>
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
  },
  methods: {
    handlerAddCategory() {
      uni.navigateTo({ url: "/pages/bill/category/edit" });
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-category-group {
  margin: 0 10px;
  .category-group {
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 5px;
  }
  .category-item {
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
  .to-add-category {
    color: $dark-color;
    font-weight: bold;
    margin-bottom: 15px;
    text-align: center;
  }
}
</style>
