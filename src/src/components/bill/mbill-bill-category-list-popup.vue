<template>
  <uni-popup
    ref="BillDayListPopup"
    class="mbill-bill-day-list-popup"
    type="bottom"
    @change="handlePopup"
  >
    <view
      class="bill-day-popup-content"
      :style="{ height: contentHeight + 'px' }"
    >
      <view class="bill-day-popup-header" id="bill-day-popup-header">
        <view class="bill-day-popup-header-title">{{ data.category }}</view>
      </view>
      <scroll-view
        scroll-y="true"
        class="bill-day-popup-items"
        :style="{ height: contentHeight - 34 + 'px' }"
        @scrolltolower="lowerBottom"
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
    data: {
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
      title: "",
      items: [],
      contentHeight: 200,
      loading: false,
      billPage: {
        page: 1,
        size: 15,
      },
      billTotal: 0,
    };
  },
  watch: {
    show(val) {
      if (val) {
        this.$refs.BillDayListPopup.open();
        this.billPage.page = 1;
        this.items = [];
        this.getCategoryBills();
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
    handlePopup(e) {
      this.$emit("change", e);
    },
    getCategoryBills() {
      // data : type 0 月份分类账单，1 年份分类帐单
      if (this.loading) return;
      this.loading = true;
      this.$api
        .billPages({
          date: this.data.date,
          dateType: this.data.type,
          categoryId: this.data.id,
          ...this.billPage,
        })
        .then((res) => {
          // console.log("列表", res);
          if (res.data.code === 0) {
            let result = res.data.result;
            this.billTotal = result.total;
            this.items = this.items.concat(result.items);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // scroll触底事件
    lowerBottom() {
      // console.log("触底加载");
      if (this.billPage.page * this.billPage.size >= this.billTotal) return;
      // console.log("加载");
      this.billPage.page += 1;
      this.getCategoryBills();
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
    }
  }
}
</style>
