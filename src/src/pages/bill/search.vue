<template>
  <view class="b-container">
    <view class="bg" />
    <uni-search-bar
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
        <text class="search-filter-text">{{ filter.date.text }}</text>
        <i class="iconfont icon-date-to icon-to" />
      </view>
      <view class="search-filter-drawer x-c" @click="onShowFilterDrawer">
        <i class="iconfont icon-filter icon-filter" />
        <view class="search-filter-text">筛选</view>
      </view>
    </view>

    <!-- 日期抽屉 -->
    <mb-search-date-drawer
      :open.sync="openDate"
      @confirm="onDateConfirm"
      :date="filter.date"
    />

    <!-- 筛选抽屉 -->
    <mb-search-filter-drawer
      :filter.sync="filter"
      :open.sync="openFilter"
      @confirm="onFilterConfirm"
    />
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
      filter: {
        date: {
          text: "",
          begin: datetime.getCurDate(),
          end: datetime.getCurDate(),
        },
      },
    };
  },
  onLoad() {
    var b = new Date();
    var e = new Date();
    var bY = b.getFullYear();
    var bM = b.getMonth() + 1;
    var eM = e.getMonth() + 1;
    var bD = b.getDate();
    var eD = e.getDate();
    var text = "今日 / " + `${bY}年${bM}月${bD}日 - ${eM}月${eD}日`;
    this.filter.date.text = text;
  },
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

    // 确认选择日期
    onDateConfirm(e) {
      // console.log("确认", e);
      this.filter.date = e;
    },

    // 筛选条件确认
    onFilterConfirm(e) {
      this.filter = e;
    },

    // 打开过滤条件窗口
    onShowFilterDrawer() {
      this.openFilter = true;
    },

    searchBill(filter) {
      this.$api
        .searchBillPages({
          date: this.data.date,
          dateType: this.data.type,
          categoryId: this.data.id,
          ...this.billPage,
        })
        .then((res) => {
          // console.log("列表", res);
          if (res.data.code === 0) {
            console.log(res.data);
          }
        })
        .finally(() => {
          this.loading = false;
        });
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
      font-size: 27rpx;
    }
  }
}
</style>
