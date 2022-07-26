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
          @select-category="handleCategorySelected"
        />
      </swiper-item>
      <swiper-item class="swiper_item" @touchmove.stop="stopTochMove">
        <mb-stat-year
          ref="statYear"
          :height="contentH"
          @monthclick="handleGotoMonthStat"
          @select-category="handleCategorySelected"
        />
      </swiper-item>
      <swiper-item class="swiper_item" @touchmove.stop="stopTochMove">
        <mb-stat-ranking ref="statRate" :height="contentH" />
      </swiper-item>
    </swiper>
    <mb-b-category-list-popup
      height="70"
      :show="popShow"
      :data="popData"
      @change="handleCategoryPopup"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
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
      popShow: false,
      popData: {},
    };
  },
  onLoad() {
    this.dynamicHeight();
  },
  onShow() {
    this.loadData(0);
  },
  onReady() {},
  methods: {
    //#region 初始化

    loadData(curr) {
      if (curr === 0) this.$refs.statMonth.loadData();
      if (curr === 1) this.$refs.statYear.loadData();
      if (curr === 2) this.$refs.statRate.loadData();
    },

    //#endregion

    //#region 组件事件

    // 计算高度，动态调整swiper 高度
    dynamicHeight() {
      let that = this;
      uni.getSystemInfo({
        success(res) {
          let pH = res.windowHeight;
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

    tabChange(e) {
      console.log("tab", e);
      let curr = e.detail.current;
      this.active = e.detail.current;
      this.loadData(curr);
    },

    handleGotoMonthStat(item) {
      console.log("指定月份", item);
      this.$refs.statMonth.specifyDate(item);
      this.active = 0;
    },

    // 弹窗状态改变触发
    handleCategoryPopup(e) {
      this.popShow = e.show;
    },

    // 选中分类占比的分类
    handleCategorySelected(e) {
      console.log(e);
      this.popData = e;
      this.popShow = true;
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
