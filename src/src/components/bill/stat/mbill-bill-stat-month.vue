<template>
  <view class="mb-stat-month">
    <view class="mb-stat-month-header" id="mb-stat-month-header">
      <mb-ba-date-scroll
        type="month"
        v-model="active"
        :specify="specify"
        @selected.stop="onSelectedMonth"
      />
    </view>
    <!-- <view> -->
    <scroll-view
      class="mb-stat-month-content"
      :style="{ height: scrollH + 'px' }"
      scroll-y="true"
      :refresher-enabled="true"
      :refresher-triggered="triggered"
      @refresherpulling="onPulling"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
      @refresherabort="onAbort"
    >
      <!-- 当月收支统计 -->
      <view class="content-total x-ac">
        <view class="content-total-month y-bc">
          <text class="content-total-month-expend">{{ stat.expend }}</text>
          <text class="content-total-title">当月支出</text>
        </view>
        <view>
          <view class="content-total-month">
            <text class="content-total-title">当月收入：</text>
            <text class="content-total-bold">{{ stat.income }}</text>
          </view>
          <view class="content-total-month content-total-mg-top">
            <text class="content-total-title">平均支出：</text>
            <text class="content-total-bold">{{ stat.expendAvg }}</text>
          </view>
        </view>
      </view>

      <!-- 当月收支趋势统计 -->
      <view class="x-bc">
        <view class="mb-stat-divide-title">收/支趋势</view>
        <view class="mb-stat-tarea-hint x-f">
          <view class="mb-stat-tarea-hint-item x-f">
            <view class="point income-bg-color"></view>
            <view class="">收入</view>
          </view>
          <view class="mb-stat-tarea-hint-item x-f">
            <view class="point expend-bg-color"></view>
            <view class="">支出</view>
          </view>
        </view>
      </view>
      <view class="mb-stat-month-bg-br">
        <view class="charts-box">
          <qiun-data-charts
            type="tarea"
            :chartData="monthTrend"
            :canvas2d="canvas2d"
            :ontouch="true"
            inScrollView="true"
          />
        </view>
        <view class="mb-stat-month-rang x-ac">
          <view class="y-bc">
            <text class="mb-stat-month-rang-num">{{
              range.incomeHighest
            }}</text>
            <text class="mb-stat-month-rang-text">最高收入/元</text>
          </view>
          <view class="y-bc">
            <text class="mb-stat-month-rang-num">{{ range.incomeLowst }}</text>
            <text class="mb-stat-month-rang-text">最低收入/元</text>
          </view>
          <view class="y-bc">
            <text class="mb-stat-month-rang-num">{{
              range.expendHighest
            }}</text>
            <text class="mb-stat-month-rang-text">最高支出/元</text>
          </view>
          <view class="y-bc">
            <text class="mb-stat-month-rang-num">{{ range.expendLowst }}</text>
            <text class="mb-stat-month-rang-text">最低支出/元</text>
          </view>
        </view>
      </view>

      <!-- 当月分类数据统计 -->
      <view class="x-bc">
        <view class="mb-stat-divide-title">分类占比</view>
        <view class="type-tabs">
          <mb-ba-focus-tabs :items="types" @selected="onTypeSwitch" />
        </view>
      </view>
      <view class="mb-stat-month-bg-br">
        <view class="charts-box">
          <mb-ba-empty v-if="isEmpty" />
          <qiun-data-charts
            v-else
            type="ring"
            :opts="opts"
            :canvas2d="canvas2d"
            :chartData="monthCategoryPercent"
            inScrollView="true"
          />
        </view>
      </view>
      <view v-if="categoryGroups.length > 0" class="mb-stat-month-bg-br">
        <mb-stat-category-group
          :groups="categoryGroups"
          @select="onCategoryClick"
        />
      </view>
    </scroll-view>
    <!-- </view> -->
  </view>
</template>

<script>
import datetime from "@/common/utils/datetime";

