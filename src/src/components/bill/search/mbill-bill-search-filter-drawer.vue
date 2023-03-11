<template>
  <view>
    <uni-drawer
      ref="filterDrawer"
      mode="right"
      :width="drawerWidth"
      @change="onChangeFilterDrawer"
    >
      <view class="search-options">
        <view class="search-options-btn x-bc">
          <view @click="onReset">重置</view>
          <view @click="onConfirm">确认</view>
        </view>
        <view class="search-options-container">
          <!-- 账单类型 -->
          <view class="search-options-cell">
            <i class="iconfont icon-select search-options-cell-icon" />
            <view class="search-options-cell-item" @click="onSelectType">
              <view class="search-options-cell-item-title x-bc">
                <view>类型</view>
                <view class="search-options-cell-item-content">
                  <view class="selected-text">{{ selectedType.text }}</view>
                  <i class="iconfont icon-to search-options-cell-to-icon" />
                </view>
              </view>
              <view class="search-options-cell-bottom-line" />
            </view>
          </view>

          <!-- 账单分类 -->
          <view class="search-options-cell">
            <i class="iconfont icon-category search-options-cell-icon" />
            <view class="search-options-cell-item" @click="onSelectCategory">
              <view class="search-options-cell-item-title x-bc">
                <view>分类</view>
                <view class="search-options-cell-item-content">
                  <view class="selected-text">{{ selectedCategpry.text }}</view>
                  <i class="iconfont icon-to search-options-cell-to-icon" />
                </view>
              </view>
              <view class="search-options-cell-bottom-line" />
            </view>
          </view>

          <!-- 账单账户 -->
          <view class="search-options-cell">
            <i class="iconfont icon-bankcard search-options-cell-icon" />
            <view class="search-options-cell-item" @click="onSelectAsset">
              <view class="search-options-cell-item-title x-bc">
                <view>账户</view>
                <view class="search-options-cell-item-content">
                  <view class="selected-text">{{ selectedAsset.text }}</view>
                  <i class="iconfont icon-to search-options-cell-to-icon" />
                </view>
              </view>
              <view class="search-options-cell-bottom-line" />
            </view>
          </view>

          <!-- 账单时间 -->
          <view class="search-options-cell">
            <i class="iconfont icon-time search-options-cell-icon" />
            <view class="search-options-cell-item">
              <view class="search-options-cell-item-title x-bc">
                <view>时间</view>
                <view class="search-options-cell-item-content">
                  <view>全部时间</view>
                  <i class="iconfont icon-to search-options-cell-to-icon" />
                </view>
              </view>
              <view class="search-options-cell-bottom-line" />
            </view>
          </view>

          <!-- 账单金额 -->
          <view class="search-options-cell">
            <i class="iconfont icon-money search-options-cell-icon" />
            <view class="search-options-cell-item">
              <view class="search-options-cell-item-title x-bc">
                <view>金额</view>
                <view class="search-options-cell-item-content">
                  <view>10</view>
                  <view>-</view>
                  <view>20</view>
                </view>
              </view>
              <view class="search-options-cell-bottom-line" />
            </view>
          </view>

          <!-- 账单地址 -->
          <view class="search-options-cell">
            <i class="iconfont icon-dizhi search-options-cell-icon" />
            <view class="search-options-cell-item">
              <view class="search-options-cell-item-title x-bc">
                <view>地址</view>
                <view class="search-options-cell-item-content">
                  <view>白云</view>
                </view>
              </view>
              <view class="search-options-cell-bottom-line" />
            </view>
          </view>

          <!-- 账单备注 -->
          <view class="search-options-cell">
            <i class="iconfont icon-note-text search-options-cell-icon" />
            <view class="search-options-cell-item">
              <view class="search-options-cell-item-title x-bc">
                <view>备注</view>
                <view class="search-options-cell-item-content">
                  <view>账单备注</view>
                </view>
              </view>
              <view class="search-options-cell-bottom-line" />
            </view>
          </view>
        </view>
      </view>
    </uni-drawer>

    <!-- 类型 -->
    <mb-search-select-drawer
      :groups="types"
      :open.sync="openType"
      @confirm="onTypeConfirm"
    />
    <!-- 分类 -->
    <mb-search-select-drawer
      :groups="categories"
      :open.sync="openCategory"
      @confirm="onCategoryConfirm"
    />
    <!-- 资产 -->
    <mb-search-select-drawer
      :groups="assets"
      :open.sync="openAsset"
      @confirm="onAssetConfirm"
    />
  </view>
</template>

