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
      <view class="search-filter-date-picker x-c" @click="onSelectDate">
        <text class="search-filter-text">{{ datePicker.text }}</text>
        <i class="iconfont icon-date-to icon-to" />
      </view>
      <view class="search-filter-drawer x-c" @click="onShowFilterDrawer">
        <i class="iconfont icon-filter icon-filter" />
        <view class="search-filter-text">筛选</view>
      </view>
    </view>

    <!-- 日期抽屉 -->
    <mb-search-date-drawer :open.sync="openDate" />

    <!-- 筛选抽屉 -->
    <mb-search-filter-drawer :open.sync="openFilter" />
  </view>
</template>

<script>
import datetime from "@/common/utils/datetime";

export default {
  data() {
    return {
      openDate: false,
      openFilter: false,
      keyWord: "",
      datePicker: {
        text: "今天 / 2023年3月5日 - 3月5日",
        begin: datetime.getCurDate(),
        end: datetime.getCurDate(),
      },
    };
  },
  onLoad() {},
  methods: {
    // 搜索框清除
    onSearchInputClear() {},

    // 输入框确认
    onSearchInputConfirm() {},

    // 搜索框取消
    onSearchInputCancel() {},

    // 选择事件
    onSelectDate() {
      this.openDate = true;
    },

    // 打开过滤条件窗口
    onShowFilterDrawer() {
      this.openFilter = true;
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
    margin: 30rpx 20rpx;
    &-date-picker {
      font-weight: bold;
      align-items: center;
      .icon-date-to {
        margin-left: 10rpx;
        font-size: 20rpx;
      }
    }
    &-drawer {
      font-weight: bold;
      color: $primary-color;
      .icon-filter {
        font-size: 35rpx;
        margin-right: 5rpx;
      }
    }
    &-text {
      font-size: 30rpx;
    }
  }
}
</style>
