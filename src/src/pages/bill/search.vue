<template>
  <view class="b-container">
    <view class="bg" />
    <uni-search-bar
      :focus="true"
      v-model="keyWord"
      radius="100"
      cancelButton="always"
      cancelText="重置"
      placeholder="请输入关键字"
      @confirm="onSearchInputConfirm"
      @cancel="onSearchInputCancel"
      @clear="onSearchInputClear"
    >
    </uni-search-bar>

    <!-- 搜索筛选 -->
    <view class="search-filter x-bc">
      <view class="search-filter-date-picker x-c">
        <text class="search-filter-text">{{ datePicker.text }}</text>
        <i class="iconfont icon-bottom icon-down" />
      </view>
      <view class="search-filter-drawer x-c" @click="onShowFilterDrawer">
        <i class="iconfont icon-filter icon-filter" />
        <view class="search-filter-text">筛选</view>
      </view>
    </view>

    <!-- 抽屉 -->
    <uni-drawer
      ref="filterDrawer"
      mode="right"
      :width="drawerWidth"
      @change="onChangeFilterDrawer"
    >
      <view class="close">
        <button @click="onCloseFilterDrawer">
          <text class="word-btn-white">关闭Drawer</text>
        </button>
      </view>
    </uni-drawer>
  </view>
</template>

<script>
import datetime from "@/common/utils/datetime";

export default {
  data() {
    return {
      keyWord: "",
      datePicker: {
        text: "今天 / 2023年3月5日 - 3月5日",
        begin: datetime.getCurDate(),
        end: datetime.getCurDate(),
      },
      drawerWidth: 250,
    };
  },
  onLoad() {
    this.getDrawerWidth();
  },
  methods: {
    // // 动态获取Drawer宽度
    // getDrawerWidth() {
    //   let that = this;
    //   uni.getSystemInfo({
    //     success(res) {
    //       that.drawerWidth = res.windowWidth * 0.9;
    //       console.log("宽", that.drawerWidth);
    //     },
    //   });
    // },

    // 搜索框清除
    onSearchInputClear() {},

    // 输入框确认
    onSearchInputConfirm() {},

    // 搜索框取消
    onSearchInputCancel() {},

    // 打开窗口
    onShowFilterDrawer() {
      this.$refs["filterDrawer"].open();
    },
    // 关闭窗口
    onCloseFilterDrawer() {
      this.$refs["filterDrawer"].close();
    },

    // 抽屉状态发生变化触发
    onChangeFilterDrawer(e) {
      console.log(e);
    },
  },
};
</script>

<style lang="scss" scope>
.bg {
  z-index: -1;
  position: absolute;
  top: 0;
  background-color: $light-color;
  width: 100%;
  height: 210rpx;
  border-radius: 0 0 30rpx 30rpx;
}
.search {
  &-filter {
    margin: 20rpx 20rpx;
    &-date-picker {
      font-weight: bold;
      align-items: baseline;
      .icon-down {
        font-size: 20rpx;
        margin-left: 10rpx;
      }
    }
    &-drawer {
      font-weight: bold;
      color: $primary-color;
      .icon-filter {
        font-size: 35rpx;
        margin-right: 10rpx;
      }
    }
    &-text {
      font-size: 30rpx;
    }
  }
}
</style>
