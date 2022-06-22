<template>
  <view class="mb-stat-rate">
    <view class="mb-stat-rate-header" id="mb-stat-rate-header">
      <!-- 排行过滤 -->
      <view class="mb-stat-rate-header-filter">
        <picker
          class="date-picker"
          mode="date"
          @change="handlePickerChange"
          fields="month"
          :value="date"
        >
          <view class="picker-title x-c">
            <text class="text-break"
              >{{ dateText.year }}年{{ dateText.month }}月</text
            >
            <i class="iconfont icon-bottom icon-down" />
          </view>
        </picker>
        <picker
          class="type-picker"
          @change="handleTypePickerChange"
          :value="billType"
          :range="billTypes"
        >
          <view class="picker-title x-c">
            <view class="text-break">{{ billTypes[billType] }}</view>
            <i class="iconfont icon-bottom icon-down" />
          </view>
        </picker>

        <picker
          class="category-picker"
          @change="bindPickerChange"
          :value="category"
          range-key="name"
          :range="categories"
        >
          <view class="picker-title x-c">
            <view class="text-break">{{ categories[category].name }}</view>
            <i class="iconfont icon-bottom icon-down" />
          </view>
        </picker>
        <i class="iconfont icon-stats clear-filter" />
      </view>

      <!-- 排行日期类型 -->
      <view class="mb-stat-rate-header-date-type-tabs">
        <mb-ba-tabs :type="dateTypes" v-model="dateActive" />
      </view>
    </view>

    <!-- 排行列表 -->
    <view class="mb-stat-rate-content" :style="{ height: scrollH + 'px' }">
      <scroll-view scroll-y="true" style="height: 100%">
        <view class="mb-stat-rate-bg-br">
          <view v-for="(item, index) in rankings" :key="index">
            <view class="rate-item-content">
              <view v-if="item.ranking !== 0" class="month">{{
                item.ranking
              }}</view>
              <mb-b-item class="rate-item" :bill="item" />
              <view class="right-icon-content">
                <i class="iconfont icon-to right-icon" />
              </view>
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
  name: "mbill-bill-stat-rate",
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
      dateText: {
        year: datetime.getCurYear(),
        month: datetime.getCurMonth(),
      },
      billType: 0,
      billTypes: ["支出", "收入"],
      category: 0,
      categories: [{ id: 0, name: "选择分类" }],
      dateActive: 0,
      dateTypes: [
        {
          title: "月排行",
        },
        {
          title: "年排行",
        },
      ],
      rankings: [
        /*{
          amount: 25555,
          amountFormat: "25,555",
          category: "水果",
          categoryIcon:
            "https://mbill.memoyu.com/images/category/icon_grape_64.png",
          description: "水果",
          id: 864,
          time: "16:54",
          type: 0,
          ranking: 1,
        },
        {
          amount: 25555,
          amountFormat: "25,555",
          category: "水果",
          categoryIcon:
            "https://mbill.memoyu.com/images/category/icon_grape_64.png",
          description: "水果",
          id: 864,
          time: "16:54",
          type: 0,
          ranking: 2,
        },
        {
          amount: 25555,
          amountFormat: "25,555",
          category: "水果",
          categoryIcon:
            "https://mbill.memoyu.com/images/category/icon_grape_64.png",
          description: "水果",
          id: 864,
          time: "16:54",
          type: 0,
          ranking: 3,
        },
        {
          amount: 25555,
          amountFormat: "25,555",
          category: "水果",
          categoryIcon:
            "https://mbill.memoyu.com/images/category/icon_grape_64.png",
          description: "水果",
          id: 864,
          time: "16:54",
          type: 0,
          ranking: 4,
        },
        {
          amount: 25555,
          amountFormat: "25,555",
          category: "水果",
          categoryIcon:
            "https://mbill.memoyu.com/images/category/icon_grape_64.png",
          description: "水果",
          id: 864,
          time: "16:54",
          type: 0,
          ranking: 5,
        },
        {
          amount: 25555,
          amountFormat: "25,555",
          category: "水果",
          categoryIcon:
            "https://mbill.memoyu.com/images/category/icon_grape_64.png",
          description: "水果",
          id: 864,
          time: "16:54",
          type: 0,
          ranking: 6,
        },
        {
          amount: 25555,
          amountFormat: "25,555",
          category: "水果",
          categoryIcon:
            "https://mbill.memoyu.com/images/category/icon_grape_64.png",
          description: "水果",
          id: 864,
          time: "16:54",
          type: 0,
          ranking: 7,
        },
        {
          amount: 25555,
          amountFormat: "25,555",
          category: "水果",
          categoryIcon:
            "https://mbill.memoyu.com/images/category/icon_grape_64.png",
          description: "水果",
          id: 864,
          time: "16:54",
          type: 0,
          ranking: 8,
        },
        {
          amount: 25555,
          amountFormat: "25,555",
          category: "水果",
          categoryIcon:
            "https://mbill.memoyu.com/images/category/icon_grape_64.png",
          description: "水果",
          id: 864,
          time: "16:54",
          type: 0,
          ranking: 9,
        },
        {
          amount: 25555,
          amountFormat: "25,555",
          category: "水果",
          categoryIcon:
            "https://mbill.memoyu.com/images/category/icon_grape_64.png",
          description: "水果",
          id: 864,
          time: "16:54",
          type: 0,
          ranking: 10,
        },
        {
          amount: 25555,
          amountFormat: "25,555",
          category: "水果",
          categoryIcon:
            "https://mbill.memoyu.com/images/category/icon_grape_64.png",
          description: "水果",
          id: 864,
          time: "16:54",
          type: 0,
          ranking: 11,
        },
        {
          amount: 25555,
          amountFormat: "25,555",
          category: "水果",
          categoryIcon:
            "https://mbill.memoyu.com/images/category/icon_grape_64.png",
          description: "水果",
          id: 864,
          time: "16:54",
          type: 0,
          ranking: 12,
        },
        {
          amount: 25555,
          amountFormat: "25,555",
          category: "水果",
          categoryIcon:
            "https://mbill.memoyu.com/images/category/icon_grape_64.png",
          description: "水果",
          id: 864,
          time: "16:54",
          type: 0,
          ranking: 13,
        },
        {
          amount: 25555,
          amountFormat: "25,555",
          category: "水果",
          categoryIcon:
            "https://mbill.memoyu.com/images/category/icon_grape_64.png",
          description: "水果",
          id: 864,
          time: "16:54",
          type: 0,
          ranking: 14,
        },
        {
          amount: 25555,
          amountFormat: "25,555",
          category: "水果",
          categoryIcon:
            "https://mbill.memoyu.com/images/category/icon_grape_64.png",
          description: "水果",
          id: 864,
          time: "16:54",
          type: 0,
          ranking: 0,
        },*/
      ],
    };
  },
  watch: {
    height(val) {
      this.calcuScrollHeight(val);
    },
    dateActive(val) {},
  },
  created() {},
  methods: {
    loadData() {
      if (this.init === true) return;
      this.init = true;
      // 初始化数据
      console.log("初始化数据-排行榜");
    },

    // 加载数据
    loadStatData() {
      this.$tip.loading();
      try {
        this.loadRanking();
      } finally {
        this.$tip.loaded();
      }
    },

    // 加载统计汇总数据
    loadRanking() {
      this.$api
        .billRanking({
          date: this.date,
          dateType: this.dateActive,
          billType: this.billType,
          categoryId: category,
        })
        .then((res) => {
          // console.log("列表", res);
          if (res.data.code === 0) {
            this.stat = res.data.result;
            this.rankings = data;
          }
        });
    },

    // 切换账单类型
    handleTypePickerChange({ detail }) {
      console.log(detail);
      this.type = detail.value;
    },

    // 计算scroll-view 最高度
    calcuScrollHeight(height) {
      let that = this;
      let query = uni.createSelectorQuery().in(that);
      query.select("#mb-stat-rate-header").fields({ size: true });
      query.exec((data) => {
        that.scrollH = height - data[0].height;
      });
    },
  },
};
</script>

<style lang="scss" scope>
.mb-stat-rate {
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
        font-size: 15px;
        font-weight: bold;
        align-items: baseline;
        .icon-down {
          font-size: 10px;
          margin-left: 5px;
        }
      }
      .text-break {
        display: -webkit-box; /*弹性伸缩盒子模型显示*/
        -webkit-box-orient: vertical; /*排列方式*/
        -webkit-line-clamp: 1; /*显示文本行数(这里控制多少行隐藏)*/
        overflow: hidden; /*溢出隐藏*/
      }
    }
    &-date-type-tabs {
      margin-top: 20rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &-content {
    .rate-item-content {
      display: flex;
      align-items: center;
      margin: 0 20rpx;
      .month {
        margin-right: 30rpx;
        font-weight: bold;
        font-size: 40rpx;
      }
      .rate-item {
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