export default {
  name: "mbill-bill-stat-month",
  props: {
    height: {
      type: [Number, String],
      default: 300,
    },
  },
  data() {
    return {
      init: false,
      active: 0,
      scrollH: 0,
      canvas2d: false,
      opts: {
        title: {
          name: "分类占比",
          fontSize: 20,
          color: "#666666",
        },
      },
      isEmpty: false,
      selectMonth: `${datetime.getCurYear()}-${datetime.getCurMonth()}`,
      type: 0,
      types: [
        { key: 0, text: "支出" },
        { key: 1, text: "收入" },
      ],
      specify: {
        year: datetime.getCurYear(),
        month: datetime.getCurMonth(),
      },
      stat: {
        expend: "0",
        income: "0",
        expendAvg: "0",
      },
      range: {
        expendHighest: "0",
        expendLowst: "0",
        incomeHighest: "0",
        incomeLowst: "0",
      },
      monthTrend: {},
      monthCategoryPercent: {},
      categoryGroups: [],
      triggered: false,
      freshing: false,
    };
  },
  watch: {
    height(val) {
      this.calcuScrollHeight(val);
    },
  },
  created() {
    this.getIsCanvas2d();
    // console.log("canvas2d-", this.canvas2d);
  },
  methods: {
    //#region 加载数据

    // 加载数据（外部调用）
    loadData() {
      if (this.init === true) return;
      this.init = true;
      // 初始化数据
      // console.log("初始化数据-月数据");
      this.triggered = true;
      // this.onRefresh();
    },

    // 加载数据
    loadStatData() {
      var p1 = this.loadSummaryStat();
      var p2 = this.loadMonthTrendData();
      var p3 = this.loadCategoryPercent();
      var p4 = this.loadCategoryPercentList();
      return Promise.all([p1, p2, p3, p4]);
    },

    // 加载分类占比
    loadCategoryStat() {
      this.loadCategoryPercent();
      this.loadCategoryPercentList();
    },

    // 加载统计汇总数据
    loadSummaryStat() {
      return this.$api
        .monthTotalStat({
          month: this.selectMonth,
          opearte: 1,
        })
        .then((res) => {
          // console.log("列表", res);
          if (res.data.code === 0) {
            this.stat = res.data.result;
          }
        });
    },
    // 加载月收支趋势数据
    loadMonthTrendData() {
      return this.$api
        .monthTotalTrend({
          month: this.selectMonth,
        })
        .then((res) => {
          // console.log("列表", res);
          if (res.data.code === 0) {
            let data = res.data.result;
            this.range = {
              expendHighest: data.expendHighest,
              expendLowst: data.expendLowst,
              incomeHighest: data.incomeHighest,
              incomeLowst: data.incomeLowst,
            };
            this.monthTrend = JSON.parse(
              JSON.stringify({
                categories: data.categories,
                series: data.series,
              })
            );
          }
        });
    },
    // 加载分类占比数据
    loadCategoryPercent() {
      return this.$api
        .categoryPercent({
          date: this.selectMonth,
          type: 0, // 月统计
          billType: this.type,
        })
        .then((res) => {
          if (res.data.code === 0) {
            let data = res.data.result;
            // console.log("列表", data);
            this.isEmpty = data.series.length <= 0;
            this.monthCategoryPercent = JSON.parse(
              JSON.stringify({
                series: [{ data: data.series }],
              })
            );
          }
        });
    },
    // 加载分类占比列表
    loadCategoryPercentList() {
      return this.$api
        .categoryPercentGroup({
          date: this.selectMonth,
          type: 0, // 月统计
          billType: this.type,
        })
        .then((res) => {
          if (res.data.code === 0) {
            let data = res.data.result;
            // console.log("列表", data);
            this.categoryGroups = data;
          }
        });
    },

    //#endregion

    // 指定日期
    specifyDate(date) {
      this.specify = date;
    },

    // 切换月份
    onSelectedMonth(item) {
      // console.log("选中的日期", item);
      let select = `${item.year}-${item.month}`;
      if (select == this.selectMonth) return;
      this.selectMonth = select;
      this.loadStatData();
    },

    // 切换账单类型
    onTypeSwitch(key) {
      // console.log(key);
      this.type = key;
      this.loadCategoryStat();
    },

    // 点击对应分类占比
    onCategoryClick(item) {
      // 向外传递参数
      this.$emit("select-category", {
        id: item.id,
        category: item.category,
        date: this.selectMonth,
        type: 0,
      });
    },

    // 计算scroll-view 最高度
    calcuScrollHeight(height) {
      let that = this;
      let query = uni.createSelectorQuery().in(that);
      query.select("#mb-stat-month-header").fields({ size: true });
      query.exec((data) => {
        that.scrollH = height - data[0].height;
      });
    },

    // 获取当前设备平台信息
    getIsCanvas2d() {
      let platform = "";
      uni.getSystemInfo({
        success(res) {
          platform = res.platform;
        },
      });
      // console.log("platform-", platform);
      switch (platform) {
        case "android":
        case "ios":
          this.canvas2d = true;
          break;
        default:
          this.canvas2d = false;
          break;
      }
    },

    // 自定义下拉刷新控件被下拉
    onPulling(e) {
      // console.log("onpulling", e);
      if (e.detail.deltaY < 0) return; // 防止上滑页面也触发下拉
      this.triggered = true;
    },

    // 自定义下拉刷新被触发
    async onRefresh() {
      if (this.freshing) return;
      this.freshing = true;
      this.loadStatData().finally((res) => {
        this.triggered = false;
        this.freshing = false;
      });
    },
    // 自定义下拉刷新被复位
    onRestore() {
      this.triggered = "restore"; // 需要重置
    },
    // 自定义下拉刷新被中止
    onAbort() {},
  },
};
</script>

