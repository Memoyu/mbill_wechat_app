<template>
  <view class="mb-stat-year">
    <view class="mb-stat-year-header" id="mb-stat-year-header">
      <mb-ba-date-scroll
        type="year"
        v-model="dateActive"
        @selected.stop="handleSelectedYear"
      />
    </view>
    <view class="mb-stat-year-content" :style="{ height: scrollH + 'px' }">
      <scroll-view scroll-y="true" style="height: 100%">
        <!-- 当年收支统计 -->
        <view class="content-total x-bc">
          <view class="content-total-month y-bc">
            <text class="content-total-month-expend">{{ stat.expend }}</text>
            <text class="content-total-title">当年支出</text>
          </view>
          <view>
            <view class="content-total-month">
              <text class="content-total-title">当年收入：</text>
              <text class="content-total-bold">{{ stat.income }}</text>
            </view>
            <view class="content-total-month content-total-mg-top">
              <text class="content-total-title">平均支出：</text>
              <text class="content-total-bold">{{ stat.average }}</text>
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
        <view class="mb-stat-year-bg-br">
          <view class="charts-box">
            <qiun-data-charts
              type="tarea"
              :chartData="yearTrend"
              :canvas2d="canvas2d"
              :ontouch="true"
              inScrollView="true"
            />
          </view>
          <view class="mb-stat-year-rang x-ac">
            <view class="y-bc">
              <text class="mb-stat-year-rang-num">{{
                range.incomeHighest
              }}</text>
              <text class="mb-stat-year-rang-text">最高收入/元</text>
            </view>
            <view class="y-bc">
              <text class="mb-stat-year-rang-num">{{ range.incomeLowst }}</text>
              <text class="mb-stat-year-rang-text">最低收入/元</text>
            </view>
            <view class="y-bc">
              <text class="mb-stat-year-rang-num">{{
                range.expendHighest
              }}</text>
              <text class="mb-stat-year-rang-text">最高支出/元</text>
            </view>
            <view class="y-bc">
              <text class="mb-stat-year-rang-num">{{ range.expendLowst }}</text>
              <text class="mb-stat-year-rang-text">最低支出/元</text>
            </view>
          </view>
        </view>

        <!-- 月份收支统计 -->
        <view class="x-bc">
          <view class="mb-stat-divide-title">占比统计</view>
          <picker
            v-if="percActive === 0"
            @change="handleTypePickerChange"
            :value="type"
            :range="types"
          >
            <view class="type-picker x-c">
              <view>{{ types[type] }}</view>
              <i class="iconfont icon-bottom icon-down" />
            </view>
          </picker>
        </view>
        <view class="mb-stat-year-func-tab">
          <mb-ba-tabs :type="percList" v-model="percActive" />
        </view>
        <view v-if="percActive === 0">
          <view class="mb-stat-year-bg-br">
            <view class="charts-box">
              <qiun-data-charts
                type="ring"
                :canvas2d="canvas2d"
                :chartData="yearCategoryPercent"
                inScrollView="true"
              />
            </view>
          </view>
          <view class="mb-stat-year-bg-br">
            <mb-stat-category-group :groups="categoryGroups" />
          </view>
        </view>

        <view v-if="percActive === 1" class="mb-stat-year-bg-br">
          <mb-stat-month-list @click="handleMonthClick" :year="year" />
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import datetime from "@/common/utils/datetime";

export default {
  name: "mbill-bill-stat-year",
  props: {
    height: {
      type: [Number, String],
      default: 300,
    },
  },
  data() {
    return {
      init: false,
      dateActive: 0,
      percActive: 0,
      scrollH: 0,
      canvas2d: false,
      selectYear: `${datetime.getCurYear()}`,
      type: 0,
      types: ["支出", "收入"],
      percList: [
        {
          title: "分类占比",
        },
        {
          title: "月份占比",
        },
      ],
      year: datetime.getCurYear(),
      stat: {
        expend: "3,3543,363",
        income: "2,305,555",
        average: "12,055,555",
      },
      range: {
        expendHighest: "0",
        expendLowst: "0",
        incomeHighest: "0",
        incomeLowst: "0",
      },
      yearTrend: {},
      yearCategoryPercent: {},
      categoryGroups: [],
    };
  },
  watch: {
    height(val) {
      this.calcuScrollHeight(val);
    },
  },
  created() {
    this.getIsCanvas2d();
  },
  methods: {
    initData() {
      if (this.init === true) return;
      this.init = true;
      // 初始化数据
      // console.log("初始化数据-年数据");
      this.$tip.loading();
      try {
        this.loadSummaryStat();
        this.loadYearTrendData();
        this.initCategoryPercent();
      } finally {
        this.$tip.loaded();
      }
    },

    // 加载分类占比
    initCategoryPercent() {
      this.loadCategoryPercent();
      this.loadCategoryPercentList();
    },

    // 加载统计汇总数据
    loadSummaryStat() {
      this.$api
        .yearTotalStat({
          year: this.selectYear,
          opearte: 1,
        })
        .then((res) => {
          console.log("列表", res);
          if (res.data.code === 0) {
            this.stat = res.data.result;
          }
        });
    },
    // 加载月收支趋势数据
    loadYearTrendData() {
      this.$api
        .yearTotalTrend({
          year: this.selectYear,
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
            this.yearTrend = JSON.parse(
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
      this.$api
        .categoryPercent({
          date: `${this.selectYear}-1`,
          type: 1, // 年统计
          billType: this.type,
        })
        .then((res) => {
          if (res.data.code === 0) {
            let data = res.data.result;
            // console.log("列表", data);
            this.yearCategoryPercent = JSON.parse(
              JSON.stringify({
                series: [{ data: data.series }],
              })
            );
          }
        });
    },
    // 加载分类占比列表
    loadCategoryPercentList() {
      this.$api
        .categoryPercentGroup({
          date: `${this.selectYear}-1`,
          type: 1, // 年统计
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

    // 切换年份
    handleSelectedYear(item) {
      // console.log("年份选择", item);
      this.year = item.year;
    },

    // 点击月份
    handleMonthClick(item) {
      // console.log("月份选择", item);
      this.$emit("monthclick", item);
    },

    // 切换账单类型
    handleTypePickerChange({ detail }) {
      console.log(detail);
      this.type = detail.value;
    },

    // 计算scroll-view 最高度
    calcuScrollHeight(height) {
      let that = this;
      let query = uni.createSelectorQuery().in(that);
      query.select("#mb-stat-year-header").fields({ size: true });
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
  },
};
</script>

<style lang="scss" scope>
.mb-stat-year {
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

    .type-picker {
      margin: 0 50rpx;
      font-size: 15px;
      font-weight: bold;
      align-items: baseline;
      .icon-down {
        font-size: 10px;
        margin-left: 5px;
      }
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
    height: 300px;
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

  .mb-stat-divide-title {
    position: sticky;
    display: inline-block;
    padding-bottom: 4px;
    margin-bottom: 12px;
    font-size: 40rpx;
    color: #40485b;
    font-weight: bolder;
    margin-left: 14px;

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
}
</style>
