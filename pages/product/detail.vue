<template>
	<view class="container">
		<!-- 商品图片轮播 -->
		<swiper class="product-images" indicator-dots="true" autoplay="false">
			<swiper-item v-for="(image, index) in product.images" :key="index">
				<image :src="image" class="product-image" @click="previewImage(index)"></image>
			</swiper-item>
		</swiper>
		
		<!-- 商品信息 -->
		<view class="product-info">
			<view class="product-header">
				<text class="product-name">{{product.name}}</text>
				<text class="product-desc">{{product.desc}}</text>
			</view>
			
			<view class="product-price">
				<text class="current-price">¥{{product.price}}</text>
				<text class="original-price" v-if="product.originalPrice">¥{{product.originalPrice}}</text>
				<text class="discount" v-if="product.originalPrice">省¥{{product.originalPrice - product.price}}</text>
			</view>
			
			<view class="product-tags">
				<text class="tag" v-for="(tag, index) in product.tags" :key="index">{{tag}}</text>
			</view>
			
			<view class="product-specs">
				<view class="spec-item" v-for="(spec, index) in product.specs" :key="index">
					<text class="spec-label">{{spec.label}}</text>
					<text class="spec-value">{{spec.value}}</text>
				</view>
			</view>
		</view>
		
		<!-- 商品详情 -->
		<view class="product-detail">
			<view class="detail-tabs">
				<view class="tab-item" :class="{ active: activeTab === 'detail' }" @click="switchTab('detail')">
					<text>商品详情</text>
				</view>
				<view class="tab-item" :class="{ active: activeTab === 'params' }" @click="switchTab('params')">
					<text>规格参数</text>
				</view>
				<view class="tab-item" :class="{ active: activeTab === 'reviews' }" @click="switchTab('reviews')">
					<text>用户评价</text>
				</view>
			</view>
			
			<view class="detail-content">
				<view v-if="activeTab === 'detail'">
					<image v-for="(image, index) in product.detailImages" :key="index" :src="image" class="detail-image"></image>
				</view>
				<view v-else-if="activeTab === 'params'">
					<view class="param-item" v-for="(param, index) in product.params" :key="index">
						<text class="param-label">{{param.label}}</text>
						<text class="param-value">{{param.value}}</text>
					</view>
				</view>
				<view v-else-if="activeTab === 'reviews'">
					<view class="review-item" v-for="(review, index) in product.reviews" :key="index">
						<view class="review-header">
							<image :src="review.avatar" class="review-avatar"></image>
							<view class="review-info">
								<text class="review-name">{{review.name}}</text>
								<text class="review-rating">⭐⭐⭐⭐⭐</text>
							</view>
							<text class="review-date">{{review.date}}</text>
						</view>
						<text class="review-content">{{review.content}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="action-buttons">
				<view class="action-btn" @click="goToCart">
					<text class="action-icon">🛒</text>
					<text class="action-label">购物车</text>
					<text class="cart-count" v-if="cartCount > 0">{{cartCount}}</text>
				</view>
				<view class="action-btn" @click="toggleFavorite">
					<text class="action-icon">{{isFavorite ? '❤️' : '🤍'}}</text>
					<text class="action-label">收藏</text>
				</view>
				<view class="action-btn" @click="contactService">
					<text class="action-icon">💬</text>
					<text class="action-label">客服</text>
				</view>
			</view>
			<button class="add-cart-btn" @click="addToCart">加入购物车</button>
			<button class="buy-now-btn" @click="buyNow">立即购买</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeTab: 'detail',
				isFavorite: false,
				cartCount: 3,
				product: {}
			}
		},
		onLoad(options) {
			if (options.id) {
				this.loadProductDetail(options.id)
			}
			this.updateCartCount()
		},
		onShow() {
			// 页面显示时更新购物车数量
			this.updateCartCount()
		},
		methods: {
			async loadProductDetail(id) {
				try {
					// 从JSON文件加载商品详情
					const res = await uni.request({
						url: '/static/data/products.json',
						method: 'GET'
					})
					
					if (res.data && res.data.products) {
						const product = res.data.products.find(p => p.id == id)
						if (product) {
							this.product = product
							console.log('商品详情加载完成:', product.name)
						} else {
							uni.showToast({
								title: '商品不存在',
								icon: 'error'
							})
						}
					}
					this.updateCartCount()
				} catch (error) {
					console.error('加载商品详情失败:', error)
					uni.showToast({
						title: '数据加载失败',
						icon: 'error'
					})
				}
			},
			previewImage(index) {
				uni.previewImage({
					current: index,
					urls: this.product.images
				})
			},
			switchTab(tab) {
				this.activeTab = tab
			},
			toggleFavorite() {
				this.isFavorite = !this.isFavorite
				uni.showToast({
					title: this.isFavorite ? '已收藏' : '已取消收藏',
					icon: 'success'
				})
			},
			async addToCart() {
				const cartManager = getApp().globalData.cartManager
				
				const result = await cartManager.addToCart(this.product)
				
				uni.showToast({
					title: result.message,
					icon: result.success ? 'success' : 'error'
				})
				
				if (result.success) {
					this.cartCount = result.cartCount
				}
			},
			buyNow() {
				uni.showModal({
					title: '确认购买',
					content: `确定要购买 ${this.product.name} 吗？`,
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '跳转到订单页面',
								icon: 'none'
							})
						}
					}
				})
			},
			goToCart() {
				uni.switchTab({
					url: '/pages/cart/cart'
				})
			},
			contactService() {
				uni.showToast({
					title: '跳转到客服页面',
					icon: 'none'
				})
			},
			async updateCartCount() {
				const cartManager = getApp().globalData.cartManager
				const cartData = await cartManager.getCartData()
				this.cartCount = cartManager.getCartCount(cartData)
			}
		}
	}
