<template>
  <view class="b-container">
    <!-- 头部操作 -->
    <view class="group-header" id="group-header">
      <view class="date-title" id="date-title">
        <picker
          class="date-picker"
          mode="date"
          @change="onPickerChange"
          fields="month"
          :value="pickerDate"
        >
          <view class="y-bc">
            <text class="now-date-year">{{ pickerDateText.year }}年</text>
            <view class="now-date-month x-c">
              <text>{{ pickerDateText.month }}月</text>
              <i class="iconfont icon-bottom icon-down" />
            </view>
          </view>
        </picker>
        <view class="pre-order-stat">
          <view class="pre-order-stat-content top">
            <view class="pre-order-stat-text">
              <text class="text">预购分组</text>
              <text class="total">{{ stat.total }}</text>
            </view>
            <view class="pre-order-stat-text">
              <text class="text">入账分组</text>
              <text class="total">{{ stat.toBill }}</text>
            </view>
          </view>
          <view class="bottom-line" />
          <view class="pre-order-stat-content bottom">
            <view class="pre-order-stat-text">
              <text class="text">已完成</text>
              <text class="total">{{ stat.done }}</text>
            </view>
            <view class="pre-order-stat-text">
              <text class="text">未完成</text>
              <text class="total">{{ stat.unDone }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 分组列表 -->
    <view class="group-content">
      <scroll-view
        :style="{
          height: scrollHeight + 'px',
        }"
        scroll-y="true"
        @scrolltolower="lowerBottom"
      >
        <uni-swipe-action ref="swipeAction">
          <uni-swipe-action-item
            v-for="g in groups"
            :key="g.id"
            :right-options="swipeOptions"
            @click="onSwipeClick($event, g)"
          >
            <view class="group-content-items">
              <mb-po-group-item :group="g" />
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>
        <view v-if="groups.length > 0" style="height: 50px" />
        <mb-ba-empty v-if="groups.length <= 0" />
      </scroll-view>
    </view>
    <!-- 底部按钮 -->
    <view class="bottom-operate" id="bottom-operate">
      <mb-ba-bottom-btn
        onlyone="true"
        @click="onBotBtnClick"
        ltext="新建分组"
      />
    </view>
    <!-- 弹窗 -->
    <mb-ba-edit-dialog
      ref="addGroupDialog"
      height="170"
      class="edit-group-input"
      @change="onDialogChange"
      @click="onDialogBtnClick"
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
      <view class="input-item x-bc">
        <text class="title">分组描述</text>
        <input
          type="text"
          class="input"
          v-model="group.description"
          alwaysEmbed="true"
          placeholder="描述一下咯"
        />
      </view>
    </mb-ba-edit-dialog>
  </view>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  GROUP_INDEX_ADD_GROUP,
  GROUP_INDEX_EDIT_GROUP,
  GROUP_INDEX_DEL_GROUP,
} from "@/store/type";
import datetime from "@/common/utils/datetime";

