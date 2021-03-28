<template>
  <view class="container">
    <view class="wrapper">
      <!-- logo -->
      <core-magic-text text="mbill"/>
      <!-- 表单 -->
      <view class="input-content">
        <view class="input-item">
          <text class="tit">用户名</text>
          <input type="text" name="username" v-model="username" placeholder="请输入用户名" maxlength="11">
        </view>
        <view class="input-item">
          <text class="tit">密码</text>
          <view class="x-ac" style="width: 100%">
            <input
              name="password"
              type="text"
              :password="!isShowPassword"
              v-model="password"
              placeholder="请输入密码"
              maxlength="20"
            >
            <view
              @tap="togglePassword"
              class="x-end"
              :class="['iconfont', isShowPassword ? 'icon-eye-open':'icon-eye-close', 'eye-image']"
            />
          </view>
        </view>
      </view>
      <!-- 登录按钮 -->
      <view class="x-c y-f">
        <button class="cu-btn login-btn mb30" @tap="toLogin">登录</button>
        <view class="x-bc tip-box">
          <button class="cu-btn tip-btn" @tap="jump('/pages/profile/register')">立即注册</button>
          <view>
            <button class="cu-btn tip-btn" @tap="jump('/pages/profile/forgot')">忘记密码</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";
import coreMagicText from "../../components/core/core-magic-text.vue";
import Tip from "@/common/utils/tip";

export default {
  components: { coreMagicText },
  data() {
    return {
      isShowPassword: false,
      username: "",
      password: ""
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
      if (that.username === "" || that.username === null) {
        Tip.toast("用户名不能为空！");
        return;
      }
      if (that.password === "" || that.password === null) {
        Tip.toast("密码不能为空！");
        return;
      }
      that
        .$api("user.login", {
          username: that.username,
          password: that.password
        })
        .then(res => {
          if (res.code === 0) {
            that.setTokenAndBack(res.result.accessToken);
          }
        });
    },
    jump(path) {
      this.$Router.push({ path: path });
    }
  }
};
</script>

<style lang="scss">
page {
  overflow-y: hidden;
}
.container {
  position: relative;
}

.wrapper {
  position: absolute;
  z-index: 90;
  .input-content {
    padding: 0 60upx;
  }
  .input-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 0 30upx;
    background: $borderColor;
    height: 120upx;
    border-radius: 4px;
    margin-bottom: 50upx;

    &:last-child {
      margin-bottom: 0;
    }

    .tit {
      height: 50upx;
      line-height: 56upx;
      font-size: 28rpx;
      color: $secondaryText;
    }

    input {
      height: 60upx;
      font-size: 28rpx;
      color: $secondaryText;
      width: 100%;
    }
    .eye-image {
      font-size: 23px;
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
