<template>
  <view class="mbill-bottom-btn">
    <view :class="[onlyone ? 'bottom-btn-grid-only-one' : 'bottom-btn-grid']">
      <view
        :class="['btn', 'bottom-left-btn']"
        :style="{
          color: lcolor,
          background: lbcolor,
          width: onlyone ? '90%' : '60%',
        }"
        @click="onLBtnTap"
        >{{ ltext }}</view
      >
      <view
        v-if="!onlyone"
        :class="['btn', 'bottom-right-btn']"
        :style="{
          color: rcolor,
          background: rbcolor,
        }"
        @click="onRBtnTap"
        >{{ rtext }}</view
      >
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bottom-btn",
  props: {
    onlyone: {
      type: Boolean,
      default: false,
    },
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
    lbcolor: {
      type: String,
      default: "#ffffff",
    },
    rbcolor: {
      type: String,
      default: "#ffffff",
    },
  },
  methods: {
    onLBtnTap() {
      this.$emit("click", { isLeft: true });
    },
    onRBtnTap() {
      this.$emit("click", { isLeft: false });
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
    padding: 0 20rpx;
    .bottom-left-btn {
      width: 60%;
    }
    .bottom-right-btn {
      width: 35%;
    }
  }

  .bottom-btn-grid-only-one {
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    padding: 0 20rpx;
    .bottom-left-btn {
      width: 90%;
    }
  }

  .btn {
    border: 2rpx solid $bright-color;
    border-radius: 24rpx;
    padding: 20rpx 0;
    font-weight: bold;
  }
}
</style>
