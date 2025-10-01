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
						{ id: 1, name: 'iPhone 15 Pro', price: 7999, originalPrice: 8999, image: 'https://via.placeholder.com/200x200/FF6B35/FFFFFF?text=iPhone' },
						{ id: 2, name: 'MacBook Air', price: 8999, originalPrice: 9999, image: 'https://via.placeholder.com/200x200/4ECDC4/FFFFFF?text=MacBook' },
						{ id: 3, name: 'AirPods Pro', price: 1999, originalPrice: 2299, image: 'https://via.placeholder.com/200x200/45B7D1/FFFFFF?text=AirPods' },
						{ id: 4, name: 'iPad Pro', price: 5999, originalPrice: 6999, image: 'https://via.placeholder.com/200x200/96CEB4/FFFFFF?text=iPad' },
						{ id: 5, name: 'Apple Watch', price: 2999, originalPrice: 3299, image: 'https://via.placeholder.com/200x200/FFEAA7/FFFFFF?text=Watch' },
						{ id: 6, name: 'Samsung Galaxy', price: 5999, originalPrice: 6999, image: 'https://via.placeholder.com/200x200/74B9FF/FFFFFF?text=Galaxy' }
					],
					// 服装鞋帽
					[
						{ id: 7, name: 'Nike运动鞋', price: 899, originalPrice: 1099, image: 'https://via.placeholder.com/200x200/FF7675/FFFFFF?text=Nike' },
						{ id: 8, name: 'Adidas外套', price: 599, originalPrice: 799, image: 'https://via.placeholder.com/200x200/6C5CE7/FFFFFF?text=Adidas' },
						{ id: 9, name: '优衣库T恤', price: 99, originalPrice: 149, image: 'https://via.placeholder.com/200x200/A29BFE/FFFFFF?text=Uniqlo' },
						{ id: 10, name: 'Zara连衣裙', price: 299, originalPrice: 399, image: 'https://via.placeholder.com/200x200/FD79A8/FFFFFF?text=Zara' }
					],
					// 食品饮料
					[
						{ id: 11, name: '进口巧克力', price: 89, originalPrice: 129, image: 'https://via.placeholder.com/200x200/FDCB6E/FFFFFF?text=Chocolate' },
						{ id: 12, name: '有机咖啡', price: 159, originalPrice: 199, image: 'https://via.placeholder.com/200x200/E17055/FFFFFF?text=Coffee' },
						{ id: 13, name: '进口红酒', price: 299, originalPrice: 399, image: 'https://via.placeholder.com/200x200/6C5CE7/FFFFFF?text=Wine' }
					],
					// 家居生活
					[
						{ id: 14, name: '智能台灯', price: 299, originalPrice: 399, image: 'https://via.placeholder.com/200x200/FFEAA7/FFFFFF?text=Lamp' },
						{ id: 15, name: '空气净化器', price: 1299, originalPrice: 1599, image: 'https://via.placeholder.com/200x200/74B9FF/FFFFFF?text=Purifier' },
						{ id: 16, name: '扫地机器人', price: 1999, originalPrice: 2499, image: 'https://via.placeholder.com/200x200/00B894/FFFFFF?text=Robot' }
					],
					// 运动户外
					[
						{ id: 17, name: '瑜伽垫', price: 199, originalPrice: 299, image: 'https://via.placeholder.com/200x200/00CEC9/FFFFFF?text=Yoga' },
						{ id: 18, name: '跑步机', price: 2999, originalPrice: 3999, image: 'https://via.placeholder.com/200x200/FF7675/FFFFFF?text=Treadmill' },
						{ id: 19, name: '登山包', price: 599, originalPrice: 799, image: 'https://via.placeholder.com/200x200/6C5CE7/FFFFFF?text=Backpack' }
					],
					// 美妆护肤
					[
						{ id: 20, name: 'SK-II精华', price: 1299, originalPrice: 1599, image: 'https://via.placeholder.com/200x200/FD79A8/FFFFFF?text=SK2' },
						{ id: 21, name: '兰蔻面霜', price: 899, originalPrice: 1099, image: 'https://via.placeholder.com/200x200/FFEAA7/FFFFFF?text=Lancome' },
						{ id: 22, name: '雅诗兰黛口红', price: 299, originalPrice: 399, image: 'https://via.placeholder.com/200x200/74B9FF/FFFFFF?text=Estee' }
					],
					// 图书文具
					[
						{ id: 23, name: '编程书籍', price: 89, originalPrice: 129, image: 'https://via.placeholder.com/200x200/00B894/FFFFFF?text=Book' },
						{ id: 24, name: '笔记本套装', price: 199, originalPrice: 299, image: 'https://via.placeholder.com/200x200/6C5CE7/FFFFFF?text=Notebook' }
					],
					// 母婴用品
					[
						{ id: 25, name: '婴儿推车', price: 1299, originalPrice: 1599, image: 'https://via.placeholder.com/200x200/FF7675/FFFFFF?text=Stroller' },
						{ id: 26, name: '儿童安全座椅', price: 1999, originalPrice: 2499, image: 'https://via.placeholder.com/200x200/00CEC9/FFFFFF?text=CarSeat' }
					],
					// 汽车用品
					[
						{ id: 27, name: '车载充电器', price: 99, originalPrice: 149, image: 'https://via.placeholder.com/200x200/FFEAA7/FFFFFF?text=Charger' },
						{ id: 28, name: '汽车脚垫', price: 299, originalPrice: 399, image: 'https://via.placeholder.com/200x200/74B9FF/FFFFFF?text=Mat' }
					],
					// 宠物用品
					[
						{ id: 29, name: '宠物玩具', price: 59, originalPrice: 89, image: 'https://via.placeholder.com/200x200/00B894/FFFFFF?text=Toy' },
						{ id: 30, name: '宠物食品', price: 199, originalPrice: 299, image: 'https://via.placeholder.com/200x200/6C5CE7/FFFFFF?text=Food' }
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

