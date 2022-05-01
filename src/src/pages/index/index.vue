<template>
  <view>
    <view class="content">
      <view>
        <view id="calendar_cls">
          <mbill-calendar
            ref="calendar"
            class="calendar"
            :expand="expand"
            :tags="tags"
            @change="handlerDateChange"
          />
        </view>
        <view
          :style="{ height: expandHeight + 'px' }"
          class="scroll-view-expand"
          @tap="handlerExpandView"
        >
          <text>^</text>
        </view>
        <scroll-view
          class="items"
          :style="{
            height: scrollHeight + 'px',
          }"
          scroll-y="true"
        >
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>12313212313 2123</p>
          <p>123132123132123</p>
          <p>123132123dddd132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123ddd132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
          <p>123132123132123</p>
        </scroll-view>
      </view>
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
      tH: 0,
      expandHeight: 25,
      scrollHeight: 0,
      calendarMaxHeight: 0,
      title: "Hello",
      state: 1,
    };
  },
  onLoad() {
    this.dynamicHeight();
  },
  onShow() {
    this.setTabBarIndex(0);
  },
  methods: {
    dynamicHeight() {
      let that = this;
      uni.getSystemInfo({
        //调用uni-app接口获取屏幕高度
        success(res) {
          that._data.tH = res.screenHeight - res.windowHeight;
          //成功回调函数
          that._data.pH = res.windowHeight; //windoHeight为窗口高度，主要使用的是这个
          let titleH = uni.createSelectorQuery().select("#calendar_cls"); //想要获取高度的元素名（class/id）
          titleH
            .boundingClientRect((data) => {
              that._data.scrollHeight =
                that._data.pH -
                data.height -
                that._data.tH -
                that._data.expandHeight;
              that._data.calendarMaxHeight = that._data.scrollHeight;
            })
            .exec();
        },
      });
    },
    handlerDateChange(e) {
      console.log(e);
    },
    handlerExpandView() {
      let minHeight = this.$refs.calendar.minHeight;
      if (this.expand) {
        this.scrollHeight = this.pH - minHeight - this.tH - this.expandHeight;
        this.expand = false;
      } else {
        this.scrollHeight = this.calendarMaxHeight - this.expandHeight;
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

.scroll-view-expand {
  background: linear-gradient(rgba(247, 235, 252, 1), rgba(255, 0, 0, 0));
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
