<template>
  <view class="b-container">
    <view class="edit-header">
      <view class="list-title">{{ groupName }}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      groupId: 0,
      groupName: "",
    };
  },
  onLoad(options) {
    this.groupId = options.groupId;
    this.groupName = options.groupName
      ? decodeURIComponent(options.groupName)
      : "";
  },
  onShow() {},
  methods: {},
};
</script>

<style>
.b-container {
}
</style>
