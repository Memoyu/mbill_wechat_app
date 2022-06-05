<template>
  <view class="b-container">
    <!-- 清单统计 -->
    <view class="list-header" id="list-header">
      <view class="list-title">{{ stat.groupName }}</view>
      <view class="list-group-time">{{ stat.time }}</view>
      <view class="list-stat">
        <view class="pre-order-stat">
          <view class="pre-order-stat-content">
            <view class="pre-order-stat-text">
              <text class="text">预购金额</text>
              <text class="total">{{ stat.amount }}</text>
            </view>
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

    <!-- 预购清单列表 -->
    <view class="list-content">
      <scroll-view
        :style="{
          height: scrollHeight + 'px',
        }"
        scroll-y="true"
        @scrolltolower="lowerBottom"
      >
        <uni-swipe-action ref="swipeAction">
          <uni-swipe-action-item
            v-for="(o, ind) in orders"
            :key="ind"
            :right-options="o.status == 0 ? doneSwipeOps : unDoneSwipeOps"
            @click="handleSwipeClick($event, o)"
          >
            <view class="list-content-items">
              <mb-po-item :order="o" @select="handleSelected" />
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>
        <mb-b-empty v-if="orders.length <= 0" />
        <view style="height: 50px" />
      </scroll-view>
    </view>
    <!-- 编辑弹窗 -->
    <mb-b-edit-dialog
      ref="editOrderDialog"
      class="edit-order-dialog"
      @change="handleDialogChange"
      @ltap="handleReqEditOrder"
    >
      <view class="input-item x-bc">
        <text class="title">金额</text>
        <input
          type="digit"
          class="input"
          v-model="order.amount"
          placeholder="0.0"
        />
      </view>
      <view class="input-item x-bc">
        <text class="title">预购日期</text>
        <picker
          class="date-picker"
          mode="date"
          @change="handlePickerChange"
          fields="day"
          :value="pickerDate"
        >
          <view class="now-date x-c">
            <text
              >{{ pickerDateText.year }}年{{ pickerDateText.month }}月{{
                pickerDateText.day
              }}日</text
            >
          </view>
        </picker>
      </view>
      <view class="input-item x-bc">
        <text class="title">预购描述</text>
        <input
          type="text"
          class="input"
          v-model="order.description"
          placeholder="描述一下咯"
        />
      </view>
    </mb-b-edit-dialog>
    <!-- 底部按钮 -->
    <view class="bottom-operate" id="bottom-operate">
      <mb-b-bottom-btn onlyone="true" @ltap="handleAddOrder" ltext="新建预购" />
    </view>
  </view>
</template>

<script>
import {
  DEL_INDEX_BILL,
  GROUP_INDEX_ADD_PRE_ORDER,
  GROUP_INDEX_DEL_PRE_ORDER,
  GROUP_INDEX_MODIFY_PRE_ORDER_STATUS,
  GROUP_INDEX_MODIFY_PRE_ORDER_AMOUNT,
  PROFILE_BILL_STAT_PRE_ORDER_AMOUNT,
} from "@/store/type";
import datetime from "@/common/utils/datetime";

