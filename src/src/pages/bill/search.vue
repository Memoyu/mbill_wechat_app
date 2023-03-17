<template>
  <view class="b-container">
    <view class="bg" />
    <view id="header-filter">
      <uni-search-bar
        v-model="keyWord"
        radius="100"
        cancelButton="none"
        placeholder="请输入关键字"
        @confirm="onSearchInputConfirm"
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
    </view>
    <scroll-view
      class="search-items-container"
      :style="{
        height: scrollHeight + 'px',
      }"
      scroll-y="true"
      @scrolltolower="onLowerBottom"
    >
      <view class="search-items" v-for="(b, index) in items" :key="index">
        <mb-b-search-item class="search-items-item" :bill="b" />
      </view>
      <!-- 空占位 -->
      <mb-ba-empty v-if="items.length <= 0" />
    </scroll-view>

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
      scrollHeight: 300,
      openDate: false,
      openFilter: false,
      keyWord: "",
      filter: {},
      items: [],
      page: {
        page: 1,
        size: 15,
      },
      total: 0,
    };
  },
  onLoad() {
    this.getDynamicHeight();
    this.initFilter();
    this.searchBill();
  },
  methods: {
    //初始化筛选条件
    initFilter() {
      this.filter = {
        types: [],
        categories: [],
        assets: [],
      };
      var b = new Date();
      var e = new Date();
      var bY = b.getFullYear();
      var bM = b.getMonth() + 1;
      var eM = e.getMonth() + 1;
      var bD = b.getDate();
      var eD = e.getDate();
      var text = "今日 / " + `${bY}年${bM}月${bD}日 - ${eM}月${eD}日`;
      this.filter.date = {
        text,
        selected: 1,
        begin: datetime.getCurDate(),
        end: datetime.getCurDate(),
      };
      this.keyWord = "";
    },

    // 搜索框清除
    onSearchInputClear() {},

    // 输入框确认
    onSearchInputConfirm() {
      this.searchBill(true);
    },

    // 搜索框重置
    onSearchInputReset() {
      this.initFilter();
      this.searchBill(true);
    },

    // 选择事件
    onSelectDate() {
      this.openDate = true;
    },

    // 确认选择日期
    onDateConfirm(e) {
      // console.log("确认", e);
      this.filter.date = e;
      this.searchBill(true);
    },

    // 筛选条件确认
    onFilterConfirm(e) {
      this.filter = e;
      this.searchBill(true);
    },

    // 打开过滤条件窗口
    onShowFilterDrawer() {
      this.openFilter = true;
    },

    // scroll触底事件
    onLowerBottom() {
      // console.log("触底加载");
      if (this.page.page * this.page.size >= this.total) return;
      // console.log("加载");
      this.page.page += 1;
      this.searchBill();
    },

    // 检索账单
    searchBill(isCover) {
      if (isCover) {
        this.items = [];
        this.page.page = 1;
      }
      let types = [];
      let categories = [];
      let assets = [];
      this.filter.types.forEach((t) => {
        types.push(t.id);
      });
      this.filter.categories.forEach((t) => {
        categories.push(t.id);
      });
      this.filter.assets.forEach((t) => {
        assets.push(t.id);
      });

      this.$api
        .searchBillPages({
          keyWord: this.keyWord,
          types: types,
          categoryIds: categories,
          assetIds: assets,
          date: {
            begin: this.filter.date.begin,
            end: this.filter.date.end,
          },
          amount: this.filter.amount,
          address: this.filter.address,
          remark: this.filter.remark,
          ...this.page,
        })
        .then((res) => {
          if (res.data.code === 0) {
            // console.log(res.data);
            this.total = res.data.result.total;
            let items =
              res.data.result.items == null ? [] : res.data.result.items;
            if (this.items.length > 0) {
              items.forEach((i) => {
                this.items.push(i);
              });
            } else {
              this.items = items;
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 获取动态高度
    getDynamicHeight() {
      let that = this;
      uni.getSystemInfo({
        success(res) {
          let pH = res.windowHeight - 5; // 多出的5px，不让底部触底
          let query = uni.createSelectorQuery();
          query.select("#header-filter").fields({ size: true });
          query.exec((data) => {
            that.scrollHeight = pH - data[0].height;
          });
        },
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
  &-items {
    margin: 20rpx;
    padding: 20rpx;
    border-radius: 26rpx;
    background: white;
    &-item {
      display: flex;
      padding: 0 20rpx;
    }
  }
}
</style>
