<template>
  <view class="mbill-bottom-btn">
    <view class="bottom-btn-grid">
      <view
        class="btn bottom-left-btn"
        :style="{ color: lcolor }"
        @tap="handlerLBtnTap"
        >{{ ltext }}</view
      >
      <view
        class="btn bottom-right-btn"
        :style="{ color: rcolor }"
        @tap="handlerRBtnTap"
        >{{ rtext }}</view
      >
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-end-split-line",
  props: {
    ltext: {
      type: String,
      default: "编辑",
    },
    rtext: {
      type: String,
      default: "删除",
    },
    lcolor: {
      type: String,
      default: "#a6b1e1",
    },
    rcolor: {
      type: String,
      default: "#d55251",
    },
  },
  methods: {
    handlerLBtnTap() {
      this.$emit("ltap");
    },
    handlerRBtnTap() {
      this.$emit("rtap");
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-bottom-btn {
  width: 100%;
  .bottom-btn-grid {
    // width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: center;
    padding: 0 10px;
    .btn {
      border-radius: 12px;
      padding: 10px 0;
      background: white;
      font-weight: bold;
    }
    .bottom-left-btn {
      width: 60%;
    }
    .bottom-right-btn {
      width: 35%;
    }
  }
}
</style>
