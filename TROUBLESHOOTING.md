# 食品管理系統故障排除指南

## 問題：載入食品失敗

### 可能原因和解決方案

#### 1. GraphQL 資料表不存在
**症狀**: 錯誤訊息包含 "food does not exist" 或類似內容

**解決方案**:
1. 確認 Nhost 後端已正確設定 `food` 資料表
2. 檢查資料表結構是否包含以下欄位：
   - `id` (uuid, primary key)
   - `name` (text)
   - `amount` (integer)
   - `price` (integer)
   - `shop` (text)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

#### 2. 網路連接問題
**症狀**: 錯誤訊息包含 "fetch", "network", "CORS" 等

**解決方案**:
1. 檢查網路連接
2. 確認 Nhost 服務正常運行
3. 檢查 CORS 設定

#### 3. 權限問題
**症狀**: 錯誤訊息包含 "permission denied" 或 "unauthorized"

**解決方案**:
1. 檢查 Nhost 的權限設定
2. 確認 `food` 資料表的讀取權限已正確設定

### 除錯工具

#### 1. 使用模擬模式
如果 GraphQL 連接有問題，可以啟用模擬模式來測試介面：

1. 訪問 `/food-management`
2. 點擊「啟用模擬模式」按鈕
3. 系統會使用本地模擬資料

#### 2. 使用除錯頁面
訪問 `/food-debug` 進行詳細檢查：

1. **測試基本連接** - 檢查 GraphQL 端點是否可達
2. **檢查 food 資料表** - 驗證資料表是否存在
3. **列出所有資料表** - 查看可用的 GraphQL 類型
4. **測試簡單查詢** - 執行基本的食品查詢

#### 3. 使用測試頁面
訪問 `/food-test` 進行 API 功能測試：

1. **測試新增食品** - 驗證新增功能
2. **測試取得所有食品** - 驗證查詢功能
3. **測試取得統計資料** - 驗證統計功能
4. **測試 GraphQL 連接** - 基本連接測試

### 檢查清單

#### Nhost 後端設定
- [ ] Nhost 專案已建立並正常運行
- [ ] `food` 資料表已建立
- [ ] 資料表欄位結構正確
- [ ] 權限設定允許讀取/寫入

#### 前端設定
- [ ] Nhost 客戶端配置正確 (subdomain, region)
- [ ] 網路連接正常
- [ ] 瀏覽器控制台沒有 CORS 錯誤

#### 資料表結構 (SQL)
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

#### 權限設定 (Nhost)
確保以下權限已設定：
- `food` 表的 `select` 權限
- `food` 表的 `insert` 權限
- `food` 表的 `update` 權限
- `food` 表的 `delete` 權限

### 常見錯誤訊息

#### "relation 'food' does not exist"
- 資料表尚未建立
- 資料表名稱不正確

#### "permission denied for table food"
- 權限設定問題
- 需要在 Nhost 控制台設定適當權限

#### "fetch is not defined" 或 "network error"
- 網路連接問題
- CORS 設定問題
- Nhost 服務不可用

#### "parsing Hasura.GraphQL.Transport.HTTP.Protocol.GQLReq(GQLReq) failed, expected Object, but encountered String"
**最新問題**: GraphQL 請求格式錯誤

**原因**: 請求體被當作字串而不是 JSON 物件發送到 Hasura

**解決方案**:
1. 應用程式已更新使用修正的 `graphqlRequest` 方法
2. 系統會自動切換到模擬模式當連接失敗時
3. 使用 `/food-debug` 頁面測試連接狀態
4. 檢查瀏覽器網路標籤中的請求格式

**臨時解決方案**:
- 系統會自動啟用模擬模式
- 手動啟用：在任何頁面的瀏覽器控制台執行 `window.foodService?.setMockMode(true)`

### 聯絡支援

如果問題持續存在，請提供以下資訊：
1. 瀏覽器控制台的完整錯誤訊息
2. Nhost 專案設定截圖
3. 資料表結構截圖
4. 權限設定截圖

### 臨時解決方案

在問題解決之前，可以：
1. 使用模擬模式繼續開發介面
2. 手動建立測試資料
3. 檢查 Nhost 文檔和社群支援