<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input">
				<text class="search-icon">🔍</text>
				<input type="text" placeholder="搜索商品" v-model="searchKeyword" />
			</view>
		</view>
		
		<!-- 轮播图 -->
		<swiper class="banner" indicator-dots="true" autoplay="true" interval="3000" duration="500">
			<swiper-item v-for="(banner, index) in banners" :key="index">
				<image :src="banner.image" class="banner-image" @click="onBannerClick(banner)"></image>
			</swiper-item>
		</swiper>
		
		<!-- 分类导航 -->
		<view class="category-nav">
			<view class="category-item" v-for="(category, index) in categories" :key="index" @click="onCategoryClick(category)">
				<view class="category-icon">{{category.icon}}</view>
				<text class="category-name">{{category.name}}</text>
			</view>
		</view>
		
		<!-- 推荐商品 -->
		<view class="section">
			<view class="section-title">
				<text>推荐商品</text>
				<text class="more" @click="goToProductList">更多 ></text>
			</view>
			<view class="product-grid">
				<view class="product-item" v-for="(product, index) in recommendProducts" :key="index" @click="goToProductDetail(product)">
					<image :src="product.image" class="product-image"></image>
					<view class="product-info">
						<text class="product-name">{{product.name}}</text>
						<view class="product-price">
							<text class="current-price">¥{{product.price}}</text>
							<text class="original-price" v-if="product.originalPrice">¥{{product.originalPrice}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchKeyword: '',
				banners: [
					{
						image: '/static/products/iphone15pro.jpg',
						link: '/pages/product/list'
					},
					{
						image: '/static/products/macbook-air.jpg',
						link: '/pages/product/list'
					},
					{
						image: '/static/products/airpods-pro.jpg',
						link: '/pages/product/list'
					}
				],
				categories: [
					{ name: '数码', icon: '📱', id: 1 },
					{ name: '服装', icon: '👕', id: 2 },
					{ name: '食品', icon: '🍎', id: 3 },
					{ name: '家居', icon: '🏠', id: 4 },
					{ name: '运动', icon: '⚽', id: 5 },
					{ name: '美妆', icon: '💄', id: 6 },
					{ name: '图书', icon: '📚', id: 7 },
					{ name: '更多', icon: '➕', id: 8 }
				],
				recommendProducts: [
					{
						id: 1,
						name: 'iPhone 15 Pro',
						price: 7999,
						originalPrice: 8999,
						image: '/static/products/iphone15pro.jpg'
					},
					{
						id: 2,
						name: 'MacBook Air',
						price: 8999,
						originalPrice: 9999,
						image: '/static/products/macbook-air.jpg'
					},
					{
						id: 3,
						name: 'AirPods Pro',
						price: 1999,
						originalPrice: 2299,
						image: '/static/products/airpods-pro.jpg'
					},
					{
						id: 4,
						name: 'iPad Pro',
						price: 5999,
						originalPrice: 6999,
						image: '/static/products/ipad-pro.jpg'
					}
				]
			}
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			loadData() {
				// 加载首页数据
				console.log('加载首页数据')
			},
			onBannerClick(banner) {
				uni.navigateTo({
					url: banner.link
				})
			},
			onCategoryClick(category) {
				if (category.id === 8) {
					// 更多分类
					uni.switchTab({
						url: '/pages/category/category'
					})
				} else {
					// 跳转到商品列表
					uni.navigateTo({
						url: `/pages/product/list?categoryId=${category.id}&categoryName=${category.name}`
					})
				}
			},
			goToProductList() {
				uni.navigateTo({
					url: '/pages/product/list'
				})
			},
			goToProductDetail(product) {
				uni.navigateTo({
					url: `/pages/product/detail?id=${product.id}`
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
	
	.search-bar {
		background-color: #FF6B35;
		padding: 20rpx;
	}
	
	.search-input {
		background-color: #fff;
		border-radius: 50rpx;
		padding: 20rpx 30rpx;
		display: flex;
		align-items: center;
	}
	
	.search-icon {
		margin-right: 20rpx;
		font-size: 32rpx;
	}
	
	.banner {
		height: 300rpx;
		margin: 20rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}
	
	.banner-image {
		width: 100%;
		height: 100%;
	}
	
	.category-nav {
		background-color: #fff;
		margin: 20rpx;
		border-radius: 20rpx;
		padding: 30rpx 20rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	
	.category-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 25%;
		margin-bottom: 30rpx;
	}
	
	.category-icon {
		font-size: 60rpx;
		margin-bottom: 10rpx;
	}
	
	.category-name {
		font-size: 24rpx;
		color: #333;
	}
	
	.section {
		background-color: #fff;
		margin: 20rpx;
		border-radius: 20rpx;
		padding: 30rpx;
	}
	
	.section-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		font-size: 32rpx;
		font-weight: bold;
	}
	
	.more {
		color: #FF6B35;
		font-size: 28rpx;
	}
	
	.product-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	
	.product-item {
		width: 48%;
		background-color: #f9f9f9;
		border-radius: 15rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
	}
	
	.product-image {
		width: 100%;
		height: 200rpx;
	}
	
	.product-info {
		padding: 20rpx;
	}
	
	.product-name {
		font-size: 28rpx;
		color: #333;
		display: block;
		margin-bottom: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.product-price {
		display: flex;
		align-items: center;
	}
	
	.current-price {
		font-size: 32rpx;
		color: #FF6B35;
		font-weight: bold;
		margin-right: 10rpx;
	}
	
	.original-price {
		font-size: 24rpx;
		color: #999;
		text-decoration: line-through;
	}
</style>
