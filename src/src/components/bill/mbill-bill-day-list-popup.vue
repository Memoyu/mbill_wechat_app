<template>
  <uni-popup
    ref="BillDayListPopup"
    class="mbill-bill-day-list-popup"
    type="bottom"
    @change="onPopup"
  >
    <view
      class="bill-day-popup-content"
      :style="{ height: contentHeight + 'px' }"
    >
      <view class="bill-day-popup-header" id="bill-day-popup-header">
        <view class="bill-day-popup-header-title">{{ title }}</view>
        <view class="bill-day-popup-header-amount">
          <view class="bill-day-popup-header-amount-total">
            <text class="bill-day-popup-header-amount-title"> 支出 </text>
            <text class="expend-color">
              {{ stat.expend }}
            </text>
          </view>
          <view
            class="bill-day-popup-header-amount-total"
            style="margin-left: 30rpx"
          >
            <text class="bill-day-popup-header-amount-title"> 收入 </text>
            <text class="income-color">
              {{ stat.income }}
            </text>
          </view>
        </view>
      </view>
      <scroll-view
        scroll-y="true"
        class="bill-day-popup-items"
        :style="{ height: contentHeight - 34 + 'px' }"
      >
        <view class="bill-day-popup-items-item">
          <mb-b-item v-for="(item, index) in items" :key="index" :bill="item" />
        </view>
        <mb-ba-empty v-if="items.length <= 0" />
      </scroll-view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: "mbill-bill-day-list-popup",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Object,
      default: {},
    },
    height: {
      type: Number,
      default: 50,
    },
  },
  data() {
    return {
      stat: { income: 0, expend: 0 },
      title: "日",
      items: [],
      contentHeight: 200,
    };
  },
  watch: {
    show(val) {
      if (val) {
        this.$refs.BillDayListPopup.open();
        this.getDayBills(this.date);
      }
    },
  },
  created() {
    let that = this;
    uni.getSystemInfo({
      success(res) {
        that.contentHeight = res.windowHeight * (that.height * 0.01);
      },
    });
  },
  methods: {
    onPopup(e) {
      this.$emit("change", e);
    },
    getDayBills(date) {
      this.$api
        .dayBills({
          date: `${date.year}-${date.month}-${date.day}`,
        })
        .then((res) => {
          // console.log("列表", res);
          if (res.data.code === 0) {
            let result = res.data.result;
            this.stat = result;
            this.title = `${result.day}日 ${result.week}`;
            this.items = result.items;
          }
        });
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-bill-day-list-popup {
  .bill-day-popup-content {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    .bill-day-popup-items {
      height: 100%;
      &-item {
        padding: 0 30rpx;
      }
    }
    .bill-day-popup-header {
      padding: 20rpx 30rpx;
      display: flex;
      justify-content: space-between;
      &-title {
        text-align: center;
        font-size: 36rpx;
        font-weight: bold;
      }
      &-amount {
        display: flex;
        font-size: 40rpx;
        font-weight: bold;
        &-title {
          font-size: 25rpx;
        }
        &-total {
        }
      }
    }
  }
}
</style>
