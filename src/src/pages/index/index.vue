<template>
  <view class="b-container">
    <!-- 日历 -->
    <view class="calendar-content" id="calendar-content">
      <view class="bg" />
      <view class="date-title">
        <picker
          class="date-picker"
          mode="date"
          @change="handlePickerChange"
          fields="month"
          :value="pickerDate"
        >
          <view class="now-date x-c">
            <text>{{ pickerDateText.year }}年{{ pickerDateText.month }}月</text>
            <i class="iconfont icon-bottom icon-down" />
          </view>
        </picker>
        <view class="statement">
          <view class="statement-text">
            <text class="statement-text-title">总收入</text>
            <view class="statement-text-total">
              <text class="statement-text-total-char">￥</text>
              <text>{{ indexStat.income }}</text>
            </view>
          </view>
          <view class="statement-text">
            <text class="statement-text-title">总支出</text>
            <view class="statement-text-total">
              <text class="statement-text-total-char">￥</text>
              <text>{{ indexStat.expend }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="calendar">
        <mb-ba-calendar
          ref="calendar"
          :expand="expand"
          :tags="indexTags"
          :date="calendarDate"
          @change="handleDayChange"
          @changemonth="handleMonthChange"
          @sizechange="handleSizeChange"
        />
      </view>
    </view>
    <!-- 展开、收缩 -->
    <view
      :style="{ height: expandHeight + 'px' }"
      class="calendar-expand"
      @tap="handleExpandView"
    >
      <i
        style="font-size: 20px"
        :class="['iconfont', 'icon-' + (expand ? 'top' : 'bottom')]"
      />
    </view>
    <!-- 账单列表 -->
    <scroll-view
      class="statement-item"
      :style="{
        height: scrollHeight + 'px',
      }"
      scroll-y="true"
      :refresher-enabled="true"
      :refresher-triggered="triggered"
      @scrolltolower="onLowerBottom"
      @refresherpulling="onPulling"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
      @refresherabort="onAbort"
    >
      <mb-b-day-group :groups="indexBills" />
      <mb-ba-login-hint v-if="!isLogin" />
      <mb-ba-empty v-if="indexBills.length <= 0 && isLogin" />
    </scroll-view>
    <mb-b-day-list-popup
      height="70"
      :show="popShow"
      :date="popDate"
      @change="handleBillsOnDayPopup"
    />
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { router, tabbar } from "@/mixins";
import datetime from "@/common/utils/datetime";

