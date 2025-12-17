import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubscriptionService, Subscription } from '../../services/subscription.service';

@Component({
  selector: 'app-subscription-stats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">訂閱服務概覽</h3>
        <a routerLink="/subscription-management" 
           class="text-blue-600 hover:text-blue-800 text-sm font-medium">
          管理訂閱 →
        </a>
      </div>

      <div *ngIf="loading" class="text-center py-4 text-gray-500">
        載入中...
      </div>

      <div *ngIf="!loading">
        <!-- 統計卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="text-2xl font-bold text-blue-600">{{ subscriptions.length }}</div>
            <div class="text-sm text-gray-600">總訂閱數</div>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <div class="text-2xl font-bold text-green-600">NT$ {{ getTotalMonthlyFee() | number }}</div>
            <div class="text-sm text-gray-600">月費總額</div>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4">
            <div class="text-2xl font-bold text-yellow-600">{{ getUpcomingCount() }}</div>
            <div class="text-sm text-gray-600">即將到期</div>
          </div>
        </div>

        <!-- 即將到期的訂閱 -->
        <div *ngIf="upcomingSubscriptions.length > 0">
          <h4 class="text-md font-semibold text-gray-700 mb-3">即將到期 (7天內)</h4>
          <div class="space-y-2">
            <div *ngFor="let subscription of upcomingSubscriptions" 
                 class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <div class="font-medium text-gray-800">{{ subscription.name }}</div>
                <div class="text-sm text-gray-600">{{ subscription.nextdate | date:'yyyy-MM-dd' }}</div>
              </div>
              <div class="text-right">
                <div class="font-semibold text-yellow-600">NT$ {{ subscription.price | number }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 最近的訂閱 -->
        <div *ngIf="recentSubscriptions.length > 0" class="mt-6">
          <h4 class="text-md font-semibold text-gray-700 mb-3">最近訂閱</h4>
          <div class="space-y-2">
            <div *ngFor="let subscription of recentSubscriptions" 
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div class="font-medium text-gray-800">{{ subscription.name }}</div>
                <div class="text-sm text-gray-600">下次付款: {{ subscription.nextdate | date:'yyyy-MM-dd' }}</div>
              </div>
              <div class="text-right">
                <div class="font-semibold text-gray-600">NT$ {{ subscription.price | number }}</div>
                <a [href]="subscription.site" target="_blank" 
                   class="text-xs text-blue-600 hover:text-blue-800">前往網站</a>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="subscriptions.length === 0" class="text-center py-8 text-gray-500">
          <div class="text-4xl mb-2">📋</div>
          <div class="text-lg font-medium mb-2">尚未新增任何訂閱</div>
          <div class="text-sm mb-4">開始管理您的訂閱服務</div>
          <a routerLink="/subscription-management" 
             class="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            新增訂閱
          </a>
        </div>
      </div>
    </div>
  `
})
export class SubscriptionStatsComponent implements OnInit {
  subscriptions: Subscription[] = [];
  upcomingSubscriptions: Subscription[] = [];
  recentSubscriptions: Subscription[] = [];
  loading = false;

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.loading = true;
    
    this.subscriptionService.getSubscriptions().subscribe({
      next: (subscriptions) => {
        this.subscriptions = subscriptions;
        this.upcomingSubscriptions = this.subscriptionService.getUpcomingSubscriptions(subscriptions, 7);
        this.recentSubscriptions = subscriptions.slice(0, 3); // 顯示前3個
        this.loading = false;
      },
      error: (error) => {
        console.error('載入訂閱統計失敗:', error);
        this.loading = false;
      }
    });
  }

  getTotalMonthlyFee(): number {
    return this.subscriptionService.getTotalMonthlyFee(this.subscriptions);
  }

  getUpcomingCount(): number {
    return this.upcomingSubscriptions.length;
  }
}