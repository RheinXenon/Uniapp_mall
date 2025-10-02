<template>
	<view class="container">
		<!-- 用户信息头部 -->
		<view class="user-header">
			<view class="user-info">
				<image class="avatar" :src="userInfo.avatar" @click="changeAvatar"></image>
				<view class="user-details">
					<text class="username">{{userInfo.name}}</text>
					<text class="user-desc">{{userInfo.desc}}</text>
				</view>
			</view>
			<view class="user-stats">
				<view class="stat-item" @click="goToOrders">
					<text class="stat-number">{{userInfo.orderCount}}</text>
					<text class="stat-label">订单</text>
				</view>
				<view class="stat-item" @click="goToFavorites">
					<text class="stat-number">{{userInfo.favoriteCount}}</text>
					<text class="stat-label">收藏</text>
				</view>
				<view class="stat-item" @click="goToCoupons">
					<text class="stat-number">{{userInfo.couponCount}}</text>
					<text class="stat-label">优惠券</text>
				</view>
			</view>
		</view>
		
		<!-- 订单状态 -->
		<view class="order-section">
			<view class="section-header">
				<text class="section-title">我的订单</text>
				<text class="more" @click="goToOrders">查看全部 ></text>
			</view>
			<view class="order-status">
				<view class="status-item" @click="goToOrders('pending')">
					<text class="status-icon">⏰</text>
					<text class="status-label">待付款</text>
					<text class="status-badge" v-if="orderStatus.pending > 0">{{orderStatus.pending}}</text>
				</view>
				<view class="status-item" @click="goToOrders('paid')">
					<text class="status-icon">📦</text>
					<text class="status-label">待发货</text>
					<text class="status-badge" v-if="orderStatus.paid > 0">{{orderStatus.paid}}</text>
				</view>
				<view class="status-item" @click="goToOrders('shipped')">
					<text class="status-icon">🚚</text>
					<text class="status-label">待收货</text>
					<text class="status-badge" v-if="orderStatus.shipped > 0">{{orderStatus.shipped}}</text>
				</view>
				<view class="status-item" @click="goToOrders('completed')">
					<text class="status-icon">✅</text>
					<text class="status-label">已完成</text>
				</view>
			</view>
		</view>
		
		<!-- 功能菜单 -->
		<view class="menu-section">
			<view class="menu-group">
				<view class="menu-item" @click="goToAddress">
					<text class="menu-icon">📍</text>
					<text class="menu-label">收货地址</text>
					<text class="menu-arrow">></text>
				</view>
				<view class="menu-item" @click="goToFavorites">
					<text class="menu-icon">❤️</text>
					<text class="menu-label">我的收藏</text>
					<text class="menu-arrow">></text>
				</view>
				<view class="menu-item" @click="goToCoupons">
					<text class="menu-icon">🎫</text>
					<text class="menu-label">优惠券</text>
					<text class="menu-arrow">></text>
				</view>
			</view>
			
			<view class="menu-group">
				<view class="menu-item" @click="goToCustomerService">
					<text class="menu-icon">💬</text>
					<text class="menu-label">客服中心</text>
					<text class="menu-arrow">></text>
				</view>
				<view class="menu-item" @click="goToSettings">
					<text class="menu-icon">⚙️</text>
					<text class="menu-label">设置</text>
					<text class="menu-arrow">></text>
				</view>
				<view class="menu-item" @click="goToAbout">
					<text class="menu-icon">ℹ️</text>
					<text class="menu-label">关于我们</text>
					<text class="menu-arrow">></text>
				</view>
			</view>
		</view>
		
		<!-- 退出登录 -->
		<view class="logout-section">
			<button class="logout-btn" @click="logout">退出登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					name: '用户昵称',
					desc: '普通会员',
					avatar: '/static/avatars/avatar1.svg',
					orderCount: 12,
					favoriteCount: 8,
					couponCount: 3
				},
				orderStatus: {
					pending: 2,
					paid: 1,
					shipped: 3,
					completed: 6
				}
			}
		},
		onLoad() {
			this.loadUserData()
		},
		methods: {
			loadUserData() {
				// 加载用户数据
				console.log('加载用户数据')
			},
			changeAvatar() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.userInfo.avatar = res.tempFilePaths[0]
					}
				})
			},
			goToOrders(status = '') {
				uni.showToast({
					title: '跳转到订单页面',
					icon: 'none'
				})
			},
			goToFavorites() {
				uni.showToast({
					title: '跳转到收藏页面',
					icon: 'none'
				})
			},
			goToCoupons() {
				uni.showToast({
					title: '跳转到优惠券页面',
					icon: 'none'
				})
			},
			goToAddress() {
				uni.showToast({
					title: '跳转到地址管理页面',
					icon: 'none'
				})
			},
			goToCustomerService() {
				uni.showToast({
					title: '跳转到客服页面',
					icon: 'none'
				})
			},
			goToSettings() {
				uni.showToast({
					title: '跳转到设置页面',
					icon: 'none'
				})
			},
			goToAbout() {
				uni.showModal({
					title: '关于我们',
					content: '这是一个简单的在线商城UniApp\n软件工程课程作业\n版本：1.0.0\n开发者：RheinXenon',
					showCancel: false
				})
			},
			logout() {
				uni.showModal({
					title: '确认退出',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '已退出登录',
								icon: 'success'
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
	.container {
		background-color: #f5f5f5;
		min-height: 100vh;
	}
	
	.user-header {
		background: linear-gradient(135deg, #FF6B35, #F7931E);
		padding: 40rpx 30rpx 30rpx;
		color: #fff;
	}
	
	.user-info {
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
	}
	
	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		margin-right: 30rpx;
		border: 4rpx solid rgba(255, 255, 255, 0.3);
	}
	
	.user-details {
		flex: 1;
	}
	
	.username {
		font-size: 36rpx;
		font-weight: bold;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.user-desc {
		font-size: 28rpx;
		opacity: 0.8;
	}
	
	.user-stats {
		display: flex;
		justify-content: space-around;
	}
	
	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.stat-number {
		font-size: 40rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	
	.stat-label {
		font-size: 24rpx;
		opacity: 0.8;
	}
	
	.order-section {
		background-color: #fff;
		margin: 20rpx;
		border-radius: 20rpx;
		padding: 30rpx;
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.more {
		font-size: 28rpx;
		color: #FF6B35;
	}
	
	.order-status {
		display: flex;
		justify-content: space-around;
	}
	
	.status-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}
	
	.status-icon {
		font-size: 48rpx;
		margin-bottom: 10rpx;
	}
	
	.status-label {
		font-size: 24rpx;
		color: #666;
	}
	
	.status-badge {
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		background-color: #FF6B35;
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 8rpx;
		border-radius: 20rpx;
		min-width: 30rpx;
		text-align: center;
	}
	
	.menu-section {
		margin: 20rpx;
	}
	
	.menu-group {
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
	}
	
	.menu-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #f5f5f5;
	}
	
	.menu-item:last-child {
		border-bottom: none;
	}
	
	.menu-icon {
		font-size: 40rpx;
		margin-right: 30rpx;
		width: 40rpx;
		text-align: center;
	}
	
	.menu-label {
		flex: 1;
		font-size: 32rpx;
		color: #333;
	}
	
	.menu-arrow {
		font-size: 28rpx;
		color: #ccc;
	}
	
	.logout-section {
		padding: 40rpx 20rpx;
	}
	
	.logout-btn {
		background-color: #fff;
		color: #FF6B35;
		border: 2rpx solid #FF6B35;
		border-radius: 50rpx;
		padding: 25rpx;
		font-size: 32rpx;
		width: 100%;
	}
</style>

