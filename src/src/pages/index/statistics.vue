<template>
  <view class="container">
    <view v-if="!showLoginTip" class="controller">
      <view class="time-filter">
        <view class="month-filter">
          <!-- <view>2019 年 01 月</view> -->
          <view class="iconfont icon-arrow-left" @tap="prevMonth"></view>
          <picker
            class="time-picker"
            mode="date"
            @change="pickerChange"
            fields="month"
            :value="date"
          >
            <view class="month">{{ date.year }} 年 {{ date.month }} 月</view>
          </picker>
          <view class="iconfont icon-arrow-right" @tap="nextMonth"></view>
        </view>
      </view>
      <core-tabs :type="tabList" v-model="active"></core-tabs>
      <mbill-chart-overview v-if="active === 0" :date="date"></mbill-chart-overview>
      <mbill-chart-category v-if="active === 1" :date="date"></mbill-chart-category>
      <mbill-chart-week-trend v-if="active === 2"></mbill-chart-week-trend>
      <mbill-chart-month-trend v-if="active === 3"></mbill-chart-month-trend>
      <mbill-chart-rate v-if="active === 4" :date="date"></mbill-chart-rate>
    </view>
    <core-login-modal/>
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
          title: "总览"
        },
        {
          title: "分类"
        },
        {
          title: "周趋势"
        },
        {
          title: "月趋势"
        },
        {
          title: "排行榜"
        }
      ],
      date: {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
      },
      isLogin: true,
      chartData: [],
      header: {},
      categories: [],
      showFilter: false,
      emptyTitle: "没有数据噢！"
    };
  },
  computed: {
    ...mapState({
      showLoginTip: state => state.user.showLoginTip
    })
  },
  onLoad() {},
  methods: {
    //时间改变触发
    pickerChange() {

    },
    //上一月
    prevMonth() {

    },
    //下一月
    nextMonth() {

    }
  }
};
</script>

<style lang="scss">
.container {
  // background:#f2f2f2;
  .controller {
    .time-filter {
      display: flex;
      justify-content: center;
      padding: 8px 0;
      font-size: 30rpx;
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
