<template>
  <view class="container">
    <view class="header">
      <image class="bg" :src="header.backgroundUrl"></image>
      <view class="level-2">
        <view class="overflow-hide">
          <view class="pull-right fs14 today-weather">
            <text>{{ header.positionName4 }}</text>
            <view
              :class="['iconfont', header.positionWeather, 'weather-icon']"
            ></view>
            <text>{{ header.positionCelsius }}</text>
          </view>
        </view>
        <view class="fs14"> {{ header.positionName1 }}</view>
        <view class="fs21 today-expend">{{ header.positionAmount1 }}</view>
        <view class="overflow-hide">
          <view class="pull-left fs14"
            >{{ header.positionName2 }} {{ header.positionAmount2 }}</view
          >
          <view class="pull-right fs14"
            >{{ header.positionName3 }} {{ header.positionAmount3 }}</view
          >
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
      <view v-for="(item, index) in statements" :key="index">
        <mbill-bill-statement-item :bill="item"></mbill-bill-statement-item>
      </view>
      <core-empty v-if="statements.length == 0" :title.sync="emptyTitle" />
      <uni-load-more
        v-else-if="showLoadMore"
        :status="status"
        :content-text="contentText"
      ></uni-load-more>
    </view>
  </view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
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
      header: {
        backgroundUrl:
          "http://localhost:5000/core/images/other/index_bg1_533x300.png",
        positionName1: "今日支出",
        positionAmount1: "40.00",
        positionName2: "本月支出",
        positionAmount2: "200.45",
        positionName3: "剩余预算",
        positionAmount3: "200.00",
        positionName4: "广州",
        positionWeather: "icon-weather-sun",
        positionCelsius: "27℃/16℃",
      },
      budgetHeader: {
        budget: "0.00",
        month_expend: "0.00",
        percentage: "0",
        color: "#FF2929",
      },
      showLoadMore: false,
      status: 'more',
      contentText: {
        contentdown: "上拉加载更多",
        contentrefresh: "加载中",
        contentnomore: "没有更多",
      },
      total: 0,
      page: {
        Date: "2021-03-14",// Date: Util.getCurrentDate(),
        Size: 10,
        Page: 0,
      },
    };
  },
  computed: {
		...mapState({
      statements: state => state.statement.statements,
    })
  },
  onUnload() {
    this.showLoadMore = false;
  },
  onLoad() {
    this.getStatementList();
  },
  onPullDownRefresh() {},
  onReachBottom() {

    this.status = "more";
    this.showLoadMore = true;
    var totalPage = this.total / this.page.Size;
    var currentPage = this.page.Page + 1;
    if (currentPage > totalPage) {
				this.status = "moMore"
				return;
		}

    this.page.Page += 1;
    this.getStatementList();
  },
  methods: {
    ...mapActions(['addStatements']),
    getStatementList() {
      this.status = 'loading';
      let that = this;
      that
        .$api("statement.list", this.page)
        .then((res) => {
          if (res.code === 0) {
            that.statementList = [...that.statementList, ...res.result.items];
            that.addStatements(res.result.items)
            that.total = res.result.total;
          }
        });
    },
    handleAddStatement() {
      wx.navigateTo({
        url: "/pages/bill/create",
      });
    },
  },
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
  position: -webkit-sticky;
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

.bill-container {
}
</style>
