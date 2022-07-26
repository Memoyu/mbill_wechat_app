<template>
  <view class="b-container">
    <!-- 头部 -->
    <view class="edit-header" id="edit-header">
      <view class="edit-header-title">{{ groupName }}</view>
    </view>
    <!-- 输入 -->
    <view class="edit-input" id="edit-input">
      <view class="edit-input-content">
        <image class="edit-input-content-image" :src="category.icon" />
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
      id: 0,
      groupId: 0,
      groupName: "分组名",
      icons: [
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_certificate_96.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_read_64.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_browser_64.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_certificate_96.png",
        },
        {
          url: "https://oss.memoyu.com/category_icons/icon_physical_80.png",
          path: "eee",
        },
        {
          url: "https://oss.memoyu.com/category_icons/icon_insurance_64.png",
          path: "eee",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_certificate_96.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_read_64.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_browser_64.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_certificate_96.png",
        },
        {
          url: "https://oss.memoyu.com/category_icons/icon_physical_80.png",
          path: "eee",
        },
        {
          url: "https://oss.memoyu.com/category_icons/icon_insurance_64.png",
          path: "eee",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_certificate_96.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_read_64.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_browser_64.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_certificate_96.png",
        },
        {
          url: "https://oss.memoyu.com/category_icons/icon_physical_80.png",
          path: "eee",
        },
        {
          url: "https://oss.memoyu.com/category_icons/icon_insurance_64.png",
          path: "eee",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_certificate_96.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_read_64.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_browser_64.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_certificate_96.png",
        },
        {
          url: "https://oss.memoyu.com/category_icons/icon_physical_80.png",
          path: "eee",
        },
        {
          url: "https://oss.memoyu.com/category_icons/icon_insurance_64.png",
          path: "eee",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_certificate_96.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_read_64.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_browser_64.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_certificate_96.png",
        },
        {
          url: "https://oss.memoyu.com/category_icons/icon_physical_80.png",
          path: "eee",
        },
        {
          url: "https://oss.memoyu.com/category_icons/icon_insurance_64.png",
          path: "eee",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_certificate_96.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_read_64.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_browser_64.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_certificate_96.png",
        },
        {
          url: "https://oss.memoyu.com/category_icons/icon_physical_80.png",
          path: "eee",
        },
        {
          url: "https://oss.memoyu.com/category_icons/icon_insurance_64.png",
          path: "eee",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_certificate_96.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_read_64.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_browser_64.png",
        },
        {
          path: "eee",
          url: "https://oss.memoyu.com/category_icons/icon_certificate_96.png",
        },
        {
          url: "https://oss.memoyu.com/category_icons/icon_physical_80.png",
          path: "eee",
        },
        {
          url: "https://oss.memoyu.com/category_icons/icon_insurance_64.png",
          path: "eee",
        },
      ],
      category: {
        icon: "https://oss.memoyu.com/category_icons/icon_book_64.png",
        path: "",
        name: "",
      },
      iconPage: {
        page: 1,
        size: 15,
      },
      iconTotal: 0,
    };
  },
  onLoad(options) {
    this.id = options.id ?? 0;
    this.groupId = options.groupId;
    this.groupName = options.groupName
      ? decodeURIComponent(options.groupName)
      : "";
    this.dynamicHeight();
  },
  onShow() {},
  methods: {
    getIcons() {},

    //#region 事件触发

    onSelectedIcon(icon) {
      this.category.icon = icon.url;
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
