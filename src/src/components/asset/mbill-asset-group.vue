<template>
  <view class="mbill-asset-group">
    <view v-for="(d, dind) in data" :key="dind">
      <view class="asset-group">{{ d.date }}</view>
      <view class="asset-item">
        <view
          class="item-content"
          v-for="(item, index) in d.items"
          :key="index"
        >
          <image class="image" :src="item.icon" />
          <text class="text">{{ item.name }}</text>
        </view>
      </view>
    </view>
    <view class="to-add-asset" @tap="toAddAsset">添加账户</view>
  </view>
</template>

<script>
export default {
  name: "mbill-asset-group",
  props: {
    data: {
      type: Array,
      default: [
        {
          date: "现金账户",
          items: [
            {
              icon: "/static/assets/tea.png",
              name: "现金",
            },
            {
              icon: "/static/assets/tea.png",
              name: "现金2",
            },
            {
              icon: "/static/assets/tea.png",
              name: "现金3",
            },
            {
              icon: "/static/assets/tea.png",
              name: "现金4",
            },
            {
              icon: "/static/assets/tea.png",
              name: "奶茶2",
            },
            {
              icon: "/static/assets/tea.png",
              name: "做饭食材2",
            },
            {
              icon: "/static/assets/tea.png",
              name: "饮料2",
            },
            {
              icon: "/static/assets/tea.png",
              name: "一日三餐2",
            },
          ],
        },
        {
          date: "虚拟账户",
          items: [
            {
              icon: "/static/assets/tea.png",
              name: "微信",
            },
            {
              icon: "/static/assets/tea.png",
              name: "支付宝",
            },
            {
              icon: "/static/assets/tea.png",
              name: "数字人民币",
            },
            {
              icon: "/static/assets/tea.png",
              name: "其他",
            },
          ],
        },
      ],
    },
  },
  methods: {
    toAddAsset() {
      uni.navigateTo({ url: "/pages/bill/asset/edit" });
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-asset-group {
  margin: 0 10px;
  .asset-group {
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 5px;
  }
  .asset-item {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    .item-content {
      width: 20%;
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .image {
        height: 35px;
        width: 35px;
      }
      .text {
        color: $grey-black-text-color;
        font-size: 13px;
      }
    }
  }
  .to-add-asset {
    margin-bottom: 15px;
    text-align: center;
  }
}
</style>
