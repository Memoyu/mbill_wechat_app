<template>
  <view class="container">
    <view class="wrapper">
      <!-- logo -->
      <core-magic-text text="mbill" class />
      <!-- 表单 -->
      <view class="login-box y-f">
        <view class="input-item x-c">
          <input
            class="inp"
            v-model="username"
            type="text"
            placeholder="请输入账号"
            placeholder-class="pl"
          />
        </view>
        <view class="input-item x-c">
          <input
            class="inp"
            :password="!isShowPassword"
            v-model="password"
            type="text"
            placeholder="请输入密码"
            placeholder-class="pl"
          />
          <view @tap="togglePassword" :class="['iconfont', isShowPassword ? 'icon-eye-open':'icon-eye-close', 'eye-image']"></view>
        </view>
      </view>
      <!-- 登录按钮 -->
      <view class="x-c y-f">
        <button class="cu-btn login-btn mb30" @tap="toLogin">登录</button>
        <view class="x-bc tip-box">
          <button class="cu-btn tip-btn" hidden="true" @tap="jump('/pages/public/register')">立即注册</button>
          <view class v-show="loginWay === 1">
            <button class="cu-btn tip-btn" @tap="jump('/pages/public/forgot')">忘记密码</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";
import coreMagicText from "../../components/core/core-magic-text.vue";
export default {
  components: { coreMagicText },
  data() {
    return {
      isShowPassword: false,
      username: "",
      password: "",
    };
  },
  methods: {
    ...mapActions(["getUserInfo", "setTokenAndBack"]),
    //显示密码
    togglePassword() {
      this.isShowPassword = !this.isShowPassword;
    },
    //登陆
    toLogin() {
      var that = this;
      that
        .$api("user.login", {
          username: that.username,
          password: that.password,
        })
        .then((res) => {
          if (res.code === 0) {
            that.setTokenAndBack(res.result.accessToken);
          }
        });
    },
  },
};
</script>

<style lang="scss">
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  // overflow: hidden;

  // logo
  .logo {
    width: 410rpx;
    height: 120rpx;
  }

  .logo-bg {
    width: 640rpx;
    height: 300rpx;
  }
}

.wrapper {
  position: absolute;
  z-index: 90;
  padding-top: 30px;
  padding-bottom: 40upx;
  width: 100vw;
  height: 100vh;
  top: 0;

  // 输入
  .login-box {
    padding-top: 80px;
    .input-item {
      height: 108rpx;
      border-bottom: 1rpx solid rgba($darkPrimaryColor, 0.3);
      width: 608rpx;

      .inp {
        flex: 1;
        height: 100%;
        font-size: 28rpx;
      }

      .pl {
        color: $secondaryText;
      }

      .code-btn {
        background: none;
        font-size: 28rpx;
        color: #845708;
      }
      .eye-image {
       font-size: 23px;
      }
    }
  }

  // 登录
  .login-btn {
    width: 630upx;
    height: 80upx;
    border-radius: 40rpx;
    margin-top: 70upx;
    background: linear-gradient(90deg, $darkPrimaryColor, $primaryColor);
    box-shadow: 0px 7rpx 6rpx 0px $darkPrimaryColor;
    color: #fff;
  }

  .tip-box {
    width: 630rpx;

    .tip-btn {
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 400;
      text-decoration: underline;
      color: $darkPrimaryColor;
      background: none;
    }
  }
}
</style>
