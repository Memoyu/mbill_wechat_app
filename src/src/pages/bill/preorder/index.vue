<template>
  <view class="b-container">
    <view class="header">
      <view class="date-title" id="date-title">
        <picker
          class="time-picker"
          mode="date"
          @change="handlerPickerChange"
          fields="month"
          :value="pickerDate"
        >
          <view class="x-c">
            <text class="now-date"
              >{{ pickerDateText.year }}年{{ pickerDateText.month }}月</text
            >
            <i
              class="iconfont icon-bottom"
              style="margin-left: 5px; font-size: 13px"
            />
          </view>
        </picker>
        <view class="pre-order-stat">
          <view class="pre-order-stat-content top">
            <view class="pre-order-stat-text">
              <text class="text">预购分组</text>
              <text class="total">{{ stat.total }}</text>
            </view>
            <view class="pre-order-stat-text">
              <text class="text">预购金额</text>
              <text class="total">￥{{ stat.amount }}</text>
            </view>
          </view>
          <view class="bottom-line" />
          <view class="pre-order-stat-content bottom">
            <view class="pre-order-stat-text">
              <text class="text">已完成</text>
              <text class="total">{{ stat.done }}</text>
            </view>
            <view class="pre-order-stat-text">
              <text class="text">未完成</text>
              <text class="total">{{ stat.undone }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="add-pre-order-group" @click="handlerLogout">新建预购分组</view>
  </view>
</template>

<script>
import datetime from "@/common/utils/datetime";

export default {
  data() {
    return {
      pickerDate: datetime.getCurDate(),
      pickerDateText: {
        year: datetime.getCurYear(),
        month: datetime.getCurMonth(),
      },
      stat: {
        total: 0,
        amount: 0,
        done: 0,
        undone: 0,
      },
    };
  },
  onShow() {},
  onLoad() {},
  methods: {},
};
</script>

<style lang="scss" scope>
.header {
  width: 100%;
  .date-title {
    height: 70px;
    background-color: $light-color;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 15px;
    align-items: center;
    border-radius: 0 0 15px 15px;

    .now-date {
      font-size: 15px;
      font-weight: bold;
    }

    .pre-order-stat {
      width: 60%;
      display: flex;
      flex-direction: column;
      .pre-order-stat-content {
        display: flex;
        justify-content: space-around;
      }
      .top {
        margin-bottom: 10px;
      }
      .bottom {
        margin-top: 10px;
      }
      .bottom-line {
        height: 1px;
        background: $bright-color;
        width: 100%;
      }
    }

    .pre-order-stat-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 80px;

      .text {
        font-size: 12px;
      }
      .total {
        font-size: 15px;
        font-weight: bold;
      }
    }
  }
}
.add-pre-order-group {
  position: absolute;
  bottom: 5%;
  font-weight: bold;
  color: $dark-color;
  text-align: center;
  border-radius: 20px;
  background-color: $primary-color;
  padding: 10px 0;
  width: 70%;
}
</style>
