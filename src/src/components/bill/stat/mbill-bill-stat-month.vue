<template>
  <view class="mbill-bill-stat-month">
    <view class="mb-stat-month-header" id="mb-stat-month-header">
      <mb-ba-date-scroll type="month" v-model="active" />
    </view>
    <view class="mb-stat-month-content" :style="{ height: scrollH + 'px' }">
      <scroll-view scroll-y="true" style="height: 100%">
        <view class="content-total x-bc">
          <view class="content-total-month y-bc">
            <text class="content-total-month-num">{{ stat.total }}</text>
            <text>当月支出/元</text>
          </view>
          <view>
            <view class="content-total-month">
              <text>当月收入/元：</text>
              <text class="content-total-bold">{{ stat.income }}</text>
            </view>
            <view class="content-total-month content-total-expend">
              <text>当月支出/元：</text>
              <text class="content-total-bold">{{ stat.expend }}</text>
            </view>
          </view>
        </view>
        <view class="charts-box">
          <qiun-data-charts
            type="tarea"
            :chartData="chartData"
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
        <view class="charts-box">
          <qiun-data-charts
            type="ring"
            :chartData="chartData1"
            inScrollView="true"
          />
        </view>
        <mb-stat-category-group />
      </scroll-view>
    </view>
  </view>
</template>

<script>
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
      stat: { total: 3354336360, income: 2305555, expend: 12055555 },
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
          series: [
            {
              name: "时间轴1",
              data: [
                [10000, 55],
                [30000, 25],
                [50000, 55],
                [70000, 25],
                [90000, 55],
              ],
            },
            {
              name: "时间轴2",
              data: [
                [0, 25],
                [20000, 55],
                [40000, 25],
                [60000, 55],
                [80000, 25],
              ],
            },
            {
              name: "时间轴3",
              data: [
                [0, 55],
                [15000, 25],
                [30000, 55],
                [45000, 25],
                [60000, 55],
              ],
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

    // 计算scroll-view 最高度
    calcuScrollHeight(height) {
      let that = this;
      let query = uni.createSelectorQuery().in(that);
      query.select("#mb-stat-month-header").fields({ size: true });
      query.exec((data) => {
        console.log(height, data);
        that.scrollH = height - data[0].height;
      });
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-bill-stat-month {
  background-color: white;
  .mb-stat-month {
    &-header {
      padding: 15rpx;
      border-radius: 0 0 25rpx 25rpx;
      background-color: $light-color;
    }
    .charts-box {
      width: 100%;
      height: 300px;
    }
  }
  .mb-stat-month-content {
    color: #ffffff;
    .content-total {
      padding: 50rpx;
      margin: 30rpx 20rpx;
      background-color: $primary-color;
      border-radius: 10rpx 35rpx 10rpx 35rpx;
      &-month {
        font-size: 25rpx;
        &-num {
          font-size: 50rpx;
          font-weight: bold;
        }
      }
      &-expend {
        margin-top: 25rpx;
      }
      &-bold {
        font-weight: bold;
      }
    }
  }
  .mb-stat-month-rang {
    margin: 20rpx 30rpx 50rpx 30rpx;
    font-size: 25rpx;
    &-num {
      color: $primary-color;
      font-size: 40rpx;
      font-weight: bold;
    }
    &-text {
      color: $grey-color;
    }
  }
}
</style>
