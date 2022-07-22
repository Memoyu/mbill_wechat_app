<template>
  <view class="bill-category-manage">
    <view class="type-tabs" id="header-type-tabs">
      <mb-ba-focus-tabs
        v-model="type"
        :items="types"
        @selected="handleTypeSwitch"
      />
    </view>
    <swiper
      :current="type"
      @change="tabChange"
      :style="{ height: contentH + 'px' }"
    >
      <swiper-item class="swiper_item">
        <mb-ca-collapse :height="contentH" :groups="groups" />
      </swiper-item>
      <swiper-item class="swiper_item">
        <mb-ca-collapse :height="contentH" :groups="groups1" />
      </swiper-item>
    </swiper>

    <view class="add-category-group" id="bottom-add-group" @tap="handleAddGroup"
      >添加分组</view
    >

    <!-- 添加分组弹窗 -->
    <mb-ba-edit-dialog
      ref="addGroupDialog"
      height="170"
      class="edit-group-input"
      @change="handleDialogChange"
      @ltap="handleReqEditGroup"
    >
      <view class="input-item x-bc">
        <text class="title">分组名称</text>
        <input
          type="text"
          class="input"
          v-model="group.name"
          alwaysEmbed="true"
          placeholder="名称"
        />
      </view>
    </mb-ba-edit-dialog>
  </view>
</template>

<script>
export default {
  data() {
    return {
      type: 0,
      types: [
        { key: 0, text: "支出" },
        { key: 1, text: "收入" },
      ],
      groups: [],
      groups1: [],
      contentH: 0,
    };
  },
  watch: {
    type(val) {
      console.log("账单类型", val);
      this.getCategoryGroups(val);
    },
  },
  onLoad(option) {
    this.dynamicHeight();
    if (option.type != undefined) {
      this.type = option.type;
    }
    this.getCategoryGroups(this.type);
  },
  onShow() {},
  methods: {
    tabChange({ detail }) {
      let curr = detail.current;
      this.type = curr;
    },

    // 选中分类
    handleSelectedItem(category) {},

    // 添加分类
    handleAddCategory(groupId) {
      console.log(groupId, "分组Id");
      this.$tip.toast("开发中，敬请期待");
    },

    // 添加分组
    handleAddGroup() {
      this.$tip.toast("开发中，敬请期待");
    },

    // 切换分类类型
    handleTypeSwitch(type) {
      this.type = type;
      // this.getCategoryGroups(type);
    },

    // 获取账单分类
    getCategoryGroups(type) {
      this.$api.categoryGroups({ type: type }).then((res) => {
        if (res.data.code === 0) {
          // this.groups = [];
          if (type == 0) {
            this.groups = res.data.result;
          } else {
            this.groups1 = res.data.result;
          }
        }
      });
    },

    // 计算高度，动态调整swiper 高度
    dynamicHeight() {
      let that = this;
      uni.getSystemInfo({
        success(res) {
          let pH = res.windowHeight;
          let query = uni.createSelectorQuery().in(that);
          query.select("#header-type-tabs").fields({ size: true });
          query.select("#bottom-add-group").fields({ size: true });
          query.exec((data) => {
            let headerH = data[0].height;
            headerH += data[1].height;
            that.contentH = pH - headerH - 40; // 40 为margin
            // console.log(pH, headerH, that.contentH);
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scope>
.bill-category-manage {
  .type-tabs {
    font-size: 35rpx;
    padding: 30rpx 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .add-category-group {
    color: $dark-color;
    font-weight: bold;
    margin: 40rpx 0;
    text-align: center;
  }
}
</style>
