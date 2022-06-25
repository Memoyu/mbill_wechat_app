<template>
  <view class="b-container">
    <view class="login" @tap="handleLogin"
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
    // uni.hideHomeButton();
  },
  onLoad() {},
  methods: {
    ...mapActions(["Login"]),
    handleLogin() {
      if (this.loading) return;
      this.loading = true;
      // uni.login({
      //   desc: "weixin", // 这个参数是必须的
      //   success: (res) => {
      //     // console.log("授权信息", res);
      //     wx.getUserProfile({
      //       lang: "zh_CN",
      //       desc: "用户登录",
      //       success: (user) => {
      //         console.log("用户信息", user);
      //         this.toLogin(user.userInfo, res.code);
      //       },
      //       fail: (err) => {
      //         console.log("getUserProfile error", err);
      //         this.$tip.error(err.errMsg);
      //         this.loading = false;
      //       },
      //     });
      //   },
      //   fail: (err) => {
      //     console.log("login error", err);
      //     this.$tip.error(err.errMsg);
      //     this.loading = false;
      //   },
      // });

      var p1 = new Promise((resolve, reject) => {
        wx.login({
          success: (res) => {
            // 这里也可以选择性返回需要的字段
            resolve(res);
          },
          fail: (err) => {
            reject("登录失败，请稍后再试！");
          },
        });
      });
      var p2 = new Promise((resolve, reject) => {
        wx.getUserProfile({
          desc: "用于完善用户资料",
          success: (res) => {
            // 这里也可以选择性返回需要的字段
            resolve(res.userInfo);
          },
          fail: (err) => {
            reject("授权失败！");
          },
        });
      });
      // 同时执行p1和p2，并在它们都完成后执行then
      Promise.all([p1, p2])
        .then((results) => {
          // results是一个长度为2的数组，放置着p1、p2的resolve
          this.handleToLogin({
            // 这里也可以选择性返回需要的字段
            ...results[0],
            ...results[1],
          });
        })
        .catch((err) => {
          // console.log(err);
          this.$tip.toast_quick(err);
          this.loading = false;
        });
    },
    handleToLogin(data) {
      // console.log("userinfo", data);
      this.Login({
        code: data.code,
        avatarUrl: data.avatarUrl,
        city: data.city,
        country: data.country,
        gender: data.gender,
        language: data.language,
        nickName: data.nickName,
        province: data.province,
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
    border-radius: 40rpx;
    padding: 20rpx 0;
    width: 70%;
    background: $expend-color;
  }
}
</style>
