<template>
  <view class="mbill-bill-stat-category-group">
    <view
      class="category-group"
      v-for="(category, index) in groups"
      :key="index"
    >
      <view class="category-group-title">
        <view class="category-group-title-name">{{ category.group }}</view>
        <view class="category-group-title-amount">{{ category.amount }}</view>
      </view>

      <view
        class="category-group-item"
        v-for="(item, ind) in category.items"
        :key="ind"
        @click="onCategoryClick(item)"
      >
        <view>
          <image class="category-group-item-image" :src="item.categoryIcon" />
        </view>

        <view class="category-group-item-title y-start">
          <view class="title-info x-bc">
            <text class="category">{{ item.category }}</text>
            <text class="total">{{ item.amount }}</text>
          </view>
          <view class="category-group-item-progress x-start">
            <view
              class="top-progress"
              :style="{ background: colors[index], width: item.percent + '%' }"
            >
            </view>
            <view
              class="bottom-progress"
              :style="{
                width: 100 - item.percent + '%',
              }"
            />
          </view>
        </view>
        <view class="icon-container">
          <i class="iconfont icon-to right-icon" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bill-stat-category-group",
  props: {
    groups: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      categoryStat: [
        /*{
          group: "餐饮伙食",
          items: [
            {
              icon: "https://mbill.memoyu.com/images/category/icon_pizza_64.png",
              category: "一日三餐",
              total: "1,000",
              percent: 10,
            },
            {
              icon: "https://mbill.memoyu.com/images/category/icon_tea_64.png",
              category: "做饭食材",
              total: "1,000",
              percent: 15,
            },
            {
              icon: "https://mbill.memoyu.com/images/category/icon_pizza_64.png",
              category: "饮料",
              total: "1,000",
              percent: 70,
            },
            {
              icon: "https://mbill.memoyu.com/images/category/icon_pizza_64.png",
              category: "水果",
              total: "1,000",
              percent: 20,
            },
          ],
        },

        {
          group: "交通出行",
          items: [
            {
              icon: "https://mbill.memoyu.com/images/category/icon_pizza_64.png",
              category: "一日三餐",
              total: "1,000",
              percent: 14,
            },
            {
              icon: "https://mbill.memoyu.com/images/category/icon_pizza_64.png",
              category: "做饭食材",
              total: "1,000",
              percent: 30,
            },
            {
              icon: "https://mbill.memoyu.com/images/category/icon_pizza_64.png",
              category: "饮料",
              total: "1,000",
              percent: 90,
            },
            {
              icon: "https://mbill.memoyu.com/images/category/icon_pizza_64.png",
              category: "水果",
              total: "1,000",
              percent: 20,
            },
          ],
        },*/
      ],
      colors: [
        "#E9D5CA",
        "#827397",
        "#4D4C7D",
        "#363062",
        "#D3EBCD",
        "#AEDBCE",
        "#839AA8",
        "#635666",
        "#F1DDBF",
        "#525E75",
        "#78938A",
        "#92BA92",
        "#D3DEDC",
        "#92A9BD",
        "#A6D6D6",
        "#FFEFEF",
        "#907FA4",
      ],
    };
  },
  methods: {
    onCategoryClick(item) {
      this.$emit("select", item);
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-bill-stat-category-group {
  color: $primary-text-color;
  .category-group {
    &-title {
      display: flex;
      justify-content: space-between;
      color: $dark-color;
      font-size: 35rpx;
      font-weight: bold;
      margin: 20rpx 30rpx;
      &-name {
      }
      &-amount {
        font-size: 30rpx;
      }
    }

    &-item {
      display: flex;
      padding: 10rpx 0;
      margin: 30rpx 30rpx;
      &-title {
        width: 100%;
        .title-info {
          width: 100%;
        }
      }
      &-progress {
        width: 100%;
        margin-top: 15rpx;
        border-radius: 30rpx;
        .top-progress {
          z-index: 2;
          height: 10rpx;
          border-radius: 40rpx 0 0 40rpx;
        }
        .bottom-progress {
          height: 10rpx;
          width: 100%;
          background: $grey-bright-color;
          border-radius: 0 40rpx 40rpx 0;
        }
      }
      &-image {
        margin-right: 20rpx;
        border-radius: 50%;
        height: 70rpx;
        width: 70rpx;
      }
      .icon-container {
        display: flex;
        justify-content: center;
        align-items: center;
        .right-icon {
          display: flex;
          border-radius: 50%;
          background: $grey-light-color;
          justify-content: center;
          align-items: center;
          margin-left: 30rpx;
          color: $grey-color;
          height: 40rpx;
          width: 40rpx;
          font-size: 20rpx;
        }
      }
    }
  }
}
</style>
