<template>
  <view class="board x-bc">
    <view class="key-num">
      <view
        v-for="(numKey, index) in numKeyList"
        :key="index"
        class="key"
        hover-class="key-click"
        hover-stay-time="50"
        @longtap="onLongTap(numKey.value)"
        @click="onClickNum(numKey.value)"
      >
        <text v-if="!numKey.icon">{{ numKey.value }}</text>
        <i
          v-else
          style="font-size: 50rpx"
          :class="['iconfont', 'icon-' + numKey.icon]"
        />
      </view>
    </view>
    <view class="btn">
      <view
        v-for="(op, index) in operateList"
        :key="index"
        :class="op.className"
        hover-class="key-click"
        hover-stay-time="50"
        @click="onClickNum(op.value)"
      >
        <view v-if="op.value === 'confirm'">
          <i
            v-if="!loading"
            style="font-size: 40rpx"
            :class="['iconfont', 'icon-' + op.icon]"
          />
          <view v-else class="confirm-loading"></view>
        </view>
        <view v-else>
          <i
            style="font-size: 40rpx"
            :class="['iconfont', 'icon-' + op.icon]"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-keyboard",
  props: {
    leng: {
      //输入长度 默认：5 例如：23456.77 -> 向下取整，则为5位
      type: [String, Number],
      default: 5,
    },
    pnum: {
      //初始化数量
      type: [String, Number],
      default: "",
    },

    decimal: {
      // 保存几位小数
      type: [String, Number],
      default: 2,
    },

    // 确认按钮加载
    loading: {
      type: [String, Boolean],
      default: false,
    },
  },
  data() {
    return {
      numKeyList: [
        { value: "1" },
        { value: "2" },
        { value: "3" },
        { value: "4" },
        { value: "5" },
        { value: "6" },
        { value: "7" },
        { value: "8" },
        { value: "9" },
        { value: "del", icon: "delete" },
        { value: "0" },
        { value: "." },
      ],
      operateList: [
        { value: "plus", icon: "plus", className: "operator" },
        { value: "minus", icon: "subtract", className: "operator" },
        { value: "confirm", icon: "confirm", className: "confirm" },
      ],
      infix: [],
      suffix: [],
      result: [],
      opList: ["+", "-"],
      nameToOp: {
        plus: "+",
        minus: "-",
      },
    };
  },
  watch: {
    pnum(value) {
      value = value.toString();
      if (
        value !== "" &&
        value !== "0" &&
        value !== undefined &&
        value !== null
      )
        this.infix.push(value);
    },
  },
  created() {
    // console.log("punm", this.pnum);
  },
  methods: {
    // 输入
    onClickNum(e) {
      // 加载中则不进行任何操作
      if (this.loading) return;
      if ("confirm" == e) {
        this.onConfirm();
        return;
      }
      // 数字：0-9
      if (!isNaN(parseInt(e, 10))) {
        // 构建中缀表达式并显示
        let infixRe = this.buildInfix(e, "add");
        this.calculate();
        return;
      }

      // 操作：删除
      if ("del" == e) {
        // 重新构建中缀表达式
        let infixRe = this.buildInfix(this.nameToOp[e], "del");
        this.calculate();
      }
      // 预运算：小数点
      else if ("." == e) {
        // console.log(this.infix.length);
        if (this.infix.length <= 0 || this.isOp(this.peekInfix())) {
          return;
        }

        // 重新构建中缀表达式
        let infixRe = this.buildInfix(this.peekInfix(), "dot");
        this.calculate();
      }
      // 运算符：+ -
      else if (this.isOp(this.nameToOp[e])) {
        let infixRe = this.buildInfix(this.nameToOp[e], "add");
        this.calculate();
      }
    },
    // 长按
    onLongTap(e) {
      if ("del" != e) return;
      this.infix = [];
      this.suffix = [];
      this.calculate();
    },

    // 确定
    onConfirm() {
      this.$emit("confirm");
    },

    // 计算输入
    calculate() {
      this.infixToSuffix();
      var suffixRe = this.calcSuffix();
      this.$emit("input", {
        input: this.infix.join(" "),
        result: suffixRe == undefined ? "0" : suffixRe,
      });
      return suffixRe;
    },

    // 构建中缀表达式
    buildInfix(val, type) {
      let tempVal;

      // 删除操作
      if (type === "del") {
        if (this.infix.length > 0) {
          tempVal = this.infix.pop();
          // console.log(tempVal);
          tempVal = tempVal.substr(0, tempVal.length - 1);
          // 删除末尾一位数
          if (tempVal.length > 0) {
            this.infix.push(tempVal);
          }
        }
        return this.infix;
      }
      // 添加操作，首先得判断运算符是否重复
      else if (type === "add") {
        let last = this.peekInfix();
        // 两个连续的运算符
        if (this.isOp(val) && this.isOp(last)) {
          return this.infix;
        }
        // 两个连续的数字
        else if (!this.isOp(val) && !this.isOp(last)) {
          // console.log(last);
          if (!this.isDecimalRange(last)) return this.infix;
          if (!this.isLengRange(last)) return this.infix;
          tempVal = last + val;
          this.infix.pop();
          this.infix.push(tempVal);
          return this.infix;
        }
        // 首个数字正负数
        if (
          !this.isOp(val) &&
          this.infix.length === 1 &&
          (last === "+" || last === "-")
        ) {
          tempVal = last === "+" ? val : "-" + val;
          this.infix.pop();
          this.infix.push(tempVal);

          return this.infix;
        }

        this.infix.push(val);
        return this.infix;
      }
      // 更改操作，比如%的预运算
      else if (type === "dot") {
        if (!this.isLengRange(this.peekInfix())) return this.infix;
        tempVal = this.infix.pop();
        if (tempVal.indexOf(".") < 0) {
          this.infix.push(tempVal + ".");
        } else {
          this.infix.push(tempVal);
        }

        return this.infix;
      }
    },

    // 中缀表达式转后缀表达式
    infixToSuffix() {
      // 主要用于临时存放操作符
      var temp = [];
      this.suffix = [];

      for (var i = 0; i < this.infix.length; i++) {
        // 数值，直接压入
        if (!this.isOp(this.infix[i])) {
          this.suffix.push(this.infix[i]);
        } else {
          if (!temp.length) {
            temp.push(this.infix[i]);
          } else {
            // 调整操作符位置，准确的构建后缀表达式
            while (temp.length) {
              this.suffix.push(temp.pop());
            }
            // 将当前运算符也压入后缀表达式
            temp.push(this.infix[i]);
          }
        }
      }
      // 将剩余运算符号压入
      while (temp.length) {
        this.suffix.push(temp.pop());
      }
    },

    // 后缀表达式计算
    calcSuffix() {
      this.result = [];
      let last = this.peekInfix();
      let len = this.isOp(last) ? this.suffix.length - 1 : this.suffix.length;
      // console.log(this.infix);
      // console.log(this.suffix);
      for (var i = 0; i < len; i++) {
        // 数值，直接压入结果集
        if (!this.isOp(this.suffix[i])) {
          this.result.push(this.suffix[i]);
        }
        // 运算符，从结果集中取出两项进行运算，并将运算结果置入结果集合
        else {
          this.result.push(
            this.opCalc(this.result.pop(), this.suffix[i], this.result.pop())
          );
        }
      }
      // 此时结果集中只有一个值，即为结果

      return this.result[0];
    },

    // 获取前缀表达式最后一个元素
    peekInfix() {
      let val = this.infix[this.infix.length - 1];
      return val == undefined ? "" : val;
    },

    // 是否是小数
    isDecimal(val) {
      return val.indexOf(".") !== -1;
    },

    // 是否在小数范围内
    isDecimalRange(val) {
      if (!this.isDecimal(val)) return true;
      let sp = val.split(".");
      if (sp[1].length < this.decimal) return true;
      return false;
    },

    // 是否在数值长度内
    isLengRange(val) {
      let fVal = Math.floor(Number(val));
      // console.log(fVal);
      return String(fVal).length < this.leng;
    },

    // 判断是否为运算符
    isOp(op) {
      return op && this.opList.indexOf(op) !== -1;
    },

    // 进行运算符的运算
    opCalc(b, op, a) {
      return op === "+"
        ? (Number(a) + Number(b)).toFixed(this.decimal)
        : op === "-"
        ? (Number(a) - Number(b)).toFixed(this.decimal)
        : 0;
    },
  },
};
</script>

