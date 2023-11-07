<template>
  <view class="b-container">
    <!-- 类型选项 -->
    <view class="type-tabs" id="header-type-tabs">
      <mb-ba-focus-tabs
        v-model="type"
        :items="types"
        @selected="onTypeSwitch"
      />
    </view>
    <!-- 分类列表 -->
    <mb-ba-group-collapse
      :height="contentH"
      :items="groups"
      @sort="handelSort"
      @selected-group="onSelectedGroup"
      @selected-item="onSelectedItem"
    />
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
          maxlength="6"
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
      chan: "",
      type: 0,
      types: [
        { key: 0, text: "支出" },
        { key: 1, text: "收入" },
      ],
      groups: [],
      contentH: 0,
      dialodOptions: {
        ltext: addBtnTitle,
        rtext: delBtnTitle,
      },
      item: {},
      group: {
        bId: 0,
        name: "",
        index: 0,
      },
    };
  },
  watch: {
    type(val) {
      // console.log("账单类型", val);
      this.getCategoryGroups(val);
    },
  },
  onLoad(option) {
    this.dynamicHeight();
    if (option.type != undefined && option.type != null) {
      this.type = option.type;
    }
    if (option.chan != undefined && option.chan != null) {
      this.chan = option.chan;
    }

    this.getCategoryGroups(this.type);
  },
  onShow() {},
  onUnload() {
    // console.log("页面卸载");
    // 如果上层页面需要更新
    if (this.chan == "refresh") {
      let pages = getCurrentPages(); //获取页面栈
      let beforePage = pages[pages.length - 2]; //上一页
      beforePage.$vm.refreshCategory = Math.random(); //直接调用上一页的方法
    }
  },
  methods: {
    // 获取账单分类
    getCategoryGroups(type) {
      this.$api.getCategoryGroups({ type: type }).then((res) => {
        if (res.data.code === 0) {
          this.groups = res.data.result;
        }
      });
    },

    //#region 事件处理

    tabChange({ detail }) {
      let curr = detail.current;
      this.type = curr;
    },

    // 切换分类类型
    onTypeSwitch(type) {
      this.type = type;
    },

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
     * @description: 选中分类
     * @param {*} e 选中分类数据
     * @return {*}
     */
    onSelectedItem(e) {
      let item = e.item;
      this.item = item;
      let group = this.groups[item.gIndex];
      if (e.type == 0) {
        // 为编辑
        this.$Router.push({
          name: "category-edit",
          params: { bId: item.bId, groupBId: group.bId, groupName: group.name },
        });
      } else if (e.type == 1) {
        // 为删除
        // console.log(item, "删除分类");
        this.$tip.choose("是否删除分类？", {}, "删除分类").then(async () => {
          this.$api.delCategory(item.bId).then((res) => {
            if (res.data.code === 0) {
              this.groups[item.gIndex].childs.splice(item.index, 1);
            } else {
              this.$tip.toast(res.data.message);
            }
          });
        });
      } else if (e.type == 2) {
        // 为新增
        this.$Router.push({
          name: "category-edit",
          params: { type: this.type, groupBId: group.bId, groupName: group.name },
        });
      }
    },

    onDialogBtnClick(e) {
      if (e.isLeft) {
        if (this.group.name == undefined || this.group.name.length <= 0) {
          this.$tip.toast("请输入分组名称");
          return;
        }

        // 没有bId 或 bId = 0 则为添加分组
        if (this.group.bId != undefined && this.group != 0) {
          this.$api
            .editCategory({
              bId: this.group.bId,
              name: this.group.name,
            })
            .then((res) => {
              if (res.data.code === 0) {
                // console.log(res.data.result);
                let result = res.data.result;
                let group = this.groups[this.group.index];
                group.name = result.name;
                this.$refs.addGroupDialog.hide();
                // this.getCategoryGroups(this.type);
              } else {
                this.$tip.toast(res.data.message);
              }
            });
        } else {
          this.$api
            .createCategory({
              parentBId: 0,
              name: this.group.name,
              type: this.type,
              sort: this.groups.length + 1,
            })
            .then((res) => {
              if (res.data.code === 0) {
                // console.log(res.data.result);
                let ca = res.data.result;
                this.groups.unshift({ bId: ca.bId, name: ca.name, childs: [] });
                this.$refs.addGroupDialog.hide();
                // this.getCategoryGroups(this.type);
              } else {
                this.$tip.toast(res.data.message);
              }
            });
        }
      } else {
        // console.log("删除group", this.group);
        this.$tip
          .choose("同时删除子项，是否删除？", {}, "删除分组")
          .then(async () => {
            this.$api.delCategory(this.group.bId).then((res) => {
              if (res.data.code === 0) {
                this.groups.splice(this.group.index, 1);
                this.$refs.addGroupDialog.hide();
              } else {
                this.$tip.toast(res.data.message);
              }
            });
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
        .sortCategoryGroups({
          sorts: sorts,
        })
        .then((res) => {
          if (res.data.code === 0) {
            // console.log(res.message);
          } else {
            this.$tip.toast(res.data.message);
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
          query.select("#add-btn").fields({ size: true });
          query.exec((data) => {
            let headerH = data[0].height;
            headerH += data[1].height;
            that.contentH = pH - headerH;
          });
        },
      });
    },

    // 编辑页面回调
    completedEditCallback(isEdit, item) {
      if (isEdit) {
        let ca = this.groups[this.item.gIndex].childs[this.item.index];
        if (ca != undefined && ca != null) {
          ca.iconUrl = item.iconUrl;
          ca.name = item.name;
        }
      } else {
        this.groups[this.item.gIndex].childs.push(item);
      }
    },
  },
};
</script>

<style lang="scss" scope>
.b-container {
  .type-tabs {
    font-size: 35rpx;
    padding: 30rpx 0;
    display: flex;
    justify-content: center;
    align-items: center;
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
