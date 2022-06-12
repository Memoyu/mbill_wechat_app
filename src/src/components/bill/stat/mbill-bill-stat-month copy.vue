<template>
  <view class="mbill-bill-stat-month">
    <view class="stat-header-date">
      <mb-ba-date-scroll type="month" v-model="dateActive" />
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bill-stat-month",
  props: {},
  methods: {},
};
</script>

<style lang="scss" scope>
.mbill-bill-stat-month {
}
</style>
