<template>
  <uni-drawer
    ref="dateDrawer"
    mode="right"
    :width="drawerWidth"
    @change="onChangeDrawer"
  >
    <view class="select">
      <view id="select-btn" class="select-btn x-bc">
        <view @click="onCancel">取消</view>
        <view @click="onConfirm">确认</view>
      </view>
      <scroll-view scroll-y="true" :style="{ height: height + 'px' }">
        <view class="select-list">
          <view
            v-for="(ds, index) in dateList"
            :key="index"
            class="select-list-container"
          >
            <view
              v-for="d in ds"
              :key="d.value"
              class="select-list-item"
              @click="onSelectedDate(d)"
            >
              <view class="x-bc">
                <view class="select-list-item-title">{{ d.name }}</view>
                <i
                  v-show="d.checked"
                  class="iconfont icon-confirm icon-selected"
                />
              </view>
              <view class="select-list-item-bottom-line" />
            </view>
            <view class="select-list-container-bottom-line" />
          </view>

          <view class="select-list-item-diy">
            <view class="x-bc">
              <view class="select-list-item-diy-title">自定义</view>
              <switch
                color="#A6B1E1"
                class="select-list-item-diy-switch"
                :checked="isDiy"
                @change="onDateDiySwitch"
              />
            </view>
            <view v-show="isDiy" class="select-list-item-diy-date x-bc">
              <view class="select-list-item-diy-date-begin">
                <picker
                  class="date-picker"
                  mode="date"
                  @change="onDatePicker($event, 'begin')"
                  fields="day"
                  :value="date.begin"
                >
                  <view class="select-list-item-diy-date-title">开始于</view>
                  <view class="select-list-item-diy-date-value">{{
                    date.begin
                  }}</view>
                </picker>
              </view>
              <i class="iconfont icon-xingzhuang_1 icon-mid" />
              <view class="select-list-item-diy-date-end">
                <picker
                  class="date-picker"
                  mode="date"
                  @change="onDatePicker($event, 'end')"
                  fields="day"
                  :value="date.end"
                >
                  <view class="select-list-item-diy-date-title">结束于</view>
                  <view class="select-list-item-diy-date-value">{{
                    date.end
                  }}</view>
                </picker>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </uni-drawer>
</template>

<script>
import datetime from "@/common/utils/datetime";

