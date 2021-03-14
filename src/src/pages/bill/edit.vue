<template>
    <view class="container">
     <view class="comonent-list">
       <expend
          :type="expend"
          :statement="statement"
          v-if="current === 'expend'"
        />

        <income
          :type="income"
          :statement="statement"
          v-if="current === 'income'"
        />

        <transfer
          :transfer="statement"
          v-if="current === 'transfer'"
        />

        <repayment
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

        }
    },
}
</script>

<style lang="scss">

</style>
