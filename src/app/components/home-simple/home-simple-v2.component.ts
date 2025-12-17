import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-simple-v2',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="w-full">
      <!-- 歡迎橫幅 -->
      <div class="mb-4 sm:mb-6 p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg sm:rounded-xl shadow-lg">
        <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2">歡迎使用鋒兄Angular資訊管理系統</h1>
        <p class="text-sm sm:text-base text-blue-100 mb-3 sm:mb-4">版權所有 2025 - 2125</p>
        <div class="flex flex-wrap gap-2 text-xs sm:text-sm">
          <span class="bg-white bg-opacity-20 px-2 py-1 rounded">Angular 19</span>
          <span class="bg-white bg-opacity-20 px-2 py-1 rounded">Tailwind CSS</span>
          <span class="bg-white bg-opacity-20 px-2 py-1 rounded">CloudFlare</span>
        </div>
      </div>

      <!-- 統計卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-blue-100">總圖片數</p>
              <p class="text-2xl sm:text-3xl font-bold">156</p>
            </div>
            <div class="text-3xl sm:text-4xl opacity-80">🖼️</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-green-100">食品項目</p>
              <p class="text-2xl sm:text-3xl font-bold">13</p>
            </div>
            <div class="text-3xl sm:text-4xl opacity-80">🍽️</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-purple-100">訂閱數</p>
              <p class="text-2xl sm:text-3xl font-bold">24</p>
            </div>
            <div class="text-3xl sm:text-4xl opacity-80">📋</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-orange-100">影片數</p>
              <p class="text-2xl sm:text-3xl font-bold">8</p>
            </div>
            <div class="text-3xl sm:text-4xl opacity-80">🎬</div>
          </div>
        </div>
      </div>

      <!-- 快速功能 -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">快速功能</h2>
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <a routerLink="/food-management" 
             class="flex flex-col items-center p-3 sm:p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <div class="text-3xl sm:text-4xl mb-2">🍽️</div>
            <p class="text-xs sm:text-sm font-medium text-gray-700 text-center">食品管理</p>
          </a>
          <a routerLink="/subscription-management" 
             class="flex flex-col items-center p-3 sm:p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <div class="text-3xl sm:text-4xl mb-2">📋</div>
            <p class="text-xs sm:text-sm font-medium text-gray-700 text-center">訂閱管理</p>
          </a>
          <a routerLink="/video-intro" 
             class="flex flex-col items-center p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <div class="text-3xl sm:text-4xl mb-2">🎬</div>
            <p class="text-xs sm:text-sm font-medium text-gray-700 text-center">影片介紹</p>
          </a>
          <a routerLink="/dashboard" 
             class="flex flex-col items-center p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <div class="text-3xl sm:text-4xl mb-2">📊</div>
            <p class="text-xs sm:text-sm font-medium text-gray-700 text-center">數據儀表板</p>
          </a>
        </div>
      </div>

      <!-- 系統資訊 -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
        <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">系統資訊</h2>
        <div class="space-y-2 text-sm sm:text-base text-gray-600">
          <p>✅ 系統運行正常</p>
          <p>📱 響應式設計已優化</p>
          <p>🚀 使用 Tailwind CSS</p>
          <p>⚡ Angular 19 獨立元件</p>
        </div>
      </div>
    </div>
  `
})
export class HomeSimpleV2Component {}
