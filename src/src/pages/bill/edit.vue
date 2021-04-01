<template>
  <view class="container">
    <view class="comonent-list">
      <mbill-bill-statement-edit
        ref="expend"
        :type="expend"
        :detail="statement"
        @submitStatement="submitStatement"
        v-if="current === 'expend'"
      />

      <mbill-bill-statement-edit
        ref="income"
        :type="income"
        :detail="statement"
        @submitStatement="submitStatement"
        v-if="current === 'income'"
      />

      <mbill-bill-transfer-edit
        ref="transfer"
        :detail="statement"
        @submitStatement="submitStatement"
        v-if="current === 'transfer'"
      />

      <mbill-bill-repayment-edit
        ref="repayment"
        :detail="statement"
        @submitStatement="submitStatement"
        v-if="current === 'repayment'"
      />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      expend: "expend",
      income: "income",
      current: "",
      statement: {},
    };
  },
  onLoad(options) {
    this.getStatement(options.id);
  },
  methods: {
    //获取账单详情
    getStatement(id) {
      var that = this;
      that
        .$api("statement.detail", {
          id: id,
        })
        .then((res) => {
          if (res.code === 0) {
            that.statement = res.result;
            that.current = res.result.type
          }
        });
    },
    //提交更新
    submitStatement(statement) {
      var that = this;
      that.$store.commit("STATEMENT_SUBMIT", true);
      console.log(statement)
      that
        .$api("statement.update", statement)
        .then((res) => {
          if (res.code === 0) {
            that.$tip.toast("更新账单成功！");
            that.$store.dispatch("modifyStatement", statement);
            that.$Router.back();
          }
        })
        .catch((err) => {
          that.$tip.confirm("由于网络原因，无法同步账单到服务器", {}, "保存失败");
        });
      that.$store.commit("STATEMENT_SUBMIT", false);
    },
  },
};
</script>

<style lang="scss">
</style>
