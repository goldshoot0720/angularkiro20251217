import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-simple',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 bg-white min-h-screen">
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        ✅ 儀表板頁面載入成功！
      </div>
      
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">數據儀表板</h1>
        <p class="text-gray-600">統一管理您的訂閱服務和食品庫存</p>
      </div>

      <!-- 簡化的統計卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100 text-sm">食品總數</p>
              <p class="text-3xl font-bold">12</p>
            </div>
            <div class="text-4xl opacity-80">🍽️</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm">訂閱總數</p>
              <p class="text-3xl font-bold">5</p>
            </div>
            <div class="text-4xl opacity-80">📋</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm">月費總額</p>
              <p class="text-3xl font-bold">NT$ 1,200</p>
            </div>
            <div class="text-4xl opacity-80">💰</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-100 text-sm">需要注意</p>
              <p class="text-3xl font-bold">3</p>
            </div>
            <div class="text-4xl opacity-80">⚠️</div>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">快速操作</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a routerLink="/food-management" class="bg-orange-100 hover:bg-orange-200 p-4 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">🍽️</div>
            <p class="text-sm font-medium text-gray-700">食品管理</p>
          </a>
          <a routerLink="/subscription-management" class="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">📋</div>
            <p class="text-sm font-medium text-gray-700">訂閱管理</p>
          </a>
          <a routerLink="/home" class="bg-green-100 hover:bg-green-200 p-4 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">🏠</div>
            <p class="text-sm font-medium text-gray-700">返回首頁</p>
          </a>
          <a routerLink="/about" class="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">ℹ️</div>
            <p class="text-sm font-medium text-gray-700">關於我們</p>
          </a>
        </div>
      </div>
    </div>
  `
})
export class DashboardSimpleComponent {}