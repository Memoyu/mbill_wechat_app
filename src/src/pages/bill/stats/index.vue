<template>
  <view class="b-container">
    <view class="stat-header" id="stat-header">
      <view class="stat-header-tab">
        <mb-ba-tabs :type="tabList" v-model="tabActive" />
      </view>
      <mb-ba-date-scroll type="month" v-model="dateActive" />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      dateActive: 0,
      tabActive: 0,
      tabList: [
        {
          title: "月数据",
        },
        {
          title: "年数据",
        },
        {
          title: "排行榜",
        },
      ],
    };
  },
  onShow() {},
  onLoad() {},
  methods: {},
};
</script>

<style lang="scss" scope>
.stat-header {
  width: 100%;
  background-color: $light-color;
  border-radius: 0 0 15px 15px;
  &-tab {
    width: 70%;
  }
}
</style>
