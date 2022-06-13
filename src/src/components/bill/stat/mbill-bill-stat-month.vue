<template>
  <view class="mbill-bill-stat-month">
    <view class="mbill-bill-stat-month-header">
      <mb-ba-date-scroll type="month" v-model="active" />
    </view>
    <view class="charts-box">
      <qiun-data-charts type="tarea" :opts="opts" :chartData="chartData" />
    </view>
    <view class="charts-box">
      <qiun-data-charts type="ring" :opts="opts1" :chartData="chartData1" />
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bill-stat-month",
  props: {},
  data() {
    return {
      init: false,
      active: 0,
      chartData: {},
      chartData1: {},
      //您可以通过修改 config-ucharts.js 文件中下标为 ['tarea'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
      opts: {
        color: [
          "#1890FF",
          "#91CB74",
          "#FAC858",
          "#EE6666",
          "#73C0DE",
          "#3CA272",
          "#FC8452",
          "#9A60B4",
          "#ea7ccc",
        ],
        padding: [15, 10, 0, 15],
        legend: {},
        xAxis: {
          disableGrid: true,
          boundaryGap: "justify",
          format: "xAxisDemo2",
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2,
          data: [
            {
              min: 0,
              max: 80,
            },
          ],
        },
        extra: {
          area: {
            type: "curve",
            opacity: 0.2,
            addLine: true,
            width: 2,
            gradient: true,
          },
        },
      },
      opts1: {
        rotate: false,
        rotateLock: false,
        color: [
          "#1890FF",
          "#91CB74",
          "#FAC858",
          "#EE6666",
          "#73C0DE",
          "#3CA272",
          "#FC8452",
          "#9A60B4",
          "#ea7ccc",
        ],
        padding: [5, 5, 5, 5],
        dataLabel: true,
        legend: {
          show: true,
          position: "right",
          lineHeight: 25,
        },
        title: {
          name: "收益率",
          fontSize: 15,
          color: "#666666",
        },
        subtitle: {
          name: "70%",
          fontSize: 25,
          color: "#7cb5ec",
        },
        extra: {
          ring: {
            ringWidth: 60,
            activeOpacity: 0.5,
            activeRadius: 10,
            offsetAngle: 0,
            labelWidth: 15,
            border: true,
            borderWidth: 3,
            borderColor: "#FFFFFF",
          },
        },
      },
    };
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
                { name: "五班", value: 8 },
              ],
            },
          ],
        };
        this.chartData1 = JSON.parse(JSON.stringify(res));
      }, 500);
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-bill-stat-month {
  &-header {
    padding: 15rpx;
    margin: 20rpx;
    border-radius: 25rpx;
    background-color: white;
  }

  .charts-box {
    width: 100%;
    height: 300px;
  }
}
</style>
