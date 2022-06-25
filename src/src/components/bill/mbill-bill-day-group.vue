<template>
  <view class="mbill-bill-date-group">
    <view v-for="(g, dind) in groups" :key="dind">
      <view class="group-date">{{ g.day }}日 {{ g.week }}</view>
      <view class="group-items">
        <view class="group-items-item">
          <mb-b-item
            v-for="(item, index) in g.items"
            :key="index"
            :bill="item"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bill-date-group",
  props: {
    groups: {
      optionalTypes: Array,
      default: [
        /*{
          date: "1日 周六",
          items: [
            {
              id: 1,
              type: 0,
              category: "奶茶",
              icon: "/static/assets/tea.png",
              amount: 30495.2,
              desc: "这是备注来着",
              time: "13:30",
            },
            {
              id: 2,
              type: 1,
              category: "奶茶1",
              icon: "/static/assets/tea.png",
              amount: 30495.3,
              desc: "这是备注来着1",
              time: "13:30",
            },
            {
              id: 3,
              type: 1,
              category: "奶茶2",
              icon: "/static/assets/tea.png",
              amount: 30495.5,
              desc: "这是备注来着2",
              time: "13:30",
            },
          ],
        },
        {
          date: "2日 周日",
          items: [
            {
              id: 4,
              type: 0,
              category: "奶茶",
              icon: "/static/assets/tea.png",
              amount: 33.2,
              desc: "这是备注来着",
              time: "13:30",
            },
            {
              id: 5,
              type: 1,
              category: "奶茶1",
              icon: "/static/assets/tea.png",
              amount: 44.3,
              desc: "这是备注来着1",
              time: "13:30",
            },
            {
              id: 6,
              type: 0,
              category: "奶茶2",
              icon: "/static/assets/tea.png",
              amount: 555.5,
              desc: "这是备注来着2",
              time: "13:30",
            },
          ],
        },
        {
          date: "3日 周一",
          items: [
            {
              id: 7,
              type: 0,
              category: "奶茶",
              icon: "/static/assets/tea.png",
              amount: 33.2,
              desc: "这是备注来着",
              time: "13:30",
            },
            {
              id: 8,
              type: 1,
              category: "奶茶1",
              icon: "/static/assets/tea.png",
              amount: 44.3,
              desc: "这是备注来着1",
              time: "13:30",
            },
            {
              id: 9,
              type: 0,
              category: "奶茶2",
              icon: "/static/assets/tea.png",
              amount: 555.5,
              desc: "这是备注来着2",
              time: "13:30",
            },
          ],
        },*/
      ],
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-bill-date-group {
  margin: 0 20rpx;
  .group-date {
    padding: 20rpx 40rpx;
    font-weight: bold;
  }
  .group-items {
    padding: 10rpx 0;
    border-radius: 26rpx;
    background: white;
    &-item {
      padding: 0 30rpx;
    }
  }
}
</style>
