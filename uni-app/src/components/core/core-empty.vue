<template>
	<view class="empty">
		<view class="iconfont icon-empty empty-no-more"></view>
		<view class="title fs14">{{ title }}</view>
	</view>
</template>

<script>
	export default {
		name: 'empty',
		props: {
			title: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style lang="scss">
	.empty {
		text-align: center;

		.empty-no-more {
			font-size: 240rpx;
			color: #be6868;
		}

		.title {
			color: #999;
		}
	}
</style>
