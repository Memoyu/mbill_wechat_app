<template>
  <view class="category">
    <core-tabs :type="tabList" v-model="active"></core-tabs>
    <view v-for="(item, index) in statements" :key="index">
      <mbill-bill-statement-item :bill="item"></mbill-bill-statement-item>
    </view>
    <core-empty v-if="statements.length == 0" :title="emptyTitle"></core-empty>
    <uni-load-more v-else-if="showLoadMore" :status="status" :content-text="contentText"></uni-load-more>
  </view>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "rateChart",
  props: {
    date: {
      type: Object
    }
  },
  data() {
    return {
      active: 0,
      statements: [],
      tabList: [
        {
          title: "支出"
        },
        {
          title: "收入"
        }
      ],
      emptyTitle: "空空如也！",
      showLoadMore: false,
      status: "more",
      contentText: {
        contentdown: "上拉加载更多",
        contentrefresh: "加载中",
        contentnomore: "没有更多"
      },
      total: 0,
      page: {
        UserId: 0,
        Year: 0,
        Month: 0,
        Type: "expend",
        Sort: "Amount-DESC,Time-DESC",
        Size: 10,
        Page: 0
      }
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  watch: {
    active() {
      this.handleChange()
    },
    date() {
      this.initData();
    }
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions(["getPagesAsync"]),
    initData() {
      this.getStatements(true);
    },
    onLoadMore() {
      this.status = "more";
      this.showLoadMore = true;
      var totalPage = this.total / this.page.Size;
      var currentPage = this.page.Page + 1;
      if (currentPage > totalPage) {
        this.status = "noMore";
        return;
      }

      this.page.Page += 1;
      this.status = "loading";
      this.getStatements();
    },
    // 切换Tab
    handleChange() {
      let type = "expend";
      if (this.active === 1) {
        type = "income";
      }
      this.page.Type = type;
      this.page.Page = 0;
      this.getStatements(true);
    },
    // 获取账单列表
    async getStatements(isCover = false) {
      let that = this;
      that.page.UserId = that.userInfo.id;
      that.page.Year = that.date.year;
      that.page.Month = that.date.month;
      let res = await that.getPagesAsync(that.page);
      if (isCover) {
        uni.pageScrollTo({ scrollTop: 0, duration: 0 });
        that.statements = res.items;
      } else {
        that.statements = [...that.statements, ...res.items];
      }
      that.total = res.total;
    }
  }
};
</script>

<style lang="scss">
.expend-bars {
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #212121;
    margin: 12px 0;
    padding: 8px;
    background-repeat: no-repeat;
    background-image: linear-gradient(#c1f5e7, #c1f5e7);
    border-radius: 4px;
    .title {
      font-size: 14px;
    }
    .amount {
      margin-top: 4px;
      font-size: 14px;
      color: green;
    }
    .percent {
      font-size: 12px;
      margin-left: 12px;
      color: #757575;
    }
  }
  .zan-icon-arrow {
    font-size: 14px;
    color: #ccc;
  }
}
</style>
