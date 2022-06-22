<template>
  <view class="mbill-bill-stat-month-list">
    <view
      class="mb-stat-month-item"
      v-for="(item, index) in surplus"
      :key="index"
      @click="handleClick(item)"
    >
      <view class="mb-stat-month-item-month">
        <view class="mb-stat-month-item-month-bl">
          <view class="month">{{ item.month }}</view>
          <view class="title">月</view>
        </view>
      </view>

      <view class="mb-stat-month-item-amount y-start">
        <view class="surplus-info">
          <text class="surplus">{{ item.surplus }}</text>
          <text class="title">结余</text>
        </view>
        <view class="income-expend-info x-start">
          <view class="income">
            <text class="title income-color">收</text>
            <text>{{ item.income }}</text>
          </view>
          <view class="expend">
            <text class="title expend-color">支</text>
            <text>{{ item.expend }}</text>
          </view>
        </view>
      </view>
      <view class="icon-container">
        <i class="iconfont icon-to right-icon" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bill-stat-month-list",
  props: {
    surplus: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      /*surplus: [
        {
          month: 1,
          surplus: "3,460",
          expend: "1,000",
          income: "1,030",
        },
        {
          month: 2,
          surplus: "3,460",
          expend: "1,000",
          income: "1,030",
        },
        {
          month: 3,
          surplus: "3,460",
          expend: "1,000",
          income: "1,030",
        },
        {
          month: 4,
          surplus: "3,460",
          expend: "1,000",
          income: "1,030",
        },
        {
          month: 5,
          surplus: "3,460",
          expend: "1,000",
          income: "1,030",
        },
        {
          month: 6,
          surplus: "3,460",
          expend: "1,000",
          income: "1,030",
        },
        {
          month: 7,
          surplus: "3,460",
          expend: "1,000",
          income: "1,030",
        },
        {
          month: 8,
          surplus: "3,460",
          expend: "1,000",
          income: "1,030",
        },
        {
          month: 9,
          surplus: "3,460",
          expend: "1,000",
          income: "1,030",
        },
        {
          month: 10,
          surplus: "3,460",
          expend: "1,000",
          income: "1,030",
        },
        {
          month: 11,
          surplus: "3,460",
          expend: "1,000",
          income: "1,030",
        },
        {
          month: 12,
          surplus: "3,460",
          expend: "1,000",
          income: "1,030",
        },
      ],*/
    };
  },
  methods: {
    handleClick(item) {
      this.$emit("click", item.month);
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-bill-stat-month-list {
  .mb-stat-month-item {
    display: flex;
    padding: 10rpx 0;
    margin: 30rpx 30rpx;

    &-month {
      display: flex;
      align-items: center;
      margin-right: 40rpx;
      &-bl {
        display: flex;
        align-items: baseline;
        .month {
          font-weight: bold;
          font-size: 40rpx;
        }
        .title {
          color: $grey-text-color;
          margin-left: 10rpx;
          font-size: 30rpx;
        }
      }
    }

    &-amount {
      width: 100%;
      .surplus-info {
        .surplus {
          font-size: 40rpx;
          font-weight: bold;
        }
        .title {
          margin-left: 20rpx;
          font-size: 25rpx;
          color: $grey-text-color;
        }
      }
      .income-expend-info {
        font-size: 30rpx;
        font-weight: bold;
        .income {
        }
        .expend {
          margin-left: 40rpx;
        }
        .title {
          margin-right: 10rpx;
          font-size: 25rpx;
        }
      }
    }
    &-image {
      margin-right: 20rpx;
      border-radius: 50%;
      height: 35px;
      width: 35px;
    }
    .icon-container {
      display: flex;
      justify-content: center;
      align-items: center;
      .right-icon {
        display: flex;
        border-radius: 50%;
        background: $grey-light-color;
        justify-content: center;
        align-items: center;
        margin-left: 30rpx;
        color: $grey-color;
        height: 40rpx;
        width: 40rpx;
        font-size: 20rpx;
      }
    }
  }
}
</style>
