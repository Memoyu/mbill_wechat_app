<template>
  <view class="container">
    <core-tabs :type="tabList" v-model="active"></core-tabs>

    <view class="comonent-list">
      <mbill-bill-statement-edit
        ref="expend"
        :type="expend"
        @submitStatement="submitStatement"
        v-if="active === 0"
      />
      <mbill-bill-statement-edit
        ref="income"
        :type="income"
        @submitStatement="submitStatement"
        v-if="active === 1"
      />
      <mbill-bill-transfer-edit
        ref="transfer"
        @submitStatement="submitStatement"
        v-if="active === 2"
      />

      <mbill-bill-repayment-edit
        ref="repayment"
        @submitStatement="submitStatement"
        v-if="active === 3"
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
      active: 0,
      tabList: [
        {
          title: "支出",
        },
        {
          title: "收入",
        },
        {
          title: "转账",
        },
        {
          title: "还款",
        },
      ],
    };
  },
  methods: {
    //新增账单
    submitStatement(statement) {
      var that = this;
      this.$store.commit("STATEMENT_SUBMIT", true);
      // console.log("提交账单信息")
      that
        .$api("statement.create", statement)
        .then((res) => {
          if (res.code === 0) {
            that.$tip.toast("添加账单成功！");
            that.$store.dispatch("addStatement", res.result);
            uni.navigateBack({
              delta: 1,
            });
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