</script>

<style>
	.container {
		background-color: #f8f9fa;
		padding-bottom: 140rpx;
		min-height: 100vh;
	}
	
	.product-images {
		height: 750rpx;
		background-color: #fff;
		border-radius: 0 0 24rpx 24rpx;
		overflow: hidden;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
	}
	
	.product-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.product-info {
		background-color: #fff;
		padding: 40rpx 30rpx;
		margin: 20rpx 20rpx 20rpx 20rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
	}
	
	.product-header {
		margin-bottom: 20rpx;
	}
	
	.product-name {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 15rpx;
		line-height: 1.4;
	}
	
	.product-desc {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}
	
	.product-price {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.current-price {
		font-size: 52rpx;
		color: #FF6B35;
		font-weight: 700;
		margin-right: 20rpx;
		text-shadow: 0 2rpx 4rpx rgba(255, 107, 53, 0.2);
	}
	
	.original-price {
		font-size: 28rpx;
		color: #999;
		text-decoration: line-through;
		margin-right: 20rpx;
	}
	
	.discount {
		background: linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%);
		color: #fff;
		font-size: 24rpx;
		font-weight: 600;
		padding: 10rpx 18rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 12rpx rgba(255, 107, 53, 0.3);
	}
	
	.product-tags {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 30rpx;
	}
	
	.tag {
		background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
		color: #1976D2;
		font-size: 24rpx;
		font-weight: 500;
		padding: 12rpx 20rpx;
		border-radius: 24rpx;
		margin-right: 15rpx;
		margin-bottom: 15rpx;
		border: 1rpx solid rgba(25, 118, 210, 0.2);
		box-shadow: 0 2rpx 8rpx rgba(25, 118, 210, 0.1);
	}
	
	.product-specs {
		border-top: 1rpx solid #f5f5f5;
		padding-top: 20rpx;
	}
	
	.spec-item {
		display: flex;
		justify-content: space-between;
		padding: 15rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}
	
	.spec-item:last-child {
		border-bottom: none;
	}
	
	.spec-label {
		font-size: 28rpx;
		color: #666;
	}
	
	.spec-value {
		font-size: 28rpx;
		color: #333;
	}
	
	.product-detail {
		background-color: #fff;
		margin: 0 20rpx 20rpx 20rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
		overflow: hidden;
	}
	
	.detail-tabs {
		display: flex;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
		background-color: #fafafa;
	}
	
	.tab-item {
		flex: 1;
		text-align: center;
		padding: 32rpx 0;
		font-size: 30rpx;
		color: #666;
		position: relative;
		transition: all 0.3s ease;
		font-weight: 500;
	}
	
	.tab-item.active {
		color: #FF6B35;
		font-weight: 600;
		background-color: #fff;
	}
	
	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 80rpx;
		height: 6rpx;
		background: linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%);
		border-radius: 3rpx 3rpx 0 0;
		box-shadow: 0 -2rpx 8rpx rgba(255, 107, 53, 0.3);
	}
	
	.detail-content {
		padding: 30rpx;
	}
	
	.detail-image {
		width: 100%;
		margin-bottom: 20rpx;
	}
	
	.param-item {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}
	
	.param-item:last-child {
		border-bottom: none;
	}
	
	.param-label {
		font-size: 28rpx;
		color: #666;
		width: 200rpx;
	}
	
	.param-value {
		font-size: 28rpx;
		color: #333;
		flex: 1;
		text-align: right;
	}
	
	.review-item {
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}
	
	.review-item:last-child {
		border-bottom: none;
	}
	
	.review-header {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.review-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		margin-right: 20rpx;
	}
	
	.review-info {
		flex: 1;
	}
	
	.review-name {
		font-size: 28rpx;
		color: #333;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.review-rating {
		font-size: 24rpx;
	}
	
	.review-date {
		font-size: 24rpx;
		color: #999;
	}
	
	.review-content {
		font-size: 28rpx;
		color: #333;
		line-height: 1.6;
	}
	
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 1) 100%);
		backdrop-filter: blur(20rpx);
		padding: 24rpx 30rpx 40rpx 30rpx;
		display: flex;
		align-items: center;
		border-top: 1rpx solid rgba(0, 0, 0, 0.05);
		z-index: 999;
		box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.08);
		gap: 20rpx;
	}
	
	.action-buttons {
		display: flex;
		gap: 20rpx;
		flex-shrink: 0;
	}
	
	.action-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		padding: 12rpx;
		border-radius: 16rpx;
		transition: all 0.3s ease;
	}
	
	.action-btn:active {
		transform: scale(0.95);
		background-color: rgba(255, 107, 53, 0.1);
	}
	
	.action-icon {
		font-size: 44rpx;
		margin-bottom: 8rpx;
		filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.1));
	}
	
	.action-label {
		font-size: 22rpx;
		color: #666;
		font-weight: 500;
	}
	
	.cart-count {
		position: absolute;
		top: 4rpx;
		right: 4rpx;
		background: linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%);
		color: #fff;
		font-size: 20rpx;
		font-weight: bold;
		padding: 6rpx 10rpx;
		border-radius: 24rpx;
		min-width: 32rpx;
		text-align: center;
		box-shadow: 0 4rpx 12rpx rgba(255, 107, 53, 0.4);
		border: 2rpx solid #fff;
	}
	
	.add-cart-btn {
		background: linear-gradient(135deg, #FFB74D 0%, #FF9800 100%);
		color: #fff;
		border-radius: 24rpx;
		padding: 20rpx 32rpx;
		font-size: 30rpx;
		font-weight: 600;
		border: none;
		min-width: 200rpx;
		max-width: 240rpx;
		flex: 1;
		box-shadow: 0 8rpx 24rpx rgba(255, 152, 0, 0.3);
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
		white-space: nowrap;
	}
	
	.add-cart-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.5s;
	}
	
	.add-cart-btn:active::before {
		left: 100%;
	}
	
	.add-cart-btn:active {
		transform: translateY(2rpx);
		box-shadow: 0 4rpx 12rpx rgba(255, 152, 0, 0.4);
	}
	
	.buy-now-btn {
		background: linear-gradient(135deg, #FF6B35 0%, #E53935 100%);
		color: #fff;
		border-radius: 24rpx;
		padding: 20rpx 32rpx;
		font-size: 30rpx;
		font-weight: 600;
		border: none;
		min-width: 200rpx;
		max-width: 240rpx;
		flex: 1;
		box-shadow: 0 8rpx 24rpx rgba(255, 107, 53, 0.4);
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
		white-space: nowrap;
	}
	
	.buy-now-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.5s;
	}
	
	.buy-now-btn:active::before {
		left: 100%;
	}
	
	.buy-now-btn:active {
		transform: translateY(2rpx);
		box-shadow: 0 4rpx 12rpx rgba(255, 107, 53, 0.5);
	}
	
	/* 响应式设计 - 针对小屏幕设备优化 */
	@media screen and (max-width: 750rpx) {
		.bottom-bar {
			padding: 20rpx 24rpx 36rpx 24rpx;
			gap: 16rpx;
		}
		
		.action-buttons {
			gap: 16rpx;
		}
		
		.action-btn {
			padding: 8rpx;
		}
		
		.action-icon {
			font-size: 40rpx;
		}
		
		.action-label {
			font-size: 20rpx;
		}
		
		.add-cart-btn,
		.buy-now-btn {
			min-width: 180rpx;
			max-width: 220rpx;
			padding: 18rpx 28rpx;
			font-size: 28rpx;
		}
	}
	
	/* 针对超小屏幕设备的进一步优化 */
	@media screen and (max-width: 650rpx) {
		.bottom-bar {
			padding: 18rpx 20rpx 32rpx 20rpx;
			gap: 12rpx;
		}
		
		.action-buttons {
			gap: 12rpx;
		}
		
		.add-cart-btn,
		.buy-now-btn {
			min-width: 160rpx;
			max-width: 200rpx;
			padding: 16rpx 24rpx;
			font-size: 26rpx;
		}
	}
</style>

