<template>
  <view class="comp-container">
    <view class="week-trend-con">
      <view class="trend-title">周支出趋势</view>
      <canvas
        id="canvaWeekColumn"
        type="2d"
        class="canvas-week-column"
        @touchstart="touchWeekColumn($event,'canvaWeekColumn')"
      ></canvas>
    </view>
    <view class="month-trend-con">
      <view class="trend-title">月支出趋势</view>
      <canvas
        id="canvaMonthColumn"
        type="2d"
        class="canvas-month-column"
        @touchstart="touchMonthColumn($event,'canvaMonthColumn')"
      ></canvas>
    </view>
  </view>
</template>

<script>
import uCharts from "@/static/plugin/u-charts/u-charts.js";
import { mapState } from "vuex";

var _self;
var canvaWeekColumn = null;
var canvaMonthColumn = null;
export default {
  name: "trendChart",
  props: {
    date: {
      type: Object
    }
  },
  watch: {
    async date() {
      await this.getTrendData();
      canvaWeekColumn.updateData(this.weekChartData);
      canvaMonthColumn.updateData(this.monthChartData);
    }
  },
  data() {
    return {
      cWidth: "",
      cHeight: "",
      pixelRatio: 1,
      weekChartData: {},
      monthChartData: {}
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  async created() {
    _self = this;
    _self.pixelRatio = uni.getSystemInfoSync().pixelRatio;
    this.cWidth = uni.upx2px(750);
    this.cHeight = uni.upx2px(500);
    await this.getTrendData();
    this.showTrendChart();
  },
  methods: {

    async getTrendData() {
      await this.getWeekTrend();
      await this.getMonthTrend();
    },
    showTrendChart() {
      this.showWeekColumn("canvaWeekColumn", this.weekChartData);
      this.showMonthColumn("canvaMonthColumn", this.monthChartData);
    },
    // 获取周趋势统计
   async getWeekTrend() {
      let that = this;
    await that
        .$api("statement.expendTrendWeek", {
          Year: that.date.year,
          Month: that.date.month,
          Type: "expend",
          UserId: that.userInfo.id
        })
        .then(res => {
          if (res.code === 0) {
            let categories = [];
            let data = [];
            res.result.map(r => {
              categories.push(r.name);
              data.push(r.data);
            });
            that.weekChartData = {
              categories: categories,
              series: [{ name: "周支出趋势", data: data }]
            };
          }
        });
    },
    // 获取周趋势统计
   async getMonthTrend() {
      let that = this;
      await that
        .$api("statement.expendTrend5Month", {
          Year: that.date.year,
          Month: that.date.month,
          Type: "expend",
          UserId: that.userInfo.id
        })
        .then(res => {
          if (res.code === 0) {
            let categories = [];
            let data = [];
            res.result.reverse().map(r => {
              categories.push(r.name);
              data.push(r.data);
            });
             that.monthChartData = {
              categories: categories,
              series: [{ name: "月支出趋势", data: data }]
            };
          }
        });
    },
    showWeekColumn(canvasId, chartData) {
      const query = uni.createSelectorQuery().in(this);
      query
        .select("#" + canvasId)
        .fields({ node: true, size: true })
        .exec(res => {
          const canvas = res[0].node;
          const ctx = canvas.getContext("2d");
          canvas.width = res[0].width * _self.pixelRatio;
          canvas.height = res[0].height * _self.pixelRatio;
          //此步不需要缩放画布，ucharts会自动缩放
          //ctx.scale(_self.pixelRatio, _self.pixelRatio)
          canvaWeekColumn = new uCharts({
            $this: _self,
            //这俩参数是新增加的，开启2d并传入ctx
            canvas2d: true,
            context: ctx,
            //这俩参数是新增加的，开启2d并传入ctx
            canvasId: canvasId,
            type: "column",
            fontSize: 13,
            padding: [15, 15, 0, 15],
            legend: {
              show: false,
              padding: 5,
              lineHeight: 11,
              margin: 0
            },
            fontSize: 11,
            background: "#FFFFFF",
            pixelRatio: _self.pixelRatio,
            animation: true,
            categories: chartData.categories,
            series: chartData.series,
            xAxis: {
              disableGrid: true,
              calibration: true,
              axisLine: true,
            },
            yAxis: {
              data: [
                {
                  position: "left",
                  axisLine: false,
                  format: val => {
                    return val.toFixed(0) + "元";
                  }
                }
              ]
            },
            dataLabel: true,
            width: _self.cWidth * _self.pixelRatio,
            height: _self.cHeight * _self.pixelRatio,
            extra: {
              column: {
                type: "group",
                width:
                  (_self.cWidth * _self.pixelRatio * 0.45) /
                  chartData.categories.length
              }
            }
          });
        });
    },
    showMonthColumn(canvasId, chartData) {
      const query = uni.createSelectorQuery().in(this);
      query
        .select("#" + canvasId)
        .fields({ node: true, size: true })
        .exec(res => {
          const canvas = res[0].node;
          const ctx = canvas.getContext("2d");
          canvas.width = res[0].width * _self.pixelRatio;
          canvas.height = res[0].height * _self.pixelRatio;
          //此步不需要缩放画布，ucharts会自动缩放
          //ctx.scale(_self.pixelRatio, _self.pixelRatio)
          canvaMonthColumn = new uCharts({
            $this: _self,
            //这俩参数是新增加的，开启2d并传入ctx
            canvas2d: true,
            context: ctx,
            //这俩参数是新增加的，开启2d并传入ctx
            canvasId: canvasId,
            type: "column",
            fontSize: 13,
            padding: [15, 15, 0, 15],
            legend: {
              show: false,
              padding: 5,
              lineHeight: 11,
              margin: 0
            },
            fontSize: 11,
            background: "#FFFFFF",
            pixelRatio: _self.pixelRatio,
            animation: true,
            categories: chartData.categories,
            series: chartData.series,
            xAxis: {
              disableGrid: true,
              calibration: true,
              axisLine: true,
            },
            yAxis: {
              data: [
                {
                  position: "left",
                  axisLine: false,
                  format: val => {
                    return val.toFixed(0) + "元";
                  }
                }
              ]
            },
            dataLabel: true,
            width: _self.cWidth * _self.pixelRatio,
            height: _self.cHeight * _self.pixelRatio,
            extra: {
              column: {
                type: "group",
                width:
                  (_self.cWidth * _self.pixelRatio * 0.45) /
                  chartData.categories.length
              }
            }
          });
        });
    },
    touchWeekColumn(e, id) {
      canvaWeekColumn.touchLegend(e, {
        animation: false
      });
      canvaWeekColumn.showToolTip(e, {
        format: function(item, category) {
          if (typeof item.data === "object") {
            return category + " " + item.name + ":" + item.data.value;
          } else {
            return category + " " + item.name + ":" + item.data;
          }
        }
      });
    },
    touchMonthColumn(e, id) {
      canvaMonthColumn.touchLegend(e, {
        animation: false
      });
      canvaMonthColumn.showToolTip(e, {
        format: function(item, category) {
          if (typeof item.data === "object") {
            return category + " " + item.name + ":" + item.data.value;
          } else {
            return category + " " + item.name + ":" + item.data;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
.comp-container {
  .trend-title {
    position: relative;
    display: inline-block;
    padding-bottom: 4px;
    margin-bottom: 12px;
    font-size: 18px;
    color: #40485b;
    font-weight: bolder;
    margin-left: 14px;

    &:before {
      content: "";
      position: absolute;
      background: $primaryColor;
      width: calc(100% + 16px);
      height: 12px;
      bottom: 0;
      left: 0;
      border-radius: 12px;
      z-index: -1;
    }
  }
  .week-trend-con {
    padding: 30rpx 2%;
    .canvas-week-column {
      width: 100%;
      height: 500rpx;
    }
  }
  .month-trend-con {
    padding: 30rpx 2%;
    .canvas-month-column {
      width: 100%;
      height: 500rpx;
    }
  }
}
</style>
