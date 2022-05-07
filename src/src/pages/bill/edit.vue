<template>
  <view>
    <view class="content">
      <view class="header">
        <view class="type-content">
          <view
            v-for="(type, index) in typeList"
            :key="index"
            :class="['item', selectedType == type.value ? 'item-select' : '']"
            @tap="handlerTypeSelected(type.value)"
            >{{ type.title }}</view
          >
        </view>
        <view class="date-content x-start">
          <picker
            class="date-picker"
            mode="date"
            @change="handlerDatePicker"
            fields="day"
            :value="selectedDate"
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
            :value="selectedTime"
          >
            <view class="x-ac time">
              <text> {{ selectedTime }}</text>
              <i
                class="iconfont icon-bottom"
                style="margin-left: 3px; font-size: 12px"
              />
            </view>
          </picker>
        </view>
      </view>
      <view class="amount">
        <view class="x-start">
          <text class="large-font">￥</text>
          <view class="total y-start">
            <view class="large-font">{{ inputResult }}</view>
            <scroll-view
              class="input"
              scroll-x="true"
              :scroll-left="inputTextLeng"
            >
              <text class="input-text">{{ input }} </text>
            </scroll-view>
          </view>
        </view>
        <mb-base-end-split-line />
      </view>
      <view class="key-board-container">
        <view class="key-board-header x-start">
          <view class="x-ac choose-asset" @tap="handlerChooseAsset">
            <i class="iconfont icon-assets icon" />
            <text class="text">选择账户</text>
          </view>
          <view class="x-ac">
            <i class="iconfont icon-edit icon" />
            <input type="text" placeholder="备注" />
          </view>
        </view>
        <mb-b-keyboard
          ref="keyboard"
          :pnum="inputResult"
          @confirm="handlerConfirmNum"
          @input="handlerInputNum"
        />
      </view>
      <view>
        <scroll-view
          :style="{
            height: scrollHeight + 'px',
          }"
          scroll-y="true"
        >
          <mb-ca-group />
        </scroll-view>
      </view>
      <uni-popup ref="popupHi" type="bottom">
        <view class="popup-box">
          <scroll-view class="asset" scroll-y="true">
            <mb-as-group />
          </scroll-view>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script>
import mbillEndSplitLine from "../../components/base/mbill-end-split-line.vue";
import MbillCategoryGroup from "../../components/category/mbill-category-group.vue";
const now = new Date();

export default {
  components: { mbillEndSplitLine, MbillCategoryGroup },
  data() {
    return {
      selectedType: 0,
      typeList: [
        { value: 0, title: "支出" },
        { value: 1, title: "收入" },
      ],
      pickerEnd: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      selectedDate: `${now.getFullYear()}-${
        now.getMonth() + 1
      }-${now.getDate()}`,
      selectedDateText: "今日",
      selectedTime: `${now.getHours()}:${now.getMinutes()}`,
      inputTextLeng: 0,
      input: "",
      inputResult: "",
      scrollHeight: 0,
      assetList: [],
    };
  },
  onLoad() {
    this.dynamicHeight();
    console.log(now);
  },
  onShow() {},
  methods: {
    // 计算高度，动态调整scroll 高度
    dynamicHeight() {
      let that = this;
      uni.getSystemInfo({
        success(res) {
          let pH = res.windowHeight;
          let h = 0;
          let query = uni.createSelectorQuery().in(that);
          query.select(".header").fields({ size: true });
          query.select(".amount").fields({ size: true });
          query.select(".key-board-container").fields({ size: true });
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
        .select(".input-text")
        .boundingClientRect((res) => {
          console.log(res);
          this.inputTextLeng = res.right;
        })
        .exec();
    },

    handlerTypeSelected(type) {
      this.selectedType = type;
    },
    handlerDatePicker({ detail }) {
      let date = new Date(detail.value);
      this.selectedDate = date;
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

    handlerTimePicker({ detail }) {
      this.selectedTime = detail.value;
    },
    handlerChooseAsset() {
      this.$refs.popupHi.open();
    },
    handlerInputNum(e) {
      // console.log(e);
      this.input = e.input;
      this.inputResult = e.result;
      this.scrollInputText();
      console.log(this.$refs);
    },
    handlerConfirmNum() {
      console.log("cof ");
    },
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
    width: 130px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .item {
      color: $light-text-color;
      padding: 3px 8px;
      border: 1rpx solid $bright-color;
      border-radius: 30rpx;
    }
    .item-select {
      color: $primary-text-color;
      background: $bright-color;
    }
  }
  .date-content {
    background: $bright-color;
    border-radius: 30rpx;
    font-size: 15px;
    .date {
      padding: 3px 4px 3px 8px;
    }
    .time {
      padding: 3px 8px 3px 0;
    }
  }
}
.amount {
  background: $light-color;
  padding: 0 10px;
  background-image: radial-gradient();
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
    .input-text {
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
  .key-board-header {
    padding: 10px 10px 0 10px;
    background: #fff;
    .choose-asset {
      margin-right: 20px;
      .text {
        display: -webkit-box; /*弹性伸缩盒子模型显示*/
        -webkit-box-orient: vertical; /*排列方式*/
        -webkit-line-clamp: 1; /*显示文本行数(这里控制多少行隐藏)*/
        overflow: hidden; /*溢出隐藏*/
      }
    }
  }
}
.popup-box {
  background-color: #fff;
  border-radius: 10rpx;
  .asset {
    height: 350px;
  }
}

.icon {
  margin-right: 10px;
  font-size: 20px;
}
</style>
