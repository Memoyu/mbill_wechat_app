<template>
  <view class="b-container">
    <!-- 头部 -->
    <view class="edit-header" id="edit-header">
      <view class="edit-header-title">{{ groupName }}</view>
    </view>
    <!-- 输入 -->
    <view class="edit-input" id="edit-input">
      <view class="edit-input-content">
        <image class="edit-input-content-image" :src="category.iconUrl" />
        <input
          type="text"
          class="edit-input-content-input"
          maxlength="5"
          v-model="category.name"
          alwaysEmbed="true"
          placeholder="分类名称"
        />
      </view>
    </view>
    <!-- Icon列表 -->
    <view class="category-icon-container">
      <scroll-view
        :style="{
          height: scrollHeight + 'px',
        }"
        scroll-y="true"
        @scrolltolower="onLowerBottom"
      >
        <view class="category-icon-list">
          <view
            class="category-icon-list-content"
            v-for="(icon, index) in icons"
            :key="index"
            @click="onSelectedIcon(icon)"
          >
            <image class="category-icon-list-content-image" :src="icon.url" />
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 保存按钮 -->
    <mb-ba-bottom-btn
      class="save-btn"
      :onlyone="true"
      ltext="保存"
      id="save-btn"
      @click="onBtnClick"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      scrollHeight: 0,
      type: 0,
      groupId: 0,
      groupName: "分组名",
      loading: false,
      icons: [],
      category: {
        id: 0,
        iconUrl: "",
        icon: "",
        name: "",
      },
      iconPage: {
        type: 0,
        page: 1,
        size: 50,
      },
      iconTotal: 0,
    };
  },
  onLoad(options) {
    // console.log(options);
    let opId = options.id;
    if (opId != undefined && opId != null) {
      this.category.id = options.id;
      this.getCategory();
    }
    this.type = options.type;
    this.groupId = options.groupId;
    this.groupName = options.groupName
      ? decodeURIComponent(options.groupName)
      : "";
    this.dynamicHeight();
    this.getIcons().then(() => {
      if (this.category.id == 0) {
        this.category.iconUrl = this.icons[0].url;
        this.category.icon = this.icons[0].path;
      }
    });
  },
  onShow() {},
  methods: {
    // 获取分类信息
    getCategory() {
      this.$api.getCategory({ id: this.category.id }).then((res) => {
        let result = res.data.result;
        console.log(result);
        this.category = result;
      });
    },

    // 获取图标列表
    getIcons() {
      return new Promise((resolve) => {
        if (this.loading) return;
        this.loading = true;
        this.$api
          .getIconPage(this.iconPage)
          .then((res) => {
            let result = res.data.result;
            this.iconTotal = result.total;
            this.icons = this.icons.concat(result.items);
            resolve();
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },

    //#region 事件触发

    onSelectedIcon(icon) {
      this.category.iconUrl = icon.url;
      this.category.icon = icon.path;
    },

    onBtnClick(e) {
      if (this.category.name == undefined || this.category.name.length <= 0) {
        this.$tip.toast("请输入分类名称");
        return;
      }
      console.log(this.category);
      if (this.category.id != undefined && this.category.id != 0) {
        this.$api
          .editCategory({
            id: this.category.id,
            name: this.category.name,
            icon: this.category.icon,
          })
          .then((res) => {
            if (res.data.code === 0) {
              this.completedEdit(true, res.data.result);
            } else {
              this.$tip.toast(res.data.message);
            }
          });
      } else {
        this.$api
          .createCategory({
            parentId: this.groupId,
            name: this.category.name,
            icon: this.category.icon,
            type: this.type,
            sort: 0, // 默认放最后
          })
          .then((res) => {
            if (res.data.code === 0) {
              this.completedEdit(false, res.data.result);
            } else {
              this.$tip.toast(res.data.message);
            }
          });
      }
    },

    onLowerBottom() {
      if (this.iconPage.page * this.iconPage.size >= this.iconTotal) return;
      // console.log("加载");
      this.iconPage.page += 1;
      this.getIcons();
    },

    //#endregion

    /**
     * @description: 编辑完成后回调，并返回上一页面
     * @param {*} isEdit 是否为编辑
     * @param {*} data 编辑后的数据
     * @return {*}
     */
    completedEdit(isEdit, data) {
      let pages = getCurrentPages(); //获取页面栈
      let beforePage = pages[pages.length - 2]; //上一页
      beforePage.$vm.completedEditCallback(isEdit, data); //直接调用上一页的方法
      this.$Router.back();
    },

    // 动态计算scrollview 高度
    dynamicHeight() {
      let that = this;
      uni.getSystemInfo({
        success(res) {
          let pH = res.windowHeight;
          let query = uni.createSelectorQuery().in(that);
          query.select("#edit-header").fields({ size: true });
          query.select("#edit-input").fields({ size: true });
          query.select("#save-btn").fields({ size: true });
          query.exec((data) => {
            // console.log(data);
            data.map((i) => {
              that.scrollHeight += i.height;
            });
            that.scrollHeight = pH - that.scrollHeight;
            // console.log(that.scrollHeight);
          });
        },
      });
    },
  },
};
</script>

<style lang='scss' scope>
.b-container {
  .edit-header {
    width: 100%;
    padding: 20rpx 0;
    &-title {
      font-size: 40rpx;
      font-weight: bold;
      text-align: center;
    }
  }

  .edit-input {
    display: flex;
    align-items: center;
    padding: 50rpx;
    &-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-image {
        height: 70rpx;
        width: 70rpx;
        margin-right: 30rpx;
      }
      &-input {
        font-size: 35rpx;
        text-align: right;
        padding: 10rpx;
      }
    }
  }
  .category-icon-container {
    background-color: #ffffff;
    margin: 0 10rpx;
    border-radius: 30rpx;
    .category-icon-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, 140rpx);
      justify-content: center;
      &-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 20rpx;
        padding: 25rpx 0;
        &-image {
          height: 70rpx;
          width: 70rpx;
        }
      }
    }
  }

  .save-btn {
    padding: 20rpx;
  }
}
</style>
