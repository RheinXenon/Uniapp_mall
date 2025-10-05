# UniApp商城项目说明文档

## 项目概述

### 项目基本信息
- **项目名称**: iEComme（基于uni-app的电子商城）
- **项目类型**: 移动端电商应用
- **开发框架**: UniApp (Vue3)
- **项目版本**: 1.0.0
- **目标平台**: H5端（可兼容小程序、App端）

### 项目定位
完整的移动端电商应用，实现从商品浏览到订单管理的完整购物流程。采用本地 JSON 数据模拟后端接口，便于前端功能开发和测试。

## 技术架构

### 核心技术栈
- **前端框架**: UniApp + Vue3
- **UI组件**: 原生uni-ui组件 + 自定义样式
- **状态管理**: 全局数据管理 + 本地存储
- **数据存储**: 本地JSON文件 + uni.storage
- **样式方案**: 全局样式 + 组件级样式

### 项目结构
```
Uniapp_mall/
├── App.vue                 # 应用入口，全局配置
├── main.js                 # 应用启动文件
├── manifest.json           # 应用配置文件
├── pages.json             # 页面路由配置
├── uni.scss               # 全局样式文件
├── pages/                 # 页面目录
│   ├── index/            # 首页
│   ├── category/         # 分类页
│   ├── cart/             # 购物车
│   ├── profile/          # 个人中心
│   ├── product/          # 商品相关页面
│   ├── orders/           # 订单管理
│   ├── logistics/        # 物流查询
│   └── favorites/        # 收藏夹
├── static/               # 静态资源
│   ├── data/            # 数据文件
│   ├── products/        # 商品图片
│   ├── tabbar/          # 底部导航图标
│   └── placeholders/    # 占位图片
└── utils/               # 工具类
    ├── cartManager.js   # 购物车管理
    └── favoritesManager.js # 收藏管理
```

## 功能模块详解

### 1. 首页模块 (pages/index/)
**功能描述**: 商城首页，展示轮播图、分类导航、推荐商品
**核心功能**:
- 搜索栏（支持商品搜索）
- 轮播图展示
- 分类导航（8个主要分类）
- 推荐商品展示
- 商品快速跳转

**技术实现**:
- 使用swiper组件实现轮播
- 动态加载商品数据
- 响应式布局设计

### 2. 商品分类模块 (pages/category/)
**功能描述**: 商品分类浏览页面
**核心功能**:
- 分类列表展示
- 分类商品筛选
- 商品快速预览

### 3. 商品详情模块 (pages/product/)
**功能描述**: 商品详细信息展示
**核心功能**:
- 商品图片轮播
- 商品基本信息展示
- 规格选择
- 价格展示
- 加入购物车
- 收藏功能
- 商品评价展示

**技术特点**:
- 图片懒加载
- 规格选择交互
- 购物车状态同步

### 4. 购物车模块 (pages/cart/)
**功能描述**: 购物车管理页面
**核心功能**:
- 购物车商品列表
- 商品数量调整
- 商品删除
- 商品选中/取消选中
- 全选/取消全选
- 价格计算
- 结算功能

**技术实现**:
- 使用CartManager工具类管理数据
- 本地存储持久化
- 实时价格计算

### 5. 订单管理模块 (pages/orders/)
**功能描述**: 订单列表和订单详情
**核心功能**:
- 订单状态筛选
- 订单列表展示
- 订单详情查看
- 订单状态跟踪
- 物流信息查询

**订单状态**:
- 待付款
- 待发货
- 待收货
- 已完成
- 已取消

### 6. 个人中心模块 (pages/profile/)
**功能描述**: 用户个人信息和设置
**核心功能**:
- 用户信息展示
- 订单管理入口
- 收藏夹管理
- 设置选项

### 7. 收藏夹模块 (pages/favorites/)
**功能描述**: 用户收藏商品管理
**核心功能**:
- 收藏商品列表
- 取消收藏
- 批量操作
- 收藏商品搜索

## 数据管理

### 数据结构设计

#### 商品数据结构
```javascript
{
  id: 1,                    // 商品ID
  name: "商品名称",           // 商品名称
  desc: "商品描述",           // 商品描述
  price: 7999,              // 现价
  originalPrice: 8999,      // 原价
  sales: 1234,              // 销量
  image: "/path/to/image",  // 主图
  images: [...],            // 商品图片数组
  tags: [...],              // 商品标签
  categoryId: 1,            // 分类ID
  categoryName: "数码",      // 分类名称
  specs: [...],             // 商品规格
  params: [...],            // 商品参数
  detailImages: [...],      // 详情图片
  reviews: [...]            // 用户评价
}
```

#### 购物车数据结构
```javascript
{
  id: 1,                    // 商品ID
  name: "商品名称",           // 商品名称
  price: 7999,              // 商品价格
  quantity: 1,              // 商品数量
  selected: true,           // 是否选中
  image: "/path/to/image",  // 商品图片
  spec: "规格描述",          // 商品规格
  addTime: "ISO时间戳"       // 添加时间
}
```

