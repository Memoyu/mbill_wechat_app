<template>
  <uni-drawer
    ref="selectDrawer"
    mode="right"
    :width="drawerWidth"
    @change="onChangeDrawer"
  >
    <view class="select">
      <view id="select-btn" class="select-btn x-bc">
        <view @click="onSelectAll">全选</view>
        <view @click="onConfirm">确认</view>
      </view>
      <scroll-view scroll-y="true" :style="{ height: height + 'px' }">
        <view class="select-collapse">
          <uni-collapse ref="collapse" :accordion="true">
            <uni-collapse-item
              title-border="none"
              v-for="(item, index) in items"
              :key="index"
              :border="false"
              :show-arrow="item.childs.length > 0"
            >
              <template v-slot:title>
                <view
                  class="select-collapse-title"
                  @click="onSelectedItem(item)"
                >
                  <view class="select-collapse-title-content">
                    <checkbox
                      class="select-collapse-title-content-cb"
                      :value="item.id"
                      :checked="item.checked"
                      @click.stop="onSelectedItemCheckBox(item)"
                    />
                    <view class="select-collapse-title-content-text">{{
                      item.name
                    }}</view>
                  </view>
                  <view class="select-collapse-title-selected">{{
                    item.selected
                  }}</view>
                </view>
              </template>
              <view
                class="select-collapse-item-container"
                v-for="(child, ind) in item.childs"
                :key="ind"
                @click="onSelectedChild(item, child)"
              >
                <view class="select-collapse-item">
                  <checkbox
                    class="select-collapse-item-cb"
                    :value="child.id"
                    :checked="child.checked"
                  />
                  <view class="select-collapse-item-text">{{
                    child.name
                  }}</view>
                </view>
              </view>
            </uni-collapse-item>
          </uni-collapse>
        </view>
      </scroll-view>
    </view>
  </uni-drawer>
</template>

<script>
export default {
  name: "mbill-bill-search-select-drawer",
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    groups: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      height: 300,
      drawerWidth: 300,
      selectAll: false,
      items: [
        // {
        //   name: "足球",
        //   id: 0,
        //   checked: false,
        //   selected: "",
        //   childs: [
        //     {
        //       name: "足球1",
        //       id: 0,
        //       checked: false,
        //     },
        //     {
        //       name: "足球2",
        //       id: 1,
        //       checked: false,
        //     },
        //     {
        //       name: "足球3",
        //       id: 2,
        //       checked: false,
        //     },
        //   ],
        // },
        // {
        //   name: "篮球",
        //   id: 1,
        //   checked: false,
        //   selected: "",
        //   childs: [
        //     {
        //       name: "篮球1",
        //       id: 0,
        //       checked: false,
        //     },
        //     {
        //       name: "篮球2",
        //       id: 1,
        //       checked: false,
        //     },
        //     {
        //       name: "篮球3",
        //       id: 2,
        //       checked: false,
        //     },
        //   ],
        // },
        // {
        //   name: "游泳",
        //   id: 2,
        //   checked: false,
        //   selected: "",
        //   childs: [
        //     {
        //       name: "游泳1",
        //       id: 0,
        //       checked: false,
        //     },
        //     {
        //       name: "游泳2",
        //       id: 1,
        //       checked: false,
        //     },
        //     {
        //       name: "游泳3",
        //       id: 2,
        //       checked: false,
        //     },
        //   ],
        // },
        // {
        //   name: "跑步",
        //   id: 2,
        //   checked: false,
        //   selected: "",
        //   childs: [],
        // },
      ],
    };
  },
  watch: {
    open(val) {
      if (val) {
        this.$refs["selectDrawer"].open();
      } else {
        this.$refs["selectDrawer"].close();
      }
    },
    groups(val) {
      // console.log("watch groups", val);
      this.items = val;
    },
  },
  created() {
    this.dynamicHeight();
    this.items = this.groups;
  },
  methods: {
    // 全选
    onSelectAll() {
      this.selectAll = !this.selectAll;
      this.items.forEach((i) => {
        i.checked = this.selectAll;
        if (i.childs == undefined) return;
        i.childs.forEach((c) => {
          c.checked = this.selectAll;
        });
      });
    },

    // 确认
    onConfirm() {
      this.$emit("update:open", false);
      var checked = {
        groups: [],
        childs: [],
      };
      this.items.forEach((i) => {
        if (i.checked) checked.groups.push({ id: i.id, name: i.name });
        if (i.childs == undefined) return;
        i.childs.forEach((c) => {
          if (c.checked) checked.childs.push({ id: c.id, name: c.name });
        });
      });
      this.$emit("confirm", checked);
    },

    // 抽屉状态发生变化触发
    onChangeDrawer(e) {
      this.$emit("update:open", e);
    },

    // 选中分组项
    onSelectedItem(item) {
      if (item.childs != undefined && item.childs.length > 0) return;
      this.onSelectedItemCheckBox(item);
    },

    // 选中分组项 CheckBox
    onSelectedItemCheckBox(item) {
      item.checked = !item.checked;
      // console.log("che", item.checked);
      if (item.childs == undefined || item.childs.length == 0) return;
      item.childs.forEach((child) => {
        child.checked = item.checked;
      });
      if (item.checked) item.selected = "全部";
      else item.selected = "";
    },

    // 选中分组子项
    onSelectedChild(item, child) {
      //console.log(child);
      child.checked = !child.checked;
      var isAllCheck = true;
      var selected = [];

      item.childs.forEach((c) => {
        if (!c.checked) isAllCheck = false;
        else selected.push(c.name);
      });

      item.checked = isAllCheck;
      if (isAllCheck) {
        item.selected = "全部";
      } else {
        var count = selected.length;
        item.selected = selected.slice(0, 2).join(", ");
        if (count > 2) item.selected += ` 等${count}个`;
      }
    },

    // 计算高度，动态调整swiper 高度
    dynamicHeight() {
      let that = this;
      uni.getSystemInfo({
        success(res) {
          let wh = res.windowHeight;
          let query = uni.createSelectorQuery().in(that);
          query.select("#select-btn").fields({ size: true });
          query.exec((data) => {
            let headerH = data[0].height;
            that.height = wh - headerH - 50;
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scope>
.select {
  margin: 40rpx 20rpx;
  &-btn {
    font-weight: bold;
    font-size: 30rpx;
    color: $primary-color;
  }
  &-collapse {
    margin-top: 20rpx;
    &-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20rpx 0;
      &-content {
        display: flex;
        align-items: center;
        &-cb {
          transform: scale(0.7);
        }
        &-text {
        }
      }
      &-selected {
        color: $primary-color;
        margin-right: 10rpx;
      }
    }
    &-item {
      display: flex;
      align-items: center;
      margin: 15rpx 20rpx;
      &-cb {
        transform: scale(0.7);
      }
      &-text {
        font-size: 30rpx;
      }
    }
    &-item-container {
      display: flex;
    }
  }
}
</style>