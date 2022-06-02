<template>
  <view class="b-container">
    <!-- 日历 -->
    <view class="calendar-content" id="calendar-content">
      <view class="bg" />
      <view class="date-title" id="date-title">
        <picker
          class="date-picker"
          mode="date"
          @change="handlerPickerChange"
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
            <text class="text">总收入</text>
            <text class="total">￥{{ indexStat.income }}</text>
          </view>
          <view class="statement-text">
            <text class="text">总支出</text>
            <text class="total">￥{{ indexStat.expend }}</text>
          </view>
        </view>
      </view>
      <view class="calendar">
        <mb-b-calendar
          ref="calendar"
          :expand="expand"
          :tags="indexTags"
          :date="calendarDate"
          @change="handlerDayChange"
          @changemonth="handlerMonthChange"
          @sizechange="handlerSizeChange"
        />
      </view>
    </view>
    <!-- 展开、收缩 -->
    <view
      :style="{ height: expandHeight + 'px' }"
      class="calendar-expand"
      @tap="handlerExpandView"
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
      @scrolltolower="lowerBottom"
    >
      <mb-bill-day-group :groups="indexBills" />
      <mb-b-empty v-if="indexBills.length <= 0" />
    </scroll-view>
    <mb-bill-day-list-popup
      height="70"
      :show="popShow"
      :date="popDate"
      @change="handlerBillsOnDayPopup"
    />
  </view>
</template>

<script>
import { mapActions, mapState } from "vuex";
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
      dateTitleHeight: 0,
      tabbarHeight: getApp().globalData.tabbarHeight,
      expandHeight: 25,
      scrollHeight: 0,
      scrollMaxHeight: 0,
      state: 1,
    };
  },
  computed: {
    ...mapState({
      indexStat: (state) => state.bill.indexStat,
      indexTags: (state) => state.bill.indexTags,
      indexBills: (state) => state.bill.indexBills,
    }),
  },
  onLoad() {
    this.getFixedHeight();
    this.initData();
  },
  onShow() {
    this.setTabBarIndex(0);
  },
  onReady() {
    this.getDynamicHeight();
  },
  methods: {
    ...mapActions(["getIndexTotalStat", "getIndexBillTags", "getIndexBills"]),
    // 初始化数据
    initData() {
      this.getIndexTotalStat(this.pickerDate);
      this.getIndexBillTags(this.pickerDate);
      this.indexPage.page = 1;
      this.getMonthBills(true);
    },

    //#region 接口请求

    // 初始化、切换月份重新加载账单
    getMonthBills(init = false) {
      if (this.loading) return;
      this.loading = true;
      this.getIndexBills({
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
      if (h) {
        // 10 为日历原本有上下为5的边距
        this.scrollHeight =
          this.pH -
          this.tabbarHeight -
          h -
          this.expandHeight -
          this.dateTitleHeight -
          10;
        this.scrollMaxHeight = this.scrollHeight;
        return;
      }

      let query = uni.createSelectorQuery();
      query.select("#calendar-content").fields({ size: true });
      query.select("#date-title").fields({ size: true });
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
        this.dateTitleHeight = data[1].height + 30;
        // console.log("初始化高度", this.scrollMaxHeight);
        // console.log(this.dateTitleHeight);
      });
    },

    // 日历月份变更
    handlerMonthChange(date) {
      // console.log("date", date);
      this.pickerDateText = date;
      this.pickerDate = `${date.year}-${date.month}`;
      // console.log(this.pickerDate.toLocaleDateString());
      this.initData();
    },

    // 选中具体日期时弹窗展示账单
    handlerDayChange(e) {
      // console.log("选中日期：", e);
      this.popDate = e;
      this.popShow = true;
    },

    // 选择日期
    handlerPickerChange({ detail }) {
      // console.log(detail.value);
      let d = new Date(detail.value);
      this.calendarDate = datetime.getCurDateObj(d);
      // console.log("calendarDate", this.calendarDate);
      this.pickerDate = datetime.getCurDate(d);
      this.pickerDateText = this.calendarDate;
      this.initData();
    },

    // 弹窗状态改变触发
    handlerBillsOnDayPopup(e) {
      this.setTabBarShow(!e.show);
      this.popShow = e.show;
    },

    // 日历size发生变更
    handlerSizeChange(h) {
      // console.log("日历尺寸", h);
      this.getDynamicHeight(h);
    },

    // 展开、收缩scroll-view
    handlerExpandView() {
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

    // scroll触底事件
    lowerBottom() {
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
    border-radius: 0 0 15px 15px;
  }
  .date-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 15px;
    align-items: center;
    .date-picker {
      .now-date {
        font-size: 15px;
        font-weight: bold;
        align-items: baseline;
        .icon-down {
          font-size: 10px;
          margin-left: 5px;
        }
      }
    }
    .statement {
      display: flex;
    }

    .statement-text {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .text {
        font-size: 11px;
      }
      .total {
        font-size: 13px;
        font-weight: bold;
      }
    }
  }
  .calendar {
    margin: 0 10px;
  }
}
.calendar-expand {
  width: 100%;
  text-align: center;
}

.statement-item {
  // background: white;
  border-radius: 15px 15px 0 0;
}

.popup-box {
  .asset {
    height: 350px;
  }
}
</style>
