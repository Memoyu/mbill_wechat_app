<template>
  <view class="mbill-bill-stat-month">
    <view
      class="mbill-bill-stat-month-header"
      id="mbill-bill-stat-month-header"
    >
      <mb-ba-date-scroll type="month" v-model="active" />
    </view>
    <view :style="{ height: scrollH + 'px' }">
      <scroll-view scroll-y="true" style="height: 100%">
        <view class="charts-box">
          <qiun-data-charts
            type="tarea"
            :chartData="chartData"
            inScrollView="true"
          />
        </view>
        <view class="charts-box">
          <qiun-data-charts
            type="ring"
            :chartData="chartData1"
            inScrollView="true"
          />
        </view>
        <view class="charts-box">
          <qiun-data-charts
            type="ring"
            :chartData="chartData1"
            inScrollView="true"
          />
        </view>
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
      query.select("#mbill-bill-stat-month-header").fields({ size: true });
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
</style>
