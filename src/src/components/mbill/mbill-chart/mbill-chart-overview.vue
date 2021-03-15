<template>
  <view class="overview">
    <view class="overview-header">
      <view class="overview-header__card">
        <view class="expend amount">{{ header.expend }}</view>
        <view class="text-small">总支出</view>
      </view>
      <view class="overview-header__card">
        <view class="income amount">{{ header.income }}</view>
        <view class="text-small">总收入</view>
      </view>
      <view class="overview-header__card">
        <view class="transfer amount">{{ header.transfer }}</view>
        <view class="text-small">转账</view>
      </view>
      <view class="overview-header__card">
        <view class="expend amount">{{ header.repay }}</view>
        <view class="text-small">还款</view>
      </view>
    </view>

    <view class="overview__count-result">
      总计（收入-支出-还款）：<text class="expend">{{ header.total }}</text>
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
export default {
  name: "overviewChart",
  props: {
    date: String,
  },
  data() {
    return {
      header: {},
      statements: [],
      categories: [],
    };
  },
  created() {
    this.getHeader();
    this.getStatementList();
    // this.categoryChart()
  },
  watch: {
    date() {
      this.getHeader();
      this.getStatementList();
      // this.categoryChart()
    },
  },
  methods: {
    async getHeader() {
      // const res = await wxRequest.Get('chart/overview_header', { date: this.date })
      const res = {
        expend: "20",
        income: "20",
        transfer: "20",
        repay: "20",
        total: "200",
      };
      this.header = res;
    },
    async getStatementList() {
      //console.log("加载")
      // const res = await wxRequest.Get('chart/overview_statements', { date: this.date })
      const res = [
        {
          id: 1,
          categoryIconPath: "",
          categoryName: "数码",
          description: "买电脑",
          year: "2021",
          month: "11",
          day: "01",
          time: "01:26",
          assetName: "微信",
          type: "expend",
          amount: 300,
        },
        {
          id: 2,
          categoryIconPath: "",
          categoryName: "出行",
          description: "买电脑",
          year: "2021",
          month: "11",
          day: "01",
          time: "01:26",
          assetName: "微信",
          type: "expend",
          amount: 300.89,
        },
      ];
      this.statements = res;
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
    font-size: 28rpx;
  }
}
</style>
