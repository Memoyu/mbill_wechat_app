<template>
  <view class="container">
    <view class="wallet-header">
      <picker
        class="time-picker"
        mode="date"
        bindchange="bindPickerChange($wx)"
        fields="month"
        :value="date"
      >
        <view class="date-view">
          <text class="toptitle-text">{{ dateYear }}</text>
          <view>
            <text class="bottom-text">{{ dateMonth }}</text>
            <text class="toptitle-text">月 ▼</text>
          </view>
        </view>
      </picker>
      <view>
        <text class="toptitle-text">收入</text>
        <view>
          <text class="bottom-text">{{ icome }}</text>
        </view>
      </view>
      <view>
        <text class="toptitle-text">支出</text>
        <view>
          <text class="bottom-text">{{ expend }}</text>
        </view>
      </view>
    </view>
    <view class="bill-container">
      <view class="bill-list" v-if="statementList.length > 0">
        <div v-for="(item, index) in statementList" :key="index">
          <bill :bill="item"></bill>
        </div>
      </view>
    </view>
    <view v-if="statementList.length == 0">
      <core-empty :title="emptyTitle"></core-empty>
    </view>
  </view>
</template>

<script>
const nowDate = new Date();
export default {
  data() {
    return {
      emptyTitle: "这个月没有账目噢！",
      expend: "0.00",
      icome: "0.00",
      date: nowDate,
      dateYear: `${nowDate.getFullYear()}年`,
      dateMonth: `${nowDate.getMonth() + 1}`,
      statementList: [
        // {
        //   id: 1,
        //   icon_path: '',
        //   category: '数码',
        //   description: '买电脑',
        //   timeStr: '11-01 01:26',
        //   asset: '微信',
        //   type: 1,
        //   money: 300
        // },
        // {
        //   id: 2,
        //   icon_path: '',
        //   category: '出行',
        //   description: '买电脑',
        //   timeStr: '11-01 01:26',
        //   asset: '微信',
        //   type: 1,
        //   money: 300.89
        // }
      ],
    };
  },
  onLoad() {},
  methods: {},
};
</script>

<style lang="scss">
.wallet-header {
  height: 130rpx;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  color: $primaryColor;
  border-radius: 15rpx;
  box-shadow: 4rpx 8rpx 12rpx #ccc;
  .toptitle-text {
    margin-bottom: 3rpx;
    font-size: 25rpx;
  }
  .bottom-text {
    font-size: 38rpx;
    font-weight: bold;
  }
}
.bill-container {
  margin-top: 15px;
  .bill-list {
    margin-bottom: 40rpx;
    > .surplus {
      text-align: center;
      > text {
        font-size: 24rpx;
        padding: 0 12rpx;
      }
    }
    > .total {
      text-align: right;
      margin: 0 32rpx;
      > text {
        font-size: 24rpx;
        &:first-child {
          padding-right: 16rpx;
        }
      }
    }
  }
}
</style>
