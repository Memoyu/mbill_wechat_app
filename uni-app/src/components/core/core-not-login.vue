<template>
	<view class="login-message">
		<view>
			<button class="to-login-btn" @tap="redirectTo">登录</button>
			<view class="continue" style="font-size: 14px; margin-top: 6px">
				{{title}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "notLogin",
		props: {
			title: {
				type: String,
				default: '亲爱的，请先登陆噢！'
			}
		},
		methods: {
			redirectTo() {
				console.log("按下")
				uni.redirectTo({
					url: 'pages/profile/login'
				})
			}
		}
	}
</script>

<style lang="scss">
	.login-message {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		z-index: 120;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;

		.to-login-btn {
			background: #be6868;
			color: white;
			font-size: 35rpx;
		}

		.continue {
			color: #999;
		}
	}
</style>
