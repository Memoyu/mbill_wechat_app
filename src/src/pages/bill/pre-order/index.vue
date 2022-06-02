<template>
  <view class="b-container">
    <!-- 头部操作 -->
    <view class="group-header" id="group-header">
      <view class="date-title" id="date-title">
        <picker
          class="date-picker"
          mode="date"
          @change="handlerPickerChange"
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
              <text class="text">预购金额</text>
              <text class="total">{{ stat.amount }}</text>
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
              <text class="total">{{ stat.undone }}</text>
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
        <view class="group-content-items" v-for="(g, ind) in groups" :key="ind">
          <mb-po-group-item :group="g" @edit="handlerEditGroup" />
        </view>
        <view style="height: 50px" />
        <mb-b-empty v-if="groups.length <= 0" />
      </scroll-view>
    </view>
    <!-- 底部按钮 -->
    <view class="bottom-operate" id="bottom-operate">
      <mb-b-bottom-btn
        onlyone="true"
        @ltap="handlerAddGroup"
        ltext="新建分组"
      />
    </view>
    <!-- 弹窗 -->
    <uni-popup ref="addGroupDialog" type="dialog">
      <uni-popup-dialog
        mode="input"
        :title="dialogTitle"
        placeholder="请输入分组名称"
        before-close="true"
        @confirm="handlerAddGroupDialogConfirm"
        @close="handlerAddGroupDialogClose"
      >
        <view class="add-group-input y-bc">
          <input
            type="text"
            class="input"
            v-model="inputGroup.name"
            placeholder="分组名称"
          />
          <input
            type="text"
            class="input"
            v-model="inputGroup.description"
            placeholder="描述一下"
          />
        </view>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import { mapActions, mapState } from "vuex";
import datetime from "@/common/utils/datetime";

export default {
  data() {
    return {
      scrollHeight: 0,
      dialogTitle: "新建预购组",
      inputGroup: {
        name: "",
        description: "",
      },
      pickerDate: datetime.getCurDate(),
      pickerDateText: {
        year: datetime.getCurYear(),
        month: datetime.getCurMonth(),
      },
      stat: {
        total: 0,
        amount: 0,
        done: 0,
        undone: 0,
      },
      page: {
        page: 1,
        size: 15,
      },
      pageTotal: 0,
      loading: false,
    };
  },
  computed: {
    ...mapState({
      groups: (state) => state.preOrder.preOrderGroups,
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
    ...mapActions(["getPreOrderGroups"]),
    // 初始化数据
    initData() {
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
    handlerPickerChange({ detail }) {
      // console.log(detail.value);
      let d = new Date(detail.value);
      this.date = datetime.getCurDateObj(d);
      this.pickerDate = datetime.getCurDate(d);
      this.pickerDateText = this.date;
      this.initData();
    },

    handlerAddGroup() {
      this.$refs.addGroupDialog.open();
    },

    handlerAddGroupDialogConfirm() {
      // console.log(this.inputGroup);
      if (!this.inputGroup.name || this.inputGroup.name == "") {
        this.$tip.toast("请输入分组名称");
        return;
      }
      if (this.inputGroup.name.length > 20) {
        this.$tip.toast("分组名称不超过10个字符");
        return;
      }
      if (
        this.inputGroup.description != "" &&
        this.inputGroup.description.length > 200
      ) {
        this.$tip.toast("分组描述不超过40个字符");
        return;
      }
      this.$api.addPreOrderGroup(this.inputGroup).then((res) => {
        if (res.data.code === 0) {
          // console.log(res);
          this.$refs.addGroupDialog.close();
          this.inputGroup = {};
        } else {
          this.$tip.alert(res.data.message);
        }
      });
    },

    handlerAddGroupDialogClose() {
      this.$refs.addGroupDialog.close();
    },

    // scroll触底事件
    lowerBottom() {},
    // 选中预购分组
    handlerEditGroup(group) {
      console.log("分组", group);
      this.dialogTitle = "编辑预购组";
      this.inputGroup = group;
      this.$refs.addGroupDialog.open();
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
    padding: 10px;
    align-items: center;
    border-radius: 0 0 15px 15px;

    .date-picker {
      width: 30%;
      .now-date-year {
        font-size: 15px;
        font-weight: bold;
      }
      .now-date-month {
        font-size: 25px;
        font-weight: bold;
        align-items: baseline;
      }
      .icon-down {
        font-size: 10px;
        margin-left: 5px;
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
        margin-bottom: 10px;
      }
      .bottom {
        margin-top: 10px;
      }
      .bottom-line {
        height: 1px;
        background: $bright-color;
        width: 100%;
      }
    }

    .pre-order-stat-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 80px;

      .text {
        font-size: 12px;
      }
      .total {
        font-size: 15px;
        font-weight: bold;
      }
    }
  }
}
.group-content {
  width: 95%;
  .group-content-items {
    margin-top: 10px;
    padding: 5px 0;
    border-radius: 13px;
    background: white;
  }
}
.bottom-operate {
  width: 100%;
  position: absolute;
  bottom: 0;
}
.add-group-input {
  width: 100%;
  .input {
    text-align: center;
    width: 100%;
    padding: 5px;
    margin-bottom: 8px;
    border-radius: 8px;
    border: 1px solid $grey-color;
  }
}
</style>