const now = new Date();
export default {
  mixins: [router, tabbar], //混入文件
  data() {
    return {
      calendarDate: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      },
      pickerDate: datetime.getCurDate(),
      pickerDateText: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      },
      indexPage: {
        page: 1,
        size: 15,
      },
      indexTotal: 0,
      expand: true,
      loading: false,
      popShow: false,
      popDate: {},
      pH: 0,
      dateTitleHeight: 62,
      tabbarHeight: getApp().globalData.tabbarHeight,
      expandHeight: 25,
      scrollHeight: 0,
      scrollMaxHeight: 0,
      state: 1,
      triggered: false,
      freshing: false,
    };
  },
  computed: {
    ...mapState({
      indexStat: (state) => state.bill.indexStat,
      indexTags: (state) => state.bill.indexTags,
      indexBills: (state) => state.bill.indexBills,
    }),
    ...mapGetters(["isLogin"]),
  },
  onLoad() {
    this.getFixedHeight();
    this.triggered = true;
    this.onRefresh();
  },
  onShow() {
    this.setTabBarIndex(0);
  },
  onReady() {},
  methods: {
    ...mapActions(["getIndexTotalStat", "getIndexBillTags", "getIndexBills"]),
    // 初始化数据
    initData() {
      return new Promise((resolve, reject) => {
        this.getIndexTotalStat(this.pickerDate);
        this.getIndexBillTags(this.pickerDate);
        this.indexPage.page = 1;
        this.getMonthBills(true)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      });
    },

    //#region 接口请求

    // 初始化、切换月份重新加载账单
    getMonthBills(init = false) {
      if (this.loading) return;
      this.loading = true;
      return this.getIndexBills({
        date: this.pickerDate,
        page: this.indexPage,
        isInit: init,
      })
        .then((res) => {
          this.indexTotal = res;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    //#endregion

    //#region 组件初始化

    // 获取固定高度值
    getFixedHeight() {
      let that = this;
      uni.getSystemInfo({
        success(res) {
          that.pH = res.windowHeight - 5; // 多出的5px，不让底部触底
        },
      });
    },

    // 动态计算scroll view 高度
    getDynamicHeight(h) {
      // console.log(h);
      if (h) {
        // 10 为日历原本有上下为5的边距
        this.scrollHeight =
          this.pH -
          this.tabbarHeight -
          h -
          this.expandHeight -
          this.dateTitleHeight;
        this.scrollMaxHeight = this.scrollHeight;
        return;
      }
      let query = uni.createSelectorQuery();
      query.select("#calendar-content").fields({ size: true });
      query.exec((data) => {
        // console.log(data);
        let elHeight = data[0].height;
        /*console.log(
          "参数",
          this.pH,
          this.tabbarHeight,
          elHeight,
          this.expandHeight
        );*/
        this.scrollHeight =
          this.pH - this.tabbarHeight - elHeight - this.expandHeight;
        this.scrollMaxHeight = this.scrollHeight;
        // 30 为时间时间选择栏的上下为15的边距
        // console.log("初始化高度", this.scrollMaxHeight);
      });
    },

    // 日历月份变更
    handleMonthChange(date) {
      // console.log("date", date);
      this.pickerDateText = date;
      this.pickerDate = `${date.year}-${date.month}`;
      // console.log(this.pickerDate.toLocaleDateString());
      this.initData();
    },

    // 选中具体日期时弹窗展示账单
    handleDayChange(e) {
      // console.log(this.isLogin);
      // console.log(this.token);
      if (!this.isLogin) {
        this.$tip.toast_quick("暂未登录，请先登录！");
        return;
      }
      // console.log("选中日期：", e);
      this.popDate = e;
      this.popShow = true;
    },

    // 选择日期
    handlePickerChange({ detail }) {
      // console.log(detail.value);
      let d = new Date(detail.value);
      let select = datetime.getCurDateObj(d);
      if (
        select.year == this.pickerDateText.year &&
        select.month == this.pickerDateText.month
      )
        return;
      this.calendarDate = select;
      // console.log("calendarDate", this.calendarDate);
      this.pickerDate = datetime.getCurDate(d);
      this.pickerDateText = this.calendarDate;
      this.initData();
    },

    // 弹窗状态改变触发
    handleBillsOnDayPopup(e) {
      this.setTabBarShow(!e.show);
      this.popShow = e.show;
    },

    // 日历size发生变更
    handleSizeChange(h) {
      // console.log("日历尺寸", h);
      this.getDynamicHeight(h);
    },

    // 展开、收缩scroll-view
    handleExpandView() {
      let minHeight = this.dateTitleHeight;
      // console.log(minHeight);
      if (this.expand) {
        this.scrollHeight =
          this.pH - minHeight - this.tabbarHeight - this.expandHeight;
        this.expand = false;
      } else {
        this.scrollHeight = this.scrollMaxHeight;
        this.expand = true;
      }
    },

    // 自定义下拉刷新控件被下拉
    onPulling(e) {
      // console.log("onpulling", e);
      if (e.detail.deltaY < 0) return; // 防止上滑页面也触发下拉
      this.triggered = true;
    },

    // 自定义下拉刷新被触发
    async onRefresh() {
      if (this.freshing) return;
      this.freshing = true;
      this.initData().finally((res) => {
        this.triggered = false;
        this.freshing = false;
      });
    },
    // 自定义下拉刷新被复位
    onRestore() {
      this.triggered = "restore"; // 需要重置
    },
    // 自定义下拉刷新被中止
    onAbort() {},

    // scroll触底事件
    onLowerBottom() {
      // console.log("触底加载");
      if (this.indexPage.page * this.indexPage.size >= this.indexTotal) return;
      // console.log("加载");
      this.indexPage.page += 1;
      this.getMonthBills();
    },
    //#endregion
  },
};
</script>

<style lang="scss" scoped>
.calendar-content {
  .bg {
    z-index: -1;
    position: absolute;
    top: 0;
    background-color: $light-color;
    width: 100%;
    height: 30%;
    border-radius: 0 0 30rpx 30rpx;
  }
  .date-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 30rpx;
    align-items: center;
    height: 64rpx;
    .date-picker {
      .now-date {
        font-size: 30rpx;
        font-weight: bold;
        align-items: baseline;
        .icon-down {
          font-size: 20rpx;
          margin-left: 10rpx;
        }
      }
    }
    .statement {
      display: flex;
    }

    .statement-text {
      margin-left: 40rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      &-title {
        font-size: 25rpx;
      }
      &-total {
        font-size: 30rpx;
        font-weight: bold;
        &-char {
          font-size: 23rpx;
        }
      }
    }
  }
  .calendar {
    margin: 0 20rpx;
  }
}
.calendar-expand {
  width: 100%;
  text-align: center;
}

.statement-item {
  // background: white;
  border-radius: 30rpx 30rpx 0 0;
}

.popup-box {
  .asset {
    height: 700rpx;
  }
}
</style>
