<template>
	<view class="column" @tap="choseCategory(category)">
		<view class="category">
			<image class="category-icon" :src="category.iconUrl"></image>
			<text class="category-name fs16">{{ category.name }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "categoryItem",
		props: {
			category: {
				type: Object,
				default: {}
			}
		},
		methods: {
			choseCategory(category) {
				// console.log(category)
				this.$emit('choseItem', category)
			}
		}
	}
</script>

<style lang="scss">
	.column {
		width: 20%;
		float: left;
		margin: 18rpx 0;

		.category {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.category-name {
				font-size: 24rpx;
				padding: 8rpx 0;
				color: $secondaryText;
			}
		}

		.category .money {
			font-size: 20rpx;
			color: $secondaryText;
		}

		.category-icon {
			width: 60rpx;
			height: 60rpx;
			margin-right: 12rpx;
		}
	}
</style>
