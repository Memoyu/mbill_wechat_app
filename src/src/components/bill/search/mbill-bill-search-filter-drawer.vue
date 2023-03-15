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
            <view class="search-options-cell-item" @click="onSelectDate">
              <view class="search-options-cell-item-title x-bc">
                <view>时间</view>
                <view class="search-options-cell-item-content">
                  <view class="selected-text">{{ datePicker.text }}</view>
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
                  <input
                    class="amount-input"
                    type="number"
                    v-model="amount.min"
                  />
                  <view
                    style="margin: 0 15rpx; display: flex; align-items: center"
                    >—</view
                  >
                  <input
                    class="amount-input"
                    type="number"
                    v-model="amount.max"
                  />
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
                  <input
                    class="other-input"
                    placeholder="输入地址"
                    v-model="address"
                  />
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
                  <input
                    class="other-input"
                    placeholder="输入备注"
                    v-model="remark"
                  />
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

    <!-- 时间 -->
    <mb-search-date-drawer
      :open.sync="openDate"
      @confirm="onDateConfirm"
      :date="datePicker"
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
    filter: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      openType: false,
      openCategory: false,
      openAsset: false,
      openDate: false,
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
      datePicker: {
        text: "",
        begin: "",
        end: "",
      },
      amount: {},
      address: "",
      remark: "",
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
    filter(val) {
      this.datePicker = val.date;
      // console.log("watch filter", val);
    },
  },
  created() {
    // console.log("filter", this.filter);
  },
  methods: {
    // 确认
    onConfirm() {
      if (
        this.amount.min != undefined &&
        this.amount.max != undefined &&
        this.amount.min > this.amount.max
      ) {
        this.$tip.toast("金额区间有误");
        return;
      }

      this.$emit("confirm", {
        types: this.selectedType.items,
        categoryIds: this.selectedCategpry.items,
        assetIds: this.selectedAsset.items,
        date: this.datePicker,
        amount: this.amount,
        address: this.address,
        remark: this.remark,
      });
      this.$emit("update:open", false);
    },

    // 抽屉状态发生变化触发
    onChangeFilterDrawer(e) {
      this.$emit("update:open", e);
    },

    // 打开选择类型抽屉
    onSelectType() {
      this.openType = true;
    },

    // 打开选择分类抽屉
    onSelectCategory() {
      this.loadCategoriesData();
      this.openCategory = true;
    },

    // 打开选择资产抽屉
    onSelectAsset() {
      this.loadAssetsData();
      this.openAsset = true;
    },

    // 打开选择日期抽屉
    onSelectDate() {
      this.openDate = true;
    },

    // 取人选择类型
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

    //确认选择分类
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

    // 确认选择资产
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

    // 确认选择日期
    onDateConfirm(e) {
      this.datePicker = e;
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
  font-size: 28rpx;
  max-width: 320rpx;
  color: $primary-color;
  display: -webkit-box; /*弹性伸缩盒子模型显示*/
  -webkit-box-orient: vertical; /*排列方式*/
  -webkit-line-clamp: 1; /*显示文本行数(这里控制多少行隐藏)*/
  overflow: hidden; /*溢出隐藏*/
}

.amount-input {
  font-size: 28rpx;
  color: $primary-color;
  margin: 7rpx;
  text-align: center;
  width: 100rpx;
  background-color: $grey-bright-color;
}

.other-input {
  font-size: 28rpx;
  color: $primary-color;
  margin: 7rpx;
  text-align: right;
}
</style>