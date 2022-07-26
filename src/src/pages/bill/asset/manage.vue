<template>
  <view class="b-container">
    <!-- 列表 -->
    <view class="group-list-container" :style="{ height: contentH + 'px' }">
      <mb-ba-group-collapse
        :height="contentH"
        :data="assetGroups"
        @sort="handelSort"
        @selected-group="onSelectedGroup"
        @selected-item="onSelectedItem"
      />
    </view>
    <!-- 添加分组按钮 -->
    <mb-ba-bottom-btn
      class="bottom-add-btn"
      :onlyone="true"
      ltext="添加分组"
      id="add-btn"
      @click="onBotBtnClick"
    />

    <!-- 添加分组弹窗 -->
    <mb-ba-edit-dialog
      ref="addGroupDialog"
      height="150"
      class="edit-group-input"
      @click="onDialogBtnClick"
    >
      <view class="input-item x-bc">
        <text class="title">分组名称</text>
        <input
          type="text"
          class="input"
          maxlength="5"
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
      contentH: 0,
      assetGroups: [],
      dialodOptions: {
        ltext: addBtnTitle,
        rtext: delBtnTitle,
      },
      group: {
        id: 0,
        name: "",
        index: 0,
      },
    };
  },
  onLoad() {
    this.dynamicHeight();
    this.getAssetGroups();
  },
  onShow() {},
  methods: {
    // 获取账单账户
    getAssetGroups() {
      this.$api.assetGroups().then((res) => {
        if (res.data.code === 0) {
          this.assetGroups = res.data.result;
        }
      });
    },

    //#region 触发事件

    // 添加分组
    onBotBtnClick(e) {
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
    onSelectedGroup(e) {
      this.group = e.group;
      if (e.type == 0) {
        // 为编辑
        this.dialodOptions.onlyone = false;
        this.dialodOptions.ltext = editBtnTitle;
        this.$refs.addGroupDialog.show(this.dialodOptions);
      }
    },

    /**
     * @description: 选中资产
     * @param {*} e 选中资产数据
     * @return {*}
     */
    onSelectedItem(e) {
      let item = e.item;
      console.log("item", item);
      let group = this.assetGroups[item.gIndex];
      if (e.type == 0) {
        // 为编辑
        this.$Router.push({
          name: "asset-edit",
          params: { id: item.id, groupId: group.id, groupName: group.name },
        });
      } else if (e.type == 1) {
        // 为删除
        console.log(item, "删除分类");
        this.assetGroups[item.gIndex].childs.splice(item.index, 1);
      } else if (e.type == 2) {
        // 为新增
        this.$Router.push({
          name: "asset-edit",
          params: { groupId: group.id, groupName: group.name },
        });
      }
    },

    onDialogBtnClick(e) {
      if (e.isLeft) {
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
            .editAssetGroup({
              name: this.group.name,
            })
            .then((res) => {
              if (res.data.code === 0) {
                // console.log(res.data.result);
                this.$refs.addGroupDialog.hide();
                this.getAssetGroups();
              }
            });
        } else {
          this.$api
            .createAssetGroup({
              name: this.group.name,
              sort: this.assetGroups.length + 1,
            })
            .then((res) => {
              if (res.data.code === 0) {
                // console.log(res.data.result);
                this.$refs.addGroupDialog.hide();
                this.getAssetGroups(this.type);
              }
            });
        }
      } else {
        console.log("删除group", this.group);
        this.$tip
          .choose("同时删除子项，是否删除？", {}, "删除分组")
          .then(async () => {
            // that.$api.delAssetGroup(this.group.id).then((res) => {
            //   if (res.data.code === 0) {
            //   }
            // });
            this.assetGroups.splice(this.group.index, 1);
            this.$refs.addGroupDialog.hide();
          });
      }
    },

    /**
     * @description: 触发请求排序
     * @param {*} sorts 排序信息
     * @return {*}
     */
    handelSort(sorts) {
      // console.log(sorts, "排序信息");
      this.$api
        .sortAssetGroups({
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
          query.select("#add-btn").fields({ size: true });
          query.exec((data) => {
            let headerH = data[0].height;
            that.contentH = pH - headerH - 43;
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scope>
.b-container {
  .group-list-container {
    margin-top: 86rpx;
  }

  .bottom-add-btn {
    padding: 20rpx;
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
