<template>
  <view class="overview">
    <view class="overview-header">
      <view class="overview-header__card">
        <view class="expend amount">{{ header.monthExpend }}</view>
        <view class="text-small">总支出</view>
      </view>
      <view class="overview-header__card">
        <view class="income amount">{{ header.monthIcome }}</view>
        <view class="text-small">总收入</view>
      </view>
      <view class="overview-header__card">
        <view class="transfer amount">{{ header.monthTransfer }}</view>
        <view class="text-small">转账</view>
      </view>
      <view class="overview-header__card">
        <view class="expend amount">{{ header.monthRepayment }}</view>
        <view class="text-small">还款</view>
      </view>
    </view>

    <view class="overview__count-result">
      <text class="fs18">总计</text>（= 收入 - 支出 - 还款）：<text class="expend">{{ header.total }}</text>
    </view>

    <view class="overview__statements">
      <view class="ovweview-title">账单列表</view>
      <div v-for="(item, index) in statements" :key="index">
        <mbill-bill-statement-item :bill="item"></mbill-bill-statement-item>
      </div>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "overviewChart",
  props: {
    date: {
      type: Object
    }
  },
  data() {
    return {
      header: {},
      statements: [],
      categories: [],
      total: 0,
      page: {
        UserId: 0,
        Year: 0,
        Month: 0,
        Size: 10,
        Page: 0
      }
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  created() {
    this.getStatementTotal();
    this.getStatementList(true);
    // this.categoryChart()
  },
  watch: {
    date() {
      this.getStatementTotal();
      this.getStatementList(true);
      // this.categoryChart()
    },
  },
  methods: {
    ...mapActions(["getPagesAsync", "getTotalAsync"]),

     // 获取当各类账单总计
    async getStatementTotal() {
      let that = this;
      let res = await that.getTotalAsync({
        UserId: that.userInfo.id,
        Year: that.date.year,
        Month: that.date.month
      });
      that.header = res;
    },
    // 获取账单列表
    async getStatementList(isCover = false) {
      let that = this;
      that.page.UserId = that.userInfo.id;
      that.page.Year = that.date.year;
      that.page.Month = that.date.month;
      let res = await that.getPagesAsync(that.page);
       if (isCover) {
        uni.pageScrollTo({ scrollTop: 0, duration: 0 });
        that.statementList = res.items;
      } else {
        that.statementList = [...that.statementList, ...res.items];
      }
      that.total = res.total;
    },
    async categoryChart() {
      // const res = await wxRequest.Get('chart/overview_budgets', { date: this.date })
      const res = [
        { category_id: 1, percent: 30, name: "伙食", format_amount: 40 },
        { category_id: 2, percent: 40, name: "游戏", format_amount: 40 },
      ];
      this.categories = res;
      for (let item of res) {
      }
    },
  },
};
</script>

<style lang="scss">
.overview {
  .overview-header {
    padding: 24rpx 0;
    border-bottom: 1px solid #f4f4f4;
    > .overview-header__card {
      display: inline-block;
      width: 25%;
      text-align: center;
      .text-small {
        font-size: 24rpx;
      }
      .amount {
        font-size: 32rpx;
      }
    }
  }
  .overview__count-result {
    padding: 16rpx 24rpx;
    font-size: 24rpx;
  }
  .overview__category-chart {
    margin: 12px;
    padding: 12px;
    box-shadow: 0 0 4px #eee;
    .budget-chart-item {
      display: inline-block;
      font-size: 24rpx;
      text-align: center;
    }
  }
  .overview__statements {
    margin: 12px;
    padding: 12px;
    box-shadow: 0 0 4px #eee;
  }
  .ovweview-title {
    font-weight: bold;
    font-size: 48rpx;
  }
}
</style>
