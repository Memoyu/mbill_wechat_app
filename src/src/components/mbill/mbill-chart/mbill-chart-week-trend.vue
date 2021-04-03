<template>
  <view class="comp-container">
    <view class="week-trend-con">
      <view class="trend-title">周支出趋势</view>
      <canvas id="canvaWeekColumn" type="2d" class="canva-week-column"></canvas>
    </view>
    <view class="month-trend-con">
      <view class="trend-title">月支出趋势</view>
      <canvas id="canvaMonthColumn" type="2d" class="canva-month-column"></canvas>
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
  data() {
    return {
      groups: [],
      cWidth: "",
      cHeight: "",
      pixelRatio: 1
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  created() {
    _self = this;
    _self.pixelRatio = uni.getSystemInfoSync().pixelRatio;
    this.cWidth = uni.upx2px(750);
    this.cHeight = uni.upx2px(500);
    this.getWeekTrend();
  },
  methods: {
    // 获取周趋势统计
    getWeekTrend() {
      let that = this;
      that
        .$api("statement.expendCategory", {
          Year: that.date.year,
          Month: that.date.month,
          UserId: that.userInfo.id
        })
        .then(res => {
          if (res.code === 0) {
            that.groups = res.result.childCategoryStas;
            that.showWeekColumn(
              "canvaWeekColumn",
              res.result.parentCategoryStas
            );
          }
        });
    },
    // 获取周趋势统计
    getMonthTrend() {
      let that = this;
      that
        .$api("statement.expendCategory", {
          Year: that.date.year,
          Month: that.date.month,
          UserId: that.userInfo.id
        })
        .then(res => {
          if (res.code === 0) {
            that.groups = res.result.childCategoryStas;
            that.showMonthColumn(
              "canvaMonthColumn",
              res.result.parentCategoryStas
            );
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
          canvaColumn = new uCharts({
            $this: _self,
            //这俩参数是新增加的，开启2d并传入ctx
            canvas2d: true,
            context: ctx,
            //这俩参数是新增加的，开启2d并传入ctx
            canvasId: canvasId,
            type: "column",
            padding: [15, 5, 0, 15],
            legend: {
              show: true,
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
              disableGrid: true
            },
            yAxis: {
              data: [
                {
                  position: "right",
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
          canvaColumn = new uCharts({
            $this: _self,
            //这俩参数是新增加的，开启2d并传入ctx
            canvas2d: true,
            context: ctx,
            //这俩参数是新增加的，开启2d并传入ctx
            canvasId: canvasId,
            type: "column",
            padding: [15, 5, 0, 15],
            legend: {
              show: true,
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
              disableGrid: true
            },
            yAxis: {
              data: [
                {
                  position: "right",
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
    }
  }
};
</script>

<style lang="scss">
.comp-container {
  margin-top: 30px;
  min-height: 100%;
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
  .month-trend-con {
    .week-trend {
      display: block;
      width: 750rpx;
      height: 500rpx;
    }
  }
  .month-trend-con {
    .month-trend {
      display: block;
      width: 750rpx;
      height: 500rpx;
    }
  }
}
</style>
