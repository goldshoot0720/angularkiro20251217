# 響應式系統使用指南

## 快速開始

### 1. 基本容器
使用響應式容器包裝你的內容：

```html
<app-responsive-container>
  <!-- 你的內容 -->
</app-responsive-container>
```

### 2. 響應式卡片
建立自適應的卡片組件：

```html
<app-responsive-card title="卡片標題" class="mb-4">
  <p>卡片內容會根據螢幕尺寸自動調整間距和字體大小</p>
</app-responsive-card>
```

### 3. 響應式網格
建立智能網格布局：

```html
<app-responsive-grid 
  [mobileColumns]="1" 
  [tabletColumns]="2" 
  [desktopColumns]="3">
  <div>網格項目 1</div>
  <div>網格項目 2</div>
  <div>網格項目 3</div>
</app-responsive-grid>
```

### 4. 響應式表單
建立自適應表單：

```html
<app-responsive-form>
  <div class="form-row">
    <div class="form-group">
      <label for="name">姓名</label>
      <input type="text" id="name" class="responsive-form-input">
    </div>
  </div>
  <button type="submit" class="btn-primary">提交</button>
</app-responsive-form>
```

### 5. 響應式導航
建立智能導航系統：

```html
<app-responsive-navigation 
  [navigationItems]="navItems"
  brandName="我的應用"
  brandIcon="🚀">
</app-responsive-navigation>
```

## 進階使用

### 響應式指令
使用指令為元素應用不同的樣式：

```html
<div appResponsive 
     mobileClass="bg-blue-100 p-4"
     tabletClass="bg-green-100 p-6"
     desktopClass="bg-purple-100 p-8">
  內容會根據螢幕尺寸應用不同樣式
</div>
```

### 響應式服務
在組件中使用響應式服務：

```typescript
import { ResponsiveService } from './services/responsive.service';

constructor(private responsiveService: ResponsiveService) {}

ngOnInit() {
  this.responsiveService.getScreenSize$().subscribe(size => {
    if (size.isMobile) {
      // 手機版邏輯
    } else if (size.isTablet) {
      // 平板版邏輯
    } else {
      // 桌面版邏輯
    }
  });
}
```

### CSS 工具類
使用預建的響應式工具類：

```html
<!-- 裝置特定顯示 -->
<div class="mobile-only">只在手機顯示</div>
<div class="tablet-only">只在平板顯示</div>
<div class="desktop-only">只在桌面顯示</div>

<!-- 響應式按鈕 -->
<button class="responsive-btn responsive-btn-full btn-primary">
  全寬按鈕
</button>

<!-- 響應式圖片 -->
<img src="image.jpg" class="responsive-img responsive-img-square">

<!-- 響應式彈性布局 -->
<div class="responsive-flex responsive-flex-between">
  <span>左側內容</span>
  <span>右側內容</span>
</div>
```

## 組件配置

### ResponsiveContainerComponent
```typescript
@Input() containerType: 'default' | 'grid' | 'flex' = 'default';
@Input() maxWidth = '1200px';
@Input() customClasses = '';
```

### ResponsiveCardComponent
```typescript
@Input() title = '';
@Input() variant: 'default' | 'compact' | 'spacious' = 'default';
@Input() customClasses = '';
@Input() hasHeaderContent = false;
@Input() hasFooterContent = false;
```

### ResponsiveGridComponent
```typescript
@Input() mobileColumns = 1;
@Input() tabletColumns = 2;
@Input() desktopColumns = 3;
@Input() autoFit = false;
@Input() autoFitSize: 'sm' | 'md' | 'lg' = 'md';
@Input() gap = '1rem';
@Input() alignment: 'center' | 'start' | 'end' | 'stretch' = 'stretch';
```

### ResponsiveFormComponent
```typescript
@Input() layout: 'vertical' | 'horizontal' | 'inline' = 'vertical';
@Input() customClasses = '';
```

### ResponsiveNavigationComponent
```typescript
@Input() navigationItems: NavigationItem[] = [];
@Input() brandName = '';
@Input() brandIcon = '';
@Input() layout: 'horizontal' | 'vertical' = 'horizontal';
@Output() itemClick = new EventEmitter<NavigationItem>();
```

## 斷點系統

### 預設斷點
- **手機版**: ≤ 768px
- **平板版**: 769px - 1024px
- **桌面版**: ≥ 1025px

