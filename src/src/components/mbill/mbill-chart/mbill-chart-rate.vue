<template>
  <view class="category">
    <core-tabs :type="tabList" v-model="active"></core-tabs>

    <div v-for="(item, index) in statements" :key="index">
      <mbill-bill-statement-item :bill="item"></mbill-bill-statement-item>
    </div>
  </view>
</template>

<script>
import mbillBillStatementItem from "../mbill-bill/mbill-bill-statement-item.vue";

export default {
  components: { mbillBillStatementItem },
  name: "rateChart",
  props: {
    date: {
      type: Object
    }
  },
  data() {
    return {
      active: 0,
      tabList: [
        {
          title: "支出",
        },
        {
          title: "收入",
        },
      ],
	  statements: [],
    };
  },
  watch: {
    date() {
      this.getStatements();
    },
  },
  created() {
    this.getStatements();
  },
  methods: {
    handleChange({ detail }) {
      this.current = detail.key;
      this.getStatements();
    },
    getStatements() {
      // const res = await wxRequest.Get('chart/rate', { date: this.date, type: this.current })
      this.statements = [
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
    },
  },
};
</script>

<style lang="scss">
.expend-bars {
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #212121;
    margin: 12px 0;
    padding: 8px;
    background-repeat: no-repeat;
    background-image: linear-gradient(#c1f5e7, #c1f5e7);
    border-radius: 4px;
    .title {
      font-size: 14px;
    }
    .amount {
      margin-top: 4px;
      font-size: 14px;
      color: green;
    }
    .percent {
      font-size: 12px;
      margin-left: 12px;
      color: #757575;
    }
  }
  .zan-icon-arrow {
    font-size: 14px;
    color: #ccc;
  }
}
</style>