export default {
  data() {
    return {
      scrollHeight: 0,
      dialodOptions: {
        onlyone: true,
        ltext: "新建",
        rtext: "取消",
      },
      group: {
        name: "",
        description: "",
      },
      pickerDate: datetime.getCurDate(),
      pickerDateText: {
        year: datetime.getCurYear(),
        month: datetime.getCurMonth(),
      },
      page: {
        page: 1,
        size: 15,
      },
      pageTotal: 0,
      loading: false,
      swipeOptions: [
        {
          text: "编辑",
        },
        {
          text: "删除",
          style: {
            backgroundColor: "rgb(255,58,49)",
          },
        },
      ],
    };
  },
  computed: {
    ...mapState({
      stat: (state) => state.preOrder.IndexStat,
      groups: (state) => state.preOrder.IndexGroups,
    }),
  },
  onShow() {},
  onReady() {
    this.dynamicHeight();
  },
  onLoad() {
    this.initData();
  },
  methods: {
    ...mapActions(["getIndexPreOrderStats", "getPreOrderGroups"]),
    // 初始化数据
    initData() {
      this.getIndexPreOrderStats(this.pickerDate);
      this.getGroups(true);
    },

    //#region 组件事件

    // 初始化、切换月份重新加载分组
    getGroups(init = false) {
      if (this.loading) return;
      this.loading = true;
      this.getPreOrderGroups({
        date: this.pickerDate,
        page: this.page,
        isInit: init,
      })
        .then((res) => {
          this.pageTotal = res;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    addGroup(group) {
      this.$api.addPreOrderGroup(group).then((res) => {
        if (res.data.code === 0) {
          // console.log(res);
          this.$refs.addGroupDialog.hide();
          this.$store.commit(GROUP_INDEX_ADD_GROUP, res.data.result);
        } else {
          this.$tip.alert(res.data.message);
        }
      });
    },

    editGroup(group) {
      this.$api.editPreOrderGroup(group).then((res) => {
        if (res.data.code === 0) {
          // console.log(res);
          this.$refs.addGroupDialog.hide();
          this.$store.commit(GROUP_INDEX_EDIT_GROUP, res.data.result);
        } else {
          this.$tip.alert(res.data.message);
        }
      });
    },

    delGroup(group) {
      this.$api.delPreOrderGroup(group.id).then((res) => {
        if (res.data.code === 0) {
          // console.log(res);
          this.$refs.addGroupDialog.hide();
          this.$store.commit(GROUP_INDEX_DEL_GROUP, group);
        } else {
          this.$tip.alert(res.data.message);
        }
      });
    },

    //#endregion

    //#region 组件事件

    // 计算高度，动态调整scroll 高度
    dynamicHeight() {
      let that = this;
      uni.getSystemInfo({
        success(res) {
          let pH = res.windowHeight;
          let query = uni.createSelectorQuery().in(that);
          query.select("#group-header").fields({ size: true });
          // query.select("#bottom-operate").fields({ size: true });
          query.exec((data) => {
            // console.log(data);
            data.map((i) => {
              that.scrollHeight += i.height;
            });
            that.scrollHeight = pH - that.scrollHeight;
          });
        },
      });
    },

    // 选择日期
    onPickerChange({ detail }) {
      // console.log(detail.value);
      let d = new Date(detail.value);
      this.pickerDate = datetime.getCurDate(d);
      this.pickerDateText = datetime.getCurDateObj(d);
      this.initData();
    },

    onBotBtnClick(e) {
      this.dialodOptions.ltext = "新建";
      this.$refs.addGroupDialog.show(this.dialodOptions);
    },

    // 弹窗变更
    onDialogChange({ show }) {
      if (!show) this.group = {};
    },

    onDialogBtnClick(e) {
      console.log(this.group);
      if (!this.group.name || this.group.name == "") {
        this.$tip.toast("请输入分组名称");
        return;
      }
      if (this.group.name.length > 20) {
        this.$tip.toast("分组名称不超过10个字符");
        return;
      }
      if (this.group.description != "" && this.group.description.length > 200) {
        this.$tip.toast("分组描述不超过40个字符");
        return;
      }
      console.log(this.dialodOptions.ltext);
      if (this.dialodOptions.ltext == "新建") {
        this.addGroup(this.group);
      } else {
        this.editGroup(this.group);
      }
    },

    // scroll触底事件
    lowerBottom() {
      // console.log("触底加载");
      if (this.page.page * this.page.size >= this.pageTotal) return;
      // console.log("加载");
      this.page.page += 1;
      this.getGroups();
    },

    onSwipeClick(e, g) {
      // console.log("swipeClick", e, group);
      if (e.index == 0) {
        this.dialogTitle = "编辑预购组";
        this.dialodOptions.ltext = "编辑";

        // 深拷贝
        var gCopy = {};
        for (var key in g) {
          gCopy[key] = g[key];
        }
        this.group = gCopy;
        this.$refs.addGroupDialog.show(this.dialodOptions);
      } else if (e.index == 1) {
        // 删除
        var that = this;
        this.$tip.choose("是否删除该预购分组？", {}, "提示").then(async () => {
          that.delGroup(g);
        });
      }
    },
    //#endregion
  },
};
</script>

<style lang="scss" scope>
.group-header {
  width: 100%;
  .date-title {
    background-color: $light-color;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20rpx;
    align-items: center;
    border-radius: 0 0 30rpx 30rpx;

    .date-picker {
      width: 30%;
      .now-date-year {
        font-size: 30rpx;
        font-weight: bold;
      }
      .now-date-month {
        font-size: 50rpx;
        font-weight: bold;
        align-items: baseline;
      }
      .icon-down {
        font-size: 20rpx;
        margin-left: 10rpx;
      }
    }

    .pre-order-stat {
      width: 70%;
      display: flex;
      flex-direction: column;
      .pre-order-stat-content {
        display: flex;
        justify-content: space-around;
      }
      .top {
        margin-bottom: 20rpx;
      }
      .bottom {
        margin-top: 20rpx;
      }
      .bottom-line {
        height: 2rpx;
        background: $bright-color;
        width: 100%;
      }
    }

    .pre-order-stat-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 160rpx;

      .text {
        font-size: 24rpx;
      }
      .total {
        font-size: 30rpx;
        font-weight: bold;
      }
    }
  }
}
.group-content {
  width: 95%;
  .group-content-items {
    margin-top: 20rpx;
    padding: 6rpx 0;
    border-radius: 26rpx;
    flex: 1;
    // padding: 0 30rpx;
    position: relative;
    background-color: #fff;
  }
  .uni-swipe_button {
    border-radius: 26rpx;
    margin: 0 10rpx;
    margin-top: 20rpx;
  }
}

.edit-group-input {
  .input-item {
    margin-top: 20rpx;
    .title {
      color: $grey-text-color;
    }
    .input {
      text-align: right;
      padding: 10rpx;
      margin-bottom: 16rpx;
    }
  }
  .input-desc {
    margin-top: 36rpx;
  }
}

.bottom-operate {
  width: 100%;
  position: absolute;
  bottom: 0;
}
</style>
