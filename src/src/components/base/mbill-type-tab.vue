<template>
  <view class="mb-type-tab">
    <view
      class="bg"
      :style="{ left: `${bgleft}px`, width: `${bgwidth}px` }"
    ></view>
    <view
      :class="['tab', item.key == active ? 'tab-active' : '']"
      :style="{ color: item.key == active ? selcolor : color }"
      v-for="(item, index) in items"
      :key="index"
      @click="handleSelected(item, index)"
      >{{ item.text }}</view
    >
  </view>
</template>

<script>
const bgwidthpercent = 0.4;
export default {
  name: "mbill-type-tab",
  props: {
    items: {
      type: Array,
      default: [],
    },
    color: {
      type: String,
      default: "#D1D1D1",
    },
    selcolor: {
      type: String,
      default: "#424874",
    },
  },
  data() {
    return {
      active: 0,
      tabWidth: 0,
      bgleft: 20,
      bgwidth: 30,
      tabsSize: [],
    };
  },

  created() {
    let query = uni.createSelectorQuery().in(this);
    query.selectAll(".tab").fields({ size: true });
    query.exec((data) => {
      this.tabsSize = data[0];
      this.bgleft = this.tabsSize[0].width / 2;
      this.bgwidth = this.tabsSize[0].width * bgwidthpercent;
    });
  },

  methods: {
    handleSelected(item, index) {
      let left = 0;
      for (let i = 0; i < index; i++) {
        left += this.tabsSize[i].width;
      }
      left += this.tabsSize[index].width / 2;
      this.bgwidth = this.tabsSize[index].width * bgwidthpercent;
      this.bgleft = left;
      let key = item.key;
      this.active = key;
      this.$emit("selected", key);
    },
  },
};
</script>

<style lang="scss" scope>
.mb-type-tab {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 30rpx;
  .tab {
    padding: 0 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    font-weight: bold;
    &-active {
    }
  }
  .bg {
    position: absolute;
    // left: 90rpx;
    border-radius: 20rpx;
    z-index: -1;
    width: 30rpx;
    height: 20rpx;
    background: $primary-color;
    transform: translate(-50%, 0%);
    transition: all 0.5s;
  }
}
</style>
