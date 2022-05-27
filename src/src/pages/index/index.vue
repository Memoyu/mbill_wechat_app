<template>
  <view class="b-container">
    <!-- 日历 -->
    <view class="calendar-content" id="calendar-content">
      <view class="bg" />
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
        <view class="statement">
          <view class="statement-text">
            <text class="text">总收入</text>
            <text class="total">￥{{ monthTotal.income }}</text>
          </view>
          <view class="statement-text">
            <text class="text">总支出</text>
            <text class="total">￥{{ monthTotal.expend }}</text>
          </view>
        </view>
      </view>
      <view class="calendar">
        <mb-b-calendar
          ref="calendar"
          :expand="expand"
          :tags="tags"
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
      <mb-bill-day-group :groups="groups" />
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
import { router, tabbar } from "@/mixins";
import { mapGetters } from "vuex";

const now = new Date();
export default {
  mixins: [router, tabbar], //混入文件
  data() {
    return {
      calendarDate: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      },
      pickerDate: new Date(now.getFullYear(), now.getMonth() + 1),
      pickerDateText: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      },
      expand: true,
      monthTotal: {
        income: "0.0",
        expend: "0.0",
      },
      tags: [
        /*{
          year: 2022,
          month: 4,
          day: 3,
        },
        {
          year: 2022,
          month: 4,
          day: 4,
        },
        {
          year: 2022,
          month: 4,
          day: 5,
        },
        {
          year: 2022,
          month: 4,
          day: 6,
        },
        {
          year: 2022,
          month: 4,
          day: 8,
        },
        {
          year: 2022,
          month: 4,
          day: 10,
        },
        {
          year: 2022,
          month: 5,
          day: 5,
        },
        {
          year: 2022,
          month: 5,
          day: 6,
        },
        {
          year: 2022,
          month: 5,
          day: 8,
        },
        {
          year: 2022,
          month: 5,
          day: 10,
        },*/
      ],
      billPage: {
        page: 1,
        size: 15,
      },
      billTotal: 0,
      groups: [],
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
  onLoad() {
    this.getFixedHeight();
    this.getDynamicHeight();
  },
  onShow() {
    this.setTabBarIndex(0);
    this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
      this.getMonthTotalStat();
      this.getHasBillDays();
      this.initMonthBills();
    },
    // 获取指定月份范围内的账单日期
    getHasBillDays() {
      let year = this.pickerDate.getFullYear();
      let month = this.pickerDate.getMonth();
      // console.log(year, month);
      this.$api
        .hasBillDays({
          beginDate: `${year}-${month - 1}`,
          endDate: `${year}-${month + 1}`,
        })
        .then((res) => {
          // console.log(res);
          if (res.data.code === 0) {
            this.tags = res.data.result;
          }
        });
    },

    // 获取指定月份账单总金额
    getMonthTotalStat() {
      let year = this.pickerDate.getFullYear();
      let month = this.pickerDate.getMonth();
      this.$api
        .monthTotalStat({
          month: `${year}-${month}`,
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.monthTotal = res.data.result;
          }
        });
    },

    // 初始化、切换月份重新加载账单
    initMonthBills() {
      this.billPage.page = 1;
      this.groups = [];
      this.getMonthBills();
    },

    // 获取账单分页数据，组装数据
    getMonthBills() {
      this.loading = true;
      this.$api
        .monthBills({
          month: this.pickerDate,
          ...this.billPage,
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.billTotal = res.data.result.total;
            let items = res.data.result.items;
            if (this.groups.length > 0) {
              this.groups.forEach((g) => {
                items.forEach((item, i) => {
                  if (item.day == g.day) {
                    g.items = g.items.concat(item.items);
                    items.splice(i, 1);
                  }
                });
              });
              console.log(items);
              this.groups = this.groups.concat(items);
            } else {
              this.groups = items;
            }
            this.loading = false;
          }
        });
    },

    // scroll触底事件
    lowerBottom() {
      // console.log("触底加载");
      if (this.billPage.page * this.billPage.size >= this.billTotal) return;
      this.billPage.page += 1;
      this.getMonthBills();
    },

    //#region 组件初始化

    getFixedHeight() {
      let that = this;
      uni.getSystemInfo({
        success(res) {
          that.pH = res.windowHeight - 5; // 多出的5px，不让底部触底
        },
      });
    },

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
        // console.log(this.pH, this.tabbarHeight, elHeight);
        this.scrollHeight =
          this.pH - this.tabbarHeight - elHeight - this.expandHeight;
        this.scrollMaxHeight = this.scrollHeight;
        // 30 为时间时间选择栏的上下为15的边距
        this.dateTitleHeight = data[1].height + 30;
        // console.log(this.scrollMaxHeight);
        // console.log(this.dateTitleHeight);
      });
    },

    handlerMonthChange(date) {
      console.log("date", date);
      this.pickerDateText = date;
      this.pickerDate = new Date(date.year, date.month);
      this.initData();
    },

    handlerPickerChange({ detail }) {
      let d = new Date(detail.value);
      this.calendarDate = {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
      };
      this.pickerDate = d;
      this.pickerDateText = this.calendarDate;
      this.initData();
    },
    handlerBillsOnDayPopup(e) {
      this.setTabBarShow(!e.show);
      this.popShow = e.show;
    },
    handlerDayChange(e) {
      console.log("选中日期：", e);
      this.popDate = e;
      this.popShow = true;
    },
    handlerSizeChange(h) {
      // console.log(h);
      this.getDynamicHeight(h);
    },
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

    .now-date {
      font-size: 15px;
      font-weight: bold;
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
