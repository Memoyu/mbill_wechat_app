<template>
  <view
    class="calendar"
    :style="{
      height: expand ? 'auto' : minHeight + 'px',
    }"
  >
    <view class="calendar-title">
      <picker
        class="time-picker"
        mode="date"
        @change="pickerChange"
        fields="month"
        :value="date"
      >
        <text class="now-date">{{ nowYear }}年{{ nowMonth }}月</text>
      </picker>
      <view class="statement">
        <view class="statement-text">
          <text class="text">总收入</text>
          <text class="total">￥100222</text>
        </view>
        <view class="statement-text">
          <text class="text">总支出</text>
          <text class="total">￥100222</text>
        </view>
      </view>
    </view>
    <view class="day">
      <view
        class="day-item"
        v-for="(item, index) in ['日', '一', '二', '三', '四', '五', '六']"
        :key="index"
      >
        {{ item }}
      </view>
    </view>

    <!-- 日期 -->
    <view
      class="threeMonth"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
      :style="{ left: 'calc(-100% + ' + dayLeft + 'px)', height: comH + 'px' }"
    >
      <!-- 遍历集合三个月的列表 -->
      <view class="day" v-for="(item, index) in monthList" :key="index">
        <!-- 遍历每个月的天数 -->
        <view
          class="day-item"
          v-for="(item2, index2) in item"
          :key="index2"
          @tap="dayClick(index2)"
        >
          <!-- 不是本月的天数颜色为灰色 -->
          <view
            :class="[
              'item-text',
              item2.className,
              item2.fromMonth == 'nowMonth'
                ? 'item-text-dark'
                : 'item-text-grey',
            ]"
            ><text>{{ item2.day }}</text>
            <view v-if="item2.isTag" class="status-point" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const currentDate = new Date();