### 方向檢測
- **平板直向**: 769px-1024px 且 高度 > 寬度
- **平板橫向**: 769px-1024px 且 寬度 > 高度

### 自定義斷點
在 `responsive.service.ts` 中修改：

```typescript
private getScreenSize(): ScreenSize {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  const isMobile = width <= 768;        // 自定義手機斷點
  const isTablet = width >= 769 && width <= 1024;  // 自定義平板斷點
  const isDesktop = width >= 1025;      // 自定義桌面斷點
  
  // ...
}
```

## 最佳實踐

### 1. 內容優先
- 確保內容在所有裝置上都能正確顯示
- 優先考慮可讀性和可用性

### 2. 漸進增強
- 從基本功能開始
- 逐步添加高級特性

### 3. 觸控友好
- 手機版使用較大的觸控目標
- 確保按鈕和連結易於點擊

### 4. 效能優化
- 避免不必要的重新渲染
- 使用 OnPush 變更檢測策略
- 適當使用 trackBy 函數

### 5. 測試覆蓋
- 在多種裝置上測試
- 測試方向變化
- 驗證觸控操作

## 常見模式

### 1. 響應式卡片網格
```html
<app-responsive-container>
  <app-responsive-grid [mobileColumns]="1" [tabletColumns]="2" [desktopColumns]="3">
    <app-responsive-card *ngFor="let item of items" [title]="item.title">
      {{ item.content }}
    </app-responsive-card>
  </app-responsive-grid>
</app-responsive-container>
```

### 2. 響應式表單布局
```html
<app-responsive-container>
  <app-responsive-card title="聯絡表單">
    <app-responsive-form>
      <div class="form-row">
        <div class="form-group">
          <label>姓名</label>
          <input type="text" class="responsive-form-input">
        </div>
        <div class="form-group">
          <label>電子郵件</label>
          <input type="email" class="responsive-form-input">
        </div>
      </div>
      <div class="form-row single">
        <div class="form-group">
          <label>訊息</label>
          <textarea class="responsive-form-input"></textarea>
        </div>
      </div>
      <button type="submit" class="responsive-btn btn-primary">送出</button>
    </app-responsive-form>
  </app-responsive-card>
</app-responsive-container>
```

### 3. 響應式儀表板
```html
<app-responsive-container>
  <!-- 統計卡片 -->
  <app-responsive-grid [mobileColumns]="1" [tabletColumns]="2" [desktopColumns]="4">
    <app-responsive-card *ngFor="let stat of stats" variant="compact">
      <div class="text-center">
        <div class="text-2xl font-bold">{{ stat.value }}</div>
        <div class="text-sm text-gray-600">{{ stat.label }}</div>
      </div>
    </app-responsive-card>
  </app-responsive-grid>

  <!-- 圖表區域 -->
  <app-responsive-grid [mobileColumns]="1" [tabletColumns]="1" [desktopColumns]="2">
    <app-responsive-card title="銷售趨勢">
      <!-- 圖表組件 -->
    </app-responsive-card>
    <app-responsive-card title="用戶分析">
      <!-- 圖表組件 -->
    </app-responsive-card>
  </app-responsive-grid>
</app-responsive-container>
```

## 故障排除

### 常見問題

1. **組件不響應**: 檢查是否正確導入響應式服務
2. **樣式不生效**: 確認CSS工具類已正確載入
3. **網格不對齊**: 檢查網格列數配置
4. **表單布局錯亂**: 確認表單結構正確

### 調試技巧

1. 使用響應式展示頁面 (`/responsive-demo`) 測試
2. 在瀏覽器開發者工具中模擬不同裝置
3. 檢查控制台是否有錯誤訊息
4. 使用 `console.log` 輸出螢幕尺寸資訊

## 擴展系統

### 添加新組件
1. 建立組件並實現響應式邏輯
2. 注入 `ResponsiveService`
3. 訂閱螢幕尺寸變化
4. 根據尺寸調整UI

### 自定義工具類
在 `responsive.css` 中添加新的工具類：

```css
.my-responsive-class {
  /* 基本樣式 */
}

@media (max-width: 768px) {
  .my-responsive-class {
    /* 手機版樣式 */
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .my-responsive-class {
    /* 平板版樣式 */
  }
}

@media (min-width: 1025px) {
  .my-responsive-class {
    /* 桌面版樣式 */
  }
}
```

這個響應式系統提供了完整的解決方案，讓你能夠快速建立適應所有裝置的現代化應用程式。