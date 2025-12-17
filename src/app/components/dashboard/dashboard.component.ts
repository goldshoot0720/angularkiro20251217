import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { FoodService, Food } from '../../services/food.service';
import { SubscriptionService, Subscription } from '../../services/subscription.service';

interface DashboardStats {
  food: {
    total: number;
    expired: number;
    expiringSoon: number;
    totalQuantity: number;
  };
  subscription: {
    total: number;
    totalMonthlyFee: number;
    upcomingCount: number;
    activeCount: number;
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-6">
      <!-- 頁面標題 -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">數據儀表板</h1>
        <p class="text-gray-600">統一管理您的訂閱服務和食品庫存</p>
      </div>

      <!-- 載入狀態 -->
      <div *ngIf="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-600">載入數據中...</p>
      </div>

      <!-- 調試信息 -->
      <div class="bg-yellow-100 p-4 rounded-lg mb-4 text-sm">
        <p><strong>調試信息:</strong></p>
        <p>isLoading: {{ isLoading }}</p>
        <p>食品數量: {{ foods.length }}</p>
        <p>訂閱數量: {{ subscriptions.length }}</p>
        <p>食品總數統計: {{ stats.food.total }}</p>
        <p>訂閱總數統計: {{ stats.subscription.total }}</p>
      </div>

      <!-- 主要統計卡片 -->
      <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- 食品總數 -->
        <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100 text-sm">食品總數</p>
              <p class="text-3xl font-bold">{{ stats.food.total }}</p>
              <p class="text-orange-100 text-xs mt-1">總數量: {{ stats.food.totalQuantity }}</p>
            </div>
            <div class="text-4xl opacity-80">🍽️</div>
          </div>
        </div>

        <!-- 訂閱總數 -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm">訂閱總數</p>
              <p class="text-3xl font-bold">{{ stats.subscription.total }}</p>
              <p class="text-blue-100 text-xs mt-1">活躍: {{ stats.subscription.activeCount }}</p>
            </div>
            <div class="text-4xl opacity-80">📋</div>
          </div>
        </div>

        <!-- 月費總額 -->
        <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm">月費總額</p>
              <p class="text-3xl font-bold">NT$ {{ stats.subscription.totalMonthlyFee | number }}</p>
              <p class="text-green-100 text-xs mt-1">每月支出</p>
            </div>
            <div class="text-4xl opacity-80">💰</div>
          </div>
        </div>

        <!-- 警告項目 -->
        <div class="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-100 text-sm">需要注意</p>
              <p class="text-3xl font-bold">{{ getTotalWarnings() }}</p>
              <p class="text-red-100 text-xs mt-1">過期 + 即將到期</p>
            </div>
            <div class="text-4xl opacity-80">⚠️</div>
          </div>
        </div>
      </div>

      <!-- 時間範圍選擇器 -->
      <div *ngIf="!isLoading" class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <h3 class="text-lg font-semibold text-gray-800">時間範圍篩選</h3>
          
          <!-- 訂閱管理時間範圍 -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">訂閱管理:</span>
            <button 
              *ngFor="let period of subscriptionPeriods"
              (click)="setSubscriptionPeriod(period.value)"
              [class]="getButtonClass(selectedSubscriptionPeriod === period.value)"
              class="px-3 py-1 text-sm rounded-lg transition-colors">
              {{ period.label }}
            </button>
          </div>

          <!-- 食品管理時間範圍 -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">食品管理:</span>
            <button 
              *ngFor="let period of foodPeriods"
              (click)="setFoodPeriod(period.value)"
              [class]="getButtonClass(selectedFoodPeriod === period.value)"
              class="px-3 py-1 text-sm rounded-lg transition-colors">
              {{ period.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- 詳細統計區域 -->
      <div *ngIf="!isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- 食品管理統計 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">食品管理統計</h3>
            <a routerLink="/food-management" 
               class="text-orange-600 hover:text-orange-800 text-sm font-medium">
              管理食品 →
            </a>
          </div>

          <!-- 食品狀態統計 -->
          <div class="grid grid-cols-3 gap-4 mb-4">
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ stats.food.total - stats.food.expired - stats.food.expiringSoon }}</div>
              <div class="text-xs text-gray-600">正常</div>
            </div>
            <div class="text-center p-3 bg-yellow-50 rounded-lg">
              <div class="text-2xl font-bold text-yellow-600">{{ stats.food.expiringSoon }}</div>
              <div class="text-xs text-gray-600">即將到期</div>
            </div>
            <div class="text-center p-3 bg-red-50 rounded-lg">
              <div class="text-2xl font-bold text-red-600">{{ stats.food.expired }}</div>
              <div class="text-xs text-gray-600">已過期</div>
            </div>
          </div>

          <!-- 即將到期的食品 -->
          <div *ngIf="upcomingFoods.length > 0">
            <h4 class="text-md font-semibold text-gray-700 mb-3">即將到期食品 ({{ selectedFoodPeriod }}天內)</h4>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div *ngFor="let food of upcomingFoods" 
                   class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img *ngIf="food.photo" [src]="food.photo" [alt]="food.name" 
                         class="w-full h-full object-cover">
                    <span *ngIf="!food.photo" class="text-gray-400 text-xs">🍽️</span>
                  </div>
                  <div>
                    <div class="font-medium text-gray-800">{{ food.name }}</div>
                    <div class="text-sm text-gray-600">{{ formatDate(food.to_date) }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-yellow-600">{{ food.amount }}</div>
                  <div class="text-xs text-gray-500">{{ getDaysUntilExpiry(food.to_date) }}天</div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="upcomingFoods.length === 0" class="text-center py-4 text-gray-500">
            <div class="text-2xl mb-2">✅</div>
            <div class="text-sm">{{ selectedFoodPeriod }}天內沒有即將到期的食品</div>
          </div>
        </div>

        <!-- 訂閱管理統計 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">訂閱管理統計</h3>
            <a routerLink="/subscription-management" 
               class="text-blue-600 hover:text-blue-800 text-sm font-medium">
              管理訂閱 →
            </a>
          </div>

          <!-- 訂閱狀態統計 -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="text-center p-3 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ stats.subscription.activeCount }}</div>
              <div class="text-xs text-gray-600">活躍訂閱</div>
            </div>
            <div class="text-center p-3 bg-yellow-50 rounded-lg">
              <div class="text-2xl font-bold text-yellow-600">{{ stats.subscription.upcomingCount }}</div>
              <div class="text-xs text-gray-600">即將到期</div>
            </div>
          </div>

          <!-- 即將到期的訂閱 -->
          <div *ngIf="upcomingSubscriptions.length > 0">
            <h4 class="text-md font-semibold text-gray-700 mb-3">即將到期訂閱 ({{ selectedSubscriptionPeriod }}天內)</h4>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div *ngFor="let subscription of upcomingSubscriptions" 
                   class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <div class="font-medium text-gray-800">{{ subscription.name }}</div>
                  <div class="text-sm text-gray-600">{{ formatDate(subscription.nextdate) }}</div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-yellow-600">NT$ {{ subscription.price | number }}</div>
                  <a [href]="subscription.site" target="_blank" 
                     class="text-xs text-blue-600 hover:text-blue-800">前往網站</a>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="upcomingSubscriptions.length === 0" class="text-center py-4 text-gray-500">
            <div class="text-2xl mb-2">✅</div>
            <div class="text-sm">{{ selectedSubscriptionPeriod }}天內沒有即將到期的訂閱</div>
          </div>
        </div>
      </div>

      <!-- 快速操作區域 -->
      <div *ngIf="!isLoading" class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">快速操作</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a routerLink="/food-management" class="bg-orange-100 hover:bg-orange-200 p-4 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">🍽️</div>
            <p class="text-sm font-medium text-gray-700">食品管理</p>
            <p class="text-xs text-gray-500">{{ stats.food.total }} 項食品</p>
          </a>
          <a routerLink="/subscription-management" class="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">📋</div>
            <p class="text-sm font-medium text-gray-700">訂閱管理</p>
            <p class="text-xs text-gray-500">{{ stats.subscription.total }} 項訂閱</p>
          </a>
          <button (click)="refreshData()" class="bg-green-100 hover:bg-green-200 p-4 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">🔄</div>
            <p class="text-sm font-medium text-gray-700">重新載入</p>
            <p class="text-xs text-gray-500">更新數據</p>
          </button>
          <a routerLink="/home" class="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">🏠</div>
            <p class="text-sm font-medium text-gray-700">返回首頁</p>
            <p class="text-xs text-gray-500">主頁面</p>
          </a>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isLoading = true;
  foods: Food[] = [];
  subscriptions: Subscription[] = [];
  upcomingFoods: Food[] = [];
  upcomingSubscriptions: Subscription[] = [];
  
  selectedSubscriptionPeriod = 3;
  selectedFoodPeriod = 7;
  
  subscriptionPeriods = [
    { label: '3天', value: 3 },
    { label: '7天', value: 7 }
  ];
  
  foodPeriods = [
    { label: '7天', value: 7 },
    { label: '30天', value: 30 }
  ];

  stats: DashboardStats = {
    food: {
      total: 0,
      expired: 0,
      expiringSoon: 0,
      totalQuantity: 0
    },
    subscription: {
      total: 0,
      totalMonthlyFee: 0,
      upcomingCount: 0,
      activeCount: 0
    }
  };

  constructor(
    private foodService: FoodService,
    private subscriptionService: SubscriptionService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData() {
    this.isLoading = true;
    console.log('開始載入儀表板數據...');
    
    // 使用 forkJoin 來並行載入數據
    forkJoin({
      foods: this.foodService.getAllFoodsObservable(),
      subscriptions: this.subscriptionService.getSubscriptions()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        // 確保在 Angular zone 內執行
        this.ngZone.run(() => {
          console.log('儀表板數據載入完成:', data);
          this.foods = data.foods || [];
          this.subscriptions = data.subscriptions || [];
          
          console.log('載入的食品數量:', this.foods.length);
          console.log('載入的訂閱數量:', this.subscriptions.length);
          
          this.calculateStats();
          this.updateUpcomingItems();
          this.isLoading = false;
          
          console.log('統計數據:', this.stats);
          console.log('isLoading 狀態:', this.isLoading);
          
          // 手動觸發變更檢測
          this.cdr.detectChanges();
          console.log('儀表板 UI 更新完成');
        });
      },
      error: (error) => {
        this.ngZone.run(() => {
          console.error('載入儀表板數據失敗:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  calculateStats() {
    // 計算食品統計
    this.stats.food.total = this.foods.length;
    this.stats.food.totalQuantity = this.foods.reduce((sum, food) => sum + food.amount, 0);
    this.stats.food.expired = this.foods.filter(food => this.isExpired(food.to_date)).length;
    this.stats.food.expiringSoon = this.foods.filter(food => 
      this.isExpiringSoon(food.to_date, this.selectedFoodPeriod) && !this.isExpired(food.to_date)
    ).length;

    // 計算訂閱統計
    this.stats.subscription.total = this.subscriptions.length;
    this.stats.subscription.totalMonthlyFee = this.subscriptionService.getTotalMonthlyFee(this.subscriptions);
    this.stats.subscription.activeCount = this.subscriptions.length; // 假設所有訂閱都是活躍的
    this.stats.subscription.upcomingCount = this.subscriptionService.getUpcomingSubscriptions(
      this.subscriptions, this.selectedSubscriptionPeriod
    ).length;
  }

  updateUpcomingItems() {
    // 更新即將到期的食品
    this.upcomingFoods = this.foods.filter(food => 
      this.isExpiringSoon(food.to_date, this.selectedFoodPeriod) || this.isExpired(food.to_date)
    ).sort((a, b) => new Date(a.to_date || '').getTime() - new Date(b.to_date || '').getTime());

    // 更新即將到期的訂閱
    this.upcomingSubscriptions = this.subscriptionService.getUpcomingSubscriptions(
      this.subscriptions, this.selectedSubscriptionPeriod
    );
  }

  setSubscriptionPeriod(days: number) {
    this.selectedSubscriptionPeriod = days;
    this.calculateStats();
    this.updateUpcomingItems();
  }

  setFoodPeriod(days: number) {
    this.selectedFoodPeriod = days;
    this.calculateStats();
    this.updateUpcomingItems();
  }

  getButtonClass(isActive: boolean): string {
    return isActive 
      ? 'bg-blue-500 text-white' 
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  }

  getTotalWarnings(): number {
    return this.stats.food.expired + this.stats.food.expiringSoon + this.stats.subscription.upcomingCount;
  }

  refreshData() {
    this.loadDashboardData();
  }

  // 輔助方法
  isExpired(dateString?: string): boolean {
    if (!dateString) return false;
    const today = new Date();
    const expiryDate = new Date(dateString);
    return expiryDate < today;
  }

  isExpiringSoon(dateString?: string, days: number = 7): boolean {
    if (!dateString) return false;
    const today = new Date();
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days && diffDays >= 0;
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW');
  }

  getDaysUntilExpiry(dateString?: string): number {
    if (!dateString) return 0;
    const today = new Date();
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}