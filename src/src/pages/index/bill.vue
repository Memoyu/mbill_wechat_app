<template>
  <view class="container">
    <view class="header">
      <image class="bg" :src="header.backgroundUrl" ></image>
      <view class="level-2">
        <view class="overflow-hide">
          <view class="pull-right fs14 today-weather">
            <text>{{ header.positionName4 }}</text>
            <view :class="['iconfont', header.positionWeather, 'weather-icon']"></view>
            <text>{{ header.positionCelsius }}</text>
          </view>
        </view>
        <view class="fs14">{{ header.positionName1 }}</view>
        <view class="fs21 today-expend">{{ statementTotal.dayExpend }}</view>
        <view class="overflow-hide">
          <view class="pull-left fs14">{{ header.positionName2 }} {{ statementTotal.monthExpend }}</view>
          <view class="pull-right fs14">{{ header.positionName3 }} {{ header.positionAmount3 }}</view>
        </view>
      </view>
      <view class="bill-btn">
        <view class="mine-bill-btn btn-shadow" @click="handleAddStatement">
          <i class="iconfont icon-write writeicon"></i>
        </view>
      </view>
      <view>
        <view class="bill-title">今日消费</view>
      </view>
    </view>
    <view class="bill-container">
      <view v-if="!showLoginTip">
        <view v-for="(item, index) in statements" :key="index">
          <mbill-bill-statement-item :bill="item"></mbill-bill-statement-item>
        </view>
        <core-empty v-if="statements.length == 0" :title="emptyTitle"></core-empty>
        <uni-load-more v-else-if="showLoadMore" :status="status" :content-text="contentText"></uni-load-more>
      </view>
      <core-login-modal/>
    </view>
  </view>
</template>

<script>
import { BASE_URL } from "@/env";
import Util from "@/common/utils/util";
import { mapMutations, mapActions, mapState } from "vuex";
import Tools from "@/common/utils/tools";
import Session from "@/common/utils/session";

export default {
  data() {
    return {
      emptyTitle: "今天没有账目噢！",
      statementList: [
        // {
        // 	id: 1,
        // 	categoryIconPath: "http://localhost:5000/core/images/category/icon_mushroom_64.png",
        // 	categoryName: "数码",
        // 	assetName: "微信",
        // 	targetAssetName: "",
        // 	description: "买电脑",
        // 	year: 2021,
        // 	month: 2,
        // 	day: 6,
        // 	time: "16:13:11",
        // 	type: "expend",
        // 	amount: 300
        // },
        // {
        // 	id: 2,
        // 	categoryIconPath: "http://localhost:5000/core/images/category/icon_mushroom_64.png",
        // 	categoryName: "",
        // 	assetName: "微信",
        // 	targetAssetName: "信用卡",
        // 	description: "买电脑",
        // 	year: 2021,
        // 	month: 2,
        // 	day: 6,
        // 	time: "16:13:11",
        // 	type: "transfer",
        // 	amount: 300.89
        // }
      ],
      statementTotal: {
        monthExpend: "0.00",
        dayExpend: "0.00"
      },
      header: {
        backgroundUrl: BASE_URL + "/core/images/other/index_bg1_533x300.png",
        positionName1: "今日支出",
        positionName2: "本月支出",
        positionName3: "剩余预算",
        positionAmount3: "0.00",
        positionName4: "未知",
        positionWeather: "icon-weather-sun",
        positionCelsius: "27℃"
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
        Year: Util.getCurrentYear(),
        Month: Util.getCurrentMonth(),
        Day: Util.getCurrentDay(),
        Size: 10,
        Page: 0,
        UserId: 0
      }
    };
  },
  computed: {
    ...mapState({
      showLoginTip: state => state.user.showLoginTip,
      statements: state => state.statement.statements,
      userInfo: state => state.user.userInfo
    })
  },
  onLoad() {},
  onShow() {
    this.getStatementList(true);
    this.getStatementTotal();
    this.getWeatherInfo();
  },
  onPullDownRefresh() {},
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
    ...mapActions(["addStatements", "getPagesAsync", "getTotalAsync"]),
    /**
     * 获取分页账单数据
     * isCover：是否清除账单数据（重新加载）
     */
    async getStatementList(isCover = false) {
      let that = this;
      that.page.UserId = that.userInfo.id;
      await that.getPagesAsync(that.page).then(res => {
        if (isCover) {
          uni.pageScrollTo({ scrollTop: 0, duration: 0 });
          that.$store.commit("COVER_STATEMENTS", res.items);
        } else {
          that.$store.commit("ADD_STATEMENTS", res.items);
        }
        that.total = res.total;
      });
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
    // 获取天气信息（校验缓存）
    async getWeatherInfo() {
      let that = this;
      let weatherCache = Session.cache("bill:index:weather");
      // console.log(weatherCache);
      if (weatherCache == null) {
        await Tools.getWeather().then(res => {
          //console.log(res)
          var data = res.liveData;
          that.setWeather(data);
          Session.cache("bill:index:weather", JSON.stringify(data), 60 * 60); //一小时过期
        });
      } else {
        that.setWeather(JSON.parse(weatherCache));
      }
    },
    // 赋值天气信息
    setWeather(data) {
      // console.log(data)
      this.header.positionName4 = data.province + "-" + data.city; //"广州",
      (this.header.positionWeather = Tools.getWeatherIcon(data.weather)), //"多云"
        (this.header.positionCelsius = data.temperature + "℃"); //"27℃,
    },
    // 跳转创建账单
    handleAddStatement() {
      if (!this.showLoginTip)
        this.$Router.push({
          path: "/pages/bill/create"
        });
    }
  }
};
</script>

<style lang="scss">
.container {
  &:-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
    display: none;
  }
}

.header {
  position: sticky;
  top: 0;
  z-index: 998;
  background: white;
  color: white;

  .bg {
    position: absolute;
    width: 100%;
    height: 340rpx;
    top: 0;
    z-index: -1;
    border-radius: 15rpx;
  }

  .level-2 {
    padding-top: 10px;
    bottom: 50rpx;
    width: 100%;

    .today-weather {
      display: flex;
      margin-bottom: 15px;

      .weather-icon {
        font-size: 20px;
        margin: 0 5px 0 5px;
      }
    }

    .today-expend {
      font-size: 64rpx;
      margin-bottom: 24rpx;
    }

    > view {
      padding: 0 24rpx;
    }
  }
  .bill-btn {
    text-align: -webkit-center;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 999;

    .mine-bill-btn {
      background: $primaryColor;
      color: white;
      width: 140rpx;
      height: 140rpx;
      border-radius: 50%;
      flex-shrink: 0;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;

      .writeicon {
        font-size: 80rpx;
        color: white;
      }
    }

    .mine-bill-btn::after {
      border: none; //移除边框
    }
  }
  .bill-title {
    position: relative;
    display: inline-block;
    padding-bottom: 4px;
    margin-bottom: 12px;
    font-size: 18px;
    color: #40485b;
    font-weight: bolder;
    margin-left: 14px;

    &:before {
      content: "";
      position: absolute;
      background: $primaryColor;
      width: calc(100% + 16px);
      height: 12px;
      bottom: 0;
      left: 0;
      border-radius: 12px;
      z-index: -1;
    }
  }
}
</style>
