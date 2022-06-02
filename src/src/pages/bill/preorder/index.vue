<template>
  <view class="b-container">
    <!-- 头部操作 -->
    <view class="header">
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
              <text class="total">￥{{ stat.amount }}</text>
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
    <!-- 底部按钮 -->
    <view class="add-pre-order-group" @click="handlerAddGroup"
      >新建预购分组</view
    >
    <!-- 弹窗 -->
    <uni-popup ref="addGroupDialog" type="dialog">
      <uni-popup-dialog
        mode="input"
        title="新建预购组"
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
      inputGroup: {},
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
  onShow() {},
  onLoad() {
    this.initData();
  },
  methods: {
    ...mapActions(["getPreOrderGroups"]),
    // 初始化数据
    initData() {
      this.getGroups(true);
    },

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
      console.log(this.inputGroup);
      if (this.inputGroup.name == "" || this.inputGroup.name.length > 20) {
        this.$tip.toast("请输入分组名称");
        return;
      }
      if (this.inputGroup.name == "" || this.inputGroup.name.length > 20) {
        this.$tip.toast("分组名称不超过20个字符");
        return;
      }
      if (
        this.inputGroup.description != undefined &&
        this.inputGroup.description.length > 200
      ) {
        this.$tip.toast("分组描述不超过200个字符");
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
  },
};
</script>

<style lang="scss" scope>
.header {
  width: 100%;
  .date-title {
    height: 70px;
    background-color: $light-color;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 15px;
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
.add-pre-order-group {
  position: absolute;
  bottom: 5%;
  font-weight: bold;
  color: $dark-color;
  text-align: center;
  border-radius: 20px;
  background-color: $primary-color;
  padding: 10px 0;
  width: 70%;
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
