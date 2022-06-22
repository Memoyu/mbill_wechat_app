<template>
  <view class="mbill-date-scroll" v-if="list.length > 0">
    <scroll-view
      scroll-x="true"
      scroll-with-animation
      :scroll-left="dateScrollLeft"
      @scroll="scroll"
      @scrolltolower="scrollToLower"
    >
      <view :class="['date-item', fontsize]" id="date-list">
        <view
          v-for="(item, index) in list"
          :key="index"
          :class="[
            'date-item-block',
            { 'date-item-block-active': currentIndex === index },
          ]"
          :id="`date-item-${type}`"
          @click="selectedDate(item, index)"
        >
          <view v-if="type === 'month'" class="date-item-block-month">
            <view>
              <text class=""> {{ getMonthFormat(item) }}</text>
              <text class="date-item-block-month-char"> 月</text>
            </view>
            <view class="date-item-block-month-year">{{ item.year }}</view>
          </view>
          <view v-if="type === 'year'" class="date-item-block-month">
            <view>
              <text class=""> {{ item.year.toString().slice(2) }}</text>
              <text class="date-item-block-month-char"> 年</text>
            </view>
            <view class="date-item-block-month-year">{{
              item.year.toString().slice(0, 2)
            }}</view>
          </view>
        </view>
      </view>
      <view
        class="date-line"
        :style="{
          background: lineColor,
          width: lineStyle.width,
          transform: lineStyle.transform,
          transitionDuration: lineStyle.transitionDuration,
        }"
      >
      </view>
    </scroll-view>
  </view>
</template>

<script>
import datetime from "@/common/utils/datetime";

export default {
  name: "mbill-date-scroll",
  props: {
    value: [Number, String],
    type: {
      type: String,
      default: "month",
    },
    // 指定日期
    specify: {
      type: Object,
      default: {
        year: datetime.getCurYear(),
        month: datetime.getCurMonth(),
      },
    },
    lineAnimated: {
      // 是否展示下划线动画
      type: Boolean,
      default: true,
    },
    fontsize: {
      type: String,
      default: "medium",
    },
  },
  data() {
    return {
      currentIndex: 0,
      lineStyle: {},
      scrollLeft: 0,
      dateScrollLeft: 0,
      duration: 0.3,
      list: [],
      page: {
        size: 10,
        year: datetime.getCurYear(),
        month: datetime.getCurMonth(),
      },
      loading: false,
    };
  },
  watch: {
    type() {
      this.setDateList();
    },
    value(val) {
      this.currentIndex = val;
      this.setDateList();
    },
    specify(val) {
      let index = this.loadSpecifyDate(val);
      console.log("指定了日期", val, index);
      if (index === this.currentIndex || index === -1) return;
      this.$emit("input", index);
      this.$emit("selected", val);
    },
  },
  created() {
    this.loadDates();
  },
  mounted() {
    this.currentIndex = this.value;
    this.setDateList();
    if (!this.lineAnimated) {
      this.duration = 0;
    }
  },
  methods: {
    // 加载日期数据
    loadDates() {
      if (this.loading) return;
      this.loading = true;

      if (this.type === "month") {
        this.getDates();
      } else if (this.type === "year") {
        this.getYears();
      }
      this.loading = false;
    },

    // 加载指定日期，并选中
    loadSpecifyDate(date) {
      let index = -1;

      if (this.type === "month") {
        index = this.list.findIndex(
          (e) => date.year === e.year && date.month === e.month
        );
      } else if (this.type === "year") {
        index = this.list.findIndex((e) => date.year === e.year);
      }
      if (index > -1) return index;
      while (index === -1) {
        if (this.type === "month") {
          index = this.getDates(date);
        } else if (this.type === "year") {
          index = this.getYears(date);
        }
      }
      return index;
    },

    /**
     * 获取日期数据
     * @param {Object} date 指定日期,指定时返回指定日期的index
     */
    getDates(date) {
      let index = -1;
      for (let i = 0; i < this.page.size; i++) {
        this.list.push({
          year: this.page.year,
          month: this.page.month,
        });
        // 赋值指定日期下标
        if (
          date &&
          date.year === this.page.year &&
          date.month === this.page.month
        ) {
          index = this.list.length - 1;
        }

        if (this.page.month == 1) {
          this.page.year -= 1;
          this.page.month = 12;
        } else {
          this.page.month -= 1;
        }
      }
      return index;
    },

    /**
     * 获取日期数据
     * @param {String} year 指定年,指定时返回指定年的index
     */
    getYears(year) {
      let index = -1;
      for (let i = 0; i < this.page.size; i++) {
        this.list.push({
          year: this.page.year,
        });
        if (year && year === this.page.year) {
          index = this.list.length - 1;
        }
        this.page.year -= 1;
      }

      return index;
    },
    getMonthFormat(item) {
      return item.month < 10 ? "0" + item.month : item.month;
    },
    selectedDate(item, index) {
      this.$emit("input", index);
      this.$emit("selected", item);
    },

    setDateList() {
      this.$nextTick(() => {
        this.setLine();
        this.scrollIntoView();
      });
    },

    setLine() {
      let lineWidth = 0,
        lineLeft = 0;
      this.getElementData(`#date-item-${this.type}`, (data) => {
        let el = data[this.currentIndex];
        lineWidth = el.width / 2;
        // lineLeft = el.width * (this.currentIndex + 0.5)  // 此种只能针对每个item长度一致的
        lineLeft = el.width / 2 + -data[0].left + el.left;
        this.lineStyle = {
          width: `${lineWidth}px`,
          transform: `translateX(${lineLeft}px) translateX(-50%)`,
          transitionDuration: `${this.duration}s`,
        };
      });
    },

    scrollIntoView() {
      // item滚动
      let lineLeft = 0;
      this.getElementData("#date-list", (data) => {
        let list = data[0];
        this.getElementData(`#date-item-${this.type}`, (data) => {
          let el = data[this.currentIndex];
          // lineLeft = el.width * (this.currentIndex + 0.5) - list.width / 2 - this.scrollLeft
          lineLeft =
            el.width / 2 +
            -list.left +
            el.left -
            list.width / 2 -
            this.scrollLeft;
          this.dateScrollLeft = this.scrollLeft + lineLeft;
        });
      });
    },

    getElementData(el, callback) {
      uni
        .createSelectorQuery()
        .in(this)
        .selectAll(el)
        .boundingClientRect()
        .exec((data) => {
          callback(data[0]);
        });
    },

    scroll(e) {
      this.scrollLeft = e.detail.scrollLeft;
    },

    scrollToLower(e) {
      console.log("触底", e);
      this.loadDates();
    },
  },
};
</script>

<style lang="scss">
.mbill-date-scroll {
  position: relative;
  ::-webkit-scrollbar {
    display: none;
  }
  .date-item {
    // position: relative;
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    white-space: nowrap;
    &-block {
      padding: 20rpx 20rpx 20rpx 20rpx;
      text-align: center;
      color: $grey-text-color;
      &-active {
        border-radius: 25rpx;
        background-color: $primary-color;
        font-weight: bold;
        color: white;
      }
      &-month {
        &-char {
          font-size: 22rpx;
        }
        &-year {
          font-size: 20rpx;
        }
      }
    }
  }
  .small {
    font-size: 30rpx;
  }
  .medium {
    font-size: 37rpx;
  }
  .date-line {
    display: block;
    height: 6rpx;
    position: absolute;
    bottom: 15rpx;
    left: 0;
    z-index: 1;
    border-radius: 3rpx;
    position: relative;
    background: white;
  }
}
</style>