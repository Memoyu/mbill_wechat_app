<template>
  <view class="mode">
    <view class="board f-sb-c">
      <view class="key-num">
        <view
          v-for="(num, index) in numList"
          :key="index"
          class="key"
          hover-class="key-click"
          hover-stay-time="50"
          @click="handlerClickNum(num.value)"
        >
          <text v-if="!num.isIcon">{{ num.value }}</text>
          <i
            v-else
            style="font-size: 25px"
            :class="['iconfont', 'icon-' + num.value]"
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
          @click="handlerOperator(op.value)"
        >
          <i style="font-size: 20px" :class="['iconfont', 'icon-' + op.icon]" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * ongetnum -> 绑定方法 数字变化
 * getnum   -> 绑定方法 点击确认
 * */

export default {
  name: "mbill-keyboard",
  props: {
    leng: {
      //输入长度
      type: [String, Number],
      default: 8,
    },
    pass: {
      // 是否开启密码模式
      type: Boolean,
      default: false,
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
      num: "0", //初始化输入数字
      numList: [
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
    this.num = pnum;
  },
  methods: {
    // 模态状态改变
    popcha(e) {
      this.num = this.pnum;
    },

    // 显示弹窗
    openfun() {
      this.$refs.popup.open();
    },
    // 关闭弹窗
    closefun() {
      this.$refs.popup.close();
    },

    // 输入
    handlerClickNum(e) {
      if (e == "delete") {
        this.handlerDel();
        return;
      }

      let num = String(this.num);

      //输入长度小于设置
      if (num.length < this.leng) {
        // 判断小数点
        let numof = num.indexOf(".");
        if (numof > -1) {
          //小数点处理
          if (e != ".") {
            if (num == 0) {
              num = e;
            } else {
              num = String(num) + e;
            }

            // 设置保留几位
            let decimal = this.decimal; //小数点
            if (num.length > numof + 1 + decimal) {
              num = num.substr(0, numof + 1 + decimal);
            }
          }
        } else {
          if (num == 0) {
            num = e;
          } else {
            num = String(num) + e;
          }
        }

        this.num = num;
        this.$emit("ongetnum", num); //数字变化调用
      }
    },
    // 操作符
    handlerOperator(val) {
      switch (val) {
        case "+":
          break;
        case "-":
          break;
        case "confirm":
          this.handlerConfirm();
          break;
      }
    },

    // 删除
    handlerDel() {
      let num = String(this.num);
      num = num.substr(0, num.length - 1);
      if (num.length == 0) {
        if (this.pass) {
          this.num = "";
        } else {
          this.num = 0;
        }
      } else {
        this.num = num;
      }

      this.$emit("ongetnum", num); //数字变化调用
    },
    // 确定
    handlerConfirm() {
      let num = String(this.num);

      if (num.charAt(num.length - 1) == ".") {
        // 最后一位是小数点就去掉
        num = num.substr(0, num.length - 1);
        this.num = num;
      }
      this.$emit("getnum", num);
    },
  },
};
</script>

<style lang="scss">
.mode {
  background-color: #ffffff;
  padding-bottom: 20rpx;
  .f-sb-c {
    /*两端对齐 上下居中*/
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .board {
    // padding: 20rpx;

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
        line-height: 100rpx;
        width: 172rpx;
        height: 100rpx;
        //border: 1rpx solid #6699ff;
      }
    }

    .btn {
      width: 190rpx;

      .operator {
        font-size: 19px;
        font-weight: bolder;
        text-align: center;
        line-height: 100rpx;
        height: 100rpx;
        //border: 1rpx solid #6699ff;
      }

      .confirm {
        font-size: 19px;
        font-weight: bolder;
        text-align: center;
        line-height: 200rpx;
        height: 200rpx;
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
}
</style>
