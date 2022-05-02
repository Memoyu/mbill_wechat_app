<template>
  <view class="board x-bc">
    <view class="key-num">
      <view
        v-for="(numKey, index) in numKeyList"
        :key="index"
        class="key"
        hover-class="key-click"
        hover-stay-time="50"
        @click="handlerClickNum(numKey.value)"
      >
        <text v-if="!numKey.isIcon">{{ numKey.value }}</text>
        <i
          v-else
          style="font-size: 25px"
          :class="['iconfont', 'icon-' + numKey.value]"
        />
      </view>
    </view>
    <view class="btn">
      <view
        v-for="(op, index) in operatorList"
        :key="index"
        :class="op.className"
        hover-class="key-click"
        hover-stay-time="50"
        @click="handlerClickOperator(op.value)"
      >
        <i style="font-size: 20px" :class="['iconfont', 'icon-' + op.icon]" />
      </view>
    </view>
  </view>
</template>

<script>
/**
 * input -> 绑定方法 数字变化
 * confirm   -> 绑定方法 点击确认
 * */

export default {
  name: "mbill-keyboard",
  props: {
    leng: {
      //输入长度
      type: [String, Number],
      default: 8,
    },
    pnum: {
      //初始化数量
      type: [String, Number],
      default: 0,
    },

    decimal: {
      // 保存几位小数
      type: [String, Number],
      default: 2,
    },
  },
  data() {
    return {
      input: "0",
      result: 0,
      numKeyList: [
        { value: "1", isIcon: false },
        { value: "2", isIcon: false },
        { value: "3", isIcon: false },
        { value: "4", isIcon: false },
        { value: "5", isIcon: false },
        { value: "6", isIcon: false },
        { value: "7", isIcon: false },
        { value: "8", isIcon: false },
        { value: "9", isIcon: false },
        { value: "delete", isIcon: true },
        { value: "0", isIcon: false },
        { value: ".", isIcon: false },
      ],
      operatorList: [
        { value: "+", icon: "plus", className: "operator" },
        { value: "-", icon: "subtract", className: "operator" },
        { value: "confirm", icon: "confirm", className: "confirm" },
      ],
    };
  },
  created() {
    //自定义初始化值
    let pnum = this.pnum;
    this.input = pnum;
  },
  methods: {
    // 输入
    handlerClickNum(e) {
      if (e == "delete") {
        this.handlerDel();
        return;
      }

      let input = String(this.input);
      //输入长度小于设置
      if (input.length < this.leng) {
        // 判断小数点
        let numof = input.indexOf(".");
        if (numof > -1) {
          //小数点处理
          if (e != ".") {
            if (input == 0) {
              input = e;
            } else {
              input = String(input) + e;
            }

            // 设置保留几位
            let decimal = this.decimal; //小数点
            if (input.length > numof + 1 + decimal) {
              input = input.substr(0, numof + 1 + decimal);
            }
          }
        } else {
          if (input == 0) {
            input = e;
          } else {
            input = String(input) + e;
          }
        }

        this.input = input;
        let result = this.calculate(input);
        this.$emit("input", { input, result }); //数字变化调用
      }
    },
    // 操作符
    handlerClickOperator(val) {
      switch (val) {
        case "+":
        case "-":
          this.handlerOperator(val);
          break;
        case "confirm":
          this.handlerConfirm();
          break;
      }
    },

    // 删除
    handlerDel() {
      let input = String(this.input);
      input = input.substr(0, input.length - 1);
      console.log(input);
      if (input.length == 0) {
        this.input = 0;
      } else {
        this.input = input;
      }
      let result = this.calculate(input);
      this.$emit("input", { input, result }); //数字变化调用
    },

    // 计算操作
    calculate(input) {
      // if (input.includes("+")) {
      //   let nums = input.split("+");
      //   this.result = eval(string);
      // } else if (input.includes("-")) {
      //   let nums = input.split("-");
      //   this.result = Number(nums[0]) - Number(nums[1]);
      // } else {
      //   this.result = Number(input);
      // }
      this.result = eval(this.input);
      return this.result;
    },

    // 按下加减符号
    handlerOperator(op) {
      console.log(this.input);
      if (this.input.includes("+") || this.input.includes("-")) {
        this.input = this.result + op;
        this.$emit("input", { input: this.input, result: this.result });
        return;
      }
      let endChar = this.input.charAt(this.input.length - 1);
      if (endChar == "+" || endChar == "-") return;
      this.handlerClickNum(op);
    },

    // 确定
    handlerConfirm() {
      let input = String(this.input);

      if (input.charAt(input.length - 1) == ".") {
        // 最后一位是小数点就去掉
        input = input.substr(0, input.length - 1);
        this.input = input;
      }
      this.$emit("confirm", input);
    },
  },
};
</script>

<style lang="scss" scope>
.board {
  background-color: #ffffff;
  padding-bottom: 20rpx;
  .key-num {
    width: 534rpx;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .key {
      color: $primary-text-color;
      font-size: 19px;
      font-weight: bold;
      text-align: center;
      line-height: 110rpx;
      width: 172rpx;
      height: 110rpx;
      //border: 1rpx solid #6699ff;
    }
  }

  .btn {
    width: 190rpx;

    .operator {
      font-size: 19px;
      font-weight: bolder;
      text-align: center;
      line-height: 110rpx;
      height: 110rpx;
      //border: 1rpx solid #6699ff;
    }

    .confirm {
      font-size: 19px;
      font-weight: bolder;
      text-align: center;
      line-height: 220rpx;
      height: 220rpx;
      background: $light-color;
      border-radius: 16px;
      //border: 1rpx solid #6699ff;
    }
  }

  .key-click {
    border-radius: 16px;
    background: $primary-color !important;
    // transform: scale(1.1);
  }
}
</style>