export default {
  name: "mbill-bill-search-date-drawer",
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      height: 300,
      drawerWidth: 300,
      dateList: [
        [{ name: "全部时间", value: 0, checked: true }],
        [
          { name: "今天", value: 1, checked: false },
          { name: "昨天", value: 2, checked: false },
          { name: "近7天", value: 3, checked: false },
          { name: "近30天", value: 4, checked: false },
        ],
        [
          { name: "本周", value: 5, checked: false },
          { name: "上周", value: 6, checked: false },
        ],
        [
          { name: "本月", value: 7, checked: false },
          { name: "上月", value: 8, checked: false },
        ],
        [
          { name: "本季", value: 9, checked: false },
          { name: "上季", value: 10, checked: false },
        ],
        [
          { name: "本年", value: 11, checked: false },
          { name: "去年", value: 12, checked: false },
        ],
      ],
      isDiy: false,
      date: {
        begin: datetime.getCurDate(),
        end: datetime.getCurDate(),
      },
      selected: 1,
    };
  },
  watch: {
    open(val) {
      if (val) {
        this.$refs["dateDrawer"].open();
      } else {
        this.$refs["dateDrawer"].close();
      }
    },
  },
  created() {
    this.dynamicHeight();
  },
  methods: {
    // 取消
    onCancel() {
      this.$emit("update:open", false);
    },

    // 确认
    onConfirm() {
      this.$emit("update:open", false);
      var range = this.getRangeDate();
    },

    getRangeDate() {
      var range = {};
      switch (this.selected) {
        case -1:
          range = this.date;
          break;
        case 0:
          range = null;
          break;
        case 1:
          range = this.getRecentDateByNum(0);
          break;
        case 2:
          var d = this.getRecentDateByNum(1);
          range = { begin: d.end, end: d.end };
          break;
        case 3:
          range = this.getRecentDateByNum(7);
          break;
        case 4:
          range = this.getRecentDateByNum(30);
          break;
        case 5:
          range = this.getRecentWeekByNum(0);
          break;
        case 6:
          range = this.getRecentWeekByNum(1);
          break;
        case 7:
          range = this.getRecentMonthByNum(0);
          break;
        case 8:
          range = this.getRecentMonthByNum(1);
          break;
        case 9:
          range = this.getRecentQuarter(false);
          break;
        case 10:
          range = this.getRecentQuarter(true);
          break;
        case 11:
          range = this.getRecentYearByNum(0);
          break;
        case 12:
          range = this.getRecentYearByNum(1);
          break;
      }
      console.log(range);
      return range;
    },

    // 获取今天到day的区间时间起止
    getRecentDateByNum(num) {
      var now = new Date();
      var t = new Date(now);
      t.setDate(now.getDate() - num);
      var e = datetime.getCurDate(t);
      return {
        begin: datetime.getCurDate(),
        end: e,
      };
    },

    // 获取前几个周的周一、周日日期
    getRecentWeekByNum(num) {
      var now = new Date();
      var nowDayOfWeek = (now.getDay() == 0 ? 7 : now.getDay() - 1) - 1;
      var begin = new Date(now);
      begin.setDate(begin.getDate() + -(nowDayOfWeek + num * 7));
      var end = new Date(begin);
      end.setDate(end.getDate() + 6);
      return {
        begin: datetime.getCurDate(begin),
        end: datetime.getCurDate(end),
      };
    },

    // 获取前几个月分的月初、月末日期
    getRecentMonthByNum(num) {
      var now = new Date();
      var nowYear = now.getFullYear();
      var nowMonth = now.getMonth();
      var begin = new Date(nowYear, nowMonth - num, 1);
      var end = new Date(nowYear, nowMonth + 1 - num, 0);
      return {
        begin: datetime.getCurDate(begin),
        end: datetime.getCurDate(end),
      };
    },

    // 获取季度
    getRecentQuarter(prev) {
      var now = new Date();
      var nowYear = now.getFullYear();
      var nowMonth = now.getMonth();
      var beginM = 0;
      if (nowMonth <= 2) {
        beginM = 0;
      } else if (nowMonth <= 5) {
        beginM = 3;
      } else if (nowMonth <= 8) {
        beginM = 6;
      } else {
        beginM = 9;
      }
      if (prev && beginM == 0) {
        nowYear -= 1;
        beginM = 9;
      }

      var begin = new Date(nowYear, beginM, 1);
      var end = new Date(begin);
      end.setMonth(begin.getMonth() + 3);
      end.setDate(end.getDate() - 1);
      return {
        begin: datetime.getCurDate(begin),
        end: datetime.getCurDate(end),
      };
    },

    // 获取前几年的第一天日期、最后一天日期
    getRecentYearByNum(num) {
      var now = new Date();
      var nowYear = now.getFullYear();
      var nowMonth = now.getMonth();

      var date = new Date(nowYear - num, nowMonth, 1);

      var begin = new Date(date);
      begin.setDate(1);
      begin.setMonth(0);

      var end = new Date(date);
      end.setFullYear(end.getFullYear() + 1); // 设置到明年
      end.setMonth(0); // 明年的0月，也就是对应到1月，是存在的哦，不是不存在的0
      end.setDate(0); // 明年的0日
      return {
        begin: datetime.getCurDate(begin),
        end: datetime.getCurDate(end),
      };
    },

    onSelectedDate(item) {
      this.selected = item.value;
      this.initSelectItem(item.value);
      if (this.isDiy) {
        this.isDiy = false;
        //强制刷新
        this.$forceUpdate();
      }
    },

    onDateDiySwitch() {
      this.isDiy = !this.isDiy;
      if (this.isDiy) {
        this.initSelectItem(-1);
      }
    },

    initSelectItem(value) {
      this.dateList.forEach((ds) => {
        ds.forEach((d) => {
          if (d.value == value) d.checked = true;
          else d.checked = false;
        });
      });
    },

    onDatePicker(e, type) {
      if (type == "begin") {
        this.date.begin = e.detail.value;
      } else {
        this.date.end = e.detail.value;
      }
    },

    // 抽屉状态发生变化触发
    onChangeDrawer(e) {
      this.$emit("update:open", e);
    },

    // 计算高度，动态调整swiper 高度
    dynamicHeight() {
      let that = this;
      uni.getSystemInfo({
        success(res) {
          let wh = res.windowHeight;
          let query = uni.createSelectorQuery().in(that);
          query.select("#select-btn").fields({ size: true });
          query.exec((data) => {
            let headerH = data[0].height;
            that.height = wh - headerH - 60;
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scope>
.select {
  &-btn {
    margin: 40rpx 20rpx 10rpx 20rpx;
    font-weight: bold;
    font-size: 30rpx;
    color: $primary-color;
  }
  &-list {
    margin: 20rpx 0;
    background-color: #ffffff;

    &-container {
      margin: 20rpx 0;
      &-bottom-line {
        height: 14rpx;
        background: $grey-bright-color;
        width: 100%;
      }
    }
    &-item {
      &-title {
        margin: 20rpx 35rpx;
      }
      &-bottom-line {
        margin-top: 10rpx;
        height: 2rpx;
        background: $bright-color;
        width: 100%;
      }
      .icon-selected {
        margin-right: 20rpx;
        color: $primary-color;
      }
      &-diy {
        margin: 30rpx 35rpx;
        &-switch {
          transform: scale(0.7);
        }
        &-date {
          margin-top: 10rpx;
          font-size: 26rpx;
          .icon-mid {
            color: $primary-color;
          }
          &-begin {
          }
          &-end {
          }

          &-title {
            color: $grey-light-color;
          }

          &-value {
            color: $primary-color;
          }
        }
      }
    }
  }
}
</style>