#### 订单数据结构
```javascript
{
  id: "ORD001",             // 订单ID
  orderNumber: "202401150001", // 订单号
  status: "pending",        // 订单状态
  statusText: "待付款",      // 状态文本
  createTime: "2024-01-15 10:30:00", // 创建时间
  totalAmount: 7999,        // 订单总金额
  payAmount: 7999,          // 实付金额
  items: [...],             // 订单商品
  address: {...},           // 收货地址
  coupon: {...},            // 优惠券信息
  logistics: {...}          // 物流信息
}
```

### 数据存储方案

#### 本地存储 (uni.storage)
- **购物车数据**: `shopping_cart_data`
- **收藏数据**: `user_favorites`
- **用户设置**: `user_settings`

#### JSON文件存储
- **商品数据**: `/static/data/products.json`
- **购物车数据**: `/static/data/cart.json`
- **订单数据**: `/static/data/orders.json`
- **收藏数据**: `/static/data/favorites.json`

## 核心工具类

### 1. CartManager (购物车管理器)
**文件位置**: `utils/cartManager.js`

**主要功能**:
- 购物车数据增删改查
- 本地存储管理
- 价格计算
- 商品规格处理
- 选中状态管理

**核心方法**:
```javascript
// 添加商品到购物车
addToCart(product, quantity, spec)

// 获取购物车数据
getCartData()

// 更新商品数量
updateQuantity(productId, spec, quantity)

// 移除商品
removeFromCart(productId, spec)

// 获取购物车总价
getCartTotal(cartData, selectedOnly)
```

### 2. FavoritesManager (收藏管理器)
**文件位置**: `utils/favoritesManager.js`

**主要功能**:
- 收藏商品管理
- 收藏状态检查
- 批量操作
- 搜索功能
- 数据导入导出

**核心方法**:
```javascript
// 添加收藏
addToFavorites(product)

// 移除收藏
removeFavorite(productId)

// 检查是否已收藏
isFavorite(productId)

// 搜索收藏
searchFavorites(keyword)
```

## 页面配置

### 路由配置 (pages.json)
- **首页**: `/pages/index/index`
- **分类页**: `/pages/category/category`
- **购物车**: `/pages/cart/cart`
- **个人中心**: `/pages/profile/profile`
- **商品列表**: `/pages/product/list`
- **商品详情**: `/pages/product/detail`
- **订单列表**: `/pages/orders/orders`
- **订单详情**: `/pages/order-detail/order-detail`
- **物流查询**: `/pages/logistics/logistics`
- **收藏夹**: `/pages/favorites/favorites`

### 底部导航配置
- **首页**: 首页图标 + 文字
- **分类**: 分类图标 + 文字
- **购物车**: 购物车图标 + 数量徽章
- **我的**: 个人中心图标 + 文字

## 样式设计

### 设计规范
- **主色调**: #FF6B35 (橙色)
- **背景色**: #F8F8F8 (浅灰)
- **文字色**: #333 (深灰)
- **边框圆角**: 20rpx
- **卡片阴影**: 0 2rpx 10rpx rgba(0,0,0,0.1)

### 全局样式类
- **按钮样式**: `.btn-primary`, `.btn-secondary`
- **卡片样式**: `.card`
- **文本样式**: `.text-primary`, `.text-secondary`
- **布局样式**: `.flex`, `.flex-center`, `.flex-between`
- **间距样式**: `.mt-10`, `.mb-20`, `.p-30`

## 开发环境配置

### 环境要求
- **Node.js**: >= 14.0.0
- **HBuilderX**: 最新版本
- **UniApp**: 3.x版本

### 项目启动
1. 使用HBuilderX打开项目
2. 选择运行到浏览器
3. 选择H5端运行

### 构建配置
- **开发环境**: 本地调试模式
- **生产环境**: 压缩优化模式
- **多端适配**: 支持H5、小程序、App

## 功能特色

### 1. 完整的购物流程
- 商品浏览 → 商品详情 → 加入购物车 → 结算下单 → 订单管理

### 2. 数据持久化
- 购物车数据本地存储
- 收藏数据本地存储
- 用户设置本地存储

### 3. 响应式设计
- 适配不同屏幕尺寸
- 移动端友好的交互体验

### 4. 模块化架构
- 工具类独立管理
- 页面组件化开发
- 样式统一管理

## 扩展建议

### 短期优化
1. **用户体验优化**
   - 添加加载状态提示
   - 优化页面切换动画
   - 增加错误处理机制

2. **功能完善**
   - 商品搜索功能
   - 商品筛选排序
   - 用户登录注册

### 长期规划
1. **后端集成**
   - 替换本地数据为API接口
   - 实现用户认证系统
   - 添加支付功能

2. **功能扩展**
   - 商品评价系统
   - 优惠券系统
   - 会员等级系统
   - 推荐算法
