<template>
  <view class="container">
    <view class="comonent-list">
      <mbill-bill-statement-edit
        :type="expend"
        :statement="statement"
        v-if="current === 'expend'"
      />

      <mbill-bill-statement-edit
        :type="income"
        :statement="statement"
        v-if="current === 'income'"
      />

      <mbill-bill-transfer-edit
        :transfer="statement"
        v-if="current === 'transfer'"
      />

      <mbill-bill-repayment-edit
        :repayment="statement"
        v-if="current === 'repayment'"
      />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      current: "expend",
      statement: {},
    };
  },
  onLoad(options) {
    this.getStatement(options.id);
  },
  methods: {
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
  },
};
</script>

<style lang="scss">
</style>
