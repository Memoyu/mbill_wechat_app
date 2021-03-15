<template>
  <view class="container">
    <core-tabs :type="tabList" v-model="active"></core-tabs>

    <view class="comonent-list">
      <mbill-bill-statement-edit
        ref="expend"
        :type="expend"
        v-if="active === 0"
      />
      <mbill-bill-statement-edit
        ref="income"
        :type="income"
        v-if="active === 1"
      />
      <mbill-bill-transfer-edit
        ref="transfer"
        v-if="active === 2"
      />

      <mbill-bill-repayment-edit
        ref="repayment"
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
};
</script>

<style lang="scss">
</style>
