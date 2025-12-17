# 食品管理系統 - 快速開始指南

## 🚀 立即開始

### 1. 啟動開發伺服器
```bash
ng serve
```
伺服器將在 `http://localhost:4200` 啟動

### 2. 訪問食品管理功能

#### 主要頁面
- **食品管理**: `http://localhost:4200/food-management`
- **儀表板**: `http://localhost:4200/dashboard` (包含食品統計)

#### 除錯和測試頁面
- **API 測試**: `http://localhost:4200/food-test`
- **連接除錯**: `http://localhost:4200/food-debug`

### 3. 解決連接問題

如果遇到「載入食品失敗」的錯誤：

#### 方法 1: 使用模擬模式 (推薦)
1. 訪問 `/food-management`
2. 點擊「啟用模擬模式」按鈕
3. 系統會使用本地測試資料，所有功能都可正常使用

#### 方法 2: 檢查 GraphQL 連接
1. 訪問 `/food-debug`
2. 依序點擊測試按鈕：
   - 測試基本連接
   - 檢查 food 資料表
   - 列出所有資料表
3. 根據錯誤訊息進行相應修復

### 4. 功能測試

#### 在模擬模式下測試所有功能：
- ✅ 新增食品
- ✅ 編輯食品資訊
- ✅ 刪除食品
- ✅ 搜尋和篩選
- ✅ 數量調整
- ✅ 統計資料顯示

#### 測試步驟：
1. 啟用模擬模式
2. 嘗試新增一個測試食品
3. 使用搜尋功能
4. 編輯現有食品
5. 調整數量
6. 查看統計資料

### 5. 生產環境設定

當準備連接真實的 Nhost 後端時：

#### 確認 Nhost 設定：
1. **資料表結構**:
```sql
CREATE TABLE food (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  amount integer NOT NULL DEFAULT 1,
  price integer NOT NULL DEFAULT 0,
  shop text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

2. **權限設定**: 確保 `food` 表有適當的讀寫權限

3. **連接測試**: 使用 `/food-debug` 頁面測試連接

### 6. 常見問題

#### Q: 為什麼看到「載入食品失敗」？
A: 這通常是因為 GraphQL 後端未正確設定。使用模擬模式可以繼續開發和測試。

#### Q: 模擬模式的資料會保存嗎？
A: 模擬模式使用本地記憶體，重新整理頁面後資料會重置。

#### Q: 如何切換回真實資料？
A: 在食品管理頁面點擊「停用模擬模式」按鈕。

#### Q: 統計資料不正確？
A: 確保已載入最新資料，可以點擊「重新整理」按鈕。

### 7. 開發提示

- 使用瀏覽器開發者工具查看詳細的錯誤訊息
- 所有 GraphQL 查詢和錯誤都會記錄在控制台
- 模擬模式非常適合前端開發和測試
- 生產環境部署前務必測試真實的 GraphQL 連接

### 8. 支援

如果遇到問題：
1. 查看瀏覽器控制台的錯誤訊息
2. 使用 `/food-debug` 頁面進行診斷
3. 參考 `TROUBLESHOOTING.md` 文件
4. 檢查 Nhost 後端設定

---

**提示**: 即使 GraphQL 後端有問題，你也可以使用模擬模式來完整體驗所有功能！