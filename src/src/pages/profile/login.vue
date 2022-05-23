<template>
  <view class="b-container">
    <view class="login" @tap="handlerLogin"
      ><text space="emsp">{{ loading ? "登录中..." : " 登录 " }}</text></view
    >
  </view>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      loading: false,
    };
  },
  onShow() {
    uni.hideHomeButton();
  },
  onLoad() {},
  methods: {
    ...mapActions(["Login"]),
    handlerLogin() {
      if (this.loading) return;
      this.loading = true;
      uni.login({
        desc: "weixin", // 这个参数是必须的
        success: (res) => {
          // console.log("授权信息", res);
          uni.getUserInfo({
            provider: "weixin",
            success: (user) => {
              // console.log("用户信息", user);
              this.toLogin(user.userInfo, res.code);
            },
            fail: (err) => {
              this.$tip.error(err.errMsg);
            },
          });
        },
        fail: (err) => {
          this.$tip.error(err.errMsg);
        },
      });
    },
    toLogin(user, code) {
      this.Login({
        code: code,
        avatarUrl: user.avatarUrl,
        city: user.city,
        country: user.country,
        gender: user.gender,
        language: user.language,
        nickName: user.nickName,
        province: user.province,
      })
        .then((res) => {
          console.log(res);
          this.loading = false;
          if (res.data.success) {
            this.$tip.success("登录成功!");
            this.$Router.replaceAll({ name: "index" });
          } else {
            this.$tip.alert(res.data.msg);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scope>
.b-container {
  justify-content: center;
  .login {
    font-weight: bold;
    color: white;
    text-align: center;
    border-radius: 20px;
    padding: 10px 0;
    width: 70%;
    background: $expend-color;
  }
}
</style>
