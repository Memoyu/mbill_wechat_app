<template>
  <view class="mbill-bill-stat-month">
    <view class="mb-stat-month-header" id="mb-stat-month-header">
      <mb-ba-date-scroll
        type="month"
        v-model="active"
        :specify="specify"
        @selected.stop="handleSelectedMonth"
      />
    </view>
    <view class="mb-stat-month-content" :style="{ height: scrollH + 'px' }">
      <scroll-view scroll-y="true" style="height: 100%">
        <!-- 当月收支统计 -->
        <view class="content-total x-bc">
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
        <view class="mb-stat-month-bg-br">
          <view class="charts-box">
            <qiun-data-charts
              type="tarea"
              :chartData="chartData"
              :canvas2d="canvas2d"
              :ontouch="true"
              inScrollView="true"
            />
          </view>
          <view class="mb-stat-month-rang x-ac">
            <view class="y-bc">
              <text class="mb-stat-month-rang-num">{{ rang.incomeMax }}</text>
              <text class="mb-stat-month-rang-text">最高收入/元</text>
            </view>
            <view class="y-bc">
              <text class="mb-stat-month-rang-num">{{ rang.incomeMin }}</text>
              <text class="mb-stat-month-rang-text">最低收入/元</text>
            </view>
            <view class="y-bc">
              <text class="mb-stat-month-rang-num">{{ rang.expendMax }}</text>
              <text class="mb-stat-month-rang-text">最高支出/元</text>
            </view>
            <view class="y-bc">
              <text class="mb-stat-month-rang-num">{{ rang.expendMin }}</text>
              <text class="mb-stat-month-rang-text">最低支出/元</text>
            </view>
          </view>
        </view>

        <!-- 当月分类数据统计 -->
        <view class="mb-stat-divide-title">分类占比</view>
        <view class="mb-stat-month-bg-br">
          <view class="charts-box">
            <qiun-data-charts
              type="ring"
              :canvas2d="canvas2d"
              :chartData="chartData1"
              inScrollView="true"
            />
          </view>
        </view>
        <view class="mb-stat-month-bg-br">
          <mb-stat-category-group />
        </view>
      </scroll-view>
    </view>
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
    canvas2d: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      init: false,
      active: 0,
      scrollH: 0,
      specify: {
        year: datetime.getCurYear(),
        month: datetime.getCurMonth(),
      },
      stat: {
        expend: "3,3543,363",
        income: "2,305,555",
        average: "12,055,555",
      },
      rang: {
        incomeMax: 33543,
        incomeMin: 23,
        expendMax: 12055,
        expendMin: 12555,
      },
      chartData: {},
      chartData1: {},
    };
  },
  watch: {
    height(val) {
      this.calcuScrollHeight(val);
    },
  },
  created() {
    this.getServerData();
  },
  methods: {
    initData() {
      if (this.init === true) return;
      this.init = true;
      // 初始化数据
      console.log("初始化数据-月数据");
    },
    getServerData() {
      //模拟从服务器获取数据时的延时
      setTimeout(() => {
        //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
        let res = {
          categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
          series: [
            {
              name: "成交量A",
              data: [35, 8, 25, 37, 4, 20],
            },
            {
              name: "成交量B",
              data: [70, 40, 65, 100, 44, 68],
            },
          ],
        };
        this.chartData = JSON.parse(JSON.stringify(res));
      }, 500);

      setTimeout(() => {
        //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
        let res = {
          series: [
            {
              data: [
                { name: "一班", value: 50 },
                { name: "二班", value: 30 },
                { name: "三班", value: 20 },
                { name: "四班", value: 18 },
                { name: "五班", value: 18 },
              ],
            },
          ],
        };
        this.chartData1 = JSON.parse(JSON.stringify(res));
      }, 500);
    },

    // 指定日期
    specifyDate(date) {
      this.specify = date;
    },

    // 切换月份
    handleSelectedMonth(item) {
      console.log(item);
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
  },
};
</script>

<style lang="scss" scope>
.mbill-bill-stat-month {
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
}
</style>
