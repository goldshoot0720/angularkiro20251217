import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService, Food, CreateFoodInput } from '../../services/food.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-food-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <!-- 頁面標題區域 -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div class="flex items-center space-x-4">
            <div class="bg-green-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M9.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm10 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">食品管理</h1>
              <p class="text-gray-600 mt-1">管理您的食品庫存與有效期限</p>
            </div>
          </div>
          <button 
            (click)="refreshData()"
            [disabled]="isLoading"
            class="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>{{ isLoading ? '載入中...' : '重新載入' }}</span>
          </button>
        </div>
      </div>

      <!-- 統計卡片區域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">總食品數</p>
              <p class="text-2xl font-bold text-gray-900">{{ foods.length }}</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">總數量</p>
              <p class="text-2xl font-bold text-green-600">{{ getTotalQuantity() }}</p>
            </div>
            <div class="bg-green-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">即將到期</p>
              <p class="text-2xl font-bold text-yellow-600">{{ getExpiringSoonCount() }}</p>
            </div>
            <div class="bg-yellow-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">已過期</p>
              <p class="text-2xl font-bold text-red-600">{{ getExpiredCount() }}</p>
            </div>
            <div class="bg-red-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 狀態指示器 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div class="flex flex-wrap items-center gap-4 text-sm">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-gray-700">即時同步</span>
          </div>
          <div *ngIf="getExpiredCount() > 0" class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <span class="text-red-700 font-medium">{{ getExpiredCount() }} 項已過期</span>
          </div>
          <div *ngIf="getExpiringSoonCount() > 0" class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span class="text-yellow-700 font-medium">{{ getExpiringSoonCount() }} 項即將到期</span>
          </div>
        </div>
      </div>

      <!-- 搜尋區域 -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="bg-gray-100 p-2 rounded-lg">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">搜尋食品</h3>
        </div>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="輸入食品名稱進行搜尋..." 
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
          </div>
          <button 
            (click)="loadFoods()"
            class="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>重新整理</span>
          </button>
        </div>
      </div>

      <!-- 新增食品表單 -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-lg">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">新增食品</h3>
        </div>
        
        <form (ngSubmit)="addFood()" #foodForm="ngForm">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">
                <span class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                  <span>食品名稱 *</span>
                </span>
              </label>
              <input 
                type="text" 
                placeholder="例如：蘋果、牛奶" 
                [(ngModel)]="newFood.name"
                name="name"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
            </div>
            
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">
                <span class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                  </svg>
                  <span>數量 *</span>
                </span>
              </label>
              <input 
                type="number" 
                placeholder="1" 
                [(ngModel)]="newFood.amount"
                name="amount"
                min="1"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
            </div>
            
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">
                <span class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>有效期限 *</span>
                </span>
              </label>
              <input 
                type="date" 
                [(ngModel)]="newFood.to_date"
                name="to_date"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
            </div>
            
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">
                <span class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>圖片網址</span>
                </span>
              </label>
              <input 
                type="url" 
                placeholder="https://example.com/image.jpg"
                [(ngModel)]="imageUrl"
                (input)="onImageUrlChange()"
                name="imageUrl"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
            </div>
          </div>
          
          <!-- 圖片預覽 -->
          <div *ngIf="imageUrl" class="mt-6">
            <label class="block text-sm font-semibold text-gray-700 mb-3">圖片預覽</label>
            <div class="relative inline-block">
              <img [src]="imageUrl" alt="預覽" 
                   class="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                   (error)="onImageError($event)">
              <button 
                type="button"
                (click)="removeImage()"
                class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold transition-colors shadow-lg">
                ×
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              來源：網址
            </p>
          </div>

          <div class="mt-6 flex flex-col sm:flex-row gap-3">
            <button 
              type="submit"
              [disabled]="!foodForm.valid || isLoading"
              class="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <svg *ngIf="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <div *ngIf="isLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{{ isLoading ? '新增中...' : '新增食品' }}</span>
            </button>
            <button 
              type="button"
              (click)="resetForm()"
              class="flex items-center justify-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span>清除表單</span>
            </button>
          </div>
        </form>
      </div>

      <!-- 食品列表 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- 載入狀態 -->
        <div *ngIf="isLoading" class="p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p class="text-gray-500 text-lg">載入食品資料中...</p>
        </div>
        
        <!-- 空狀態 -->
        <div *ngIf="!isLoading && foods.length === 0" class="p-12 text-center">
          <div class="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M9.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm10 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">尚未新增任何食品</h3>
          <p class="text-gray-500 mb-4">開始新增您的第一個食品來管理庫存</p>
        </div>

        <!-- 桌面版表格 -->
        <div *ngIf="!isLoading && foods.length > 0" class="hidden lg:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>圖片</span>
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    <span>名稱</span>
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                    </svg>
                    <span>數量</span>
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>到期日期</span>
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr *ngFor="let food of displayedFoods" 
                  class="hover:bg-gray-50 transition-colors duration-200 {{ getExpiryStatusClass(food) }}"
                  [title]="getExpiryStatusText(food)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                    <img *ngIf="food.photo" [src]="food.photo" [alt]="food.name" 
                         class="w-full h-full object-cover">
                    <svg *ngIf="!food.photo" class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">{{ food.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-3">
                    <button 
                      (click)="updateQuantity(food, food.amount - 1)"
                      [disabled]="food.amount <= 1"
                      class="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                      −
                    </button>
                    <span class="text-lg font-bold text-gray-900 min-w-[40px] text-center bg-gray-50 px-3 py-1 rounded-lg">{{ food.amount }}</span>
                    <button 
                      (click)="updateQuantity(food, food.amount + 1)"
                      class="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg text-sm font-bold transition-colors">
                      +
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <div class="text-sm font-medium" [ngClass]="{
                      'text-red-600': isExpired(food),
                      'text-yellow-600': isExpiringSoon(food),
                      'text-gray-700': !isExpired(food) && !isExpiringSoon(food)
                    }">
                      {{ formatDate(food.to_date) }}
                    </div>
                    <span *ngIf="isExpired(food)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      已過期
                    </span>
                    <span *ngIf="isExpiringSoon(food) && !isExpired(food)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      即將到期
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button 
                      (click)="editFood(food)"
                      class="inline-flex items-center px-3 py-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      編輯
                    </button>
                    <button 
                      (click)="confirmDeleteFood(food)"
                      class="inline-flex items-center px-3 py-1 rounded-md text-red-600 hover:bg-red-50 transition-colors">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 手機版卡片列表 -->
        <div *ngIf="!isLoading && foods.length > 0" class="lg:hidden divide-y divide-gray-100">
          <div *ngFor="let food of displayedFoods" 
               class="p-4 hover:bg-gray-50 transition-colors duration-200 {{ getExpiryStatusClass(food) }}"
               [title]="getExpiryStatusText(food)">
            <div class="flex items-start space-x-4">
              <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                <img *ngIf="food.photo" [src]="food.photo" [alt]="food.name" 
                     class="w-full h-full object-cover">
                <svg *ngIf="!food.photo" class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 truncate">{{ food.name }}</h3>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="text-sm text-gray-500">到期日：</span>
                  <span class="text-sm font-medium" [ngClass]="{
                    'text-red-600': isExpired(food),
                    'text-yellow-600': isExpiringSoon(food),
                    'text-gray-700': !isExpired(food) && !isExpiringSoon(food)
                  }">
                    {{ formatDate(food.to_date) }}
                  </span>
                  <span *ngIf="isExpired(food)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    已過期
                  </span>
                  <span *ngIf="isExpiringSoon(food) && !isExpired(food)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    即將到期
                  </span>
                </div>
                
                <div class="flex items-center justify-between mt-3">
                  <div class="flex items-center space-x-3">
                    <button 
                      (click)="updateQuantity(food, food.amount - 1)"
                      [disabled]="food.amount <= 1"
                      class="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                      −
                    </button>
                    <span class="text-lg font-bold text-gray-900 min-w-[40px] text-center bg-gray-50 px-3 py-1 rounded-lg">{{ food.amount }}</span>
                    <button 
                      (click)="updateQuantity(food, food.amount + 1)"
                      class="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg text-sm font-bold transition-colors">
                      +
                    </button>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <button 
                      (click)="editFood(food)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      (click)="confirmDeleteFood(food)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 編輯食品模態框 -->
      <div *ngIf="editingFood" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform transition-all">
          <!-- 模態框標題 -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold">編輯食品</h3>
              </div>
              <button 
                type="button"
                (click)="cancelEdit()"
                class="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- 模態框內容 -->
          <div class="p-6">
            <form (ngSubmit)="updateFood()" #editForm="ngForm">
              <div class="space-y-5">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <span class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                      </svg>
                      <span>食品名稱 *</span>
                    </span>
                  </label>
                  <input 
                    type="text" 
                    [(ngModel)]="editingFood.name"
                    name="editName"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      <span class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                        </svg>
                        <span>數量 *</span>
                      </span>
                    </label>
                    <input 
                      type="number" 
                      [(ngModel)]="editingFood.amount"
                      name="editAmount"
                      min="1"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  </div>
                  
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      <span class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>有效期限 *</span>
                      </span>
                    </label>
                    <input 
                      type="date" 
                      [(ngModel)]="editingFood.to_date"
                      name="editToDate"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <span class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>圖片網址</span>
                    </span>
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://example.com/image.jpg"
                    [(ngModel)]="editImageUrl"
                    (input)="onEditImageUrlChange()"
                    name="editImageUrl"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                </div>
                
                <!-- 編輯時的圖片預覽 -->
                <div *ngIf="editImageUrl || editingFood.photo" class="space-y-3">
                  <label class="block text-sm font-semibold text-gray-700">目前圖片</label>
                  <div class="flex justify-center">
                    <div class="relative inline-block">
                      <img [src]="editImageUrl || editingFood.photo" alt="預覽" 
                           class="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                           (error)="onEditImageError($event)">
                      <button 
                        type="button"
                        (click)="removeEditImage()"
                        class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold transition-colors shadow-lg">
                        ×
                      </button>
                    </div>
                  </div>
                  <div class="text-center">
                    <p *ngIf="editImageUrl" class="text-xs text-gray-500">
                      來源：網址
                    </p>
                    <p *ngIf="!editImageUrl && editingFood.photo" class="text-xs text-gray-500">
                      來源：原有圖片
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- 按鈕區域 -->
              <div class="mt-8 flex gap-3">
                <button 
                  type="submit"
                  [disabled]="!editForm.valid || isLoading"
                  class="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg *ngIf="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <div *ngIf="isLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{{ isLoading ? '更新中...' : '更新食品' }}</span>
                </button>
                <button 
                  type="button"
                  (click)="cancelEdit()"
                  class="flex-1 flex items-center justify-center space-x-2 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <span>取消</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FoodManagementComponent implements OnInit, OnDestroy {
  foods: Food[] = [];
  displayedFoods: Food[] = [];
  isLoading = true; // 預設為載入中
  searchTerm = '';
  selectedShop = '';
  editingFood: Food | null = null;
  imageUrl: string = '';
  editImageUrl: string = '';
  private destroy$ = new Subject<void>();

  newFood: CreateFoodInput = {
    name: '',
    amount: 1,
    to_date: '',
    photo: ''
  };

  constructor(
    private foodService: FoodService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('FoodManagementComponent ngOnInit 被調用');
    this.loadFoods();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadFoods() {
    console.log('開始載入食品資料...', new Date().toLocaleTimeString());
    this.isLoading = true;
    
    try {
      this.foods = await this.foodService.getAllFoods();
      console.log('成功載入食品資料:', this.foods);
      console.log('食品數量:', this.foods.length);
      
      this.applyFilters();
      this.isLoading = false;
      
      // 立即觸發變更檢測
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      
      console.log('總數量:', this.getTotalQuantity());
    } catch (error: any) {
      console.error('載入食品失敗:', error);
      this.isLoading = false;
      this.cdr.detectChanges();
      
      // 顯示更詳細的錯誤信息
      let errorMessage = '載入食品失敗';
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      alert(errorMessage + '\n\n請檢查:\n1. 網路連接\n2. GraphQL 服務是否正常\n3. food 資料表是否存在\n\n可以訪問 /food-debug 進行詳細檢查');
    }
  }

  async addFood() {
    if (!this.newFood.name || !this.newFood.to_date || this.newFood.amount <= 0) {
      alert('請填寫所有必填欄位');
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();
    
    try {
      const createdFood = await this.foodService.createFood(this.newFood);
      this.foods.push(createdFood);
      this.applyFilters();
      this.resetForm();
      this.isLoading = false;
      this.cdr.detectChanges();
      alert('食品新增成功！');
    } catch (error) {
      console.error('新增食品失敗:', error);
      this.isLoading = false;
      this.cdr.detectChanges();
      alert('新增食品失敗，請稍後再試');
    }
  }

  async updateQuantity(food: Food, newAmount: number) {
    if (newAmount < 1) return;

    try {
      const updatedFood = await this.foodService.updateFood(food.id, { amount: newAmount });
      const index = this.foods.findIndex(f => f.id === food.id);
      if (index !== -1) {
        this.foods[index] = updatedFood;
        this.applyFilters();
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('更新數量失敗:', error);
      alert('更新數量失敗，請稍後再試');
    }
  }

  editFood(food: Food) {
    this.editingFood = { ...food };
    this.editImageUrl = food.photo || '';
    
    // 格式化日期為 YYYY-MM-DD 格式，避免時區問題
    if (this.editingFood.to_date) {
      // 使用本地日期格式，避免時區轉換
      const dateStr = this.editingFood.to_date;
      if (dateStr.includes('T')) {
        // 如果是 ISO 格式，只取日期部分
        this.editingFood.to_date = dateStr.split('T')[0];
      } else if (dateStr.includes('/')) {
        // 如果是 MM/DD/YYYY 或類似格式，轉換為 YYYY-MM-DD
        const date = new Date(dateStr + 'T00:00:00');
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        this.editingFood.to_date = `${year}-${month}-${day}`;
      }
    }
  }

  async updateFood() {
    if (!this.editingFood) return;

    this.isLoading = true;
    this.cdr.detectChanges();
    
    try {
      const updatedFood = await this.foodService.updateFood(this.editingFood.id, {
        name: this.editingFood.name,
        amount: this.editingFood.amount,
        to_date: this.editingFood.to_date,
        photo: this.editingFood.photo
      });

      const index = this.foods.findIndex(f => f.id === this.editingFood!.id);
      if (index !== -1) {
        this.foods[index] = updatedFood;
        this.applyFilters();
      }

      this.editingFood = null;
      this.isLoading = false;
      this.cdr.detectChanges();
      alert('食品更新成功！');
    } catch (error) {
      console.error('更新食品失敗:', error);
      this.isLoading = false;
      this.cdr.detectChanges();
      alert('更新食品失敗，請稍後再試');
    }
  }

  cancelEdit() {
    this.editingFood = null;
    this.editImageUrl = '';
  }

  confirmDeleteFood(food: Food) {
    if (confirm(`確定要刪除「${food.name}」嗎？`)) {
      this.deleteFood(food);
    }
  }

  async deleteFood(food: Food) {
    try {
      const success = await this.foodService.deleteFood(food.id);
      if (success) {
        this.foods = this.foods.filter(f => f.id !== food.id);
        this.applyFilters();
        this.cdr.detectChanges();
        alert('食品刪除成功！');
      }
    } catch (error) {
      console.error('刪除食品失敗:', error);
      alert('刪除食品失敗，請稍後再試');
    }
  }

  async onSearch() {
    if (this.searchTerm.trim()) {
      try {
        this.foods = await this.foodService.searchFoods(this.searchTerm);
        this.applyFilters();
      } catch (error) {
        console.error('搜尋失敗:', error);
      }
    } else {
      this.loadFoods();
    }
  }



  applyFilters() {
    this.displayedFoods = [...this.foods];
  }

  resetForm() {
    this.newFood = {
      name: '',
      amount: 1,
      to_date: '',
      photo: ''
    };
    this.imageUrl = '';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    
    // 避免時區問題，直接解析日期字符串
    let date: Date;
    if (dateString.includes('T')) {
      // ISO 格式，只取日期部分
      const dateOnly = dateString.split('T')[0];
      const [year, month, day] = dateOnly.split('-').map(Number);
      date = new Date(year, month - 1, day);
    } else if (dateString.includes('-')) {
      // YYYY-MM-DD 格式
      const [year, month, day] = dateString.split('-').map(Number);
      date = new Date(year, month - 1, day);
    } else {
      // 其他格式
      date = new Date(dateString + 'T00:00:00');
    }
    
    return date.toLocaleDateString('zh-TW');
  }





  getTotalQuantity(): number {
    return this.foods.reduce((sum, food) => sum + food.amount, 0);
  }

  refreshData() {
    console.log('手動重新載入食品資料');
    this.foods = [];
    this.displayedFoods = [];
    this.loadFoods();
  }

  // 檢查食品是否即將到期（7天內）
  isExpiringSoon(food: Food): boolean {
    if (!food.to_date) return false;
    
    // 使用本地日期，避免時區問題
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 設置為當天開始時間
    
    const expiryDate = this.parseDate(food.to_date);
    expiryDate.setHours(0, 0, 0, 0); // 設置為當天開始時間
    
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }

  // 檢查食品是否已過期
  isExpired(food: Food): boolean {
    if (!food.to_date) return false;
    
    // 使用本地日期，避免時區問題
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 設置為當天開始時間
    
    const expiryDate = this.parseDate(food.to_date);
    expiryDate.setHours(0, 0, 0, 0); // 設置為當天開始時間
    
    return expiryDate < today;
  }

  // 獲取到期狀態的 CSS 類別
  getExpiryStatusClass(food: Food): string {
    if (this.isExpired(food)) {
      return 'bg-red-50 border-l-4 border-red-500';
    } else if (this.isExpiringSoon(food)) {
      return 'bg-yellow-50 border-l-4 border-yellow-500';
    }
    return '';
  }

  // 獲取到期狀態文字
  getExpiryStatusText(food: Food): string {
    if (!food.to_date) return '';
    
    // 使用本地日期，避免時區問題
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 設置為當天開始時間
    
    const expiryDate = this.parseDate(food.to_date);
    expiryDate.setHours(0, 0, 0, 0); // 設置為當天開始時間
    
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `已過期 ${Math.abs(diffDays)} 天`;
    } else if (diffDays === 0) {
      return '今天到期';
    } else if (diffDays <= 7) {
      return `${diffDays} 天後到期`;
    }
    return '';
  }

  // 解析日期字符串，避免時區問題
  private parseDate(dateString: string): Date {
    if (dateString.includes('T')) {
      // ISO 格式，只取日期部分
      const dateOnly = dateString.split('T')[0];
      const [year, month, day] = dateOnly.split('-').map(Number);
      return new Date(year, month - 1, day);
    } else if (dateString.includes('-')) {
      // YYYY-MM-DD 格式
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    } else {
      // 其他格式，添加時間部分避免時區轉換
      return new Date(dateString + 'T00:00:00');
    }
  }

  // 獲取已過期食品數量
  getExpiredCount(): number {
    return this.foods.filter(food => this.isExpired(food)).length;
  }

  // 獲取即將到期食品數量
  getExpiringSoonCount(): number {
    return this.foods.filter(food => this.isExpiringSoon(food) && !this.isExpired(food)).length;
  }

  // 處理新增食品的圖片網址變更
  onImageUrlChange() {
    if (this.imageUrl.trim()) {
      this.newFood.photo = this.imageUrl.trim();
    } else {
      this.newFood.photo = '';
    }
  }

  // 移除新增食品的圖片
  removeImage() {
    this.imageUrl = '';
    this.newFood.photo = '';
  }

  // 處理編輯食品的圖片網址變更
  onEditImageUrlChange() {
    if (this.editingFood) {
      if (this.editImageUrl.trim()) {
        this.editingFood.photo = this.editImageUrl.trim();
      } else {
        this.editingFood.photo = '';
      }
    }
  }

  // 移除編輯食品的圖片
  removeEditImage() {
    this.editImageUrl = '';
    if (this.editingFood) {
      this.editingFood.photo = '';
    }
  }

  // 處理圖片載入錯誤
  onImageError(event: any) {
    console.error('圖片載入失敗:', this.imageUrl);
    event.target.src = ''; // 清除錯誤的圖片
  }

  // 處理編輯時圖片載入錯誤
  onEditImageError(event: any) {
    console.error('圖片載入失敗:', this.editImageUrl || this.editingFood?.photo);
    event.target.src = ''; // 清除錯誤的圖片
  }
}