<style lang="scss" scope>
.board {
  background-color: #ffffff;
  padding: 0 20rpx 20rpx 20rpx;
  .key-num {
    width: 534rpx;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .key {
      color: $primary-text-color;
      font-size: 38rpx;
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
      font-size: 38rpx;
      font-weight: bolder;
      text-align: center;
      line-height: 110rpx;
      height: 110rpx;
      //border: 1rpx solid #6699ff;
    }

    .confirm {
      font-size: 38rpx;
      font-weight: bolder;
      text-align: center;
      line-height: 220rpx;
      height: 220rpx;
      background: $light-color;
      border-radius: 32rpx;
      //border: 1rpx solid #6699ff;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }

  .key-click {
    border-radius: 32rpx;
    background: $primary-color !important;
    // transform: scale(1.1);
  }

  .confirm-loading {
    position: relative;
    width: 30rpx;
    height: 30rpx;
    border-radius: 50%;
    background: $primary-color;
    -webkit-animation: confirm-loading 1.5s infinite linear;
    animation: confirm-loading 1.5s infinite linear;
  }
  .confirm-loading:after {
    content: "";
    position: absolute;
    width: 50rpx;
    height: 50rpx;
    border-top: 10rpx solid $bright-color;
    border-bottom: 10rpx solid $bright-color;
    border-left: 10rpx solid transparent;
    border-right: 10rpx solid transparent;
    border-radius: 50%;
    top: -20rpx;
    left: -20rpx;
  }
  @-webkit-keyframes confirm-loading {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    50% {
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes confirm-loading {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    50% {
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
}
</style>
