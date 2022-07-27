<template>
  <view class="b-container">
    <!-- 头部 -->
    <view class="edit-header" id="edit-header">
      <view class="edit-header-title">{{ groupName }}</view>
    </view>
    <!-- 输入 -->
    <view class="edit-input" id="edit-input">
      <view class="edit-input-content">
        <image class="edit-input-content-image" :src="asset.iconUrl" />
        <input
          type="text"
          class="edit-input-content-input"
          maxlength="5"
          v-model="asset.name"
          alwaysEmbed="true"
          placeholder="账户名称"
        />
      </view>
    </view>
    <!-- Icon列表 -->
    <view class="asset-icon-container">
      <scroll-view
        :style="{
          height: scrollHeight + 'px',
        }"
        scroll-y="true"
        @scrolltolower="onLowerBottom"
      >
        <view class="asset-icon-list">
          <view
            class="asset-icon-list-content"
            v-for="(icon, index) in icons"
            :key="index"
            @click="onSelectedIcon(icon)"
          >
            <image class="asset-icon-list-content-image" :src="icon.url" />
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
      id: 0,
      groupId: 0,
      groupName: "分组名",
      loading: false,
      icons: [],
      asset: {
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
    let opId = options.id;
    if (opId != undefined && opId != null) {
      this.asset.id = options.id;
      this.getAsset();
    }
    this.groupId = options.groupId;
    this.groupName = options.groupName
      ? decodeURIComponent(options.groupName)
      : "";
    this.dynamicHeight();
    this.getIcons().then(() => {
      if (this.category.id == 0) {
        this.asset.iconUrl = this.icons[0].url;
        this.asset.icon = this.icons[0].path;
      }
    });
  },
  onShow() {},
  methods: {
    // 获取分类信息
    getAsset() {
      this.$api.getAsset({ id: this.asset.id }).then((res) => {
        let result = res.data.result;
        console.log(result);
        this.asset.iconUrl = result.iconUrl;
        this.asset.name = result.name;
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
      this.asset.icon = icon.url;
    },

    onBtnClick(e) {},

    onLowerBottom() {
      if (this.iconPage.page * this.iconPage.size >= this.iconTotal) return;
      // console.log("加载");
      this.iconPage.page += 1;
      this.getIcons();
    },

    //#endregion

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
            console.log(data);
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
  .asset-icon-container {
    background-color: #ffffff;
    margin: 0 10rpx;
    border-radius: 30rpx;
    .asset-icon-list {
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
