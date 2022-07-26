<template>
  <view class="mb-stat-ranking">
    <view class="mb-stat-ranking-header" id="mb-stat-ranking-header">
      <!-- 排行过滤 -->
      <view class="mb-stat-ranking-header-filter">
        <picker
          class="date-picker"
          mode="date"
          @change="onDatePickerChange"
          fields="month"
          :value="date"
          :end="dateEnd"
        >
          <view class="picker-title x-c">
            <text class="one-t"
              >{{ dateText.year }}年{{ dateText.month }}月</text
            >
            <i class="iconfont icon-bottom icon-down" />
          </view>
        </picker>
        <picker
          class="type-picker"
          @change="onTypePickerChange"
          :value="billType"
          :range="billTypes"
        >
          <view class="picker-title x-c">
            <view class="one-t">{{ billTypes[billType] }}</view>
            <i class="iconfont icon-bottom icon-down" />
          </view>
        </picker>

        <picker
          class="category-picker"
          @change="bindCategoryPickerChange"
          :value="category"
          range-key="name"
          :range="categories"
        >
          <view class="picker-title x-c">
            <view class="one-t">{{ categories[category].name }}</view>
            <i class="iconfont icon-bottom icon-down" />
          </view>
        </picker>
        <i class="iconfont icon-delete clear-filter" @click="onResetFilter" />
      </view>

      <!-- 排行日期类型 -->
      <view class="mb-stat-ranking-header-date-type-tabs">
        <mb-ba-focus-tabs
          :items="dateTypes"
          @selected="onTypeSwitch"
          color="#808080"
        />
      </view>
    </view>

    <!-- 排行列表 -->
    <view class="mb-stat-ranking-content" :style="{ height: scrollH + 'px' }">
      <scroll-view
        scroll-y="true"
        style="height: 100%"
        :refresher-enabled="true"
        :refresher-triggered="triggered"
        @scrolltolower="onLowerBottom"
        @refresherpulling="onPulling"
        @refresherrefresh="onRefresh"
        @refresherrestore="onRestore"
        @refresherabort="onAbort"
      >
        <view class="mb-stat-ranking-bg-br" v-if="rankings.length > 0">
          <view v-for="(item, index) in rankings" :key="index">
            <view class="ranking-item-content">
              <view v-if="index < 20" class="ranking-num">{{
                getRanking(index)
              }}</view>
              <mb-b-item class="ranking-item" :bill="item" :showdate="true" />
              <!-- <view class="right-icon-content">
                <i class="iconfont icon-to right-icon" />
              </view> -->
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import datetime from "@/common/utils/datetime";

