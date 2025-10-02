<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input">
				<text class="search-icon">🔍</text>
				<input type="text" placeholder="搜索商品" v-model="searchKeyword" @confirm="onSearch" />
			</view>
		</view>
		
		<view class="category-content">
			<!-- 左侧分类列表 -->
			<scroll-view class="category-sidebar" scroll-y="true">
				<view 
					class="category-item" 
					:class="{ active: currentCategory === index }"
					v-for="(category, index) in categories" 
					:key="index"
					@click="selectCategory(index)"
				>
					<text class="category-name">{{category.name}}</text>
				</view>
			</scroll-view>
			
			<!-- 右侧商品列表 -->
			<scroll-view class="product-content" scroll-y="true">
				<view class="product-grid">
					<view 
						class="product-item" 
						v-for="(product, index) in currentProducts" 
						:key="index"
						@click="goToProductDetail(product)"
					>
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
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchKeyword: '',
				currentCategory: 0,
				categories: [
					{ name: '数码电子', id: 1 },
					{ name: '服装鞋帽', id: 2 },
					{ name: '食品饮料', id: 3 },
					{ name: '家居生活', id: 4 },
					{ name: '运动户外', id: 5 },
					{ name: '美妆护肤', id: 6 },
					{ name: '图书文具', id: 7 },
					{ name: '母婴用品', id: 8 },
					{ name: '汽车用品', id: 9 },
					{ name: '宠物用品', id: 10 }
				],
				allProducts: [
					// 数码电子
					[
						{ id: 1, name: 'iPhone 15 Pro', price: 7999, originalPrice: 8999, image: '/static/products/iphone15pro.jpg' },
						{ id: 2, name: 'MacBook Air', price: 8999, originalPrice: 9999, image: '/static/products/macbook-air.jpg' },
						{ id: 3, name: 'AirPods Pro', price: 1999, originalPrice: 2299, image: '/static/products/airpods-pro.jpg' },
						{ id: 4, name: 'iPad Pro', price: 5999, originalPrice: 6999, image: '/static/products/ipad-pro.jpg' },
						{ id: 5, name: 'Apple Watch', price: 2999, originalPrice: 3299, image: '/static/products/apple-watch.jpg' },
						{ id: 6, name: 'Samsung Galaxy', price: 5999, originalPrice: 6999, image: '/static/products/galaxy-s24-ultra.jpg' }
					],
					// 服装鞋帽
					[
						{ id: 7, name: 'Nike运动鞋', price: 899, originalPrice: 1099, image: '/static/placeholders/clothing.svg' },
						{ id: 8, name: 'Adidas外套', price: 599, originalPrice: 799, image: '/static/placeholders/clothing.svg' },
						{ id: 9, name: '优衣库T恤', price: 99, originalPrice: 149, image: '/static/placeholders/clothing.svg' },
						{ id: 10, name: 'Zara连衣裙', price: 299, originalPrice: 399, image: '/static/placeholders/clothing.svg' }
					],
					// 食品饮料
					[
						{ id: 11, name: '进口巧克力', price: 89, originalPrice: 129, image: '/static/placeholders/food.svg' },
						{ id: 12, name: '有机咖啡', price: 159, originalPrice: 199, image: '/static/placeholders/food.svg' },
						{ id: 13, name: '进口红酒', price: 299, originalPrice: 399, image: '/static/placeholders/food.svg' }
					],
					// 家居生活
					[
						{ id: 14, name: '智能台灯', price: 299, originalPrice: 399, image: '/static/placeholders/home.svg' },
						{ id: 15, name: '空气净化器', price: 1299, originalPrice: 1599, image: '/static/placeholders/home.svg' },
						{ id: 16, name: '扫地机器人', price: 1999, originalPrice: 2499, image: '/static/placeholders/home.svg' }
					],
					// 运动户外
					[
						{ id: 17, name: '瑜伽垫', price: 199, originalPrice: 299, image: '/static/placeholders/sports.svg' },
						{ id: 18, name: '跑步机', price: 2999, originalPrice: 3999, image: '/static/placeholders/sports.svg' },
						{ id: 19, name: '登山包', price: 599, originalPrice: 799, image: '/static/placeholders/sports.svg' }
					],
					// 美妆护肤
					[
						{ id: 20, name: 'SK-II精华', price: 1299, originalPrice: 1599, image: '/static/placeholders/beauty.svg' },
						{ id: 21, name: '兰蔻面霜', price: 899, originalPrice: 1099, image: '/static/placeholders/beauty.svg' },
						{ id: 22, name: '雅诗兰黛口红', price: 299, originalPrice: 399, image: '/static/placeholders/beauty.svg' }
					],
					// 图书文具
					[
						{ id: 23, name: '编程书籍', price: 89, originalPrice: 129, image: '/static/placeholders/books.svg' },
						{ id: 24, name: '笔记本套装', price: 199, originalPrice: 299, image: '/static/placeholders/books.svg' }
					],
					// 母婴用品
					[
						{ id: 25, name: '婴儿推车', price: 1299, originalPrice: 1599, image: '/static/placeholders/baby.svg' },
						{ id: 26, name: '儿童安全座椅', price: 1999, originalPrice: 2499, image: '/static/placeholders/baby.svg' }
					],
					// 汽车用品
					[
						{ id: 27, name: '车载充电器', price: 99, originalPrice: 149, image: '/static/placeholders/car.svg' },
						{ id: 28, name: '汽车脚垫', price: 299, originalPrice: 399, image: '/static/placeholders/car.svg' }
					],
					// 宠物用品
					[
						{ id: 29, name: '宠物玩具', price: 59, originalPrice: 89, image: '/static/placeholders/pet.svg' },
						{ id: 30, name: '宠物食品', price: 199, originalPrice: 299, image: '/static/placeholders/pet.svg' }
					]
				]
			}
		},
		computed: {
			currentProducts() {
				return this.allProducts[this.currentCategory] || []
			}
		},
		onLoad(options) {
			if (options.categoryId) {
				this.currentCategory = parseInt(options.categoryId) - 1
			}
		},
		methods: {
			selectCategory(index) {
				this.currentCategory = index
			},
			onSearch() {
				// 搜索功能
				console.log('搜索:', this.searchKeyword)
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
		height: 100vh;
		display: flex;
		flex-direction: column;
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
	
	.category-content {
		flex: 1;
		display: flex;
		height: calc(100vh - 120rpx);
	}
	
	.category-sidebar {
		width: 200rpx;
		background-color: #fff;
		border-right: 1rpx solid #eee;
	}
	
	.category-item {
		padding: 30rpx 20rpx;
		border-bottom: 1rpx solid #f5f5f5;
		text-align: center;
		position: relative;
	}
	
	.category-item.active {
		background-color: #FF6B35;
		color: #fff;
	}
	
	.category-item.active::after {
		content: '';
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 6rpx;
		height: 40rpx;
		background-color: #FF6B35;
	}
	
	.category-name {
		font-size: 28rpx;
	}
	
	.product-content {
		flex: 1;
		background-color: #fff;
		padding: 20rpx;
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

