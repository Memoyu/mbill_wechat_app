<template>
  <view class="mbill-tabs" v-if="type.length > 0">
    <scroll-view
      scroll-x="true"
      scroll-with-animation
      :scroll-left="tabsScrollLeft"
      @scroll="scroll"
    >
      <view :class="['tab', fontsize]" id="tab-list">
        <view
          v-for="(item, index) in type"
          :key="index"
          :class="[
            'tab-item-block',
            { 'tab-item-block--active': currentIndex === index },
          ]"
          :style="{ color: currentIndex === index ? `${itemColor}` : '' }"
          id="tab-item"
          @click="selectTab(item, index)"
        >
          <view class="tab__item-title">
            {{ item.title }}
          </view>
        </view>
      </view>
      <view
        class="tab-line"
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
export default {
  name: "mbill-tabs",
  props: {
    value: [Number, String],
    type: {
      // 传值
      type: Array,
      default: [],
    },
    itemColor: {
      type: String,
      default: "#A6B1E1",
    }, // tab主色调
    lineColor: String, // 下划线主色调
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
      tabsScrollLeft: 0,
      duration: 0.3,
    };
  },
  watch: {
    type() {
      this.setTabList();
    },
    value(val) {
      this.currentIndex = val;
      this.setTabList();
    },
  },
  mounted() {
    this.currentIndex = this.value;
    this.setTabList();
    if (!this.lineAnimated) {
      this.duration = 0;
    }
  },
  methods: {
    selectTab(item, index) {
      this.$emit("input", index);
    },
    setTabList() {
      this.$nextTick(() => {
        if (this.type.length > 0) {
          this.setLine();
          this.scrollIntoView();
        }
      });
    },
    setLine() {
      let lineWidth = 0,
        lineLeft = 0;
      this.getElementData(`#tab-item`, (data) => {
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
      this.getElementData("#tab-list", (data) => {
        let list = data[0];
        this.getElementData(`#tab-item`, (data) => {
          let el = data[this.currentIndex];
          // lineLeft = el.width * (this.currentIndex + 0.5) - list.width / 2 - this.scrollLeft
          lineLeft =
            el.width / 2 +
            -list.left +
            el.left -
            list.width / 2 -
            this.scrollLeft;
          this.tabsScrollLeft = this.scrollLeft + lineLeft;
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
  },
};
</script>

<style lang="scss">
.mbill-tabs {
  position: relative;
  .tab {
    position: relative;
    display: flex;
    font-size: 28rpx;
    white-space: nowrap;
    line-height: 90rpx;
    &-item-block {
      padding: 0 30rpx;
      text-align: center;
      color: $grey-text-color;
      &-active {
        font-weight: bold;
        color: $primary-color;
      }
      &-title {
      }
    }
  }
  .small {
    font-size: 28rpx;
  }
  .medium {
    font-size: 30rpx;
  }

  .large {
    font-size: 35rpx;
  }
  .tab-line {
    display: block;
    height: 6rpx;
    position: absolute;
    bottom: 15rpx;
    left: 0;
    z-index: 1;
    border-radius: 3rpx;
    position: relative;
    background: $primary-color;
  }
}
</style>