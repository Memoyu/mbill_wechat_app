<template>
  <uni-popup ref="authModal" type="bottom" safe-area="false">
    <view class="mbill-auth-modal"> This is content </view>
    <view class="mbill-auth-modal"> This is content </view>
    <view class="mbill-auth-modal"> This is content </view>
    <view class="mbill-auth-modal"> This is content </view>
    <view class="mbill-auth-modal"> This is content </view>
    <view class="mbill-auth-modal"> This is content </view>
    <view class="mbill-auth-modal"> This is content </view>
  </uni-popup>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "mmbill-auth-modal",
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    this.handlerModalShow(this.show);
  },
  watch: {
    show(val) {
      this.handlerModalShow(val);
    },
  },
  methods: {
    handlerModalShow(isShow) {
      console.log(isShow);
      if (isShow) {
        this.$refs.authModal.open();
      } else {
        this.$refs.authModal.close();
      }
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-auth-modal {
}
</style>
