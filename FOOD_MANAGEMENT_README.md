# 食品管理系統

## 功能概述

這是一個基於 Angular 和 Nhost GraphQL 的食品管理系統，提供完整的 CRUD 操作和統計功能。

## 主要功能

### 1. 食品管理 (`/food-management`)
- ✅ 新增食品（名稱、數量、價格、商店）
- ✅ 查看所有食品列表
- ✅ 編輯食品資訊
- ✅ 刪除食品
- ✅ 快速調整數量（+/-按鈕）
- ✅ 搜尋食品（根據名稱）
- ✅ 根據商店篩選
- ✅ 即時統計（總價值、商店數量）

### 2. 食品統計 (`app-food-stats`)
- ✅ 總食品數量
- ✅ 總價值計算
- ✅ 商店數量統計
- ✅ 平均價格計算

### 3. 儀表板整合 (`/dashboard`)
- ✅ 食品統計卡片顯示
- ✅ 與其他管理模組整合

## 技術架構

### 前端 (Angular)
- **服務層**: `FoodService` - 處理所有 GraphQL API 調用
- **組件層**: 
  - `FoodManagementComponent` - 主要管理介面
  - `FoodStatsComponent` - 統計顯示組件
  - `FoodTestComponent` - API 測試組件

### 後端 (Nhost GraphQL)
- **資料表**: `food`
  - `id` (uuid) - 主鍵
  - `name` (text) - 食品名稱
  - `amount` (integer) - 數量
  - `price` (integer) - 價格
  - `shop` (text) - 商店名稱
  - `created_at` (timestamp) - 建立時間
  - `updated_at` (timestamp) - 更新時間

## GraphQL 操作

### 查詢 (Queries)
```graphql
# 取得所有食品
query GetAllFoods {
  food {
    id name amount price shop created_at updated_at
  }
}

# 根據 ID 取得食品
query GetFoodById($id: uuid!) {
  food_by_pk(id: $id) {
    id name amount price shop created_at updated_at
  }
}

# 根據商店篩選
query GetFoodsByShop($shop: String!) {
  food(where: {shop: {_eq: $shop}}) {
    id name amount price shop created_at updated_at
  }
}

# 搜尋食品
query SearchFoods($searchTerm: String!) {
  food(where: {name: {_ilike: $searchTerm}}) {
    id name amount price shop created_at updated_at
  }
}

# 統計資料
query GetFoodStats {
  food_aggregate {
    aggregate {
      count
      sum { amount price }
      avg { price }
    }
  }
  food(distinct_on: shop) { shop }
}
```

### 變更 (Mutations)
```graphql
# 新增食品
mutation CreateFood($input: food_insert_input!) {
  insert_food_one(object: $input) {
    id name amount price shop created_at updated_at
  }
}

# 更新食品
mutation UpdateFood($id: uuid!, $input: food_set_input!) {
  update_food_by_pk(pk_columns: {id: $id}, _set: $input) {
    id name amount price shop created_at updated_at
  }
}

# 刪除食品
mutation DeleteFood($id: uuid!) {
  delete_food_by_pk(id: $id) { id }
}
```

## 使用方式

### 1. 訪問食品管理頁面
```
http://localhost:4200/food-management
```

### 2. 新增食品
1. 填寫食品名稱、數量、價格、商店
2. 點擊「新增食品」按鈕
3. 系統會即時更新列表和統計

### 3. 管理現有食品
- **編輯**: 點擊「編輯」按鈕，在彈出視窗中修改資訊
- **刪除**: 點擊「刪除」按鈕，確認後刪除
- **調整數量**: 使用 +/- 按鈕快速調整數量

### 4. 搜尋和篩選
- **搜尋**: 在搜尋框輸入食品名稱
- **篩選**: 選擇特定商店進行篩選
- **重新整理**: 點擊重新整理按鈕載入最新資料

### 5. 查看統計
- 在儀表板 (`/dashboard`) 查看食品統計卡片
- 或在食品管理頁面頂部查看即時統計

## API 測試

訪問測試頁面進行 API 功能驗證：
```
http://localhost:4200/food-test
```

## 錯誤處理

系統包含完整的錯誤處理機制：
- GraphQL 查詢/變更錯誤
- 網路連接錯誤
- 資料驗證錯誤
- 使用者友善的錯誤訊息

## 響應式設計

- 支援桌面和行動裝置
- 使用 Tailwind CSS 進行樣式設計
- 適應性表格和表單佈局

## 未來擴展

可考慮的功能擴展：
- [ ] 食品分類管理
- [ ] 有效期限追蹤
- [ ] 庫存警告通知
- [ ] 批量操作功能
- [ ] 匯出/匯入功能
- [ ] 食品圖片上傳
- [ ] 條碼掃描整合