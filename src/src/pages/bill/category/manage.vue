<template>
  <view class="bill-category-manage">
    <view class="type-tabs">
      <mb-ba-focus-tabs
        v-model="type"
        :items="types"
        @selected="handleTypeSwitch"
      />
    </view>
    <view class="category-collapse-content">
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
    </view>
    <view class="add-category-group" @tap="handleAddGroup">添加分组</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      type: 0,
      types: [
        { key: 0, text: "支出" },
        { key: 1, text: "收入" },
      ],
      groups: [],
    };
  },
  onLoad(option) {
    if (option.type != undefined) {
      this.type = option.type;
    }
    this.getCategoryGroups(this.type);
  },
  onShow() {},
  methods: {
    // 选中分类
    handleSelectedItem(category) {},

    // 添加分类
    handleAddCategory(groupId) {
      console.log(groupId, "分组Id");
      this.$tip.toast("开发中，敬请期待");
    },

    // 添加分组
    handleAddGroup() {
      this.$tip.toast("开发中，敬请期待");
    },

    // 切换分类类型
    handleTypeSwitch(type) {
      // this.type = key;
      this.getCategoryGroups(type);
    },

    // 获取账单分类
    getCategoryGroups(type) {
      this.$api.categoryGroups({ type: type }).then((res) => {
        if (res.data.code === 0) {
          // this.groups = [];
          this.groups = res.data.result;
          this.$forceUpdate();
        }
      });
    },
  },
};
</script>

<style lang="scss" scope>
.bill-category-manage {
  .type-tabs {
    font-size: 35rpx;
    padding: 30rpx 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .category-collapse-content {
    background: #ffffff;
    border-radius: 30rpx;
    margin: 0 10rpx;
    padding: 10rpx;
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

  .add-category-group {
    color: $dark-color;
    font-weight: bold;
    margin-top: 40rpx;
    text-align: center;
  }
}
</style>