export default {
  data() {
    return {
      groupId: 0,
      scrollHeight: 0,
      dialogOptions: {
        ltext: "新建",
        onlyone: true,
      },
      stat: {
        groupName: "分组",
        time: "周五-2022-06-03日",
        amount: 0,
        done: 0,
        unDone: 0,
      },
      orders: [],
      order: {
        description: "",
      },
      pickerDate: datetime.getCurDate(),
      pickerDateText: {
        year: datetime.getCurYear(),
        month: datetime.getCurMonth(),
        day: datetime.getCurDay(),
      },
      page: {
        page: 1,
        size: 15,
      },
      pageTotal: 0,
      loading: false,
      doneSwipeOps: [
        {
          text: "已购",
          style: {
            backgroundColor: "#47A271",
          },
        },
        {
          text: "删除",
          style: {
            backgroundColor: "rgb(255,58,49)",
          },
        },
      ],
      unDoneSwipeOps: [
        {
          text: "重置",
          style: {
            backgroundColor: "#C24F50",
          },
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
  onShow() {},
  onLoad(options) {
    this.groupId = options.id;
    this.initData();
  },
  onReady() {
    this.dynamicHeight();
  },
  methods: {
    initData() {
      this.getPreOrders(true);
      this.getGroupPreOrderStat();
    },

    // 完成预购转账单后回调
    completedToBillCallback(id, billId) {
      console.log("转换完成回调");
      let order = {};
      this.orders.forEach((o, i) => {
        if (o.id == id) {
          order = o;
          this.orders[i].billId = billId;
        }
      });

      this.editPreOrderStatus(order, 1);
    },

    //#region 接口调用

    // 获取分组预购统计
    getGroupPreOrderStat() {
      this.$api
        .groupPreOrderStat({
          id: this.groupId,
        })
        .then((res) => {
          // console.log("列表", res);
          if (res.data.code === 0) {
            this.stat = res.data.result;
          }
        });
    },

    // 获取预购列表
    getPreOrders(init = false) {
      if (this.loading) return;
      this.loading = true;
      this.$api
        .groupPreOrders({
          id: this.groupId,
          ...this.page,
        })
        .then((res) => {
          // console.log("列表", res);
          if (res.data.code === 0) {
            let result = res.data.result;
            this.pageTotal = result.total;
            if (!init || this.orders.length > 0) {
              this.orders = this.orders.concat(result.items);
            } else {
              this.orders = result.items;
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 新增预购
    addPreOrder(order) {
      this.$api.addPreOrder(order).then((res) => {
        if (res.data.code === 0) {
          // console.log(res);
          this.$refs.editOrderDialog.hide();
          this.addLocalItem(res.data.result);
        } else {
          this.$tip.alert(res.data.message);
        }
      });
    },

    // 编辑预购状态
    editPreOrderStatus(order, status) {
      this.$api
        .editPreOrderStatus({ id: order.id, billId: order.billId, status })
        .then((res) => {
          if (res.data.code === 0) {
            // console.log(res);
            this.$refs.editOrderDialog.hide();
            this.updateLocalStatus(order, status);
          } else {
            this.$tip.alert(res.data.message);
          }
        });
    },

    // 编辑预购
    editPreOrder(order) {
      this.$api.editPreOrder(order).then((res) => {
        if (res.data.code === 0) {
          // console.log(res);
          this.$refs.editOrderDialog.hide();
          this.updateLocalItem(res.data.result);
        } else {
          this.$tip.alert(res.data.message);
        }
      });
    },

    // 删除预购
    delPreOrder(order) {
      this.$api.delPreOrder(order.id).then((res) => {
        if (res.data.code === 0) {
          // console.log(res);
          this.$refs.editOrderDialog.hide();
          this.delLocalItem(order);
        } else {
          this.$tip.alert(res.data.message);
        }
      });
    },

    // 调整本地数据(主要为状态变更)
    updateLocalStatus(order, status) {
      try {
        for (let i = 0; i < this.orders.length; i++) {
          if (order.id == this.orders[i].id) {
            this.orders[i].status = status;
            throw new Error("Ok"); // 跳出循环
          }
        }
      } catch (e) {}
      if (status == 0) {
        this.stat.done -= 1;
        this.stat.unDone += 1;
      } else if (status == 1) {
        this.stat.done += 1;
        this.stat.unDone -= 1;
      }
      this.$store.commit(GROUP_INDEX_MODIFY_PRE_ORDER_STATUS, order);
    },

    // 调整本地数据(主要为新增后各项数据的增加)
    addLocalItem(order) {
      this.orders.unshift(order);
      this.stat.unDone += 1;
      let amount = order.amount;
      this.stat.amount = (this.stat.amount + amount).fixed(2);
      this.$store.commit(GROUP_INDEX_MODIFY_PRE_ORDER_AMOUNT, {
        groupId: order.groupId,
        amount,
        op: 0,
      });
      this.$store.commit(PROFILE_BILL_STAT_PRE_ORDER_AMOUNT, {
        amount,
        op: 0,
      });
      this.$store.commit(GROUP_INDEX_ADD_PRE_ORDER, order);
    },

    // 调整本地数据(主要为金额等变更)
    updateLocalItem(newOrder) {
      let oldOrder = null;
      try {
        for (let i = 0; i < this.orders.length; i++) {
          if (newOrder.id == this.orders[i].id) {
            oldOrder = this.orders[i];
            this.orders[i] = newOrder;
            throw new Error("Ok"); // 跳出循环
          }
        }
      } catch (e) {}
      if (oldOrder == null) return;
      let diff = Math.abs(
        Number(oldOrder.amount) - Number(newOrder.amount)
      ).fixed(2);
      // console.log("diff", oldOrder, newOrder, diff);
      let groupId = newOrder.groupId;
      if (oldOrder.amount < newOrder.amount) {
        this.stat.amount += diff;
        this.$store.commit(GROUP_INDEX_MODIFY_PRE_ORDER_AMOUNT, {
          groupId,
          amount: diff,
          op: 0,
        });
        this.$store.commit(PROFILE_BILL_STAT_PRE_ORDER_AMOUNT, {
          amount: diff,
          op: 0,
        });
      } else if (oldOrder.amount > newOrder.amount) {
        this.stat.amount -= diff;
        this.$store.commit(GROUP_INDEX_MODIFY_PRE_ORDER_AMOUNT, {
          groupId,
          amount: diff,
          op: 1,
        });
        this.$store.commit(PROFILE_BILL_STAT_PRE_ORDER_AMOUNT, {
          amount: diff,
          op: 1,
        });
      }
    },

    // 调整本地数据(主要为数据移除)
    delLocalItem(order) {
      // console.log("删除", order);
      try {
        for (let i = 0; i < this.orders.length; i++) {
          if (order.id == this.orders[i].id) {
            // console.log("找到了");
            this.orders.splice(i, 1);
            throw new Error("Ok"); // 跳出循环
          }
        }
      } catch (e) {}

      // 减少金额
      this.stat.amount -= order.amount;
      this.$store.commit(GROUP_INDEX_MODIFY_PRE_ORDER_AMOUNT, {
        groupId: order.groupId,
        amount: order.amount,
        op: 1,
      });
      this.$store.commit(PROFILE_BILL_STAT_PRE_ORDER_AMOUNT, {
        amount: order.amount,
        op: 1,
      });
      // 减少完成或未完成
      if (order.status == 0) {
        this.stat.unDone -= 1;
      } else if (order.status == 1) {
        this.stat.done -= 1;
      }
      this.$store.commit(GROUP_INDEX_DEL_PRE_ORDER, order);
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
          query.select("#list-header").fields({ size: true });
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

    // 新建预购
    handleAddOrder() {
      this.dialogOptions.ltext = "新建";
      this.$refs.editOrderDialog.show(this.dialogOptions);
    },

    // 选中预购项触发
    handleSelected(order) {
      this.dialogOptions.ltext = "编辑";
      this.order = order;
      this.$refs.editOrderDialog.show(this.dialogOptions);
    },

    // 弹窗变更
    handleDialogChange({ show }) {
      if (!show) this.order = {};
    },

    // 编辑弹窗触发
    handleReqEditOrder() {
      var amtreg = /^\d+(\.\d{1,2})?$/;
      if (!amtreg.test(this.order.amount)) {
        this.$tip.toast("请输入正确的金额格式");
        return;
      }

      if (!this.order.description || this.order.description == "") {
        this.$tip.toast("请输入预购描述");
        return;
      }
      if (this.order.description.length > 200) {
        this.$tip.toast("预购描述不超过40个字符");
        return;
      }
      // console.log(this.dialogOptions.ltext);
      this.order.time = this.pickerDate;
      this.order.groupId = this.groupId;
      if (this.dialogOptions.ltext == "新建") {
        this.addPreOrder(this.order);
      } else {
        this.editPreOrder(this.order);
      }
    },

    // 选择日期
    handlePickerChange({ detail }) {
      // console.log(detail.value);
      let d = new Date(detail.value);
      this.pickerDate = datetime.getCurDate(d);
      this.pickerDateText = datetime.getCurDateObj(d);
    },

    // scroll触底事件
    lowerBottom() {
      // console.log("触底加载");
      if (this.page.page * this.page.size >= this.pageTotal) return;
      // console.log("加载");
      this.page.page += 1;
      this.getPreOrders();
    },

    // 滑动操作触发
    handleSwipeClick(e, o) {
      // console.log(e);
      if (e.index == 0) {
        // 修改状态
        if (e.content.text == this.doneSwipeOps[0].text)
          this.$Router.push({ name: "bill-edit", params: { order: o.id } });
        else if (e.content.text == this.unDoneSwipeOps[0].text) {
          this.editPreOrderStatus(o, 0);
          // 删除首页指定的账单
          this.$store.commit(DEL_INDEX_BILL, o.billId);
        }
      } else if (e.index == 1) {
        let that = this;
        // 删除
        this.$tip.choose("是否删除该条预购？", {}, "提示").then(async () => {
          that.delPreOrder(o);
        });
      }
    },
    //#endregion
  },
};
</script>

<style lang="scss" scope>
.list-header {
  background-color: $light-color;
  width: 100%;
  border-radius: 0 0 15px 15px;
  .list-title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
  .list-group-time {
    text-align: center;
    color: $grey-text-color;
  }
  .list-stat {
    // background-color: $light-color;
    padding: 10px;
    align-items: center;
    .pre-order-stat {
      display: flex;
      flex-direction: column;
      .pre-order-stat-content {
        display: flex;
        justify-content: space-around;
      }
    }

    .pre-order-stat-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 80px;

      .text {
        font-size: 15px;
      }
      .total {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
}
.list-content {
  width: 95%;
  .list-content-items {
    margin-top: 10px;
    padding: 5px 0;
    border-radius: 13px;
    background: white;
  }
  .uni-swipe_button {
    border-radius: 13px;
    margin: 0 5px;
    margin-top: 10px;
  }
}

.edit-order-dialog {
  margin: 15px;
  .input-item {
    margin-top: 10px;
    .title {
      color: $grey-text-color;
    }
    .input {
      text-align: right;
      padding: 5px;
      margin-bottom: 8px;
    }
  }
  .input-desc {
    margin-top: 18px;
  }
}

.bottom-operate {
  width: 100%;
  position: absolute;
  bottom: 0;
}
</style>
