<template>
  <view class="container">
    <view class="header">
      <view class="time-filter">
        <view class="month-filter">
          <!-- <view>2019 年 01 月</view> -->
          <view class="iconfont icon-arrow-left" @tap="prevMonth"></view>
          <picker
            class="time-picker"
            mode="date"
            @change="pickerChange"
            fields="day"
            :value="dateModel"
          >
            <view class="month"
              >{{ date.year }} 年 {{ date.month }} 月 {{ date.day }} 日</view
            >
          </picker>
          <view class="iconfont icon-arrow-right" @tap="nextMonth"></view>
        </view>
      </view>
    </view>
    <view class="pre-order-list">
      <view v-for="(item, index) in preOrders" :key="index">
        <mbill-bill-statement-item :bill="item"></mbill-bill-statement-item>
      </view>
      <core-empty
        class=""
        v-if="preOrders.length <= 0"
        :title="emptyTitle"
      ></core-empty>
      <uni-load-more
        v-else-if="showLoadMore"
        :status="status"
        :content-text="contentText"
      ></uni-load-more>
    </view>
    <view class="bottom-button">
      <tui-button>新增预购清单</tui-button>
    </view>
  </view>
</template>
<script>
const nowDate = new Date();
export default {
  name: "preOrderList",
  data() {
    return {
      dateModel: nowDate,
      date: {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        day: nowDate.getDate(),
      },
      preOrders: [],
      emptyTitle: "空空如也！",
      showLoadMore: false,
      status: "more",
      contentText: {
        contentdown: "上拉加载更多",
        contentrefresh: "加载中",
        contentnomore: "没有更多",
      },
    };
  },
  methods: {
    //上一月
    prevMonth() {
      var now = this.dateModel;
      now.setDate(now.getDate() - 1);
      this.dateModel = now;
      this.date.year = now.getFullYear();
      this.date.month = now.getMonth() + 1;
      this.date.day = now.getDate();
    },
    //下一月
    nextMonth() {
      var now = this.dateModel;
      now.setDate(now.getDate() + 1);
      this.dateModel = now;
      this.date.year = now.getFullYear();
      this.date.month = now.getMonth() + 1;
      this.date.day = now.getDate();
    },
    //时间改变触发
    pickerChange({ detail }) {
      let that = this;
      var date = new Date(detail.value);
      // console.log(detail);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (
        year !== that.date.year ||
        month !== that.date.month ||
        day !== that.date.day
      ) {
        that.date.year = year;
        that.date.month = month;
        that.date.day = day;
        that.dateModel = new Date(year, month - 1, day);
      }
    },
  },
};
</script>

<style lang="scss">
.container {
  height: 100%;

  .header {
    position: sticky;
    top: 0;
    z-index: 998;
    background: white;
    .time-filter {
      display: flex;
      justify-content: center;
      padding: 8px 0;
      font-size: 33rpx;
      .month-filter {
        display: flex;
        align-items: center;
        .iconfont {
          color: black;
          padding: 6px 10px;
        }
        .month {
          color: $primaryColor;
          padding: 0 12px;
        }
      }
    }
  }
  .pre-order-list {
    margin: 8px;
  }

  .bottom-button {
    position: absolute;
    bottom: 0;
    left: 0;
    background: #f4f4f4;
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
  }
}
</style>
