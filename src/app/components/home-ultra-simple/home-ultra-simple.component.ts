import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-ultra-simple',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 space-y-8">
      <!-- 版權資訊區域 -->
      <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg">
        <div class="text-center">
          <h1 class="text-2xl font-bold mb-3">鋒兄塗哥公關資訊©</h1>
          <p class="text-lg mb-2">版權所有 2025～2125</p>
          <div class="flex flex-wrap justify-center gap-4 text-sm">
            <span class="bg-blue-600 px-3 py-1 rounded-full">前端使用 Angular(Material)</span>
            <span class="bg-green-600 px-3 py-1 rounded-full">後端使用 NNhost</span>
            <span class="bg-orange-600 px-3 py-1 rounded-full">網頁存放於 CloudFlare</span>
          </div>
        </div>
      </div>
      
      <!-- 圖片展示區域 -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">📸 首頁圖片展示</h2>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-6">來自 /images 資料夾的精選圖片</p>
        
        <!-- 圖片網格 -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <!-- 測試用彩色方塊 -->
          <div *ngFor="let demo of demoImages; let i = index" class="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div 
              [style.background]="demo.gradient"
              class="w-full h-32 flex items-center justify-center text-white font-bold text-lg transition-transform duration-300 group-hover:scale-110">
              {{ demo.icon }}
            </div>
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <span class="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">
                {{ demo.name }}
              </span>
            </div>
          </div>
          
          <!-- 實際圖片測試 -->
          <div *ngFor="let image of featuredImages" class="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <img 
              [src]="getImagePath(image.filename)" 
              [alt]="image.name"
              class="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110 bg-gray-200 dark:bg-gray-700"
              loading="lazy"
              (error)="onImageError($event, image)"
            />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <span class="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">
                {{ image.name }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- 圖片統計 -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            顯示 {{ demoImages.length }} 個示範項目 + {{ featuredImages.length }} 張實際圖片 | 總共 {{ totalImages }} 張圖片
          </p>
        </div>
      </div>
      
      <!-- 頂部歡迎區域 -->
      <div class="bg-gradient-to-r from-green-500 to-blue-500 text-white p-8 rounded-lg text-center">
        <h1 class="text-4xl font-bold">✅ 歡迎來到鋒兄系統！</h1>
        <p class="text-xl mt-4">首頁已成功載入 - 測試滾動按鈕功能</p>
      </div>
      
      <!-- 系統介紹 -->
      <div class="bg-blue-100 p-6 rounded-lg">
        <h2 class="text-2xl font-bold mb-4">歡迎使用鋒兄Angular資訊管理系統</h2>
        <p class="text-lg mb-4">這是一個功能完整的管理系統，包含多個模組和響應式設計。</p>
        <p class="text-base text-gray-700">現在您可以測試右下角的滾動按鈕功能：</p>
        <ul class="list-disc list-inside mt-2 text-gray-700">
          <li>🔵 藍色按鈕：回到頂部</li>
          <li>🟢 綠色按鈕：跳到底部</li>
          <li>⚪ 白色圓圈：顯示滾動進度</li>
        </ul>
      </div>
      
      <!-- 功能模組 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div class="text-4xl mb-4">📊</div>
          <h3 class="font-bold text-lg mb-2">儀表板</h3>
          <p class="text-gray-600">查看系統數據和統計資訊</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div class="text-4xl mb-4">🍽️</div>
          <h3 class="font-bold text-lg mb-2">食品管理</h3>
          <p class="text-gray-600">管理餐廳菜單和食品資訊</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div class="text-4xl mb-4">📋</div>
          <h3 class="font-bold text-lg mb-2">訂閱管理</h3>
          <p class="text-gray-600">處理會員訂閱和服務管理</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div class="text-4xl mb-4">🎬</div>
          <h3 class="font-bold text-lg mb-2">影片介紹</h3>
          <p class="text-gray-600">觀看系統介紹和教學影片</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div class="text-4xl mb-4">📱</div>
          <h3 class="font-bold text-lg mb-2">響應式展示</h3>
          <p class="text-gray-600">測試不同裝置的顯示效果</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div class="text-4xl mb-4">ℹ️</div>
          <h3 class="font-bold text-lg mb-2">關於我們</h3>
          <p class="text-gray-600">了解系統資訊和開發團隊</p>
        </div>
      </div>

      <!-- 測試內容區域 -->
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-center">測試滾動功能</h2>
        
        <!-- 重複內容來增加頁面高度 -->
        <div class="bg-purple-100 p-6 rounded-lg">
          <h3 class="text-xl font-bold mb-4">第一個測試區塊</h3>
          <p class="mb-4">這是用來測試滾動功能的內容區塊。當您滾動頁面時，右下角會出現滾動按鈕。</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white p-4 rounded">
              <h4 class="font-bold">功能特色</h4>
              <p>響應式設計、現代化界面、流暢動畫</p>
            </div>
            <div class="bg-white p-4 rounded">
              <h4 class="font-bold">技術棧</h4>
              <p>Angular 17、Tailwind CSS、TypeScript</p>
            </div>
          </div>
        </div>

        <div class="bg-orange-100 p-6 rounded-lg">
          <h3 class="text-xl font-bold mb-4">第二個測試區塊</h3>
          <p class="mb-4">繼續滾動以測試滾動進度指示器的準確性。</p>
          <div class="space-y-4">
            <div class="bg-white p-4 rounded">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div class="bg-white p-4 rounded">
              <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
            <div class="bg-white p-4 rounded">
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            </div>
          </div>
        </div>

        <div class="bg-pink-100 p-6 rounded-lg">
          <h3 class="text-xl font-bold mb-4">第三個測試區塊</h3>
          <p class="mb-4">測試滾動到底部的功能。</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-white p-4 rounded text-center">
              <div class="text-2xl mb-2">🚀</div>
              <p class="font-bold">高效能</p>
            </div>
            <div class="bg-white p-4 rounded text-center">
              <div class="text-2xl mb-2">🎨</div>
              <p class="font-bold">美觀設計</p>
            </div>
            <div class="bg-white p-4 rounded text-center">
              <div class="text-2xl mb-2">📱</div>
              <p class="font-bold">響應式</p>
            </div>
          </div>
        </div>

        <div class="bg-green-100 p-6 rounded-lg">
          <h3 class="text-xl font-bold mb-4">第四個測試區塊</h3>
          <p class="mb-4">更多測試內容來確保滾動功能正常運作。</p>
          <div class="space-y-3">
            <div class="bg-white p-3 rounded">項目 1: 系統管理功能</div>
            <div class="bg-white p-3 rounded">項目 2: 用戶權限控制</div>
            <div class="bg-white p-3 rounded">項目 3: 數據分析報表</div>
            <div class="bg-white p-3 rounded">項目 4: 自動化流程</div>
            <div class="bg-white p-3 rounded">項目 5: 安全性監控</div>
          </div>
        </div>

        <div class="bg-indigo-100 p-6 rounded-lg">
          <h3 class="text-xl font-bold mb-4">最後一個測試區塊</h3>
          <p class="mb-4">這是頁面的最後一個區塊，用來測試「跳到底部」按鈕。</p>
          <div class="bg-white p-4 rounded">
            <p class="text-center text-lg font-semibold">🎉 恭喜！您已經到達頁面底部</p>
            <p class="text-center mt-2">現在可以使用藍色按鈕回到頂部</p>
          </div>
        </div>
      </div>

      <!-- 底部資訊 -->
      <div class="bg-gray-800 text-white p-6 rounded-lg text-center">
        <h3 class="text-xl font-bold mb-2">鋒兄Angular資訊管理系統</h3>
        <p class="text-gray-300">版本 2.0 | 滾動按鈕功能已啟用</p>
        <p class="text-sm text-gray-400 mt-2">© 2024 鋒兄AI 開發團隊</p>
      </div>
    </div>
  `
})
export class HomeUltraSimpleComponent {
  // 示範用彩色方塊
  demoImages = [
    { name: 'AI 生成圖片', icon: '🤖', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: '創意設計', icon: '🎨', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: '攝影作品', icon: '📸', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: '數位藝術', icon: '🖼️', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { name: '插畫作品', icon: '✏️', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { name: '3D 渲染', icon: '🎭', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { name: '概念圖', icon: '💡', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { name: '視覺效果', icon: '✨', gradient: 'linear-gradient(135deg, #ff8a80 0%, #ea80fc 100%)' },
    { name: '品牌設計', icon: '🏷️', gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
    { name: '網頁設計', icon: '💻', gradient: 'linear-gradient(135deg, #a6c1ee 0%, #fbc2eb 100%)' }
  ];

  // 精選圖片列表（使用確定存在的圖片）
  featuredImages = [
    { filename: 'favicon.ico', name: '網站圖標', isRoot: true },
    { filename: 'test-image.png', name: '測試圖片', isRoot: true }
  ];

  // 總圖片數量
  totalImages = 300; // 根據實際資料夾中的圖片數量

  // 獲取圖片路徑
  getImagePath(filename: string): string {
    const image = this.featuredImages.find(img => img.filename === filename);
    if (image?.isRoot) {
      return `/${filename}`;
    }
    return `/images/${filename}`;
  }

  // 圖片載入錯誤處理
  onImageError(event: any, image: any) {
    console.log('圖片載入失敗:', event.target.src, '圖片:', image.name);
    
    // 避免無限循環，檢查是否已經是錯誤圖片
    if (event.target.src.includes('data:image/svg+xml')) {
      return;
    }
    
    // 隱藏圖片容器並顯示錯誤訊息
    const container = event.target.parentElement;
    if (container) {
      container.innerHTML = `
        <div class="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div class="text-center text-gray-500 dark:text-gray-400 p-2">
            <div class="text-2xl mb-2">🖼️</div>
            <div class="text-xs">圖片載入失敗</div>
            <div class="text-xs">${image.name}</div>
          </div>
        </div>
      `;
    }
  }
}
