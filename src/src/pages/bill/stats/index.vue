<template>
  <!-- 头部tabbar -->
  <view class="b-container">
    <view class="stat-header" id="stat-header">
      <view class="stat-header-bg"></view>
      <view class="stat-header-tab">
        <mb-ba-tabs :type="tabList" v-model="active" fontsize="large" />
      </view>
    </view>
    <!-- 内容 -->
    <swiper
      :touchable="false"
      :current="active"
      @change="tabChange"
      class="stat-content"
      :style="{ height: contentH + 'px' }"
    >
      <swiper-item class="swiper_item" @touchmove.stop="stopTochMove">
        <mb-stat-month
          ref="statMonth"
          :height="contentH"
          :canvas2d="canvas2d"
        />
      </swiper-item>
      <swiper-item class="swiper_item" @touchmove.stop="stopTochMove">
        <mb-stat-year
          ref="statYear"
          :height="contentH"
          :canvas2d="canvas2d"
          @monthclick="handleGotoMonthStat"
        />
      </swiper-item>
      <swiper-item class="swiper_item" @touchmove.stop="stopTochMove">
        <mb-stat-rate ref="statRate" />
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      canvas2d: false,
      tabList: [
        {
          title: "月数据",
        },
        {
          title: "年数据",
        },
        {
          title: "排行榜",
        },
      ],
      contentH: 500,
    };
  },
  onLoad() {},
  onShow() {
    this.initData(0);
  },
  onReady() {
    this.dynamicHeight();
  },
  methods: {
    //#region 初始化

    initData(curr) {
      if (curr === 0) this.$refs.statMonth.initData();
      if (curr === 1) this.$refs.statYear.initData();
      if (curr === 2) this.$refs.statRate.initData();
    },

    //#endregion

    //#region 组件事件

    // 计算高度，动态调整swiper 高度
    dynamicHeight() {
      let that = this;
      uni.getSystemInfo({
        success(res) {
          let pH = res.windowHeight;
          that.getIsCanvas2d(res.platform);
          let query = uni.createSelectorQuery().in(that);
          query.select("#stat-header").fields({ size: true });
          query.exec((data) => {
            let headerH = data[0].height;
            that.contentH = pH - headerH;
            // console.log(pH, tempH, that.contentH);
          });
        },
      });
    },

    getIsCanvas2d(platform) {
      switch (platform) {
        case "android":
        case "ios":
          this.canvas2d = true;
          break;
        default:
          this.canvas2d = false;
          break;
      }
    },

    tabChange(e) {
      // console.log(e);
      let curr = e.detail.current;
      this.active = e.detail.current;
      this.initData(curr);
    },

    handleGotoMonthStat(item) {
      console.log(item);
      this.$refs.statMonth.specifyDate(item);
      this.active = 0;
    },

    stopTochMove() {
      return false;
    },

    //#endregion
  },
};
</script>

<style lang="scss" scope>
.stat-header {
  width: 100%;
  display: flex;
  justify-content: center;
  &-bg {
    position: absolute;
    width: 100%;
    height: 400rpx;
    background-color: $light-color;
    border-radius: 0 0 25rpx 25rpx;
  }
  &-tab {
    margin-bottom: 10rpx;
  }
}
.stat-content {
  width: 100%;
}
</style>
