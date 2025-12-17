# 右側內容區域空白問題排查指南

## 問題描述
之前右側可以正常顯示內容，現在卻變成空白。

## 已修復的問題

### 1. 圖片路徑問題 ✅
**問題**: 圖片服務使用了錯誤的路徑 `/assets/images/`，但實際圖片在 `public/images/` 目錄中。

**修復**:
- 將 `src/app/services/image.service.ts` 中的 `imageBasePath` 從 `/assets/images/` 改為 `/images/`
- 更新 `src/app/components/home/home.component.ts` 中的圖片路徑

### 2. 應用構建 ✅
- Angular 開發服務器運行正常
- 所有組件編譯成功
- 沒有 TypeScript 錯誤

## 排查步驟

### 步驟 1: 檢查開發服務器
1. 確認開發服務器正在運行: `http://localhost:4200`
2. 檢查終端是否有錯誤信息
3. 確認構建成功

### 步驟 2: 檢查瀏覽器控制台
1. 打開瀏覽器開發者工具 (F12)
2. 查看 **Console** 標籤:
   - 是否有 JavaScript 錯誤？
   - 是否有路由錯誤？
   - 是否有組件載入錯誤？

3. 查看 **Network** 標籤:
   - 圖片是否載入成功？
   - API 請求是否正常？
   - 是否有 404 錯誤？

4. 查看 **Elements** 標籤:
   - `<router-outlet>` 是否存在？
   - 是否有內容被渲染？
   - CSS 樣式是否正確應用？

### 步驟 3: 測試路由
訪問以下 URL 測試不同的路由:
- `http://localhost:4200/home` - 首頁
- `http://localhost:4200/test` - 測試頁面 (新增)
- `http://localhost:4200/dashboard` - 儀表板
- `http://localhost:4200/about` - 關於我們

如果測試頁面可以顯示，說明路由系統正常工作。

### 步驟 4: 檢查組件結構
確認以下組件是否正確:
1. `app.ts` - 主應用組件
2. `responsive-layout.component.ts` - 響應式布局組件
3. `home.component.ts` - 首頁組件

### 步驟 5: 檢查圖片載入
1. 打開 `test-debug.html` 文件
2. 查看圖片是否能正常載入
3. 確認正確的圖片路徑

## 可能的原因

### 1. 路由配置問題
**症狀**: 左側導航欄顯示，但右側內容區域空白

**檢查**:
```typescript
// src/app/app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // ... 其他路由
];
```

### 2. 組件導入問題
**症狀**: 控制台顯示組件載入錯誤

**檢查**:
```typescript
// src/app/app.ts
import { ResponsiveLayoutComponent } from './components/responsive-layout/responsive-layout.component';
```

### 3. CSS 樣式問題
**症狀**: 內容存在但不可見

**檢查**:
- 是否有 `display: none` 樣式？
- 是否有 `opacity: 0` 樣式？
- 是否有 `visibility: hidden` 樣式？

### 4. 響應式服務問題
**症狀**: 響應式組件無法正確判斷螢幕尺寸

**檢查**:
```typescript
// src/app/services/responsive.service.ts
// 確認服務正常初始化
```

### 5. 圖片服務問題
**症狀**: 圖片無法載入，頁面顯示空白

**檢查**:
- 圖片路徑是否正確
- 圖片文件是否存在
- 圖片服務是否正常初始化

## 解決方案

### 方案 1: 清除緩存並重新構建
```bash
# 停止開發服務器
Ctrl + C

# 清除 Angular 緩存
rmdir /s /q .angular

# 清除 node_modules (如果需要)
rmdir /s /q node_modules
npm install

# 重新啟動開發服務器
ng serve
```

### 方案 2: 檢查瀏覽器緩存
1. 打開開發者工具
2. 右鍵點擊刷新按鈕
3. 選擇 "清空緩存並硬性重新載入"

### 方案 3: 檢查路由配置
確認 `app.config.ts` 中的路由配置:
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withEnabledBlockingInitialNavigation()
    )
  ]
};
```

### 方案 4: 使用測試頁面
訪問 `http://localhost:4200/test` 查看測試頁面是否能正常顯示。

## 調試工具

### 1. 測試頁面
打開 `test-debug.html` 文件進行基本測試。

### 2. Angular DevTools
安裝 Angular DevTools 瀏覽器擴展來調試 Angular 應用。

### 3. 控制台日誌
在組件中添加日誌:
```typescript
ngOnInit() {
  console.log('組件已初始化');
}
```

## 常見錯誤信息

### 錯誤 1: "Cannot match any routes"
**原因**: 路由配置錯誤
**解決**: 檢查 `app.routes.ts` 配置

### 錯誤 2: "Failed to load resource: 404"
**原因**: 資源文件不存在
**解決**: 檢查文件路徑和文件是否存在

### 錯誤 3: "Component not found"
**原因**: 組件導入錯誤
**解決**: 檢查組件導入路徑

## 聯繫支持

如果以上方法都無法解決問題，請提供以下信息:
1. 瀏覽器控制台的完整錯誤信息
2. Network 標籤的請求狀態
3. Angular 版本信息
4. 操作系統和瀏覽器版本

## 總結

目前已修復的問題:
- ✅ 圖片路徑從 `/assets/images/` 改為 `/images/`
- ✅ 首頁組件圖片路徑已更新
- ✅ 添加了測試頁面用於驗證
- ✅ Angular 應用構建成功

下一步:
1. 訪問 `http://localhost:4200` 查看應用
2. 訪問 `http://localhost:4200/test` 查看測試頁面
3. 檢查瀏覽器控制台是否有錯誤
4. 如果測試頁面正常，說明路由系統工作正常
5. 如果首頁仍然空白，檢查圖片服務和圖片路徑
