<template>
  <view>
    <view class="content">
      <view class="calendar">
        <mbill-calendar
          ref="calendar"
          class="calendar"
          :expand="expand"
          :tags="tags"
          @change="handlerDateChange"
          @sizechange="handlerSizeChange"
        />
      </view>
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
      <scroll-view
        class="items"
        :style="{
          height: scrollHeight + 'px',
        }"
        scroll-y="true"
      >
        <p v-for="(item, index) in Array(100).fill(1)" :key="index">
          123132123132123 {{ index }}
        </p>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { mixin } from "@/mixins/tabbar.js";

export default {
  mixins: [mixin], //混入文件
  data() {
    return {
      expand: true,
      tags: [
        {
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
        },
      ],
      pH: 0,
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
    console.log("h", this.tabbarHeight);
  },
  methods: {
    getFixedHeight() {
      let that = this;
      uni.getSystemInfo({
        success(res) {
          that.pH = res.windowHeight; //windoHeight为窗口高度，主要使用的是这个
        },
      });
    },
    getDynamicHeight(h) {
      if (h) {
        console.log("dooooo" + h);
        this.scrollHeight = this.pH - this.tabbarHeight - h - this.expandHeight;
        this.scrollMaxHeight = this.scrollHeight;
        console.log(
          this.pH,
          this.tabbarHeight,
          h,
          this.expandHeight,
          this.scrollHeight
        );
        return;
      }

      let query = uni.createSelectorQuery();
      query.select(".calendar").fields({ size: true });
      query.exec((data) => {
        // console.log(data);
        let elHeight = data[0].height;
        // console.log(this.pH, this.tabbarHeight, elHeight);
        this.scrollHeight =
          this.pH - this.tabbarHeight - elHeight - this.expandHeight;
        this.scrollMaxHeight = this.scrollHeight;
        // console.log(this.scrollMaxHeight);
      });
    },
    handlerDateChange(e) {
      console.log(e);
    },
    handlerSizeChange(h) {
      this.getDynamicHeight(h);
    },
    handlerExpandView() {
      let minHeight = this.$refs.calendar.minHeight + 10;
      console.log(minHeight);
      if (this.expand) {
        this.scrollHeight =
          this.pH - minHeight - this.tabbarHeight - this.expandHeight;
        this.expand = false;
      } else {
        this.scrollHeight = this.scrollMaxHeight;
        this.expand = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.calendar-expand {
  // background: linear-gradient(rgba(247, 235, 252, 1), rgba(255, 0, 0, 0));
  text-align: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
.items {
  transition: all 0.1s linear;
}
</style>
