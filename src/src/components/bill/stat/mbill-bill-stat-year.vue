<template>
  <view class="mb-stat-year">
    <view class="mb-stat-year-header" id="mb-stat-year-header">
      <mb-ba-date-scroll type="year" v-model="active" />
    </view>
    <view class="mb-stat-year-content" :style="{ height: scrollH + 'px' }">
      <scroll-view scroll-y="true" style="height: 100%">
        <!-- 当年收支统计 -->
        <view class="content-total x-bc">
          <view class="content-total-month y-bc">
            <text class="content-total-month-expend">{{ stat.expend }}</text>
            <text class="content-total-title">当年支出</text>
          </view>
          <view>
            <view class="content-total-month">
              <text class="content-total-title">当年收入：</text>
              <text class="content-total-bold">{{ stat.income }}</text>
            </view>
            <view class="content-total-month content-total-mg-top">
              <text class="content-total-title">平均支出：</text>
              <text class="content-total-bold">{{ stat.average }}</text>
            </view>
          </view>
        </view>

        <!-- 月份收支统计 -->
        <view class="mb-stat-year-month-list">
          <mb-stat-month-list />
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bill-stat-year",
  props: {
    height: {
      type: [Number, String],
      default: 300,
    },
  },
  data() {
    return {
      init: false,
      active: 0,
      scrollH: 0,
      stat: {
        expend: "3,3543,363",
        income: "2,305,555",
        average: "12,055,555",
      },
    };
  },
  watch: {
    height(val) {
      this.calcuScrollHeight(val);
    },
  },
  created() {},
  methods: {
    initData() {
      if (this.init === true) return;
      this.init = true;
      // 初始化数据
      console.log("初始化数据-年数据");
    },
    // 计算scroll-view 最高度
    calcuScrollHeight(height) {
      let that = this;
      let query = uni.createSelectorQuery().in(that);
      query.select("#mb-stat-year-header").fields({ size: true });
      query.exec((data) => {
        that.scrollH = height - data[0].height;
      });
    },
  },
};
</script>

<style lang="scss" scope>
.mb-stat-year {
  &-header {
    padding: 15rpx;
    border-radius: 0 0 25rpx 25rpx;
    background-color: $light-color;
  }
  &-content {
    .content-total {
      color: #ffffff;
      padding: 40rpx 30rpx;
      margin: 30rpx 20rpx;
      background-color: $primary-color;
      border-radius: 10rpx 35rpx 10rpx 35rpx;
      &-month {
        display: flex;
        flex-wrap: nowrap;
        font-size: 30rpx;
        &-expend {
          font-size: 50rpx;
          font-weight: bold;
        }
      }
      &-mg-top {
        margin-top: 25rpx;
      }
      &-title {
        color: $grey-bright-color;
      }
      &-bold {
        font-weight: bold;
      }
    }
  }

  &-month-list {
    background-color: #ffffff;
    border-radius: 30rpx;
    padding: 10rpx;
    margin: 0 20rpx;
  }
}
</style>
