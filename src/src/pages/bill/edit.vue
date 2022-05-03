<template>
  <view>
    <view class="content">
      <view class="header">
        <view class="type">
          <view
            v-for="(type, index) in typeList"
            :key="index"
            :class="['item', selectedType == type.value ? 'item-select' : '']"
            @tap="handlerTypeSelected(type.value)"
            >{{ type.title }}</view
          >
        </view>
        <picker
          class="time-picker"
          mode="date"
          @change="handlerPicker"
          fields="day"
          :value="selectedDate"
          :end="pickerEnd"
        >
          <view class="x-ac date">
            <text> {{ selectedDateText }}</text>
            <i
              class="iconfont icon-bottom"
              style="margin-left: 3px; font-size: 12px"
            />
          </view>
        </picker>
      </view>
      <view class="amount">
        <view class="x-start">
          <text class="total">￥</text>
          <view class="y-start">
            <view class="total">{{ inputResult }}</view>
            <view class="input">{{ input }}</view>
          </view>
        </view>
        <mbill-end-split-line count="50" />
      </view>
      <view class="key-board">
        <view class="x-start">
          <view class="x-ac choose-asset" @tap="handlerChooseAsset">
            <i class="iconfont icon-assets icon" />
            <text class="text">选择账户</text>
          </view>
          <view class="x-ac">
            <i class="iconfont icon-edit icon" />
            <input type="text" placeholder="备注" />
          </view>
        </view>
        <mbill-keyboard
          ref="keyboard"
          :pnum="inputResult"
          @confirm="handlerConfirmNum"
          @input="handlerInputNum"
        />
      </view>
      <view>
        <scroll-view
          class="items"
          :style="{
            height: scrollHeight + 'px',
          }"
          scroll-y="true"
        >
          <p v-for="(item, index) in Array(100).fill(1)" :key="index">
            这是账单类型 {{ index }}
          </p>
        </scroll-view>
      </view>
      <uni-popup ref="popupHi" type="bottom">
        <view class="popup-box">
          <scroll-view class="items" scroll-y="true">
            <p v-for="(item, index) in Array(100).fill(1)" :key="index">
              这是账户列表 {{ index }}
            </p>
          </scroll-view>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script>
import mbillEndSplitLine from "../../components/base/mbill-end-split-line.vue";
const now = new Date();

export default {
  components: { mbillEndSplitLine },
  data() {
    return {
      selectedType: 0,
      typeList: [
        { value: 0, title: "支出" },
        { value: 1, title: "收入" },
      ],
      pickerEnd: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      selectedDateText: "今日",
      selectedDate: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      },
      input: "",
      inputResult: "24",
      scrollHeight: 0,
      assetList: [],
    };
  },
  onLoad() {
    this.dynamicHeight();
  },
  onShow() {},
  methods: {
    dynamicHeight() {
      let that = this;
      uni.getSystemInfo({
        success(res) {
          let pH = res.windowHeight;
          let h = 0;
          let query = uni.createSelectorQuery().in(that);
          query.select(".header").fields({ size: true });
          query.select(".amount").fields({ size: true });
          query.select(".key-board").fields({ size: true });
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
    handlerTypeSelected(type) {
      this.selectedType = type;
    },
    handlerPicker(e) {
      console.log(e);
      let date = new Date(e.detail.value);
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
    handlerChooseAsset() {
      this.$refs.popupHi.open();
    },
    handlerInputNum(e) {
      console.log(e);
      this.input = e.input;
      this.inputResult = e.result;
    },
    handlerConfirmNum(e) {
      console.log("cof " + e);
    },
  },
};
</script>

<style lang="scss" scope>
.header {
  padding: 10px 10px;
  background: $bright-color;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .type {
    width: 130px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .item {
      color: $grey-text-color;
      padding: 3px 8px;
      border: 1rpx solid $grey-text-color;
      border-radius: 30rpx;
    }
    .item-select {
      color: $primary-text-color;
      background: $grey-text-color;
    }
  }
  .date {
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 30rpx;
    background: $grey-text-color;
  }
}
.amount {
  background: $bright-color;
  padding: 10px 15px 0 15px;
  background-image: radial-gradient();
  .total {
    height: 40px;
    font-size: 30px;
    font-weight: bold;
  }
  .input {
    height: 22px;
    margin-bottom: 8px;
  }
}

.choose-asset {
  margin-right: 20px;
}
.icon {
  margin: 0 10px;
  font-size: 20px;
}

.key-board {
  position: absolute;
  bottom: 0;
  padding-top: 7px;
}
.popup-box {
  text-align: center;
  background-color: #fff;
  padding: 30rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  .items {
    height: 350px;
  }
}
</style>