<script>
import mbillBillSearchSelectDrawer from "./mbill-bill-search-select-drawer.vue";
export default {
  components: { mbillBillSearchSelectDrawer },
  name: "mbill-bill-search-filter-drawer",
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      openType: false,
      openCategory: false,
      openAsset: false,
      drawerWidth: 300,
      types: [
        { id: 0, name: "支出" },
        { id: 1, name: "收入" },
      ],
      categories: [],
      assets: [],
      selectedType: {
        text: "",
        items: [],
      },
      selectedCategpry: {
        text: "",
        items: [],
      },
      selectedAsset: {
        text: "",
        items: [],
      },
    };
  },
  watch: {
    open(val) {
      if (val) {
        this.$refs["filterDrawer"].open();
      } else {
        this.$refs["filterDrawer"].close();
      }
    },
  },

  methods: {
    // 确认
    onConfirm() {
      this.$emit("update:open", false);
    },

    // 抽屉状态发生变化触发
    onChangeFilterDrawer(e) {
      this.$emit("update:open", e);
    },

    onSelectType() {
      this.openType = true;
    },

    onSelectCategory() {
      this.loadCategoriesData();
      this.openCategory = true;
    },

    onSelectAsset() {
      this.loadAssetsData();
      this.openAsset = true;
    },

    onTypeConfirm(e) {
      // console.log("type", e);
      var count = e.groups.length;
      if (count <= 0) {
        this.selectedType.text = "";
      } else {
        var names = [];
        e.groups.slice(0, 2).forEach((g) => {
          names.push(g.name);
        });
        this.selectedType.text = names.join(", ");
        if (count > 2) this.selectedType.text += ` 等${count}个`;
      }
      this.selectedType.items = e.groups;
    },

    onCategoryConfirm(e) {
      // console.log("category", e);
      var count = e.childs.length;
      if (count <= 0) {
        this.selectedCategpry.text = "";
      } else {
        var names = [];
        e.childs.slice(0, 2).forEach((c) => {
          names.push(c.name);
        });
        this.selectedCategpry.text = names.join(", ");
        if (count > 2) this.selectedCategpry.text += ` 等${count}个`;
      }
      this.selectedCategpry.items = e.childs;
    },

    onAssetConfirm(e) {
      // console.log("asset", e);
      var count = e.childs.length;
      if (count <= 0) {
        this.selectedAsset.text = "";
      } else {
        var names = [];
        e.childs.slice(0, 2).forEach((c) => {
          names.push(c.name);
        });
        this.selectedAsset.text = names.join(", ");
        if (count > 2) this.selectedAsset.text += ` 等${count}个`;
      }
      this.selectedAsset.items = e.childs;
    },

    // 分类数据
    loadCategoriesData() {
      this.$api.getCategoryGroups().then((res) => {
        if (res.data.code === 0) {
          var groups = res.data.result;
          var dtos = [];
          groups.forEach((g) => {
            var dto = {
              id: g.id,
              name: g.name,
              childs: [],
            };
            g.childs.forEach((c) => {
              dto.childs.push({ id: c.id, name: c.name });
            });
            dtos.push(dto);
          });
          this.categories = dtos;
        }
      });
    },

    // 资产数据
    loadAssetsData() {
      this.$api.getAssetGroups().then((res) => {
        if (res.data.code === 0) {
          var groups = res.data.result;
          var dtos = [];
          groups.forEach((g) => {
            var dto = {
              id: g.id,
              name: g.name,
              childs: [],
            };
            g.childs.forEach((c) => {
              dto.childs.push({ id: c.id, name: c.name });
            });
            dtos.push(dto);
          });
          this.assets = dtos;
        }
      });
    },
  },
};
</script>

<style lang="scss" scope>
.search {
  &-options {
    margin: 40rpx 25rpx;
    &-btn {
      font-weight: bold;
      font-size: 30rpx;
      color: $primary-color;
    }

    &-container {
      margin-top: 50rpx;
    }

    &-cell {
      display: flex;
      align-items: center;
      font-size: 32rpx;
      margin: 45rpx 0;
      &-icon {
        margin-right: 10rpx;
        font-size: 40rpx;
      }
      &-to-icon {
        margin-left: 20rpx;
        font-size: 20rpx;
        display: flex;
        align-items: center;
      }
      &-item {
        width: 100%;
        &-title {
          margin-bottom: 10rpx;
        }
        &-content {
          display: flex;
        }
      }
      &-bottom-line {
        height: 2rpx;
        background: $bright-color;
        width: 100%;
      }
    }
  }
}
.selected-text {
  font-size: 27rpx;
  max-width: 320rpx;
  color: $primary-color;
  display: -webkit-box; /*弹性伸缩盒子模型显示*/
  -webkit-box-orient: vertical; /*排列方式*/
  -webkit-line-clamp: 1; /*显示文本行数(这里控制多少行隐藏)*/
  overflow: hidden; /*溢出隐藏*/
}
</style>