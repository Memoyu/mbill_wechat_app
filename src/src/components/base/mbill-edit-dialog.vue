<template>
  <uni-popup
    ref="editDialogPopup"
    class="mbill-edit-dialog-popup"
    type="center"
    @change="handlePopup"
  >
    <view
      class="edit-dialog-popup-content"
      :style="{ width: contentWidth + 'px', height: height + 'px' }"
    >
      <view class="edit-dialog-input">
        <slot />
      </view>
      <!-- 底部按钮 -->
      <view class="bottom-operate" id="bottom-operate">
        <mb-ba-bottom-btn
          @ltap="handleLeft"
          @rtap="handleRight"
          :onlyone="onlyone"
          :ltext="ltext"
          :rtext="rtext"
          lbcolor="#F1F1F1"
          rbcolor="#F1F1F1"
        />
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: "mbill-edit-dialog-popup",
  props: {
    autoclose: {
      type: Boolean,
      default: false,
    },
    // 弹窗宽度,直接使用像素单位
    height: {
      type: Number,
      default: 200,
    },
    // 弹窗宽度,直接使用百分比
    width: {
      type: Number,
      default: 90,
    },
  },
  data() {
    return {
      // contentHeight: 0,
      contentWidth: 0,
      onlyone: false,
      ltext: "确定",
      rtext: "完成",
    };
  },
  created() {
    let that = this;
    uni.getSystemInfo({
      success(res) {
        that.contentWidth = res.windowWidth * (that.width * 0.01);
        // that.contentHeight = res.windowHeight * (that.height * 0.01);
      },
    });
  },
  methods: {
    show(options) {
      this.ltext = options.ltext;
      this.rtext = options.rtext;
      this.onlyone = options.onlyone;
      this.$refs.editDialogPopup.open();
    },

    hide() {
      this.$refs.editDialogPopup.close();
    },

    handlePopup(e) {
      this.$emit("change", e);
    },

    handleLeft() {
      // console.log("左边按下");
      this.$emit("ltap");
      if (this.autoclose) this.$refs.editDialogPopup.close();
    },

    handleRight() {
      this.$emit("rtap");
      if (this.autoclose) this.$refs.editDialogPopup.close();
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-edit-dialog-popup {
  .edit-dialog-popup-content {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 12px;
    padding-bottom: 20px;
    .edit-dialog-input {
      margin: 15px;
      .input-item {
        margin-top: 10px;
        .title {
          color: $grey-text-color;
        }
        .input {
          text-align: right;
          padding: 5px;
          margin-bottom: 8px;
        }
      }
      .input-desc {
        margin-top: 18px;
      }
    }

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
  .bottom-operate {
    width: 100%;
    position: absolute;
    bottom: 0;
    margin-bottom: 10px;
  }
}
</style>
