<template>
  <view class="container">
    <view v-if="!showLoginTip">
      <view class="wallet-header">
        <picker class="time-picker" mode="date" @change="pickerChange" fields="month" :value="date">
          <view class="date-view">
            <view class="toptitle-text">{{ page.Year }}</view>
            <view>
              <text class="bottom-text">{{ page.Month }}</text>
              <text class="toptitle-text">月 ▼</text>
            </view>
          </view>
        </picker>
        <view>
          <view class="toptitle-text">收入</view>
          <view>
            <text class="bottom-text">{{ statementTotal.monthIcome }}</text>
          </view>
        </view>
        <view>
          <view class="toptitle-text">支出</view>
          <view>
            <text class="bottom-text">{{ statementTotal.monthExpend }}</text>
          </view>
        </view>
      </view>
      <view class="bill-container">
        <view v-for="(item, index) in statementList" :key="index">
          <mbill-bill-statement-item :bill="item"></mbill-bill-statement-item>
        </view>
        <core-empty v-if="statementList.length == 0" :title="emptyTitle"></core-empty>
        <uni-load-more v-else-if="showLoadMore" :status="status" :content-text="contentText"></uni-load-more>
      </view>
    </view>
    <core-login-modal/>
  </view>
</template>

<script>
import Util from "@/common/utils/util";
import { mapMutations, mapActions, mapState } from "vuex";

const nowDate = new Date();
export default {
  data() {
    return {
      emptyTitle: "这个月没有账目噢！",

      date: nowDate,
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
      statementTotal: {
        monthExpend: 0.0,
        monthIcome: 0.0
      },
      showLoadMore: false,
      status: "more",
      contentText: {
        contentdown: "上拉加载更多",
        contentrefresh: "加载中",
        contentnomore: "没有更多"
      },
      total: 0,
      page: {
        UserId: 0,
        Year: Util.getCurrentYear(),
        Month: Util.getCurrentMonth(),
        Size: 10,
        Page: 0
      }
    };
  },
  computed: {
    ...mapState({
      showLoginTip: state => state.user.showLoginTip,
      userInfo: state => state.user.userInfo
    })
  },
  onLoad() {
    this.getStatementList();
    this.getStatementTotal();
  },
  onShow() {
    this.page.Page = 0;
    this.getStatementList(true);
    this.getStatementTotal();
  },
  onPullDownRefresh() {
    this.page.Page = 0;
    this.getStatementList(true);
    this.getStatementTotal();
    uni.stopPullDownRefresh();
  },
  onReachBottom() {
    this.status = "more";
    this.showLoadMore = true;
    var totalPage = this.total / this.page.Size;
    var currentPage = this.page.Page + 1;
    if (currentPage > totalPage) {
      this.status = "noMore";
      return;
    }

    this.page.Page += 1;
    this.status = "loading";
    this.getStatementList();
  },
  methods: {
    ...mapActions(["getPagesAsync", "getTotalAsync"]),
    /**
     * 获取分页账单数据
     * isCover：是否清除账单数据（重新加载）
     */
    async getStatementList(isCover = false) {
      let that = this;
      that.page.UserId = that.userInfo.id;
      let res = await that.getPagesAsync(that.page);
      if (isCover) {
        uni.pageScrollTo({ scrollTop: 0, duration: 0 });
        that.statementList = res.items;
      } else {
        that.statementList = [...that.statementList, ...res.items];
      }

      that.total = res.total;
    },
    // 获取当各类账单总计
    async getStatementTotal() {
      let that = this;
      let res = await that.getTotalAsync({
        UserId: that.userInfo.id,
        Year: that.page.Year,
        Month: that.page.Month
      });
      that.statementTotal = res;
    },
    //时间改变触发
    pickerChange({ detail }) {
      let that = this;
      var date = new Date(detail.value);
      // console.log(detail);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (year != that.page.Year || month != that.page.Month) {
        that.page.Year = year;
        that.page.Month = month;
        uni.startPullDownRefresh();
      }
    }
  }
};
</script>

<style lang="scss">
.wallet-header {
  position: sticky;
  top: 0;
  z-index: 998;
  background: white;
  height: 130rpx;
  //position: relative;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  color: $primaryColor;
  border-radius: 15rpx;
  box-shadow: 4rpx 8rpx 12rpx #ccc;
  .toptitle-text {
    width: 100%;
    margin-bottom: 3rpx;
    font-size: 25rpx;
    text-align: center;
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
