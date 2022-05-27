<template>
  <uni-popup
    ref="BillDayListPopup"
    class="mbill-bill-day-list-popup"
    type="bottom"
    @change="handlerPopup"
  >
    <view class="popup-content" :style="{ height: contentHeight + 'px' }">
      <view class="popup-content-title">{{ title }}</view>
      <mb-bill-item v-for="(item, index) in items" :key="index" :bill="item" />
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
  .popup-content {
    background-color: #fff;
    border-radius: 10rpx;
    .popup-content-title {
      text-align: center;
      padding: 5px;
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