<style lang="scss" scope>
// background-color: white;
.mb-stat-month {
  &-header {
    margin: 0 20rpx;
  }
  &-content {
    .content-total {
      color: #ffffff;
      padding: 40rpx 30rpx;
      margin: 30rpx 20rpx;
      background-color: $primary-color;
      border-radius: 10rpx 35rpx 10rpx 35rpx;
      &-month {
        display: flex;
        flex-wrap: nowrap;
        font-size: 30rpx;
        &-expend {
          font-size: 50rpx;
          font-weight: bold;
        }
      }
      &-mg-top {
        margin-top: 25rpx;
      }
      &-title {
        color: $grey-bright-color;
      }
      &-bold {
        font-weight: bold;
      }
    }

    .type-tabs {
      margin: 0 20rpx;
    }
  }

  &-rang {
    margin: 20rpx 30rpx 50rpx 30rpx;
    font-size: 25rpx;
    &-num {
      color: $primary-color;
      font-size: 40rpx;
      font-weight: bold;
    }
    &-text {
      color: $grey-text-color;
    }
  }

  &-bg-br {
    background-color: #ffffff;
    border-radius: 30rpx;
    padding: 10rpx;
    margin: 0 20rpx 20rpx 20rpx;
  }
  .charts-box {
    width: 100%;
    height: 600rpx;
  }
}
.mb-stat-divide-title {
  position: sticky;
  display: inline-block;
  padding-bottom: 8rpx;
  margin-bottom: 24rpx;
  font-size: 40rpx;
  color: #40485b;
  font-weight: bolder;
  margin-left: 28rpx;

  &:before {
    content: "";
    position: absolute;
    background: $primary-color;
    width: calc(100% + 35rpx);
    height: 24rpx;
    bottom: 0;
    left: 0;
    border-radius: 24rpx;
    z-index: -1;
  }
}

.mb-stat-tarea-hint {
  margin-right: 30rpx;
  &-item {
    margin-left: 30rpx;
    color: $grey-text-color;
    .point {
      margin-right: 20rpx;
      width: 30rpx;
      height: 30rpx;
      border-radius: 50%;
    }
  }
}
</style>
