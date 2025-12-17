# 鋒兄AI管理系統

基於 Angular 21 和 Nhost 後端的現代化管理系統，提供完整的數據管理和可視化功能。

## 功能特色

### 🏠 儀表板
- 實時數據統計展示
- 會員項目、訂閱服務、營業額等關鍵指標
- 食品管理和訂閱管理統計分析

### 🖼️ 圖片展示
- 支援多種圖片格式 (JPG/JPEG, PNG)
- 圖片分類和統計
- 批量上傳和管理功能

### 🍽️ 食品管理
- 食品庫存管理
- 有效期限追蹤
- 過期提醒系統
- 數量調整和編輯功能

### 📋 訂閱管理
- 訂閱服務追蹤
- 付款日期管理
- 月費統計和分析
- 服務網站快速連結

### 🎬 影片介紹
- 影片內容展示
- 播放和下載功能
- 熱門影片推薦

### ℹ️ 關於我們
- 團隊介紹
- 服務特色展示
- 聯絡資訊

## 技術棧

- **前端**: Angular 21 + TypeScript
- **後端**: Nhost (GraphQL + PostgreSQL)
- **樣式**: Tailwind CSS
- **部署**: 支援 SSR (Server-Side Rendering)

## 開發環境設置

### 前置需求
- Node.js 18+ 
- npm 或 yarn

### 安裝依賴
```bash
npm install
```

### 環境配置
確保 `.env` 文件包含正確的 Nhost 配置：
```
NHOST_SUBDOMAIN=uxgwdiuehabbzenwtcqo
NHOST_REGION=eu-central-1
```

### 啟動開發服務器
```bash
npm start
```

應用程式將在 `http://localhost:4200/` 運行

## 項目結構

```
src/
├── app/
│   ├── components/          # 頁面組件
│   │   ├── dashboard/       # 儀表板
│   │   ├── gallery/         # 圖片展示
│   │   ├── food-management/ # 食品管理
│   │   ├── subscription-management/ # 訂閱管理
│   │   ├── video-intro/     # 影片介紹
│   │   ├── about/           # 關於我們
│   │   └── sidebar/         # 側邊欄導航
│   ├── services/            # 服務層
│   │   └── nhost.service.ts # Nhost 後端服務
│   ├── app.routes.ts        # 路由配置
│   └── app.ts              # 主應用組件
└── styles.css              # 全局樣式
```

## 構建部署

### 開發構建
```bash
npm run build
```

### 生產構建
```bash
npm run build --configuration=production
```

### SSR 服務器
```bash
npm run serve:ssr:angularkiro20251217
```

## 主要功能

1. **響應式設計**: 支援桌面和移動設備
2. **中文本地化**: 完整的繁體中文界面
3. **實時數據**: 與 Nhost 後端實時同步
4. **模組化架構**: 易於擴展和維護
5. **現代化 UI**: 使用 Tailwind CSS 構建美觀界面

## 開發團隊

- **鋒兄**: 技術總監 & 創辦人
- **塗哥**: 營運總監 & 共同創辦人

## 版權資訊

© 2025-2125 鋒兄塗哥公開資訊 版權所有