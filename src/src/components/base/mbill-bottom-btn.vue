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
        @tap="handleLBtnTap"
        >{{ ltext }}</view
      >
      <view
        v-if="!onlyone"
        :class="['btn', 'bottom-right-btn']"
        :style="{
          color: rcolor,
          background: rbcolor,
        }"
        @tap="handleRBtnTap"
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
    handleLBtnTap() {
      this.$emit("ltap");
    },
    handleRBtnTap() {
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
    padding: 0 10px;
    .bottom-left-btn {
      width: 90%;
    }
  }

  .btn {
    border: 1px solid $bright-color;
    border-radius: 12px;
    padding: 10px 0;
    font-weight: bold;
  }
}
</style>
