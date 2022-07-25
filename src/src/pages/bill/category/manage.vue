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
        <mb-ca-collapse
          :height="contentH"
          :data="expendGroups"
          @sort="handelSort"
          @selected-group="handleSelectedGroup"
          @selected-item="handleSelectedItem"
        />
      </swiper-item>
      <swiper-item class="swiper_item">
        <mb-ca-collapse
          :height="contentH"
          :data="incomeGroups"
          @sort="handelSort"
        />
      </swiper-item>
    </swiper>

    <view class="add-category-group" id="bottom-add-group" @tap="handleAddGroup"
      >添加分组</view
    >

    <!-- 添加分组弹窗 -->
    <mb-ba-edit-dialog
      ref="addGroupDialog"
      height="150"
      class="edit-group-input"
      @ltap="handleEditGroup"
      @rtap="handleDelGroup"
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
const addBtnTitle = "新建";
const editBtnTitle = "编辑";
const delBtnTitle = "删除";

export default {
  data() {
    return {
      type: 0,
      types: [
        { key: 0, text: "支出" },
        { key: 1, text: "收入" },
      ],
      expendGroups: [],
      incomeGroups: [],
      contentH: 0,
      dialodOptions: {
        ltext: addBtnTitle,
        rtext: delBtnTitle,
      },
      group: {
        id: 0,
        name: "",
        index: 0,
      },
      item: {
        id: 0,
        name: "",
        icon: "",
        index: 0,
        gIndex: 0,
      },
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
    // 获取账单分类
    getCategoryGroups(type) {
      this.$api.getCategoryGroups({ type: type }).then((res) => {
        if (res.data.code === 0) {
          // this.groups = [];
          if (type == 0) {
            this.expendGroups = res.data.result;
          } else {
            this.incomeGroups = res.data.result;
          }
        }
      });
    },

    //#region 事件处理

    tabChange({ detail }) {
      let curr = detail.current;
      this.type = curr;
    },

    // 添加分类
    handleAddCategory(groupId) {
      console.log(groupId, "分组Id");
      this.$tip.toast("开发中，敬请期待");
    },

    // 切换分类类型
    handleTypeSwitch(type) {
      this.type = type;
    },

    // 添加分组
    handleAddGroup() {
      this.group = {};
      this.dialodOptions.onlyone = true;
      this.dialodOptions.ltext = addBtnTitle;
      this.$refs.addGroupDialog.show(this.dialodOptions);
    },

    /**
     * @description: 编辑分组
     * @param {*} group 分组信息
     * @return {*}
     */
    handleSelectedGroup(e) {
      this.group = e.group;
      if (e.type == 0) {
        // 为编辑
        this.dialodOptions.onlyone = false;
        this.dialodOptions.ltext = editBtnTitle;
        this.$refs.addGroupDialog.show(this.dialodOptions);
      }
    },

    /**
     * @description: 选中分类
     * @param {*} e 选中分类数据
     * @return {*}
     */
    handleSelectedItem(e) {
      this.item = e.item;
      if (e.type == 0) {
        // 为编辑
      } else if (e.type == 1) {
        // 为删除
        console.log(e.item, "删除分类");
        this.expendGroups[this.item.gIndex].childs.splice(this.item.index, 1);
      }
    },

    /**
     * @description: 请求添加分组
     * @return {*}
     */
    handleEditGroup() {
      if (this.group.name == undefined || this.group.name.length <= 0) {
        this.$tip.toast("请输入分组名称");
        return;
      }
      if (this.group.name.length > 6) {
        this.$tip.toast("分组名称超长");
        return;
      }

      // 没有id 或 id = 0 则为添加分组
      if (this.group.id != undefined && this.group != 0) {
        this.$api
          .editCategoryGroup({
            name: this.group.name,
          })
          .then((res) => {
            if (res.data.code === 0) {
              // console.log(res.data.result);
              this.$refs.addGroupDialog.hide();
              this.getCategoryGroups(this.type);
            }
          });
      } else {
        this.$api
          .createCategoryGroup({
            name: this.group.name,
            type: this.type,
            sort:
              this.type == 0
                ? this.expendGroups.length + 1
                : this.incomeGroups.length + 1,
          })
          .then((res) => {
            if (res.data.code === 0) {
              // console.log(res.data.result);
              this.$refs.addGroupDialog.hide();
              this.getCategoryGroups(this.type);
            }
          });
      }
    },
    handleDelGroup() {
      console.log("删除group", this.group);
      this.$tip
        .choose("同时删除子项，是否删除？", {}, "删除分组")
        .then(async () => {
          // that.$api.delCategoryGroup(this.group.id).then((res) => {
          //   if (res.data.code === 0) {
          //   }
          // });
          this.expendGroups.splice(this.group.index, 1);
          this.$refs.addGroupDialog.hide();
        });
    },

    /**
     * @description: 触发请求排序
     * @param {*} sorts 排序信息
     * @return {*}
     */
    handelSort(sorts) {
      // console.log(sorts, "排序信息");
      this.$api
        .sortCategoryGroups({
          sorts: sorts,
        })
        .then((res) => {
          if (res.data.code === 0) {
            console.log(res.message);
          }
        });
    },

    //#endregion

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
            that.contentH = pH - headerH - 20; // 20 为margin
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
    margin: 20rpx 0;
    text-align: center;
  }

  .edit-group-input {
    .input-item {
      height: 170rpx;
      .title {
        color: $grey-text-color;
      }
      .input {
        text-align: right;
        padding: 10rpx;
      }
    }
    .input-desc {
      margin-top: 36rpx;
    }
  }
}
</style>
