<template>
  <view class="container">
    <view class="main">
      <ec-canvas
        id="category-pie-dom"
        class="category-pie"
        canvas-id="category-pie"
        @init="echartPieInit"
        :ec="ec"
      >
      </ec-canvas>

      <ec-canvas
        id="category-bar-dom"
        class="category-bar"
        canvas-id="category-bar"
        @init="echartBarInit"
        :ec="ec"
      >
      </ec-canvas>
    </view>
  </view>
</template>

<script>
//import * as echarts from "@/static/plugin/echart/echarts";
export default {
  name: "categoryChart",
  props: {},
  data() {
    return {
      ec: {},
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    };
  },
  components: {},
  methods: {
    echartPieInit({ detail }) {
      // console.log(detail);
      this.initChartPie(
        detail.echart,
        detail.canvas,
        detail.width,
        detail.height,
        detail.dpr,
        detail.wxNode
      );
    },
    echartBarInit({ detail }) {
      this.initChartBar(
        detail.echart,
        detail.canvas,
        detail.width,
        detail.height,
        detail.dpr,
        detail.wxNode
      );
    },
    initChartPie(echart, canvas, width, height, dpr, wxNode) {
      var chart = echart.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr,
      });

      var option = {
        title: {
          text: "用户访问来源",
          x: "center",
        },
        color: [
          "#37A2DA",
          "#32C5E9",
          "#67E0E3",
          "#91F2DE",
          "#FFDB5C",
          "#FF9F7F",
        ],
        tooltip: {
          show: true,
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" },
            ],
            label: {
              formatter(d) {
                return `${d.data.name}\n${d.data.value}`;
              },
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      canvas.setChart(chart);
      chart.setOption(option);
      wxNode.chart = chart;
    },
    initChartBar(echart, canvas, width, height, dpr, wxNode) {
      const chart = echart.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr,
      });
      // console.log(wxNode)
      canvas.setChart(chart);
      var option = {
        title: {
          text: "堆叠图",
        },
        color: [
          "#37A2DA",
          "#32C5E9",
          "#67E0E3",
          "#91F2DE",
          "#FFDB5C",
          "#FF9F7F",
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["直接访问", "邮件营销", "联盟广告"],
        },
        grid: {
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: this.data,
          axisPointer: {
            label: {
              formatter: (d) => {
                // console.log(d)
                // console.log(self)
                // self.tooltip = d.seriesData
              },
            },
          },
        },
        series: [
          {
            name: "直接访问",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight",
              },
            },
            data: [320, 302, 301, 334, 390, 330, 320],
          },
          {
            name: "邮件营销",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight",
              },
            },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "联盟广告",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight",
              },
            },
            data: [220, 182, 191, 234, 290, 330, 310],
          },
        ],
      };
      chart.setOption(option);
      wxNode.chart = chart;
    },
  },
};
</script>

<style lang="scss">
.container {
  margin-top: 30px;
  min-height: 100%;
  .main {
    width: 750rpx;
    .category-pie {
      display: block;
      width: 750rpx;
      height: 500rpx;
    }
    .category-bar {
      display: block;
      width: 750rpx;
      height: 900rpx;
    }
  }
}
</style>
