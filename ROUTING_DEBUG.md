# 路由問題調試指南

## 問題描述
點擊任何選單項目後，路由URL會變化（例如 `/about`），但顯示的內容卻是錯誤的頁面（例如顯示儀表板內容）。

## 已確認的事實
1. ✅ 路由配置正確 (`app.routes.ts`)
2. ✅ 元件檔案存在且命名正確
3. ✅ 元件導出名稱正確
4. ✅ RouterModule 正確導入
5. ✅ router-outlet 位置正確
6. ⚠️ URL 會變化但內容不對應

## 可能的原因

### 1. 瀏覽器快取問題
**症狀**: 舊的元件被快取，導致顯示錯誤內容
**解決方案**:
```bash
# 清除 Angular 快取
rmdir /s /q .angular\cache

# 清除 node_modules 快取
rmdir /s /q node_modules\.cache

# 重新安裝依賴（如果需要）
npm install

# 重新啟動開發伺服器
npm start
```

### 2. 懶加載問題
**症狀**: 元件懶加載失敗，回退到預設元件
**檢查方法**:
1. 打開瀏覽器開發者工具
2. 切換到 Network 標籤
3. 點擊不同的選單項目
4. 查看是否有載入對應的 chunk 檔案

**預期行為**:
- 點擊 "關於我們" → 應該載入 `about-component-xxx.js`
- 點擊 "儀表板" → 應該載入 `dashboard-simple-component-xxx.js`

### 3. 元件模組衝突
**症狀**: 多個元件使用相同的 selector 或導出名稱
**檢查方法**:
```bash
# 搜尋重複的 selector
rg "selector: 'app-" src/app/components --type ts

# 搜尋重複的 export class
rg "export class.*Component" src/app/components --type ts
```

### 4. 路由守衛或攔截器
**症狀**: 路由守衛重定向到錯誤的頁面
**檢查**: 查看 `app.config.ts` 是否有路由守衛配置

## 調試步驟

### 步驟 1: 清除所有快取
```bash
# 停止開發伺服器 (Ctrl+C)

# 清除 Angular 快取
rmdir /s /q .angular

# 清除 dist 資料夾
rmdir /s /q dist

# 重新啟動
npm start
```

### 步驟 2: 檢查瀏覽器控制台
打開瀏覽器開發者工具，查看：
1. **Console 標籤**: 是否有 JavaScript 錯誤？
2. **Network 標籤**: 元件檔案是否正確載入？
3. **Application 標籤**: 清除網站資料和快取

### 步驟 3: 測試路由
1. 直接在瀏覽器輸入 URL:
   - `http://localhost:4200/about`
   - `http://localhost:4200/dashboard`
   - `http://localhost:4200/home`

2. 觀察：
   - URL 是否正確？
   - 頁面內容是否對應？
   - 黃色調試框顯示的路由是否正確？

### 步驟 4: 檢查元件載入
在每個元件的 constructor 或 ngOnInit 中添加 console.log：

```typescript
// about.component.ts
export class AboutComponent {
  constructor() {
    console.log('✅ AboutComponent 已載入');
  }
}

// dashboard-simple.component.ts
export class DashboardSimpleComponent {
  constructor() {
    console.log('✅ DashboardSimpleComponent 已載入');
  }
}
```

## 臨時解決方案

### 方案 1: 使用直接導入而非懶加載
修改 `app.routes.ts`:

```typescript
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { DashboardSimpleComponent } from './components/dashboard-simple/dashboard-simple.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: '首頁' },
  { path: 'about', component: AboutComponent, title: '關於我們' },
  { path: 'dashboard', component: DashboardSimpleComponent, title: '儀表板' },
  // ... 其他路由
];
```

### 方案 2: 強制重新載入
在 `app.ts` 中添加：

```typescript
import { Router, NavigationEnd } from '@angular/router';

constructor(private router: Router) {
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe(() => {
    // 強制重新載入元件
    window.scrollTo(0, 0);
  });
}
```

## 檢查清單

- [ ] 清除 `.angular/cache` 資料夾
- [ ] 清除瀏覽器快取
- [ ] 重新啟動開發伺服器
- [ ] 檢查瀏覽器控制台錯誤
- [ ] 檢查 Network 標籤的檔案載入
- [ ] 測試直接輸入 URL
- [ ] 檢查元件 constructor 日誌
- [ ] 確認沒有重複的 selector
- [ ] 確認沒有路由守衛衝突

## 預期結果

修復後，應該看到：
1. ✅ 點擊 "關於我們" → 顯示綠色提示 "✅ 關於我們頁面載入成功！"
2. ✅ 點擊 "儀表板" → 顯示 "數據儀表板" 標題
3. ✅ 點擊 "首頁" → 顯示圖片展示和統計卡片
4. ✅ 黃色調試框顯示的路由與頁面內容一致

## 如果問題仍然存在

請提供以下資訊：
1. 瀏覽器控制台的完整錯誤訊息
2. Network 標籤中載入的檔案列表
3. 黃色調試框顯示的路由
4. 實際顯示的頁面內容

## 相關檔案
- `src/app/app.routes.ts` - 路由配置
- `src/app/app.config.ts` - 應用程式配置
- `src/app/app.ts` - 主元件
- `src/app/app.html` - 主模板
