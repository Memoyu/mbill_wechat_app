<template>
  <view
    class="mbill-calendar"
    :style="{
      height: expand ? 'auto' : '0px',
    }"
  >
    <view class="calendar-container">
      <view class="week" id="week-title">
        <view
          class="week-title"
          v-for="(item, index) in ['一', '二', '三', '四', '五', '六', '日']"
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
        :style="{
          left: 'calc(-100% + ' + dayLeft + 'px)',
          height: comH + 'px',
        }"
      >
        <!-- 遍历集合三个月的列表 -->
        <view class="day" v-for="(item, index) in monthList" :key="index">
          <!-- 遍历每个月的天数 -->
          <view
            class="day-item"
            v-for="(item2, index2) in item"
            :key="index2"
            @tap="handlerDayClick(index2)"
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
    date: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
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
      fixedHeight: 0,
    };
  },

  created() {
    let query = uni.createSelectorQuery().in(this);
    query.select("#week-title").fields({ size: true });
    query.exec((data) => {
      this.fixedHeight = data[0].height;
    });

    /*调用初始化当前日期*/
    this.getThreeMonth();
  },
  watch: {
    date(newValue, oldValue) {
      console.log(newValue);
      this.dateChange(newValue);
    },

    tags(newValue, oldValue) {
      this.monthList.map((m) =>
        m.map((d) => {
          d.isTag = this.isTag(d.year, d.month, d.day);
        })
      );
    },
  },

  methods: {
    //时间改变触发
    dateChange(date) {
      let year = date.year;
      let month = date.month;
      if (year !== this.nowYear || month !== this.nowMonth) {
        this.nowYear = year;
        this.nowMonth = month;
      }
      this.getThreeMonth();
      this.getCurrentMonthHeight();
    },

    //点击某一天
    handlerDayClick(index) {
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

    // 日期模块松手
    touchend(e) {
      // 根据移动距离判断跳转上一月还是下一月
      if (this.dayLeft > 100) this.syy();
      if (this.dayLeft < -100) this.xyy();
      this.dayLeft = 0;
      this.getCurrentMonthHeight();
    },

    /*获取上一月*/
    syy() {
      if (this.nowMonth == 1) {
        this.nowYear = parseInt(this.nowYear) - 1;
        this.nowMonth = 12;
        this.getThreeMonth();
      } else {
        this.nowMonth = parseInt(this.nowMonth) - 1;
        this.getThreeMonth();
      }
      this.changeMonthEvent(this.nowYear, this.nowMonth);
    },

    /*获取下一月*/
    xyy() {
      if (this.nowMonth == 12) {
        this.nowYear = parseInt(this.nowYear) + 1;
        this.nowMonth = 1;
        this.getThreeMonth();
      } else {
        this.nowMonth = parseInt(this.nowMonth) + 1;
        this.getThreeMonth();
      }
      this.changeMonthEvent(this.nowYear, this.nowMonth);
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

      // console.log("日期", this.monthList);
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
      if (s == 0) s = 7;
      var lastYear = Month == 1 ? Year - 1 : Year;
      //上月月份
      var lastMonth = Month == 1 ? 12 : Month - 1;
      // 上月天数
      var lastMonthDay = days_per_month[lastMonth - 1];
      // 补上 上月日期
      for (var i = s - 2; i >= 0; i--) {
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
      if (l == 0) l = 7;
      var nextYear = Month == 12 ? Year + 1 : Year;
      //下月月份
      var nextMonth = Month == 12 ? 1 : Month + 1;
      if (l < 7) {
        // 补上 下月日期
        for (var d = 1; d <= 7 - l; d++) {
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
    // 是否选中日期
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
    // 是否标记日期
    isTag(y, m, d) {
      let tag = false;
      this.tags.map((t) => {
        if (y == t.year && m == t.month && d == t.day) {
          tag = true;
        }
      });
      return tag;
    },

    // 触发月份变更
    changeMonthEvent(year, month) {
      this.$emit("changemonth", { year, month });
    },

    // 获取当前日期选项高度，用于计算当前组件日期高度
    getCurrentMonthHeight() {
      let dayH = uni.createSelectorQuery().in(this).select(".item-text");
      dayH
        .boundingClientRect((data) => {
          let dayCount = this.monthList[1].length;
          let dayHCount = dayCount / 7;
          this.comH = dayHCount * data.height;
          // 10 为上下边距
          this.$emit("sizechange", this.fixedHeight + this.comH);
        })
        .exec();
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-calendar {
  // padding: 5px 5px;
  border-radius: 18px;
  background-color: white;
  overflow: hidden;

  .calendar-container {
    margin: 5px 0;

    .threeMonth {
      display: flex;
      width: 300%;
      position: relative;
      transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
    }

    .title {
      font-size: 35rpx;
      font-weight: bold;
      padding-bottom: 30rpx;
    }

    .week {
      display: flex;
      padding: 0 10px;
      justify-content: space-around;
      .week-title {
        margin: 10px 0;
      }
    }

    .day {
      display: flex;
      position: relative;
      width: 100%;
      padding: 0 10px;
      justify-content: space-around;
      flex-wrap: wrap;
      text-align: center;
      align-content: flex-start;
      .day-item {
        width: 13%;
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
            margin-top: 50%;
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
}
</style>
