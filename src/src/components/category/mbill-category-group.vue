<template>
  <view class="mbill-category-group">
    <view v-for="(d, dind) in data" :key="dind">
      <view class="category-group">{{ d.date }}</view>
      <view class="category-item">
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
  </view>
</template>

<script>
export default {
  name: "mbill-category-group",
  props: {
    data: {
      type: Array,
      default: [
        {
          date: "伙食餐饮",
          items: [
            {
              icon: "/static/assets/tea.png",
              name: "奶茶",
            },
            {
              icon: "/static/assets/tea.png",
              name: "做饭食材",
            },
            {
              icon: "/static/assets/tea.png",
              name: "饮料",
            },
            {
              icon: "/static/assets/tea.png",
              name: "一日三餐",
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
          date: "交通出行",
          items: [
            {
              icon: "/static/assets/tea.png",
              name: "高铁",
            },
            {
              icon: "/static/assets/tea.png",
              name: "出租车",
            },
            {
              icon: "/static/assets/tea.png",
              name: "地铁",
            },
            {
              icon: "/static/assets/tea.png",
              name: "公交",
            },
          ],
        },
        {
          date: "医疗保障",
          items: [
            {
              icon: "/static/assets/tea.png",
              name: "药品",
            },
            {
              icon: "/static/assets/tea.png",
              name: "就诊",
            },
            {
              icon: "/static/assets/tea.png",
              name: "保险",
            },
            {
              icon: "/static/assets/tea.png",
              name: "检查",
            },
          ],
        },
        {
          date: "伙食餐饮222",
          items: [
            {
              icon: "/static/assets/tea.png",
              name: "奶茶",
            },
            {
              icon: "/static/assets/tea.png",
              name: "做饭食材",
            },
            {
              icon: "/static/assets/tea.png",
              name: "饮料",
            },
            {
              icon: "/static/assets/tea.png",
              name: "一日三餐",
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
      ],
    },
  },
  methods: {},
};
</script>

<style lang="scss" scope>
.mbill-category-group {
  margin: 0 10px;
  .category-group {
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 5px;
  }
  .category-item {
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
}
</style>
