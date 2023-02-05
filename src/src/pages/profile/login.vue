<template>
  <view class="b-container x-c">
    <view class="user-info">
      <!-- 头像 -->
      <view class="user-info-avatar">
        <button
          v-if="preUser.isExist == 0"
          class="user-info-avatar-button"
          open-type="chooseAvatar"
          @chooseavatar="onChooseAvatar"
        >
          <image
            :class="preUser.avatarUrl == '' ? 'user-info-avatar-img' : ''"
            :src="preUser.avatarUrl"
          ></image>
        </button>
        <view v-else class="user-info-avatar-button">
          <image :class="preUser.avatarUrl" :src="preUser.avatarUrl"></image>
        </view>
      </view>
      <!-- 昵称 -->
      <input
        v-show="preUser.isExist == 0"
        type="nickname"
        class="user-info-nickname-input"
        placeholder-class="user-nickname-input-pcs"
        placeholder="请输入昵称"
        maxlength="10"
        v-model="preUser.nickname"
      />
    </view>
    <!-- 登录 -->
    <view class="login" @click="onLogin"
      ><text space="emsp">{{ loading ? "登录中..." : " 登录 " }}</text></view
    >

    <!-- 重新授权 -->
    <view class="auth-login"
      ><text class="auth-login-text" @click="onAuthLogin" space="emsp"
        >重新授权</text
      ></view
    >
  </view>
</template>

<script>
import { mapActions } from "vuex";
import generator from "@/common/utils/generator.js";

export default {
  data() {
    return {
      loading: false,
      preUser: {},
    };
  },
  onShow() {
    // 进行预登录
    this.preLoginCode();
  },
  onLoad() {},
  methods: {
    ...mapActions(["Login"]),
    // 微信预登录
    preLoginCode() {
      uni.login({
        success: (res) => {
          this.$api
            .preLogin({
              code: res.code,
            })
            .then((res) => {
              console.log("pre", res);
              if (res.data.success) {
                this.preUser = res.data.result;
              } else {
                this.$tip.alert(res.data.msg);
              }
            })
            .catch((err) => {});
        },
        fail: (err) => {
          this.$tip.toast("授权失败，请重新授权！");
        },
      });
    },

    // 选择头像并上传
    onChooseAvatar(e) {
      this.$api
        .uploadImageToQiniu(
          "avatar/" + generator.generateUUID() + ".png",
          e.detail.avatarUrl
        )
        .then((res) => {
          this.preUser.avatarUrl = res;
        })
        .catch((err) => {
          this.$tip.toast(err);
        });
    },

    // 登录
    onLogin() {
      // 用户第一次登录时，才需要校验，
      if (this.preUser.isExist == 0) {
        if (this.preUser.nickname == undefined || this.preUser.nickname == "") {
          this.$tip.toast("请输入昵称");
          return;
        }
        if (
          this.preUser.avatarUrl == undefined ||
          this.preUser.avatarUrl == ""
        ) {
          this.$tip.toast("请选择头像");
          return;
        }
      }

      if (this.loading) return;
      this.loading = true;
      this.Login({
        code: this.preUser.code,
        avatarUrl: this.preUser.avatarUrl,
        nickname: this.preUser.nickname,
      })
        .then((res) => {
          // console.log(res);
          if (res.data.success) {
            this.$tip.success("登录成功!");
            this.$Router.replaceAll({ name: "index" });
          } else {
            this.$tip.alert(res.data.msg);
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 点击重新授权
    onAuthLogin() {
      // 进行预登录
      this.preLoginCode();
    },
  },
};
</script>

<style lang="scss" scope>
.b-container {
  .user-info {
    margin-bottom: 70rpx;
    &-avatar {
      width: 150rpx;
      height: 150rpx;
      position: relative;
      border-radius: 50%;
      margin: 0 auto;
      text-align: center;
      line-height: 150rpx;
      background-color: #fff;
      border: 1rpx solid $expend-color;

      image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 50%;
        display: table;
      }

      &-button {
        height: 150rpx;
        padding: 0;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        &-img {
          &:before {
            content: "选择头像";
            position: absolute;
            right: 0;
            bottom: 0;
            width: 160rpx;
            height: 50rpx;
            padding-top: 5rpx;
            background: rgb(71, 162, 113, 0.6);
            font-size: 25rpx;
            color: #fff;
            display: flex;
            align-items: flex-end;
            justify-content: center;
          }
        }
      }
    }
    &-nickname-input {
      font-size: 35rpx;
      text-align: center;
      color: $expend-color;
      border-radius: 20rpx;
      border: 2rpx solid $expend-color;
      padding: 10rpx;
      margin: 30rpx 0;
      &-pcs {
        color: $expend-color;
      }
    }
  }
  .login {
    font-weight: bold;
    color: white;
    text-align: center;
    border-radius: 40rpx;
    padding: 20rpx 0;
    width: 70%;
    background: $expend-color;
  }
  .auth-login {
    display: flex;
    justify-content: flex-end;
    width: 60%;
    margin-top: 60rpx;
    font-size: 27rpx;
    font-weight: bold;
    color: $expend-color;
    text-align: center;
    text-decoration: underline;
    &-text {
      padding: 10rpx;
    }
  }
}
</style>