export default {
  name: "mbill-bill-stat-ranking",
  props: {
    height: {
      type: [Number, String],
      default: 300,
    },
  },
  data() {
    return {
      init: false,
      scrollH: 0,
      date: datetime.getCurDate(),
      dateEnd: datetime.getCurDate(),
      dateText: {
        year: datetime.getCurYear(),
        month: datetime.getCurMonth(),
      },
      billType: 0,
      billTypes: ["支出", "收入"],
      category: 0,
      categories: [],
      categoryId: 0,
      dateActive: 0,
      dateTypes: [
        {
          key: 0,
          text: "月排行",
        },
        {
          key: 1,
          text: "年排行",
        },
      ],
      rankings: [],
      loading: false,
      rankingPage: {
        page: 1,
        size: 15,
      },
      rankingTotal: 0,
      triggered: false,
      freshing: false,
    };
  },
  watch: {
    height(val) {
      this.calcuScrollHeight(val);
    },
    dateActive(val) {
      this.loadStatData();
    },
  },
  created() {},
  methods: {
    loadData() {
      if (this.init === true) return;
      this.init = true;
      // 初始化数据
      // console.log("初始化数据-排行榜");
      this.loadCategoriesData();
      this.triggered = true;
      // this.onRefresh();
    },

    // 加载数据
    loadStatData() {
      this.rankingPage.page = 1;
      var p1 = this.loadRanking(true);
      return Promise.all([p1]);
    },

    // 加载统计汇总数据
    loadRanking(init = false) {
      if (this.loading) return;
      this.loading = true;
      return this.$api
        .billRanking({
          date: this.date,
          dateType: this.dateActive,
          billType: this.billType,
          categoryId: this.categoryId,
          ...this.rankingPage,
        })
        .then((res) => {
          // console.log("列表", res);
          if (res.data.code === 0) {
            let data = res.data.result;
            this.rankingTotal = data.total;
            if (init) this.rankings = [];
            this.rankings = this.rankings.concat(data.items);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 获取分类下拉列表数据
    loadCategoriesData() {
      this.$api.categoryList({ type: this.billType }).then((res) => {
        // console.log("列表", res);
        if (res.data.code === 0) {
          let data = res.data.result;
          this.categories = data;
          this.categories.unshift({ id: 0, name: "选择分类" });
        }
      });
    },

    // 切换日期
    onDatePickerChange({ detail }) {
      let date = new Date(detail.value);
      // console.log(date);
      let select = datetime.getCurDateObj(date);
      if (
        select.year == this.dateText.year &&
        select.month == this.dateText.month
      )
        return;
      this.dateText = select;
      this.date = datetime.getCurDate(date);
      this.loadStatData();
    },

    // 切换账单类型
    onTypePickerChange({ detail }) {
      // console.log(detail);
      if (this.billType == detail.value) return;
      this.billType = detail.value;
      this.category = 0;
      this.categoryId = 0;
      this.loadCategoriesData();
      this.loadStatData();
    },

    // 账单分类选择
    bindCategoryPickerChange({ detail }) {
      // console.log(detail);
      if (this.category == detail.value) return;
      this.category = detail.value;
      let ca = this.categories[this.category];
      this.categoryId = ca.id;
      this.loadStatData();
    },

    onTypeSwitch(key) {
      this.dateActive = key;
    },

    // 重置过滤条件,并重新加载数据
    onResetFilter() {
      this.date = datetime.getCurDate();
      this.dateText = datetime.getCurDateObj();
      this.dateActive = 0;
      this.billType = 0;
      this.category = 0;
      this.categoryId = 0;
      this.rankingPage.page = 1;
      this.loadStatData();
    },
    getRanking(index) {
      return index + 1;
    },

    // 自定义下拉刷新控件被下拉
    onPulling(e) {
      // console.log("onpulling", e);
      if (e.detail.deltaY < 0) return; // 防止上滑页面也触发下拉
      this.triggered = true;
    },

    // 自定义下拉刷新被触发
    async onRefresh() {
      if (this.freshing) return;
      this.freshing = true;
      this.loadStatData().finally((res) => {
        this.triggered = false;
        this.freshing = false;
      });
    },
    // 自定义下拉刷新被复位
    onRestore() {
      this.triggered = "restore"; // 需要重置
    },
    // 自定义下拉刷新被中止
    onAbort() {},

    // scroll触底事件
    onLowerBottom() {
      // console.log("触底加载");
      if (this.rankingPage.page * this.rankingPage.size >= this.rankingTotal)
        return;
      // console.log("加载");
      this.rankingPage.page += 1;
      this.loadRanking();
    },

    // 计算scroll-view 最高度
    calcuScrollHeight(height) {
      let that = this;
      let query = uni.createSelectorQuery().in(that);
      query.select("#mb-stat-ranking-header").fields({ size: true });
      query.exec((data) => {
        that.scrollH = height - data[0].height;
      });
    },
  },
};
</script>

<style lang="scss" scope>
.mb-stat-ranking {
  &-header {
    &-filter {
      margin: 0 50rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .date-picker {
      }
      .type-picker {
        margin-left: 50rpx;
      }
      .category-picker {
        margin-left: 50rpx;
      }
      .clear-filter {
        margin-left: 40rpx;
        padding: 15rpx;
        font-size: 35rpx;
      }
      .picker-title {
        font-size: 30rpx;
        font-weight: bold;
        align-items: baseline;
        .icon-down {
          font-size: 20rpx;
          margin-left: 10rpx;
        }
      }
    }
    &-date-type-tabs {
      font-size: 30rpx;
      margin: 30rpx 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &-content {
    .ranking-item-content {
      display: flex;
      align-items: center;
      margin: 0 20rpx;
      .ranking-num {
        margin-right: 30rpx;
        font-weight: bold;
        font-size: 40rpx;
        color: $primary-color;
      }
      .ranking-item {
        width: 100%;
      }
      .right-icon-content {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 30rpx;
        .right-icon {
          display: flex;
          border-radius: 50%;
          background: $grey-light-color;
          justify-content: center;
          align-items: center;
          color: $grey-color;
          height: 40rpx;
          width: 40rpx;
          font-size: 20rpx;
        }
      }
    }
  }

  &-bg-br {
    background-color: #ffffff;
    border-radius: 30rpx;
    padding: 10rpx;
    margin: 0 20rpx 20rpx 20rpx;
  }
}
</style>