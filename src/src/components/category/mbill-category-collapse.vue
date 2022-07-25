<template>
  <view class="mbill-category-collapse">
    <scroll-view
      scroll-y="true"
      class="mbill-category-collapse-scroll-view"
      :style="{ height: height - 15 + 'px' }"
    >
      <uni-collapse ref="collapse" :accordion="true" @change="collapseChange">
        <uni-collapse-item
          title-border="none"
          v-for="(g, index) in groups"
          :key="index"
          :border="false"
          :open="index === open"
        >
          <template v-slot:title>
            <view class="collapse-title">
              <view class="category-group">{{ g.name }}</view>
              <view class="category-group-sort">
                <i
                  class="iconfont icon-up-arrow-outline"
                  @click.stop="handleGroupUpSort(index)"
                />
                <i
                  class="iconfont icon-down-arrow-outline"
                  @click.stop="handleGroupDownSort(index)"
                />

                <i
                  class="iconfont icon-list-3"
                  @click.stop="handleEditGroup(index, g)"
                />
              </view>
            </view>
          </template>
          <view
            class="item-content"
            v-for="(item, ind) in g.childs"
            :key="ind"
            @click="handleEditItem(index, ind, item)"
          >
            <view class="category-item-content">
              <image class="image" :src="item.iconUrl" />
              <text class="text">{{ item.name }}</text>
            </view>
            <view class="category-item-sort">
              <i
                class="iconfont icon-up-arrow-outline"
                @click.stop="handleItemUpSort(index, ind)"
              />
              <i
                class="iconfont icon-down-arrow-outline"
                @click.stop="handleItemDownSort(index, ind)"
              />

              <i
                class="iconfont icon-close"
                @click.stop="handleDelItem(index, ind, item)"
              />
            </view>
          </view>
          <view class="add-category-item" @tap="handleAddItem(index)"
            >添加</view
          >
        </uni-collapse-item>
      </uni-collapse>
    </scroll-view>
  </view>
</template>

<script>
// 操作类型：0 选中；1 删除；2 新增
export default {
  name: "mbill-category-collapse",
  props: {
    height: {
      type: [Number, String],
      default: 300,
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      open: 0,
      groups: [],

      selItem: {
        type: -1,
        index: 0,
        id: 0,
      },
      selGroup: {
        type: -1,
        index: 0,
        id: 0,
      },
    };
  },
  watch: {
    data(val) {
      this.groups = val;
      console.log("data 变化了", this.open, this.groups);
      // 当前展开项是否已被删除
      if (
        this.selGroup.type == 0 &&
        this.open == this.selGroup.index && // 当前选中项为展开状态
        this.groups[this.selGroup.index].id != this.selGroup.id // 并且回调时不存在该分组
      ) {
        console.log(
          "关闭分组",
          this.groups[this.selGroup.index].id,
          this.selGroup.id
        );
        this.open = -1;
      }

      if (
        this.selItem.type == 1 &&
        this.groups[this.open].childs[this.selItem.index].id != this.selItem.id // 并且回调时不存在该分类
      ) {
        this.$nextTick(() => {
          this.$refs.collapse.resize();
        });
      }
    },
  },
  created() {},
  methods: {
    // 编辑分组
    handleEditGroup(index, group) {
      this.handleGroupEvent(0, index, group);
    },

    // 触发分组事件
    handleGroupEvent(type, index, group) {
      // console.log("edit group", group);
      this.selGroup = {
        type,
        index,
        id: group.id,
      };
      this.$emit("selected-group", {
        type,
        group: { index, ...group },
      });
    },

    // 分组排序向上
    handleGroupUpSort(index) {
      // console.log("open", this.open, index);
      this.sort(this.groups, index, 1);
    },

    // 分组排序向下
    handleGroupDownSort(index) {
      // console.log("open", this.open);
      this.sort(this.groups, index, 0);
    },

    handleEditItem(gIndex, index, item) {
      this.handleItemEvent(0, gIndex, index, item);
    },

    handleDelItem(gIndex, index, item) {
      this.handleItemEvent(1, gIndex, index, item);
    },

    // 新增子项
    handleAddItem(gIndex, index, item) {
      // console.log("del group", item);
      this.handleItemEvent(2, gIndex, index, item);
    },

    // 触发子项事件
    handleItemEvent(type, gIndex, index, item) {
      // console.log("del group", item);
      this.selItem = {
        type,
        index,
        id: item.id,
      };
      this.$emit("selected-item", { type, item: { gIndex, index, ...item } });
    },

    // 子项排序向上
    handleItemUpSort(gIndex, index) {
      // console.log("handleItemUpSort", gIndex, index);
      this.sort(this.groups[gIndex].childs, index, 1);
    },

    // 子项排序向下
    handleItemDownSort(gIndex, index) {
      // console.log("open", this.open);
      this.sort(this.groups[gIndex].childs, index, 0);
    },

    /**
     * @description: 排序整合
     * @param {int} index 当前索引
     * @param {*} direction 方向 0：向下 1：向上
     * @param {*} this
     * @return {*}
     */
    sort(list, index, direction) {
      if (
        (direction === 0 && index == list.length - 1) ||
        (direction === 1 && index == 0)
      ) {
        return;
      }
      let newIndex = direction === 0 ? index + 1 : index - 1;
      list[index] = list.splice(newIndex, 1, list[index])[0];
      if (this.open === index) {
        this.open = newIndex;
      }

      // 获取排序后数据
      let sorts = list.map((item, index) => {
        return {
          id: item.id,
          sort: list.length - index,
        };
      });

      this.$emit("sort", sorts);
    },

    collapseChange(e) {
      // console.log("change", e);
      // 赋值-1是为了重置open的值
      if (e.length === 0) e = "-1";
      this.open = Number(e);
    },
  },
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
    .collapse-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .category-group {
        font-weight: bold;
        padding: 20rpx 30rpx;
      }
      .category-group-sort {
        width: 240rpx;
        display: flex;
        align-items: flex-start;
        margin-right: 30rpx;
      }
      i {
        position: relative;
        z-index: 99;
        display: flex;
        font-size: 40rpx;
        color: $dark-color;
        padding: 10rpx;
        margin: 5rpx 15rpx;
        &::after {
          content: ""; // ::before and ::after both require content
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: $grey-light-color;
          z-index: -1;
        }
      }
    }
    .item-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 20rpx;
      margin: 0 50rpx;
      padding: 20rpx 0;
      .category-item-content {
        display: flex;
        align-items: center;
        width: 100%;
        .image {
          height: 60rpx;
          width: 60rpx;
          margin-right: 30rpx;
        }
        .text {
          font-weight: bold;
          color: $grey-black-text-color;
          font-size: 30rpx;
        }
      }
      .category-item-sort {
        display: flex;
        align-items: flex-start;
        font-size: 40rpx;
      }

      i {
        position: relative;
        z-index: 99;
        display: flex;
        font-size: 30rpx;
        color: $dark-color;
        padding: 10rpx;
        margin: 5rpx 15rpx;
        &::after {
          content: ""; // ::before and ::after both require content
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: $grey-light-color;
          z-index: -1;
        }
      }
    }
    .add-category-item {
      font-size: 30rpx;
      color: $dark-color;
      font-weight: bold;
      padding: 20rpx 0;
      text-align: center;
    }
    .category-item-selected {
      background-color: $light-color;
    }
  }
}
</style>
