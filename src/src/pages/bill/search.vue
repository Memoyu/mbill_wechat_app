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
      <view class="search-options">
        <view class="search-options-btn x-bc">
          <view @click="onCloseFilterDrawer">确认</view>
          <view @click="onResetFilter">重置</view>
        </view>
        <view class="search-options-container">
          <!-- 账单类型 -->
          <view class="search-options-cell">
            <i class="iconfont icon-select search-options-cell-icon" />
            <view class="search-options-cell-item">
              <view class="search-options-cell-item-title x-bc">
                <text>类型</text>
                <view class="search-options-cell-item-content">
                  <text>全部</text>
                  <i class="iconfont icon-to search-options-cell-to-icon" />
                </view>
              </view>
              <view class="search-options-cell-bottom-line" />
            </view>
          </view>

          <!-- 账单分类 -->
          <view class="search-options-cell">
            <i class="iconfont icon-category search-options-cell-icon" />
            <view class="search-options-cell-item">
              <view class="search-options-cell-item-title x-bc">
                <text>分类</text>
                <view class="search-options-cell-item-content">
                  <text>全部</text>
                  <i class="iconfont icon-to search-options-cell-to-icon" />
                </view>
              </view>
              <view class="search-options-cell-bottom-line" />
            </view>
          </view>

          <!-- 账单账户 -->
          <view class="search-options-cell">
            <i class="iconfont icon-bankcard search-options-cell-icon" />
            <view class="search-options-cell-item">
              <view class="search-options-cell-item-title x-bc">
                <text>账户</text>
                <view class="search-options-cell-item-content">
                  <text>全部</text>
                  <i class="iconfont icon-to search-options-cell-to-icon" />
                </view>
              </view>
              <view class="search-options-cell-bottom-line" />
            </view>
          </view>

          <!-- 账单时间 -->
          <view class="search-options-cell">
            <i class="iconfont icon-time search-options-cell-icon" />
            <view class="search-options-cell-item">
              <view class="search-options-cell-item-title x-bc">
                <text>时间</text>
                <view class="search-options-cell-item-content">
                  <text>全部时间</text>
                  <i class="iconfont icon-to search-options-cell-to-icon" />
                </view>
              </view>
              <view class="search-options-cell-bottom-line" />
            </view>
          </view>

          <!-- 账单金额 -->
          <view class="search-options-cell">
            <i class="iconfont icon-money search-options-cell-icon" />
            <view class="search-options-cell-item">
              <view class="search-options-cell-item-title x-bc">
                <text>金额</text>
                <view class="search-options-cell-item-content">
                  <text>10</text>
                  <text>-</text>
                  <text>20</text>
                  <i class="iconfont icon-to search-options-cell-to-icon" />
                </view>
              </view>
              <view class="search-options-cell-bottom-line" />
            </view>
          </view>

          <!-- 账单地址 -->
          <view class="search-options-cell">
            <i class="iconfont icon-dizhi search-options-cell-icon" />
            <view class="search-options-cell-item">
              <view class="search-options-cell-item-title x-bc">
                <text>地址</text>
                <view class="search-options-cell-item-content">
                  <text>白云</text>
                  <i class="iconfont icon-to search-options-cell-to-icon" />
                </view>
              </view>
              <view class="search-options-cell-bottom-line" />
            </view>
          </view>

          <!-- 账单备注 -->
          <view class="search-options-cell">
            <i class="iconfont icon-note-text search-options-cell-icon" />
            <view class="search-options-cell-item">
              <view class="search-options-cell-item-title x-bc">
                <text>备注</text>
                <view class="search-options-cell-item-content">
                  <text>账单备注</text>
                  <i class="iconfont icon-to search-options-cell-to-icon" />
                </view>
              </view>
            </view>
          </view>
        </view>
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
      drawerWidth: 300,
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

    // 打开窗口
    onShowFilterDrawer() {
      this.$refs["filterDrawer"].open();
    },

    // 关闭窗口
    onCloseFilterDrawer() {
      this.$refs["filterDrawer"].close();
    },

    // 重置筛选项
    onResetFilter() {},

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
    margin: 30rpx 20rpx;
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
        margin-right: 5rpx;
      }
    }
    &-text {
      font-size: 30rpx;
    }
  }

  &-options {
    margin: 40rpx 25rpx;
    &-btn {
      font-weight: bold;
      font-size: 30rpx;
      color: $primary-color;
    }

    &-container {
      margin-top: 50rpx;
    }

    &-cell {
      display: flex;
      align-items: center;
      font-size: 32rpx;
      margin: 45rpx 0;
      &-icon {
        margin-right: 10rpx;
        font-size: 40rpx;
      }
      &-to-icon {
        margin-left: 20rpx;
        font-size: 20rpx;
        display: flex;
        align-items: center;
      }
      &-item {
        width: 100%;
        &-title {
          margin-bottom: 20rpx;
        }
        &-content {
          display: flex;
        }
      }
      &-bottom-line {
        height: 2rpx;
        background: $bright-color;
        width: 100%;
      }
    }
  }
}
</style>