export default {
  name: "mbill-calendar",
  props: {
    expand: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      date: currentDate,
      nowYear: currentDate.getFullYear(), //获取年份
      nowMonth: currentDate.getMonth() + 1, //获取月份
      selectedDate: {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate(),
      },
      monthList: [],
      dayLeft: 0,
      startLeft: 0,
      comH: "auto",
      minHeight: 0,
    };
  },
  onReady() {
    let titleH = uni.createSelectorQuery().in(this).select(".calendar-title");
    titleH
      .boundingClientRect((data) => {
        this.minHeight = data.height + 30;
      })
      .exec();
  },

  created() {
    /*调用初始化当前考勤*/
    this.getThreeMonth();
  },

  methods: {
    //时间改变触发
    pickerChange({ detail }) {
      let date = new Date(detail.value);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (year !== this.nowYear || month !== this.nowMonth) {
        this.nowYear = year;
        this.nowMonth = month;
        this.date = new Date(this.nowYear, this.nowMonth - 1);
      }
      this.syy();
      this.xyy();
      this.getCurrentMonthHeight();
    },

    // 日期模块松手
    touchend(e) {
      // 根据移动距离判断跳转上一月还是下一月
      if (this.dayLeft > 100) this.syy();
      if (this.dayLeft < -100) this.xyy();
      this.dayLeft = 0;
      this.date = new Date(this.nowYear, this.nowMonth - 1);
      this.getCurrentMonthHeight();
    },

    // 日期模块点击
    touchstart(e) {
      // 记录初始点击位置
      this.startLeft = e.touches[0].pageX;
    },

    // 日期模块拖动
    touchmove(e) {
      this.dayLeft = e.touches[0].pageX - this.startLeft;
    },

    /*获取上一月*/
    syy() {
      if (this.nowMonth == 1) {
        this.nowYear = parseInt(this.nowYear) - 1;
        this.nowMonth = 12;
        this.getThreeMonth();
        return;
      }
      this.nowMonth = parseInt(this.nowMonth) - 1;
      this.getThreeMonth();
    },

    /*获取下一月*/
    xyy() {
      if (this.nowMonth == 12) {
        this.nowYear = parseInt(this.nowYear) + 1;
        this.nowMonth = 1;
        this.getThreeMonth();
        return;
      }
      this.nowMonth = parseInt(this.nowMonth) + 1;
      this.getThreeMonth();
    },

    // 获取三月日期
    getThreeMonth() {
      let year, month;
      this.monthList = [];

      // 获取上一月日历
      if (this.nowMonth == 1) {
        year = parseInt(this.nowYear) - 1;
        month = 12;
      } else {
        year = this.nowYear;
        month = parseInt(this.nowMonth) - 1;
      }
      this.monthList.push(this.getCalendar(year, month));

      // 获取当前月日历
      this.monthList.push(this.getCalendar(this.nowYear, this.nowMonth));

      // 获取下一月日历
      if (this.nowMonth == 12) {
        year = parseInt(this.nowYear) + 1;
        month = 1;
      } else {
        year = this.nowYear;
        month = parseInt(this.nowMonth) + 1;
      }
      this.monthList.push(this.getCalendar(year, month));
    },

    //获取某月日期
    getCalendar(Year, Month) {
      //每个月的天数
      var days_per_month = new Array(
        31,
        28 + this.isLeap(Year),
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
      );
      var dateList = [];

      //获取本月的一号是星期几 0星期天
      var s = new Date(Year + "/" + Month + "/" + "01").getDay();
      var lastYear = Month == 1 ? Year - 1 : Year;
      //上月月份
      var lastMonth = Month == 1 ? 12 : Month - 1;
      // 上月天数
      var lastMonthDay = days_per_month[lastMonth - 1];
      // 补上 上月日期
      for (var i = s - 1; i >= 0; i--) {
        var day = parseInt(lastMonthDay) - i;
        dateList.push({
          year: lastYear,
          month: lastMonth,
          day,
          fromMonth: "lastMonth",
          className: this.isActive(lastYear, lastMonth, day),
          isTag: this.isTag(lastYear, lastMonth, day),
        }); //获取上月末尾天数  补齐本月日历显示
      }

      // 当月天数
      var nowMonthDay = days_per_month[Month - 1];
      // 添加当月日期
      for (var d = 0; d < nowMonthDay; d++) {
        dateList.push({
          year: Year,
          month: Month,
          day: d + 1,
          fromMonth: "nowMonth",
          className: this.isActive(Year, Month, d + 1),
          isTag: this.isTag(Year, Month, d + 1),
        });
      }

      //获取本月最后一天是星期几 0星期天
      var l = new Date(Year + "/" + Month + "/" + nowMonthDay).getDay();
      var nextYear = Month == 12 ? Year + 1 : Year;
      //下月月份
      var nextMonth = Month == 12 ? 1 : Month + 1;
      if (l < 6) {
        // 补上 下月日期
        for (var d = 1; d <= 6 - l; d++) {
          dateList.push({
            year: nextYear,
            month: nextMonth,
            day: d,
            fromMonth: "nextMonth",
            className: this.isActive(nextYear, nextMonth, d),
            isTag: this.isTag(nextYear, nextMonth, d),
          });
        }
      }
      return dateList;
    },

    // 闰年 时间判断
    isLeap(year) {
      return year % 4 == 0
        ? year % 100 != 0
          ? 1
          : year % 400 == 0
          ? 1
          : 0
        : 0;
    },

    isActive(y, m, d) {
      if (
        y == this.selectedDate.year &&
        m == this.selectedDate.month &&
        d == this.selectedDate.day
      ) {
        return "active";
      }

      return "";
    },

    isTag(y, m, d) {
      let tag = false;
      this.tags.map((t) => {
        if (y == t.year && m == t.month && d == t.day) {
          tag = true;
        }
      });
      return tag;
    },

    //点击某一天
    dayClick(index) {
      // 如果 点击本月的日期
      let targetIndex = index;
      if (this.monthList[1][index].fromMonth != "nowMonth") {
        //点击 哪一天
        let day = this.monthList[1][index].day;
        if (this.monthList[1][index].fromMonth == "nextMonth") {
          // 如果 点击下一月的日期 跳转下一月
          this.xyy();
        } else if (this.monthList[1][index].fromMonth == "lastMonth") {
          // 如果 点击上一月的日期 跳转上一月
          this.syy();
        }
        targetIndex = this.monthList[1].findIndex(
          (e) => e.fromMonth == "nowMonth" && e.day == day
        );
      }
      // // 如果 点击本月的日期
      // if (this.monthList[1][index].fromMonth == "nowMonth") {
      //   this.monthList[1].map((item, inx) => {
      //     if (index == inx) {
      //       item.className = "active";
      //       this.selectedDate = {
      //         year: this.nowYear,
      //         month: this.nowMonth,
      //         day: item.day,
      //       };
      //       this.$emit("change", this.selectedDate);
      //     } else {
      //       item.className = "";
      //     }
      //   });
      //   return;
      // }

      // 如果 点击本月的日期

      this.monthList.map((m, i) => {
        m.map((item, inx) => {
          if (targetIndex == inx && i == 1) {
            item.className = "active";
            this.selectedDate = {
              year: this.nowYear,
              month: this.nowMonth,
              day: item.day,
            };
            this.$emit("change", this.selectedDate);
          } else {
            item.className = "";
          }
        });
      });

      // //对应日期 选中状态
      // let nowIndex = this.monthList[1].findIndex(
      //   (e) => e.fromMonth == "nowMonth" && e.day == day
      // );
      // this.monthList[1][nowIndex].className = "active";
      // this.selectedDate = {
      //   year: this.nowYear,
      //   month: this.nowMonth,
      //   day: this.monthList[1][nowIndex].day,
      // };
      // this.$emit("change", this.selectedDate);
    },

    getCurrentMonthHeight() {
      let dayH = uni.createSelectorQuery().in(this).select(".item-text");
      dayH
        .boundingClientRect((data) => {
          let dayCount = this.monthList[1].length;
          let dayHCount = dayCount / 7;
          this.comH = dayHCount * data.height;
        })
        .exec();
    },
  },
};
</script>

<style lang="scss" scope>
.calendar {
  margin: 0 auto;
  padding: 5px 5px;
  width: auto;
  background-color: $bright-color;
  overflow: hidden;

  .calendar-title {
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

  .threeMonth {
    display: flex;
    width: 300%;
    position: relative;
    transition: all 0.1s linear;
  }

  .title {
    font-size: 35rpx;
    font-weight: bold;
    padding-bottom: 30rpx;
  }

  .day {
    display: flex;
    position: relative;
    width: 100%;
    justify-content: space-around;
    flex-wrap: wrap;
    text-align: center;
    align-content: flex-start;
    .day-item {
      width: 14%;
      .item-text {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 50%;
        width: 100%;
        padding-top: calc(50% - 0.8em);
        padding-bottom: calc(50% + 0.8em);
        height: 0;
        &-dark {
          color: $primary-text-color;
        }
        &-grey {
          color: $grey-text-color;
        }
      }
      .status-point {
        &::after {
          display: block;
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: $dark-color;
        }
      }

      .active {
        background-color: $primary-color;
        color: $light-text-color;
      }
    }
  }
}
</style>
