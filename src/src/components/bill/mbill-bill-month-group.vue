<template>
  <view class="mbill-bill-month-group">
    <view v-for="(d, dind) in data" :key="dind">
      <view class="group-year">{{ d.year }}</view>
      <view class="group-year-item">
        <view class="group-month-item" v-for="(m, mind) in d.items" :key="mind">
          <view class="month-item-date">{{ m.date }}</view>
          <mb-bill-item
            v-for="(item, index) in m.items"
            :key="index"
            :data="item"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-bill-month-group",
  props: {
    data: {
      type: Array,
      default: [
        {
          year: "2020",
          items: [
            {
              date: "1月19日 周一",
              items: [
                {
                  type: 0,
                  category: "奶茶",
                  icon: "/static/assets/tea.png",
                  amount: 30495.2,
                  desc: "这是备注来着",
                  time: "13:30",
                },
                {
                  type: 1,
                  category: "奶茶1",
                  icon: "/static/assets/tea.png",
                  amount: 30495.3,
                  desc: "这是备注来着1",
                  time: "13:30",
                },
                {
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
              date: "2月10日 周二",
              items: [
                {
                  type: 0,
                  category: "奶茶",
                  icon: "/static/assets/tea.png",
                  amount: 30495.2,
                  desc: "这是备注来着",
                  time: "13:30",
                },
                {
                  type: 1,
                  category: "奶茶1",
                  icon: "/static/assets/tea.png",
                  amount: 30495.3,
                  desc: "这是备注来着1",
                  time: "13:30",
                },
                {
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
              date: "4月10日 周三",
              items: [
                {
                  type: 0,
                  category: "奶茶",
                  icon: "/static/assets/tea.png",
                  amount: 30495.2,
                  desc: "这是备注来着",
                  time: "13:30",
                },
                {
                  type: 1,
                  category: "奶茶1",
                  icon: "/static/assets/tea.png",
                  amount: 30495.3,
                  desc: "这是备注来着1",
                  time: "13:30",
                },
                {
                  type: 1,
                  category: "奶茶2",
                  icon: "/static/assets/tea.png",
                  amount: 30495.5,
                  desc: "这是备注来着2",
                  time: "13:30",
                },
              ],
            },
          ],
        },
        {
          year: "2021",
          items: [
            {
              date: "1月19日 周一",
              items: [
                {
                  type: 0,
                  category: "奶茶",
                  icon: "/static/assets/tea.png",
                  amount: 30495.2,
                  desc: "这是备注来着",
                  time: "13:30",
                },
                {
                  type: 1,
                  category: "奶茶1",
                  icon: "/static/assets/tea.png",
                  amount: 30495.3,
                  desc: "这是备注来着1",
                  time: "13:30",
                },
                {
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
              date: "2月10日 周二",
              items: [
                {
                  type: 0,
                  category: "奶茶",
                  icon: "/static/assets/tea.png",
                  amount: 30495.2,
                  desc: "这是备注来着",
                  time: "13:30",
                },
                {
                  type: 1,
                  category: "奶茶1",
                  icon: "/static/assets/tea.png",
                  amount: 30495.3,
                  desc: "这是备注来着1",
                  time: "13:30",
                },
                {
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
              date: "4月10日 周三",
              items: [
                {
                  type: 0,
                  category: "奶茶",
                  icon: "/static/assets/tea.png",
                  amount: 30495.2,
                  desc: "这是备注来着",
                  time: "13:30",
                },
                {
                  type: 1,
                  category: "奶茶1",
                  icon: "/static/assets/tea.png",
                  amount: 30495.3,
                  desc: "这是备注来着1",
                  time: "13:30",
                },
                {
                  type: 1,
                  category: "奶茶2",
                  icon: "/static/assets/tea.png",
                  amount: 30495.5,
                  desc: "这是备注来着2",
                  time: "13:30",
                },
              ],
            },
          ],
        },
        {
          year: "2022",
          items: [
            {
              date: "1月19日 周一",
              items: [
                {
                  type: 0,
                  category: "奶茶",
                  icon: "/static/assets/tea.png",
                  amount: 30495.2,
                  desc: "这是备注来着",
                  time: "13:30",
                },
                {
                  type: 1,
                  category: "奶茶1",
                  icon: "/static/assets/tea.png",
                  amount: 30495.3,
                  desc: "这是备注来着1",
                  time: "13:30",
                },
                {
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
              date: "2月10日 周二",
              items: [
                {
                  type: 0,
                  category: "奶茶",
                  icon: "/static/assets/tea.png",
                  amount: 30495.2,
                  desc: "这是备注来着",
                  time: "13:30",
                },
                {
                  type: 1,
                  category: "奶茶1",
                  icon: "/static/assets/tea.png",
                  amount: 30495.3,
                  desc: "这是备注来着1",
                  time: "13:30",
                },
                {
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
              date: "4月10日 周三",
              items: [
                {
                  type: 0,
                  category: "奶茶",
                  icon: "/static/assets/tea.png",
                  amount: 30495.2,
                  desc: "这是备注来着",
                  time: "13:30",
                },
                {
                  type: 1,
                  category: "奶茶1",
                  icon: "/static/assets/tea.png",
                  amount: 30495.3,
                  desc: "这是备注来着1",
                  time: "13:30",
                },
                {
                  type: 1,
                  category: "奶茶2",
                  icon: "/static/assets/tea.png",
                  amount: 30495.5,
                  desc: "这是备注来着2",
                  time: "13:30",
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-bill-month-group {
  margin: 0 10px;
  .group-year {
    padding: 10px 20px;
    font-weight: bold;
  }
  .group-year-item {
    padding: 5px 0;
    border-radius: 13px;
    background: white;
    .group-month-item {
      .month-item-date {
        padding: 10px 20px;
        color: $grey-black-text-color;
        font-weight: 600;
      }
    }
  }
}
</style>
