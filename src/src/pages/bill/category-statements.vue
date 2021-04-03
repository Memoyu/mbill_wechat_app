<template>
    <view class="container">
        <view class="bill-container">
            <view v-for="(item, index) in statements" :key="index">
                <mbill-bill-statement-item :bill="item"></mbill-bill-statement-item>
            </view>
            <core-empty v-if="statements.length == 0" :title="emptyTitle"></core-empty>
            <uni-load-more v-else-if="showLoadMore" :status="status" :content-text="contentText"></uni-load-more>
            <core-login-modal/>
        </view>
    </view>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";
import Util from "@/common/utils/util";

export default {
  data() {
    return {
      emptyTitle: "空空如也！",
      statements: [],
      showLoadMore: false,
      status: "more",
      contentText: {
        contentdown: "上拉加载更多",
        contentrefresh: "加载中",
        contentnomore: "没有更多"
      },
      total: 0,
      page: {
        Year: 0,
        Month: 0,
        CategoryId: 0,
        Size: 10,
        Page: 0,
        UserId: 0
      }
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  onLoad(options) {
    if (
      options.id === undefined ||
      options.year === undefined ||
      options.month === undefined
    ) {
      uni.navigateBack({
        delta: 1
      });
    } else {
      this.page.CategoryId = options.id;
      this.page.Year = options.year;
      this.page.Month = options.month;
    }
    var name = decodeURIComponent(options.name)
    uni.setNavigationBarTitle({
      title: options.year + "-" + options.month  + " " + name + " 列表"
    });
    this.getStatement();
  },
  onReachBottom() {
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
    this.getStatement();
  },
  methods: {
    ...mapActions(["getPagesAsync"]),
    async getStatement(isCover = false) {
      let that = this;
      that.page.UserId = that.userInfo.id;
      let res = await that.getPagesAsync(that.page);
      that.statements = [...that.statements, ...res.items];
      that.total = res.total;
    }
  }
};
</script>

<style lang="scss">
</style>
