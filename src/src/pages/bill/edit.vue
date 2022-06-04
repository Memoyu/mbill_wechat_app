<template>
  <view>
    <view class="container">
      <!-- 账单类型、时间 -->
      <view class="header" id="edit-header">
        <view class="type-content">
          <view
            v-for="(type, index) in typeList"
            :key="index"
            :class="[
              'item',
              model.type == type.id ? `item-select ${type.color}` : '',
            ]"
            @tap="handlerTypeSelected(type)"
            >{{ type.title }}</view
          >
        </view>
        <view class="date-content x-start">
          <picker
            class="date-picker"
            mode="date"
            @change="handlerDatePicker"
            fields="day"
            :value="date"
            :end="pickerEnd"
          >
            <view class="x-ac date">
              <text> {{ selectedDateText }}</text>
            </view>
          </picker>
          <picker
            class="time-picker"
            mode="time"
            @change="handlerTimePicker"
            :value="model.time"
          >
            <view class="x-ac time">
              <text> {{ model.time }}</text>
              <i class="iconfont icon-bottom icon-down" />
            </view>
          </picker>
        </view>
      </view>

      <!-- 输入金额 -->
      <view class="amount" id="edit-amount">
        <view class="amount-input">
          <text :class="['char', typeColor]">￥</text>
          <view class="total y-start">
            <view :class="['large-font', typeColor]">{{ model.amount }}</view>
            <scroll-view
              class="input"
              scroll-x="true"
              :scroll-left="inputTextLeng"
            >
              <text class="input-amount-text" id="input-amount-text"
                >{{ input }}
              </text>
            </scroll-view>
          </view>
        </view>
        <mb-b-end-split-line />
      </view>

      <!-- 账单分类选择 -->
      <view>
        <scroll-view
          class="category-groups"
          :style="{
            height: scrollHeight + 'px',
          }"
          scroll-y="true"
        >
          <mb-ca-group
            :select="model.categoryId"
            :groups="categoryGroups"
            @selected="handlerSelectedCategory"
          />
        </scroll-view>
      </view>

      <!-- 数字键盘 -->
      <view class="key-board-container" id="edit-key-board-container">
        <view class="location x-start">
          <i
            :class="[
              'iconfont',
              'icon-location',
              'icon',
              !locationStatus ? 'icon-color' : '',
            ]"
            @click="handlerSwitchChange"
            @longtap="handlerSwitchLongtap"
          />
          <input
            type="text"
            class="input-text"
            v-model="model.address"
            placeholder="地址"
          />
        </view>
        <view class="key-board-header x-start">
          <view class="x-ac choose-asset" @tap="handlerChooseAsset">
            <i class="iconfont icon-assets icon" />
            <text class="text">{{ model.asset }}</text>
          </view>
          <view class="x-ac">
            <i class="iconfont icon-edit icon" />
            <input
              type="text"
              class="input-text"
              v-model="model.description"
              placeholder="备注"
            />
          </view>
        </view>
        <mb-b-keyboard
          ref="keyboard"
          :pnum="initAmount"
          @confirm="handlerConfirmNum"
          @input="handlerInputNum"
        />
      </view>

      <!-- 账单账户弹窗 -->
      <uni-popup ref="assetPopup" type="bottom">
        <view class="asset-popup">
          <scroll-view class="asset-list" scroll-y="true">
            <mb-as-group
              :select="model.assetId"
              :groups="assetGroups"
              @selected="handlerSelectedAsset"
            />
          </scroll-view>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script>
import { mapActions } from "vuex";
import Location from "@/common/utils/location";
import { LOCATION_STATUS } from "@/common/utils/constants";
import datetime from "@/common/utils/datetime";
import { ADD_INDEX_BILL, MODIFY_INDEX_BILL } from "@/store/type";

