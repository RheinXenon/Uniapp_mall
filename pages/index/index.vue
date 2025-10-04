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
				banners: [],
				categories: [],
				recommendProducts: []
			}
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			async loadData() {
				try {
					// 加载商品数据
					const res = await uni.request({
						url: '/static/data/products.json',
						method: 'GET'
					})
					
					if (res.data) {
						this.banners = res.data.banners || []
						this.categories = res.data.categories || []
						// 推荐商品取前4个
						this.recommendProducts = (res.data.products || []).slice(0, 4).map(product => ({
							id: product.id,
							name: product.name,
							price: product.price,
							originalPrice: product.originalPrice,
							image: product.image
						}))
					}
					console.log('首页数据加载完成')
				} catch (error) {
					console.error('加载首页数据失败:', error)
					uni.showToast({
						title: '数据加载失败',
						icon: 'error'
					})
				}
			},
			onBannerClick(banner) {
				uni.navigateTo({
					url: banner.link
				})
			},
			onCategoryClick(category) {
				// 所有分类按钮都跳转到分类标签页
				uni.switchTab({
					url: '/pages/category/category'
				})
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
