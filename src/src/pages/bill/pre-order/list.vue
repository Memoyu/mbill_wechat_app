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
            @click="handlerSwipeClick($event, o)"
          >
            <view class="list-content-items">
              <mb-po-item :order="o" @select="handlerSelected" />
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>
        <mb-b-empty v-if="orders.length <= 0" />
      </scroll-view>
    </view>
    <!-- 编辑弹窗 -->
    <mb-b-edit-dialog
      ref="editOrderDialog"
      class="edit-order-dialog"
      @ltap="handlerReqEditOrder"
    >
      <view class="input-item x-bc">
        <text class="title">金额</text>
        <input
          type="text"
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
          @change="handlerPickerChange"
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
      <mb-b-bottom-btn
        onlyone="true"
        @ltap="handlerAddOrder"
        ltext="新建预购"
      />
    </view>
  </view>
</template>

<script>
import datetime from "@/common/utils/datetime";

export default {
  data() {
    return {
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
    this.order.groupId = options.id;
    this.initData();
  },
  onReady() {
    this.dynamicHeight();
  },
  methods: {
    //#region 接口调用

    initData() {
      this.getPreOrders();
      this.getGroupPreOrderStat();
    },
    getGroupPreOrderStat() {
      this.$api
        .groupPreOrderStat({
          id: this.order.groupId,
        })
        .then((res) => {
          // console.log("列表", res);
          if (res.data.code === 0) {
            this.stat = res.data.result;
          }
        });
    },
    getPreOrders() {
      this.$api
        .groupPreOrders({
          id: this.order.groupId,
          ...this.page,
        })
        .then((res) => {
          // console.log("列表", res);
          if (res.data.code === 0) {
            let result = res.data.result;
            this.pageTotal = result.total;
            this.orders = result.items;
          }
        });
    },

    // 新增预购
    addPreOrder(order) {
      this.$api.addPreOrder(order).then((res) => {
        if (res.data.code === 0) {
          // console.log(res);
          this.$refs.editOrderDialog.hide();
          this.order = {};
          this.orders.unshift(res.data.result);
          this.stat.unDone += 1;
          this.stat.amount += Number(order.amount).fixed(2);
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
          this.order = {};
          this.orders.forEach((o) => {
            if (order.id == o.id) {
              o = res.data.res;
            }
          });
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
          query.select("#list-header").fields({ size: true });
          // query.select("#bottom-operate").fields({ size: true });
          query.exec((data) => {
            console.log(data);
            data.map((i) => {
              that.scrollHeight += i.height;
            });
            that.scrollHeight = pH - that.scrollHeight;
          });
        },
      });
    },

    // 新建预购
    handlerAddOrder() {
      this.dialogOptions.ltext = "新建";
      this.$refs.editOrderDialog.show(this.dialogOptions);
    },

    // 选中预购项触发
    handlerSelected(order) {
      this.dialogOptions.ltext = "编辑";
      this.order = order;
      this.$refs.editOrderDialog.show(this.dialogOptions);
    },

    // 编辑弹窗触发
    handlerReqEditOrder() {
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
      console.log(this.dialogOptions.ltext);
      this.order.time = this.pickerDate;
      if (this.dialogOptions.ltext == "新建") {
        this.addPreOrder(this.order);
      } else {
        this.editPreOrder(this.order);
      }
    },

    // scroll触底事件
    lowerBottom() {},

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