const now = new Date();
export default {
  data() {
    return {
      isOrder: false, // 是否为预购转账单
      order: {}, // 预购信息
      bill: {
        id: 0,
        type: 0,
        amount: 0,
        categoryId: 0,
        assetId: 0,
        description: "",
        address: "",
        time: "",
      },
      model: {
        id: 0,
        type: 0,
        categoryId: 0,
        assetId: 0,
        asset: "选择账户",
        description: "",
        address: "",
        amount: "0",
        time: `${now.getHours()}:${now.getMinutes()}`,
      },
      date: datetime.getCurDate(),
      initAmount: "0",
      typeColor: "",
      typeList: [
        { id: 0, title: "支出", color: "expend-color" },
        { id: 1, title: "收入", color: "income-color" },
      ],
      pickerEnd: datetime.getCurDate(),
      selectedDateText: "今日",
      inputTextLeng: 0,
      input: "",
      scrollHeight: 0,
      categoryGroups: [],
      assetGroups: [],
      locationStatus: uni.getStorageSync(LOCATION_STATUS) || false,
    };
  },
  onLoad(option) {
    // console.log(option);
    this.initData();

    // 校验是否为预购过来的
    if (option.order != undefined) {
      console.log("预购Id", option.order);
      this.isOrder = true;
      this.getPreOrder(option.order);
    }

    // console.log(option.id);
    if (option.id == undefined) {
      if (this.locationStatus) this.getLocation();
    } else {
      this.getBillDetail(option.id);
    }
  },
  onShow() {},
  onReady() {
    this.dynamicHeight();
  },

  watch: {
    "model.type"(val) {
      console.log("账单类型变更", val);
      let type = this.typeList[val];
      // this.model.type = type.id;
      this.typeColor = type.color;
      this.getCategoryGroups();
    },
    date(val) {
      console.log("日期变更", val);
      let date = new Date(val);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (
        year == now.getFullYear() &&
        month == now.getMonth() + 1 &&
        day == now.getDate()
      ) {
        this.selectedDateText = "今日";
      } else if (year == now.getFullYear()) {
        this.selectedDateText = month + "月" + day + "日";
      } else {
        this.selectedDateText = year + "年" + month + "月" + day + "日";
      }
    },
  },

  methods: {
    ...mapActions(["modifyIndexBill"]),
    // 初始化数据
    initData() {
      this.typeColor = this.typeList[0].color;
      this.getCategoryGroups();
    },

    //#region 接口请求

    // 获取账单详情
    getPreOrder(id) {
      this.$api
        .getPreOrder({
          id: id,
        })
        .then((res) => {
          if (res.data.code === 0) {
            console.log("预购信息", res.data.result);
            let result = res.data.result;
            this.model.description = result.description;
            this.model.amount = result.amount;
            this.initAmount = result.amount;
            this.order = result;
            // let dateTime = new Date(result.time);
            // this.date = datetime.getCurDate(dateTime);
            // this.model.time = `${dateTime.getHours()}:${dateTime.getMinutes()}`;
          } else {
            this.$tip.error(res.data.message);
            this.isOrder = false;
          }
        });
    },

    // 获取账单详情
    getBillDetail(id) {
      this.$api
        .billDetail({
          id: id,
        })
        .then((res) => {
          if (res.data.code === 0) {
            let result = res.data.result;
            this.model = result;
            this.initAmount = result.amount;
            let dateTime = new Date(result.time);
            this.date = datetime.getCurDate(dateTime);
            this.model.time = `${dateTime.getHours()}:${dateTime.getMinutes()}`;
          }
        });
    },

    // 获取账单分类
    getCategoryGroups() {
      this.$api.categoryGroups({ type: this.model.type }).then((res) => {
        if (res.data.code === 0) {
          this.categoryGroups = res.data.result;
        }
      });
    },

    // 获取账单账户
    getAssetGroups() {
      this.$api.assetGroups().then((res) => {
        if (res.data.code === 0) {
          this.assetGroups = res.data.result;
        }
      });
    },

    //#endregion

    //#region 组件初始化

    // 计算高度，动态调整scroll 高度
    dynamicHeight() {
      let that = this;
      uni.getSystemInfo({
        success(res) {
          let pH = res.windowHeight;
          let query = uni.createSelectorQuery().in(that);
          query.select("#edit-header").fields({ size: true });
          query.select("#edit-amount").fields({ size: true });
          query.select("#edit-key-board-container").fields({ size: true });
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

    // 滚动输入的表达式，始终展示最后
    scrollInputText() {
      uni
        .createSelectorQuery()
        .select("#input-amount-text")
        .boundingClientRect((res) => {
          // console.log(res);
          this.inputTextLeng = res.right;
        })
        .exec();
    },

    // 账单类型选择
    handlerTypeSelected(type) {
      if (this.isOrder && type.id == 1) {
        this.$tip.toast("预购无法转成收入类型");
        return;
      }
      this.model.type = type.id;
      this.model.categoryId = 0;
    },

    // 日期选择
    handlerDatePicker({ detail }) {
      // console.log(this.model.date);
      this.date = detail.value;
      this.model.date = detail.value;
    },

    // 时间选择
    handlerTimePicker({ detail }) {
      this.model.time = detail.value;
    },

    // 弹出账户选择
    handlerChooseAsset() {
      this.getAssetGroups();
      this.$refs.assetPopup.open();
    },

    // 键盘输入
    handlerInputNum(e) {
      // console.log(e);
      this.input = e.input;
      this.model.amount = e.result;
      this.scrollInputText();
      // console.log(this.$refs);
    },

    // 键盘确认
    handlerConfirmNum() {
      this.bill = {
        id: this.model.id,
        type: this.model.type,
        amount: Number(this.model.amount),
        categoryId: this.model.categoryId,
        assetId: this.model.assetId,
        description: this.model.description,
        address: this.model.address,
        time: `${this.date} ${this.model.time}`,
      };

      if (this.bill.amount === 0 || isNaN(this.bill.amount)) {
        this.$tip.toast("金额不能为零");
        return false;
      }

      if (this.bill.categoryId <= 0) {
        this.$tip.toast("请选择分类");
        return false;
      }

      if (this.bill.assetId <= 0) {
        this.$tip.toast("请选择账户");
        return false;
      }

      if (this.bill.id <= 0) {
        this.$api.addBill(this.bill).then((res) => {
          if (res.data.code === 0) {
            let bill = res.data.result;
            // console.log("添加成功", { bill, date: this.bill.time });
            this.$store.commit(ADD_INDEX_BILL, { bill, date: this.bill.time });
            // 如果是预购转账单，此处需要处理
            this.orderToBill(bill.id);
            this.$Router.back();
          } else {
            this.$tip.error(res.data.message);
          }
        });
      } else {
        this.$api.editBill(this.bill).then((res) => {
          if (res.data.code === 0) {
            let bill = res.data.result;
            // console.log("编辑成功", { bill, date: this.bill.time });
            this.modifyIndexBill({
              bill,
              date: this.bill.time,
            });
            this.$Router.back();
          } else {
            this.$tip.error(res.data.message);
          }
        });
      }
      // console.log("cof ", this.bill);
    },

    // 预购转账单处理
    orderToBill(billId) {
      // 先校验，是否为预购
      if (!this.isOrder) return;
      // 获取上一个页面（如果账单过来，必须是预购列表页面），并调用其方法
      let pages = getCurrentPages(); //获取页面栈
      let beforePage = pages[pages.length - 2]; //上一页
      console.log(beforePage);
      beforePage.$vm.completedToBillCallback(this.order.id, billId); //直接调用上一页的方法
    },

    // 选中账单分类
    handlerSelectedCategory(item) {
      this.model.categoryId = item.id;
    },

    // 选中账单账户
    handlerSelectedAsset(item) {
      this.model.assetId = item.id;
      this.model.asset = item.name;
      this.$refs.assetPopup.close();
    },

    // 位置信息获取开关切换(点击获取)
    handlerSwitchChange() {
      // console.log("获取位置", this.locationStatus);
      if (this.locationStatus) {
        this.getLocation();
      }
    },

    // 位置信息获取开关切换(长按开关)
    handlerSwitchLongtap() {
      // console.log("长按");
      this.locationStatus = !this.locationStatus;
      uni.setStorageSync(LOCATION_STATUS, this.locationStatus);
      if (this.locationStatus) {
        this.getLocation();
        this.$tip.toast("自动获取地址信息已开启");
      } else {
        // 关闭获取地理位置
        // this.model.address = "";
        this.$tip.toast("自动获取地址信息已关闭");
      }
    },

    // 获取定位地址
    getLocation() {
      Location.getLocation().then((res) => {
        console.log("位置信息", res);
        this.model.address = res.address;
      });
    },

    //#endregion
  },
};
</script>

<style lang="scss" scope>
.header {
  padding: 0 10px;
  background: $light-color;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .type-content {
    font-size: 15px;
    width: 140px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .item {
      color: $light-text-color;
      padding: 5px 15px;
      border: 1rpx solid $bright-color;
      border-radius: 30rpx;
    }
    .item-select {
      font-weight: bold;
      background: $bright-color;
    }
  }
  .date-content {
    background: $bright-color;
    border-radius: 30rpx;
    font-size: 15px;
    .date-picker {
      .date {
        padding: 3px 4px 3px 8px;
      }
    }

    .time-picker {
      .time {
        border-left: solid $light-color 1px;
        align-items: baseline;
        padding: 3px 8px 3px 3px;
      }
      .icon-down {
        font-size: 10px;
        margin-left: 5px;
      }
    }
  }
}
.amount {
  background: $light-color;
  padding: 0 10px;
  margin-bottom: 5px;
  background-image: radial-gradient();
  .amount-input {
    display: flex;
    // align-items: flex-start;
    align-items: baseline;
  }
  .char {
    font-size: 20px;
    font-weight: bold;
  }
  .total {
    width: 100%;
    overflow: hidden;
  }
  .large-font {
    height: 40px;
    font-size: 30px;
    font-weight: bold;
  }

  .input {
    white-space: nowrap;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    height: 22px;
    margin-bottom: 8px;
    .input-amount-text {
      display: inline-block;
      flex-shrink: 0;
      position: relative;
      display: inline-block;
      background-size: contain;
      background-repeat: no-repeat;
    }
    ::-webkit-scrollbar {
      display: none;
      width: 0 !important;
      height: 0 !important;
      -webkit-appearance: none;
      background: transparent;
    }
  }
}

.key-board-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  .location {
    padding: 10px 10px 0 10px;
    background: #fff;
  }
  .key-board-header {
    padding: 10px 10px 0 10px;
    background: #fff;
    .choose-asset {
      margin-right: 20px;
    }
    .text {
      color: $primary-color;
      display: -webkit-box; /*弹性伸缩盒子模型显示*/
      -webkit-box-orient: vertical; /*排列方式*/
      -webkit-line-clamp: 1; /*显示文本行数(这里控制多少行隐藏)*/
      overflow: hidden; /*溢出隐藏*/
    }
  }
  .input-text {
    width: 100%;
  }
}
.asset-popup {
  background-color: #fff;
  border-radius: 10rpx;
  .asset-list {
    padding: 10px 0;
    height: 350px;
  }
}

.icon {
  color: $primary-color;
  margin-right: 10px;
  font-size: 20px;
}
.icon-color {
  color: $bright-color;
}
</style>
