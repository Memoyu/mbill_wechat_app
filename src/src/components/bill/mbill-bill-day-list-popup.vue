<template>
  <uni-popup
    ref="BillDayListPopup"
    class="mbill-bill-day-list-popup"
    type="bottom"
    @change="handlerPopup"
  >
    <view class="bill-popup-content" :style="{ height: contentHeight + 'px' }">
      <view class="bill-popup-title">{{ title }}</view>
      <scroll-view
        scroll-y="true"
        class="bill-popup-items"
        :style="{ height: contentHeight - 34 + 'px' }"
      >
        <mb-bill-item
          v-for="(item, index) in items"
          :key="index"
          :bill="item"
        />
      </scroll-view>
      <mb-b-empty v-if="items.length <= 0" />
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
      title: "",
      items: [],
      contentHeight: 200,
    };
  },
  watch: {
    show(val) {
      if (val) {
        this.$refs.BillDayListPopup.open();
      }
    },
    date(val) {
      if (val) {
        // console.log("Com", val);
        this.getDayBills(val);
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
    handlerPopup(e) {
      this.$emit("change", e);
    },
    getDayBills(date) {
      // console.log("param", param);
      this.$api
        .dayBills({
          date: `${date.year}-${date.month}-${date.day}`,
        })
        .then((res) => {
          // console.log("列表", res);
          if (res.data.code === 0) {
            let result = res.data.result;
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
  .bill-popup-content {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 10rpx;
    .bill-popup-items {
      height: 100%;
      .bill-popup-items-scroll {
      }
    }
    .bill-popup-title {
      text-align: center;
      padding: 5px;
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
