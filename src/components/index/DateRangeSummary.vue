<script setup lang="ts">
const opts = {
  color: ['#FAC858', '#EE6666', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4', '#ea7ccc'],
  padding: [15, 15, 0, 5],
  enableScroll: false,
  dataLabel: false,
  legend: {
    show: false,
  },
  xAxis: {
    disableGrid: true,
  },
  yAxis: {
    disabled: true,
    disableGrid: true,
  },
  extra: {
    column: {
      type: 'group',
      width: 8,
      activeBgColor: '#000000',
      activeBgOpacity: 0.08,
      linearType: 'custom',
      seriesGap: 2,
      linearOpacity: 0.5,
      barBorderCircle: true,
      customColor: [
        '#FA7D8D',
        '#EB88E2',
      ],
    },
  },
}

const data = {
  categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
  series: [
    {
      name: '目标值',
      data: [35, 36, 31, 33, 13, 34, 3, 45, 66, 88, 11, 34, 66, 33, 22],
    },
    {
      name: '完成量',
      data: [18, 27, 21, 24, 6, 28, 18, 28, 33, 33, 22, 33, 22, 33, 20],
    },
  ],
}
</script>

<template>
  <view>
    <view class="flex items-start justify-between">
      <view>
        <view class="font-bold">
          本周汇总
        </view>
        <view class="text-sm text-gray-400">
          收入：2333.00，支出：344.66
        </view>
      </view>
      <view class="flex items-center justify-center rounded-full bg-white/70 p-1">
        <wd-icon name="ellipsis" size="18" />
      </view>
    </view>
    <view class="dr-summary-box">
      <qiun-data-charts
        type="column"
        canvas2d
        :opts="opts"
        :chart-data="data"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.dr-summary-box {
  height: 150px;
}
</style>
