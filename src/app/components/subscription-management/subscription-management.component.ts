import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionService, Subscription } from '../../services/subscription.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-subscription-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <!-- 頁面標題區域 -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div class="flex items-center space-x-4">
            <div class="bg-blue-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">訂閱管理</h1>
              <p class="text-gray-600 mt-1">管理您的所有訂閱服務</p>
            </div>
          </div>
          <button 
            (click)="refreshData()"
            [disabled]="loading"
            class="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>{{ loading ? '載入中...' : '重新載入' }}</span>
          </button>
        </div>
      </div>

      <!-- 統計卡片區域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">總訂閱數</p>
              <p class="text-2xl font-bold text-gray-900">{{ subscriptions.length }}</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">總月費</p>
              <p class="text-2xl font-bold text-green-600">NT$ {{ getTotalMonthlyFee() | number }}</p>
            </div>
            <div class="bg-green-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">即將到期</p>
              <p class="text-2xl font-bold text-yellow-600">{{ getUpcomingSubscriptions().length }}</p>
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
              <p class="text-sm font-medium text-gray-600">年度總支出</p>
              <p class="text-2xl font-bold text-purple-600">NT$ {{ (getTotalMonthlyFee() * 12) | number }}</p>
            </div>
            <div class="bg-purple-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 錯誤訊息 -->
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {{ error }}
        <button (click)="error = null" class="float-right font-bold">&times;</button>
      </div>

      <!-- 即將到期提醒 -->
      <div *ngIf="getUpcomingSubscriptions().length > 0" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
        <strong>提醒：</strong>有 {{ getUpcomingSubscriptions().length }} 個訂閱即將在 7 天內到期
      </div>

      <!-- 新增訂閱表單 -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">新增訂閱服務</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">服務名稱 *</label>
            <input 
              type="text" 
              placeholder="例如：Netflix" 
              [(ngModel)]="newSubscription.name"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">網站 URL</label>
            <input 
              type="url" 
              placeholder="https://example.com" 
              [(ngModel)]="newSubscription.site"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">月費 (NT$) *</label>
            <input 
              type="number" 
              placeholder="390" 
              [(ngModel)]="newSubscription.price"
              min="0"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">下次付款日期 *</label>
            <input 
              type="date" 
              [(ngModel)]="newSubscription.nextdate"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
          </div>
        </div>
        
        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <button 
            (click)="addSubscription()"
            [disabled]="loading || !newSubscription.name || !newSubscription.nextdate"
            class="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <svg *ngIf="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <div *ngIf="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>{{ loading ? '新增中...' : '新增訂閱' }}</span>
          </button>
          <button 
            (click)="resetForm()"
            class="flex items-center justify-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            <span>清除表單</span>
          </button>
        </div>
      </div>

      <!-- 訂閱列表 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- 載入狀態 -->
        <div *ngIf="loading && subscriptions.length === 0" class="p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p class="text-gray-500">載入訂閱資料中...</p>
        </div>
        
        <!-- 空狀態 -->
        <div *ngIf="subscriptions.length === 0 && !loading" class="p-12 text-center">
          <div class="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">尚未新增任何訂閱服務</h3>
          <p class="text-gray-500 mb-4">開始新增您的第一個訂閱服務來追蹤支出</p>
        </div>

        <!-- 桌面版表格 -->
        <div *ngIf="subscriptions.length > 0" class="hidden lg:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <span>服務名稱</span>
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>下次付款日期</span>
                    <span class="text-blue-500 ml-1" title="已按日期排序（由近至遠）">↑</span>
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    <span>月費</span>
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                    <span>網站</span>
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr *ngFor="let subscription of subscriptions" 
                  class="hover:bg-gray-50 transition-colors duration-200"
                  [ngClass]="{
                    'bg-yellow-50 border-l-4 border-yellow-400': isUpcomingSubscription(subscription),
                    'bg-red-50 border-l-4 border-red-400': isOverdueSubscription(subscription)
                  }">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {{ subscription.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="text-sm font-medium text-gray-900">{{ subscription.name }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <div class="text-sm" [ngClass]="{
                      'text-red-600 font-semibold': isOverdueSubscription(subscription),
                      'text-yellow-600 font-semibold': isUpcomingSubscription(subscription),
                      'text-gray-900': !isUpcomingSubscription(subscription) && !isOverdueSubscription(subscription)
                    }">
                      {{ subscription.nextdate | date:'yyyy-MM-dd' }}
                    </div>
                    <span *ngIf="isOverdueSubscription(subscription)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      已逾期
                    </span>
                    <span *ngIf="isUpcomingSubscription(subscription)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      即將到期
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold" [ngClass]="{
                    'text-green-600': subscription.price < 200,
                    'text-blue-600': subscription.price >= 200 && subscription.price < 500,
                    'text-orange-600': subscription.price >= 500
                  }">
                    NT$ {{ subscription.price | number }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <a [href]="subscription.site" target="_blank" 
                     class="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-900 text-sm transition-colors">
                    <span>前往網站</span>
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button 
                      (click)="editSubscription(subscription)"
                      class="inline-flex items-center px-3 py-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      編輯
                    </button>
                    <button 
                      (click)="deleteSubscription(subscription.id)"
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
        <div *ngIf="subscriptions.length > 0" class="lg:hidden divide-y divide-gray-100">
          <div *ngFor="let subscription of subscriptions" 
               class="p-4 hover:bg-gray-50 transition-colors duration-200"
               [ngClass]="{
                 'bg-yellow-50 border-l-4 border-yellow-400': isUpcomingSubscription(subscription),
                 'bg-red-50 border-l-4 border-red-400': isOverdueSubscription(subscription)
               }">
            <!-- 手機版優化布局 -->
            <div class="space-y-3">
              <!-- 頂部：服務信息和價格 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3 flex-1 min-w-0">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                    {{ subscription.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-medium text-gray-900 truncate">{{ subscription.name }}</h3>
                    <div class="flex items-center space-x-2 mt-1 flex-wrap">
                      <span class="text-sm text-gray-500">下次付款：</span>
                      <span class="text-sm font-medium" [ngClass]="{
                        'text-red-600': isOverdueSubscription(subscription),
                        'text-yellow-600': isUpcomingSubscription(subscription),
                        'text-gray-900': !isUpcomingSubscription(subscription) && !isOverdueSubscription(subscription)
                      }">
                        {{ subscription.nextdate | date:'MM/dd' }}
                      </span>
                      <span *ngIf="isOverdueSubscription(subscription)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        已逾期
                      </span>
                      <span *ngIf="isUpcomingSubscription(subscription)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        即將到期
                      </span>
                    </div>
                  </div>
                </div>
                <div class="text-right flex-shrink-0 ml-2">
                  <div class="text-lg font-bold" [ngClass]="{
                    'text-green-600': subscription.price < 200,
                    'text-blue-600': subscription.price >= 200 && subscription.price < 500,
                    'text-orange-600': subscription.price >= 500
                  }">
                    NT$ {{ subscription.price | number }}
                  </div>
                </div>
              </div>
              
              <!-- 底部：操作按鈕 -->
              <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                <div class="flex items-center space-x-1">
                  <button 
                    (click)="editSubscription(subscription)"
                    class="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    <span>編輯</span>
                  </button>
                  <button 
                    (click)="deleteSubscription(subscription.id)"
                    class="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <span>刪除</span>
                  </button>
                </div>
                <a [href]="subscription.site" target="_blank" 
                   class="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  <span>網站</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 編輯訂閱模態框 -->
      <div *ngIf="editingSubscription" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                <h3 class="text-xl font-bold">編輯訂閱服務</h3>
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
            <form (ngSubmit)="updateSubscription()" #editForm="ngForm">
              <div class="space-y-5">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <span class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span>服務名稱 *</span>
                    </span>
                  </label>
                  <input 
                    type="text" 
                    [(ngModel)]="editingSubscription.name"
                    name="editName"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <span class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                      </svg>
                      <span>網站 URL</span>
                    </span>
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://example.com"
                    [(ngModel)]="editingSubscription.site"
                    name="editSite"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      <span class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                        <span>月費 (NT$) *</span>
                      </span>
                    </label>
                    <input 
                      type="number" 
                      [(ngModel)]="editingSubscription.price"
                      name="editPrice"
                      min="0"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  </div>
                  
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      <span class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>下次付款日期 *</span>
                      </span>
                    </label>
                    <input 
                      type="date" 
                      [(ngModel)]="editingSubscription.nextdate"
                      name="editNextdate"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  </div>
                </div>
              </div>
              
              <!-- 按鈕區域 -->
              <div class="mt-8 flex gap-3">
                <button 
                  type="submit"
                  [disabled]="!editForm.valid || loading"
                  class="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg *ngIf="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <div *ngIf="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{{ loading ? '更新中...' : '更新訂閱' }}</span>
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
export class SubscriptionManagementComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  loading = true; // 預設為載入中
  error: string | null = null;
  private destroy$ = new Subject<void>();
  
  newSubscription = {
    name: '',
    site: '',
    price: 0,
    nextdate: ''
  };

  editingSubscription: Subscription | null = null;

  constructor(
    private subscriptionService: SubscriptionService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('SubscriptionManagementComponent ngOnInit 被調用');
    // 直接載入資料，不使用複雜的初始化邏輯
    this.loadSubscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSubscriptions() {
    console.log('開始載入訂閱資料...', new Date().toLocaleTimeString());
    this.loading = true;
    this.error = null;
    
    this.subscriptionService.getSubscriptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subscriptions) => {
          console.log('成功載入訂閱資料:', subscriptions);
          console.log('訂閱數量:', subscriptions.length);
          
          // 按下次付款日期排序（由近至遠）
          this.subscriptions = this.sortSubscriptionsByNextDate(subscriptions);
          this.loading = false;
          
          // 立即觸發變更檢測
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          
          console.log('總月費:', this.getTotalMonthlyFee());
          console.log('即將到期的訂閱:', this.getUpcomingSubscriptions());
        },
        error: (error) => {
          console.error('載入訂閱失敗:', error);
          this.error = '載入訂閱資料失敗';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  addSubscription() {
    if (this.newSubscription.name && this.newSubscription.nextdate) {
      this.loading = true;
      
      const subscriptionData = {
        name: this.newSubscription.name,
        site: this.newSubscription.site || 'https://example.com',
        price: this.newSubscription.price || 0,
        nextdate: this.newSubscription.nextdate
      };

      this.subscriptionService.addSubscription(subscriptionData).subscribe({
        next: (newSubscription) => {
          this.subscriptions.push(newSubscription);
          // 重新排序
          this.subscriptions = this.sortSubscriptionsByNextDate(this.subscriptions);
          this.resetForm();
          this.loading = false;
          // 觸發變更檢測
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('新增訂閱失敗:', error);
          this.error = '新增訂閱失敗';
          this.loading = false;
          // 觸發變更檢測
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        }
      });
    }
  }

  editSubscription(subscription: Subscription) {
    this.editingSubscription = { ...subscription };
    
    // 格式化日期為 YYYY-MM-DD 格式，避免時區問題
    if (this.editingSubscription.nextdate) {
      const dateStr = this.editingSubscription.nextdate;
      if (dateStr.includes('T')) {
        // 如果是 ISO 格式，只取日期部分
        this.editingSubscription.nextdate = dateStr.split('T')[0];
      } else if (dateStr.includes('/')) {
        // 如果是 MM/DD/YYYY 或類似格式，轉換為 YYYY-MM-DD
        const date = new Date(dateStr + 'T00:00:00');
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        this.editingSubscription.nextdate = `${year}-${month}-${day}`;
      }
    }
  }

  updateSubscription() {
    if (!this.editingSubscription) return;

    this.loading = true;
    this.cdr.detectChanges();
    
    const updateData = {
      name: this.editingSubscription.name,
      site: this.editingSubscription.site,
      price: this.editingSubscription.price,
      nextdate: this.editingSubscription.nextdate
    };

    this.subscriptionService.updateSubscription(this.editingSubscription.id, updateData).subscribe({
      next: (updatedSubscription) => {
        const index = this.subscriptions.findIndex(s => s.id === this.editingSubscription!.id);
        if (index !== -1) {
          this.subscriptions[index] = updatedSubscription;
          // 重新排序
          this.subscriptions = this.sortSubscriptionsByNextDate(this.subscriptions);
        }
        
        this.editingSubscription = null;
        this.loading = false;
        this.cdr.detectChanges();
        alert('訂閱更新成功！');
      },
      error: (error) => {
        console.error('更新訂閱失敗:', error);
        this.error = '更新訂閱失敗';
        this.loading = false;
        this.cdr.detectChanges();
        alert('更新訂閱失敗，請稍後再試');
      }
    });
  }

  cancelEdit() {
    this.editingSubscription = null;
  }

  deleteSubscription(id: string) {
    if (confirm('確定要刪除這個訂閱嗎？')) {
      this.loading = true;
      
      this.subscriptionService.deleteSubscription(id).subscribe({
        next: (success) => {
          if (success) {
            this.subscriptions = this.subscriptions.filter(s => s.id !== id);
          }
          this.loading = false;
          // 觸發變更檢測
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('刪除訂閱失敗:', error);
          this.error = '刪除訂閱失敗';
          this.loading = false;
          // 觸發變更檢測
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        }
      });
    }
  }

  resetForm() {
    this.newSubscription = {
      name: '',
      site: '',
      price: 0,
      nextdate: ''
    };
  }

  getTotalMonthlyFee(): number {
    return this.subscriptionService.getTotalMonthlyFee(this.subscriptions);
  }

  getUpcomingSubscriptions(): Subscription[] {
    return this.subscriptionService.getUpcomingSubscriptions(this.subscriptions, 7);
  }

  refreshData() {
    console.log('手動重新載入資料');
    this.subscriptions = [];
    this.loadSubscriptions();
  }

  /**
   * 按下次付款日期排序訂閱（由近至遠）
   */
  private sortSubscriptionsByNextDate(subscriptions: Subscription[]): Subscription[] {
    return [...subscriptions].sort((a, b) => {
      const dateA = new Date(a.nextdate);
      const dateB = new Date(b.nextdate);
      return dateA.getTime() - dateB.getTime(); // 升序排列（最近的在前面）
    });
  }

  /**
   * 檢查訂閱是否即將到期（7天內）
   */
  isUpcomingSubscription(subscription: Subscription): boolean {
    const today = new Date();
    const nextDate = new Date(subscription.nextdate);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return nextDate >= today && nextDate <= nextWeek;
  }

  /**
   * 檢查訂閱是否已逾期
   */
  isOverdueSubscription(subscription: Subscription): boolean {
    const today = new Date();
    const nextDate = new Date(subscription.nextdate);
    
    return nextDate < today;
  }
}