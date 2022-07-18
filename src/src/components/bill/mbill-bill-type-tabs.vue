<template>
  <view class="mb-bill-type-tabs">
    <view
      class="bg"
      :style="{
        left: `${bgleft}px`,
        width: `${bgwidth}px`,
        height: `${bgheight}px`,
        background: bgcolor,
      }"
    />
    <view
      :class="['tab', item.id == selected.id ? 'tab-active' : '']"
      :style="{
        color:
          item.id == selected.id
            ? item.selcolor
              ? item.selcolor
              : selcolor
            : item.color
            ? item.color
            : color,
      }"
      v-for="(item, index) in items"
      :key="index"
      @click="handleSelected(item, index)"
      >{{ item.text }}</view
    >
  </view>
</template>

<script>
export default {
  name: "mbill-bill-type-tabs",
  props: {
    items: {
      type: Array,
      default: [],
    },
    value: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: "#FFFFFF",
    },
    selcolor: {
      type: String,
      default: "#47A271",
    },
  },
  data() {
    return {
      selected: 0,
      tabWidth: 0,
      bgleft: 20,
      bgwidth: 30,
      bgheight: 0,
      bgcolor: "#FFFFFF",
      tabsSize: [],
      zoomOutInter: 0,
      zoomInInter: 0,
      loadingSize: false,
    };
  },

  watch: {
    value(value) {
      // console.log("type", value);
      if (this.selected.id == value) return;
      this.getTabsSize((list) => {
        let ind = 0;
        let type = this.items.find((type, index) => {
          if (type.id == value) {
            ind = index;
            return type;
          }
        });
        this.initSelected(type, ind, list);
      });
    },
  },

  created() {
    this.selected = this.items[0];
    this.bgcolor = this.selected.color ? this.selected.color : this.color;
    this.getTabsSize();
  },

  methods: {
    // 选中tab触发
    handleSelected(item, index) {
      // console.log("进来了");
      this.bgheight = this.tabsSize[index].height * 0.2;
      this.bgwidth = this.tabsSize[index].width * 0.2;

      // 缩小动画结束后
      clearInterval(this.zoomOutInter);
      this.zoomOutInter = setInterval(() => {
        let left = 0;
        for (let i = 0; i < index; i++) {
          left += this.tabsSize[i].width;
        }
        left += this.tabsSize[index].width / 2;
        this.bgleft = left;
      }, 300);

      // 移动动画结束后
      clearInterval(this.zoomInInter);
      this.zoomInInter = setInterval(() => {
        this.bgheight = this.tabsSize[index].height;
        this.bgwidth = this.tabsSize[index].width;
      }, 500);

      this.selected = item;
      this.$emit("input", item.id);
    },

    // 获取tabs的宽度和高度信息
    getTabsSize(action) {
      // console.log(action, "a");
      // if (this.tabsSize.length > 0 || this.loadingSize) return;
      this.loadingSize = true;
      let query = uni.createSelectorQuery().in(this);
      query.selectAll(".tab").fields({ size: true });
      query.exec((data) => {
        let list = data[0];
        this.tabsSize = list;
        this.bgleft = this.tabsSize[0].width / 2;
        this.bgwidth = this.tabsSize[0].width;
        this.bgheight = this.tabsSize[0].height;
        this.loadingSize = false;
        if (action) action(list);
        // console.log("加载size完成");
      });
    },

    // 初始化tab选中
    initSelected(item, index, list) {
      let left = 0;
      for (let i = 0; i < index; i++) {
        left += list[i].width;
      }
      left += list[index].width / 2;
      this.bgheight = list[index].height;
      this.bgwidth = list[index].width;
      this.bgleft = left;
      this.selected = item;
      // this.$emit("selected", item);
    },
  },
};
</script>

<style lang="scss" scope>
.mb-bill-type-tabs {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 30rpx;
  z-index: 1;
  font-size: 35rpx;
  .tab {
    padding: 10rpx 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    &-active {
    }
  }
  .bg {
    position: absolute;
    // left: 90rpx;
    border-radius: 20rpx;
    z-index: -1;
    transform: translate(-50%, 0%);
    transition: all 0.5s;
  }
}
</style>
