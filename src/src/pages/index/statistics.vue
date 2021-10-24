<template>
  <view class="container">
    <view v-if="!showLoginTip" class="controller">
      <view class="header">
        <view class="time-filter">
          <view class="month-filter">
            <!-- <view>2019 年 01 月</view> -->
            <view class="iconfont icon-arrow-left" @tap="prevMonth"></view>
            <picker
              class="time-picker"
              mode="date"
              @change="pickerChange"
              fields="month"
              :value="dateModel"
            >
              <view class="month">{{ date.year }} 年 {{ date.month }} 月</view>
            </picker>
            <view class="iconfont icon-arrow-right" @tap="nextMonth"></view>
          </view>
        </view>
        <core-tabs
          :type="tabList"
          v-model="active"
          fontsize="medium"
        ></core-tabs>
      </view>
      <view class="chart">
        <mbill-chart-overview
          ref="overview"
          v-if="active === 0"
          :date="date"
        ></mbill-chart-overview>
        <mbill-chart-category
          ref="overview"
          v-if="active === 1"
          :date="date"
        ></mbill-chart-category>
        <mbill-chart-week-trend
          ref="overview"
          v-if="active === 2"
          :date="date"
        ></mbill-chart-week-trend>
        <mbill-chart-rate
          ref="overview"
          v-if="active === 3"
          :date="date"
        ></mbill-chart-rate>
      </view>
    </view>
    <core-login-modal />
  </view>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";

const nowDate = new Date();
export default {
  data() {
    return {
      active: 0,
      tabList: [
        {
          title: "总览",
        },
        {
          title: "分类",
        },
        {
          title: "趋势",
        },
        {
          title: "排行榜",
        },
      ],
      dateModel: nowDate,
      date: {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
      },
      chartData: [],
      header: {},
      categories: [],
      showFilter: false,
      emptyTitle: "没有数据噢！",
    };
  },
  computed: {
    ...mapState({
      showLoginTip: (state) => state.user.showLoginTip,
    }),
  },
  onLoad() {},
  onShow() {
    if (this.$refs.overview !== undefined) {
      this.$refs.overview.initData();
    }
  },
  onReachBottom() {
    if (this.active === 0 || this.active === 3) {
      this.$refs.overview.onLoadMore();
    }
  },
  methods: {
    //时间改变触发
    pickerChange({ detail }) {
      let that = this;
      var date = new Date(detail.value);
      // console.log(detail);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (year !== that.date.year || month !== that.date.month) {
        that.date.year = year;
        that.date.month = month;
        that.dateModel = new Date(year, month);
      }
    },
    //上一月
    prevMonth() {
      var now = this.dateModel;
      now.setMonth(now.getMonth() - 1);
      this.dateModel = now;
      this.date.year = now.getFullYear();
      this.date.month = now.getMonth() + 1;
    },
    //下一月
    nextMonth() {
      var now = this.dateModel;
      now.setMonth(now.getMonth() + 1);
      this.dateModel = now;
      this.date.year = now.getFullYear();
      this.date.month = now.getMonth() + 1;
    },
  },
};
</script>

<style lang="scss">
.container {
  // background:#f2f2f2;
  .controller {
    .header {
      position: sticky;
      top: 0;
      z-index: 998;
      background: white;
      // color: white;
    }
    .chart {
      z-index: -1;
    }
    .time-filter {
      display: flex;
      justify-content: center;
      padding: 8px 0;
      font-size: 33rpx;
      .month-filter {
        display: flex;
        align-items: center;
        .iconfont {
          color: black;
          padding: 6px 10px;
        }
        .month {
          color: $primaryColor;
          padding: 0 12px;
        }
      }
    }
  }
}
</style>
