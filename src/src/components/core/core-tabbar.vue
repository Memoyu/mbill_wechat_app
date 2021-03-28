<template>
  <view class="mbill-tabbar-wrap" v-if="tabbarList && tabbarList.length && showTabbar">
    <view class="tabbar-box" :style="{ background: '#fff' }">
      <view
        class="tabbar-item"
        v-for="(tab, index) in tabbarList"
        :key="tab.name"
        @tap="switchTabbar(tab, index)"
      >
        <view class="img-box">
          <image
            class="tabbar-icon"
            :src="currentPath == tab.path ? tab.activeImage : tab.image"
            mode="aspectFill"
          ></image>
        </view>
        <view
          class="tabbar-text"
          :style="{ color: currentPath == tab.path ? tabbarData.activeColor : tabbarData.color }"
        >{{ tab.name }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "shoproTabbar",
  components: {},
  data() {
    return {
      tabbarData: {
        activeColor: "#212121",
        color: "#757575",
        list: [
          {
            name: "记账",
            path: "/pages/index/bill",
            image: "../../static/assets/icons/tabbar/bill.png",
            activeImage: "../../static/assets/icons/tabbar/bill_select.png"
          },
          {
            name: "明细",
            path: "/pages/index/detail",
            image: "../../static/assets/icons/tabbar/detail.png",
            activeImage: "../../static/assets/icons/tabbar/detail_select.png"
          },
          {
            name: "统计",
            path: "/pages/index/statistics",
            image: "../../static/assets/icons/tabbar/statistics.png",
            activeImage:
              "../../static/assets/icons/tabbar/statistics_select.png"
          },
          {
            name: "我的",
            path: "/pages/index/profile",
            image: "../../static/assets/icons/tabbar/profile.png",
            activeImage: "../../static/assets/icons/tabbar/profile_select.png"
          }
        ]
      }
    };
  },
  props: {
    queryObj: {}
  },
  computed: {
    tabbarList() {
			if (this.tabbarData) {
				return this.tabbarData.list;
			}
		},
    currentPath() {
      let pages = getCurrentPages();
      console.log(this)
			let currPage = this.$Route.path;
      
			return '/' + currPage;
    },
    showTabbar() {
      if (this.tabbarData && this.tabbarData.list) {
        let arr = [];
        let path = "";
        //arr.push("/pages/index/bill");
        for (let item of this.tabbarData.list) {
          arr.push(item.path);
        }
        return arr.includes(this.currentPath);
      }
    }
  },
  created() {},
  methods: {
    // 切换tabbar
    switchTabbar(tab, index) {
      this.$tools.routerTo(tab.path, {}, true);
    }
  }
};
</script>

<style lang="scss">
.mbill-tabbar-wrap {
  height: calc(100rpx + env(safe-area-inset-bottom) / 2);
  padding-bottom: calc(env(safe-area-inset-bottom) / 2);
  position: relative;
  width: 100%;
  z-index: 70;

  .tabbar-box {
    position: fixed;
    display: flex;
    align-items: center;
    width: 100%;
    height: calc(100rpx + env(safe-area-inset-bottom) / 2);
    border-top: 1rpx solid #eeeeee;
    background-color: #fff;
    z-index: 998;
    bottom: 0;
    padding-bottom: calc(env(safe-area-inset-bottom) / 2);

    .tabbar-item {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;

      .img-box {
        position: relative;

        .cu-tag {
          right: -12px;
        }
      }

      .tabbar-icon {
        width: 50rpx;
        height: 50rpx;
      }

      .tabbar-text {
        font-size: 20rpx;
      }
    }
  }
}
</style>
