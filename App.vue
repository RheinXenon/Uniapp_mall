<script>
	export default {
		onLaunch: function() {
			console.log('商城App启动')
		},
		onShow: function() {
			console.log('商城App显示')
		},
		onHide: function() {
			console.log('商城App隐藏')
		}
	}
</script>

<style>
	/* 全局样式 */
	page {
		background-color: #f5f5f5;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
	}
	
	/* 通用按钮样式 */
	.btn-primary {
		background-color: #FF6B35;
		color: #fff;
		border-radius: 50rpx;
		padding: 20rpx 40rpx;
		font-size: 32rpx;
		border: none;
	}
	
	.btn-secondary {
		background-color: #fff;
		color: #FF6B35;
		border: 2rpx solid #FF6B35;
		border-radius: 50rpx;
		padding: 20rpx 40rpx;
		font-size: 32rpx;
	}
	
	/* 通用卡片样式 */
	.card {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}
	
	/* 通用文本样式 */
	.text-primary {
		color: #FF6B35;
	}
	
	.text-secondary {
		color: #666;
	}
	
	.text-muted {
		color: #999;
	}
	
	/* 通用间距 */
	.mt-10 { margin-top: 10rpx; }
	.mt-20 { margin-top: 20rpx; }
	.mt-30 { margin-top: 30rpx; }
	.mb-10 { margin-bottom: 10rpx; }
	.mb-20 { margin-bottom: 20rpx; }
	.mb-30 { margin-bottom: 30rpx; }
	.ml-10 { margin-left: 10rpx; }
	.ml-20 { margin-left: 20rpx; }
	.mr-10 { margin-right: 10rpx; }
	.mr-20 { margin-right: 20rpx; }
	
	.p-10 { padding: 10rpx; }
	.p-20 { padding: 20rpx; }
	.p-30 { padding: 30rpx; }
	
	/* 通用布局 */
	.flex {
		display: flex;
	}
	
	.flex-column {
		flex-direction: column;
	}
	
	.flex-center {
		justify-content: center;
		align-items: center;
	}
	
	.flex-between {
		justify-content: space-between;
	}
	
	.flex-around {
		justify-content: space-around;
	}
	
	/* 通用字体大小 */
	.text-xs { font-size: 20rpx; }
	.text-sm { font-size: 24rpx; }
	.text-base { font-size: 28rpx; }
	.text-lg { font-size: 32rpx; }
	.text-xl { font-size: 36rpx; }
	.text-2xl { font-size: 40rpx; }
	.text-3xl { font-size: 48rpx; }
	
	/* 通用字体粗细 */
	.font-normal { font-weight: normal; }
	.font-bold { font-weight: bold; }
	
	/* 通用圆角 */
	.rounded { border-radius: 10rpx; }
	.rounded-lg { border-radius: 20rpx; }
	.rounded-full { border-radius: 50rpx; }
	
	/* 通用阴影 */
	.shadow {
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}
	
	.shadow-lg {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
	}
</style>
