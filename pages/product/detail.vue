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
				product: {
					id: 1,
					name: 'iPhone 15 Pro 深空黑色 256GB',
					desc: '全新A17 Pro芯片，钛金属设计，专业级摄像头系统',
					price: 7999,
					originalPrice: 8999,
					images: [
						'https://via.placeholder.com/750x750/FF6B35/FFFFFF?text=iPhone+正面',
						'https://via.placeholder.com/750x750/4ECDC4/FFFFFF?text=iPhone+背面',
						'https://via.placeholder.com/750x750/45B7D1/FFFFFF?text=iPhone+侧面'
					],
					tags: ['官方正品', '全国联保', '7天无理由退货'],
					specs: [
						{ label: '颜色', value: '深空黑色' },
						{ label: '存储', value: '256GB' },
						{ label: '屏幕', value: '6.1英寸Super Retina XDR' },
						{ label: '芯片', value: 'A17 Pro芯片' },
						{ label: '摄像头', value: '4800万像素主摄' }
					],
					params: [
						{ label: '品牌', value: 'Apple' },
						{ label: '型号', value: 'iPhone 15 Pro' },
						{ label: '颜色', value: '深空黑色' },
						{ label: '存储容量', value: '256GB' },
						{ label: '屏幕尺寸', value: '6.1英寸' },
						{ label: '分辨率', value: '2556×1179像素' },
						{ label: '处理器', value: 'A17 Pro芯片' },
						{ label: '摄像头', value: '4800万像素主摄' },
						{ label: '电池容量', value: '3274mAh' },
						{ label: '操作系统', value: 'iOS 17' }
					],
					detailImages: [
						'https://via.placeholder.com/750x1000/FF6B35/FFFFFF?text=商品详情1',
						'https://via.placeholder.com/750x800/4ECDC4/FFFFFF?text=商品详情2',
						'https://via.placeholder.com/750x900/45B7D1/FFFFFF?text=商品详情3'
					],
					reviews: [
						{
							name: '用户***123',
							avatar: 'https://via.placeholder.com/80x80/FF6B35/FFFFFF?text=头像',
							rating: 5,
							date: '2024-01-15',
							content: '手机很漂亮，拍照效果很好，系统流畅，值得购买！'
						},
						{
							name: '用户***456',
							avatar: 'https://via.placeholder.com/80x80/4ECDC4/FFFFFF?text=头像',
							rating: 5,
							date: '2024-01-10',
							content: '钛金属手感很好，重量适中，电池续航也不错。'
						},
						{
							name: '用户***789',
							avatar: 'https://via.placeholder.com/80x80/45B7D1/FFFFFF?text=头像',
							rating: 4,
							date: '2024-01-08',
							content: '整体不错，就是价格有点贵，不过质量确实好。'
						}
					]
				}
			}
		},
		onLoad(options) {
			if (options.id) {
				this.loadProductDetail(options.id)
			}
		},
		methods: {
			loadProductDetail(id) {
				// 根据ID加载商品详情
				console.log('加载商品详情:', id)
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
			addToCart() {
				uni.showToast({
					title: '已加入购物车',
					icon: 'success'
				})
				this.cartCount++
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
			}
		}
	}
</script>

<style>
	.container {
		background-color: #f5f5f5;
		padding-bottom: 120rpx;
	}
	
	.product-images {
		height: 750rpx;
		background-color: #fff;
	}
	
	.product-image {
		width: 100%;
		height: 100%;
	}
	
	.product-info {
		background-color: #fff;
		padding: 30rpx;
		margin-bottom: 20rpx;
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
		font-size: 48rpx;
		color: #FF6B35;
		font-weight: bold;
		margin-right: 20rpx;
	}
	
	.original-price {
		font-size: 28rpx;
		color: #999;
		text-decoration: line-through;
		margin-right: 20rpx;
	}
	
	.discount {
		background-color: #FF6B35;
		color: #fff;
		font-size: 24rpx;
		padding: 8rpx 16rpx;
		border-radius: 20rpx;
	}
	
	.product-tags {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 30rpx;
	}
	
	.tag {
		background-color: #FF6B35;
		color: #fff;
		font-size: 24rpx;
		padding: 8rpx 16rpx;
		border-radius: 20rpx;
		margin-right: 15rpx;
		margin-bottom: 15rpx;
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
		margin-bottom: 20rpx;
	}
	
	.detail-tabs {
		display: flex;
		border-bottom: 1rpx solid #eee;
	}
	
	.tab-item {
		flex: 1;
		text-align: center;
		padding: 30rpx 0;
		font-size: 32rpx;
		color: #666;
		position: relative;
	}
	
	.tab-item.active {
		color: #FF6B35;
		font-weight: bold;
	}
	
	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60rpx;
		height: 4rpx;
		background-color: #FF6B35;
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
		background-color: #fff;
		padding: 20rpx;
		display: flex;
		align-items: center;
		border-top: 1rpx solid #eee;
		z-index: 999;
	}
	
	.action-buttons {
		display: flex;
		margin-right: 20rpx;
	}
	
	.action-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 40rpx;
		position: relative;
	}
	
	.action-icon {
		font-size: 40rpx;
		margin-bottom: 8rpx;
	}
	
	.action-label {
		font-size: 24rpx;
		color: #666;
	}
	
	.cart-count {
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
	
	.add-cart-btn {
		background-color: #FF6B35;
		color: #fff;
		border-radius: 50rpx;
		padding: 25rpx 40rpx;
		font-size: 32rpx;
		margin-right: 20rpx;
		border: none;
	}
	
	.buy-now-btn {
		background-color: #FF6B35;
		color: #fff;
		border-radius: 50rpx;
		padding: 25rpx 40rpx;
		font-size: 32rpx;
		border: none;
	}
</style>

