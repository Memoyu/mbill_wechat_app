<template>
  <view class="mode">
    <view class="board f-sb-c">
      <view class="key-num">
        <view
          class="key"
          hover-class="key-click"
          hover-stay-time="100"
          @click="setnum('1')"
          >1</view
        >
        <view class="key" hover-class="key-click" @click="setnum('2')">2</view>
        <view class="key" hover-class="key-click" @click="setnum('3')">3</view>
        <view class="key" hover-class="key-click" @click="setnum('4')">4</view>
        <view class="key" hover-class="key-click" @click="setnum('5')">5</view>
        <view class="key" hover-class="key-click" @click="setnum('6')">6</view>
        <view class="key" hover-class="key-click" @click="setnum('7')">7</view>
        <view class="key" hover-class="key-click" @click="setnum('8')">8</view>
        <view class="key" hover-class="key-click" @click="setnum('9')">9</view>
        <view class="key" hover-class="key-click" @click="setnum('.')"></view>
        <view class="key key-num0" hover-class="key-click" @click="setnum('0')"
          >0</view
        >
        <view class="key" hover-class="key-click" @click="setnum('.')">.</view>
      </view>
      <view class="btn">
        <view class="delete" hover-class="key-click" @click="del">+</view>
        <view class="delete" hover-class="key-click" @click="del">-</view>
        <view class="confirm" hover-class="key-click" @click="confirm"
          >确认</view
        >
      </view>
    </view>
  </view>
</template>

<script>
/**
 * ongetnum_ -> 绑定方法 数字变化
 * getnum_   -> 绑定方法 点击确认
 * */

export default {
  name: "wly-keyboard",
  props: {
    leng: {
      //输入长度
      type: [String, Number],
      default: "6",
    },
    pass: {
      // 是否开启密码模式
      type: Boolean,
      default: false,
    },
    pnum: {
      //初始化数量
      type: [String, Number],
      default: "0",
    },

    decimal: {
      // 保存几位小数
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      num: "0", //初始化输入数字
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
    setnum(e) {
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
        this.$emit("ongetnum_", num); //数字变化调用
      }
    },

    // 删除
    del() {
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

      this.$emit("ongetnum_", num); //数字变化调用
    },
    // 确定
    confirm() {
      let num = String(this.num);

      if (num.charAt(num.length - 1) == ".") {
        // 最后一位是小数点就去掉
        num = num.substr(0, num.length - 1);
        this.num = num;
      }

      this.$emit("getnum_", num);
    },
  },
};
</script>

<style lang="scss">
.mode {
  background-color: #fff;
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
        font-size: 19px;
        font-weight: bolder;
        text-align: center;
        line-height: 100rpx;
        width: 172rpx;
        height: 100rpx;
        border: 1rpx solid #6699ff;
      }
      .key-click {
        background: #8552a1;
        transform: scale(1.1);
      }
    }

    .btn {
      width: 190rpx;

      .delete {
        font-size: 19px;
        font-weight: bolder;
        text-align: center;
        line-height: 100rpx;
        height: 100rpx;
        border: 1rpx solid #6699ff;
      }

      .confirm {
        font-size: 19px;
        font-weight: bolder;
        text-align: center;
        line-height: 200rpx;
        height: 200rpx;
        background: #8552a1;
        border: 1rpx solid #6699ff;
      }
    }
  }
}
</style>
