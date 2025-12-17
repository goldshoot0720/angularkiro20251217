import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-simple',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6">
        <h1 class="text-3xl font-bold mb-2">🏠 歡迎使用鋒兄Angular資訊管理系統</h1>
        <p class="text-blue-100 mb-4">版權所有 2025 - 2125</p>
        <div class="flex gap-2 text-sm">
          <span class="bg-white bg-opacity-20 px-2 py-1 rounded">Angular + Material</span>
          <span class="bg-white bg-opacity-20 px-2 py-1 rounded">Nhost 後端</span>
          <span class="bg-white bg-opacity-20 px-2 py-1 rounded">CloudFlare 託管</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 class="text-xl font-bold mb-4">🖼️ 圖片路徑測試</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <p class="text-sm mb-2">Images 路徑</p>
            <img src="/images/0d5c4921-9c4c-46b8-8266-85d89c053d66.png" 
                 alt="測試圖片" 
                 class="w-full h-24 object-cover border rounded"
                 onload="this.nextElementSibling.textContent='✅ 成功'"
                 onerror="this.nextElementSibling.textContent='❌ 失敗'">
            <p class="text-xs mt-1">載入中...</p>
          </div>
          <div class="text-center">
            <p class="text-sm mb-2">Public 路徑</p>
            <img src="/test-image-direct.png" 
                 alt="測試圖片" 
                 class="w-full h-24 object-cover border rounded"
                 onload="this.nextElementSibling.textContent='✅ 成功'"
                 onerror="this.nextElementSibling.textContent='❌ 失敗'">
            <p class="text-xs mt-1">載入中...</p>
          </div>
          <div class="text-center">
            <p class="text-sm mb-2">相對 Images</p>
            <img src="images/0d5c4921-9c4c-46b8-8266-85d89c053d66.png" 
                 alt="測試圖片" 
                 class="w-full h-24 object-cover border rounded"
                 onload="this.nextElementSibling.textContent='✅ 成功'"
                 onerror="this.nextElementSibling.textContent='❌ 失敗'">
            <p class="text-xs mt-1">載入中...</p>
          </div>
          <div class="text-center">
            <p class="text-sm mb-2">備用圖片</p>
            <div class="w-full h-24 bg-gray-200 border rounded flex items-center justify-center">
              <span class="text-gray-500 text-xs">備用圖片</span>
            </div>
            <p class="text-xs mt-1">✅ 正常</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 class="text-xl font-bold mb-4">📊 系統狀態</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-blue-100 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-blue-600">{{ currentTime | date:'HH:mm:ss' }}</div>
            <div class="text-sm text-blue-500">當前時間</div>
          </div>
          <div class="bg-green-100 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-green-600">✅</div>
            <div class="text-sm text-green-500">系統正常</div>
          </div>
          <div class="bg-purple-100 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-purple-600">Angular</div>
            <div class="text-sm text-purple-500">框架</div>
          </div>
          <div class="bg-orange-100 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-orange-600">{{ loadCount }}</div>
            <div class="text-sm text-orange-500">載入次數</div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4">🚀 快速功能</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg text-center cursor-pointer transition-colors">
            <div class="text-2xl mb-2">🍽️</div>
            <p class="text-sm font-medium text-gray-700">食品管理</p>
          </div>
          <div class="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center cursor-pointer transition-colors">
            <div class="text-2xl mb-2">📋</div>
            <p class="text-sm font-medium text-gray-700">訂閱管理</p>
          </div>
          <div class="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center cursor-pointer transition-colors">
            <div class="text-2xl mb-2">🎬</div>
            <p class="text-sm font-medium text-gray-700">影片介紹</p>
          </div>
          <div class="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center cursor-pointer transition-colors">
            <div class="text-2xl mb-2">📊</div>
            <p class="text-sm font-medium text-gray-700">數據儀表板</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeSimpleComponent {
  currentTime = new Date();
  loadCount = 1;

  constructor() {
    console.log('HomeSimpleComponent 已載入');
    
    // 每秒更新時間
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    // 記錄載入次數
    const count = localStorage.getItem('homeLoadCount');
    this.loadCount = count ? parseInt(count) + 1 : 1;
    localStorage.setItem('homeLoadCount', this.loadCount.toString());
  }
}