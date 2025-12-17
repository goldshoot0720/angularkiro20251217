import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubscriptionService, Subscription } from '../../services/subscription.service';
import { FoodService, Food } from '../../services/food.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard-simple',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 bg-gray-50 min-h-screen">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">數據儀表板</h1>
        <p class="text-gray-600">統一管理您的訂閱服務和食品庫存</p>
      </div>

      <!-- 載入狀態 -->
      <div *ngIf="loading" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
        ⏳ 正在載入數據...
      </div>

      <!-- 錯誤訊息 -->
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        ❌ {{ error }}
      </div>

      <!-- 統計卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- 食品總數 -->
        <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100 text-sm">食品總數</p>
              <p class="text-3xl font-bold">{{ foodStats.total }}</p>
            </div>
            <div class="text-4xl opacity-80">🍽️</div>
          </div>
        </div>

        <!-- 訂閱總數 -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm">訂閱總數</p>
              <p class="text-3xl font-bold">{{ subscriptionStats.total }}</p>
            </div>
            <div class="text-4xl opacity-80">📋</div>
          </div>
        </div>

        <!-- 月費總額 -->
        <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm">月費總額</p>
              <p class="text-3xl font-bold">NT$ {{ subscriptionStats.totalFee }}</p>
            </div>
            <div class="text-4xl opacity-80">💰</div>
          </div>
        </div>

        <!-- 需要注意 -->
        <div class="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-100 text-sm">需要注意</p>
              <p class="text-3xl font-bold">{{ totalAlerts }}</p>
            </div>
            <div class="text-4xl opacity-80">⚠️</div>
          </div>
        </div>
      </div>

      <!-- 訂閱管理統計 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span class="text-2xl mr-2">📋</span>
          訂閱管理統計
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 3天內到期 -->
          <div class="border-l-4 border-red-500 bg-red-50 p-4 rounded">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-800">3天內到期提示</h3>
              <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {{ subscriptionStats.expiring3Days }}
              </span>
            </div>
            <div *ngIf="subscriptionStats.expiring3Days > 0" class="mt-3 space-y-2">
              <div *ngFor="let sub of upcomingSubscriptions3Days" 
                   class="bg-white p-3 rounded border border-red-200">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-gray-800">{{ sub.name }}</p>
                    <p class="text-sm text-gray-600">{{ sub.site }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-semibold text-red-600">
                      {{ getDaysUntil(sub.nextdate) }}天後
                    </p>
                    <p class="text-xs text-gray-500">NT$ {{ sub.price }}</p>
                  </div>
                </div>
              </div>
            </div>
            <p *ngIf="subscriptionStats.expiring3Days === 0" class="text-sm text-gray-600 mt-2">
              ✅ 沒有即將到期的訂閱
            </p>
          </div>

          <!-- 7天內到期 -->
          <div class="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-800">7天內到期提示</h3>
              <span class="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {{ subscriptionStats.expiring7Days }}
              </span>
            </div>
            <div *ngIf="subscriptionStats.expiring7Days > 0" class="mt-3 space-y-2">
              <div *ngFor="let sub of upcomingSubscriptions7Days" 
                   class="bg-white p-3 rounded border border-yellow-200">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-gray-800">{{ sub.name }}</p>
                    <p class="text-sm text-gray-600">{{ sub.site }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-semibold text-yellow-600">
                      {{ getDaysUntil(sub.nextdate) }}天後
                    </p>
                    <p class="text-xs text-gray-500">NT$ {{ sub.price }}</p>
                  </div>
                </div>
              </div>
            </div>
            <p *ngIf="subscriptionStats.expiring7Days === 0" class="text-sm text-gray-600 mt-2">
              ✅ 沒有即將到期的訂閱
            </p>
          </div>
        </div>
      </div>

      <!-- 食品管理統計 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span class="text-2xl mr-2">🍽️</span>
          食品管理統計
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 7天內過期 -->
          <div class="border-l-4 border-red-500 bg-red-50 p-4 rounded">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-800">7天內過期提示</h3>
              <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {{ foodStats.expiring7Days }}
              </span>
            </div>
            <div *ngIf="foodStats.expiring7Days > 0" class="mt-3 space-y-2">
              <div *ngFor="let food of expiringFoods7Days" 
                   class="bg-white p-3 rounded border border-red-200">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-gray-800">{{ food.name }}</p>
                    <p class="text-sm text-gray-600">數量: {{ food.amount }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-semibold text-red-600">
                      {{ getDaysUntil(food.to_date!) }}天後過期
                    </p>
                    <p class="text-xs text-gray-500">{{ food.shop }}</p>
                  </div>
                </div>
              </div>
            </div>
            <p *ngIf="foodStats.expiring7Days === 0" class="text-sm text-gray-600 mt-2">
              ✅ 沒有即將過期的食品
            </p>
          </div>

          <!-- 30天內過期 -->
          <div class="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-800">30天內過期提示</h3>
              <span class="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {{ foodStats.expiring30Days }}
              </span>
            </div>
            <div *ngIf="foodStats.expiring30Days > 0" class="mt-3 space-y-2 max-h-64 overflow-y-auto">
              <div *ngFor="let food of expiringFoods30Days" 
                   class="bg-white p-3 rounded border border-yellow-200">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-gray-800">{{ food.name }}</p>
                    <p class="text-sm text-gray-600">數量: {{ food.amount }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-semibold text-yellow-600">
                      {{ getDaysUntil(food.to_date!) }}天後過期
                    </p>
                    <p class="text-xs text-gray-500">{{ food.shop }}</p>
                  </div>
                </div>
              </div>
            </div>
            <p *ngIf="foodStats.expiring30Days === 0" class="text-sm text-gray-600 mt-2">
              ✅ 沒有即將過期的食品
            </p>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
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
          <button (click)="refreshData()" class="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">🔄</div>
            <p class="text-sm font-medium text-gray-700">重新整理</p>
          </button>
        </div>
      </div>
    </div>
  `
})
export class DashboardSimpleComponent implements OnInit {
  loading = true;
  error = '';

  // 訂閱數據
  subscriptions: Subscription[] = [];
  upcomingSubscriptions3Days: Subscription[] = [];
  upcomingSubscriptions7Days: Subscription[] = [];

  // 食品數據
  foods: Food[] = [];
  expiringFoods7Days: Food[] = [];
  expiringFoods30Days: Food[] = [];

  // 統計數據
  subscriptionStats = {
    total: 0,
    totalFee: 0,
    expiring3Days: 0,
    expiring7Days: 0
  };

  foodStats = {
    total: 0,
    expiring7Days: 0,
    expiring30Days: 0
  };

  get totalAlerts(): number {
    return this.subscriptionStats.expiring3Days + this.foodStats.expiring7Days;
  }

  constructor(
    private subscriptionService: SubscriptionService,
    private foodService: FoodService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = '';
    console.log('開始載入儀表板數據...');

    // 使用 Observable 訂閱方式載入訂閱數據
    this.subscriptionService.getSubscriptions().subscribe({
      next: (subs) => {
        console.log('儀表板載入訂閱數據:', subs.length, '筆');
        this.subscriptions = subs;
        
        // 計算統計
        this.subscriptionStats.total = this.subscriptions.length;
        this.subscriptionStats.totalFee = this.subscriptionService.getTotalMonthlyFee(this.subscriptions);
        console.log('訂閱統計 - 總數:', this.subscriptionStats.total, '月費:', this.subscriptionStats.totalFee);
        
        // 獲取即將到期的訂閱
        this.upcomingSubscriptions3Days = this.subscriptionService.getUpcomingSubscriptions(this.subscriptions, 3);
        this.upcomingSubscriptions7Days = this.subscriptionService.getUpcomingSubscriptions(this.subscriptions, 7);
        
        this.subscriptionStats.expiring3Days = this.upcomingSubscriptions3Days.length;
        this.subscriptionStats.expiring7Days = this.upcomingSubscriptions7Days.length;
        console.log('到期提示 - 3天:', this.subscriptionStats.expiring3Days, '7天:', this.subscriptionStats.expiring7Days);
        
        // 載入食品數據
        this.loadFoods();
      },
      error: (err) => {
        console.error('載入訂閱數據失敗:', err);
        this.error = '載入訂閱數據失敗';
        this.loading = false;
      }
    });
  }

  async loadFoods() {
    try {
      this.foods = await this.foodService.getAllFoods();
      console.log('儀表板載入食品數據:', this.foods.length, '筆');
      
      // 計算統計
      this.foodStats.total = this.foods.length;
      
      // 獲取即將過期的食品
      this.expiringFoods7Days = this.getExpiringFoods(7);
      this.expiringFoods30Days = this.getExpiringFoods(30);
      
      this.foodStats.expiring7Days = this.expiringFoods7Days.length;
      this.foodStats.expiring30Days = this.expiringFoods30Days.length;
      console.log('過期提示 - 7天:', this.foodStats.expiring7Days, '30天:', this.foodStats.expiring30Days);
      
      // 所有數據載入完成
      this.loading = false;
      console.log('儀表板數據載入完成');
      
      // 強制觸發變更檢測
      this.cdr.detectChanges();
    } catch (err) {
      console.error('載入食品數據失敗:', err);
      this.error = '載入食品數據失敗';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  getExpiringFoods(days: number): Food[] {
    const today = new Date();
    const targetDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    
    return this.foods.filter(food => {
      if (!food.to_date) return false;
      const expiryDate = new Date(food.to_date);
      return expiryDate >= today && expiryDate <= targetDate;
    });
  }

  getDaysUntil(dateString: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  refreshData() {
    this.loadData();
  }
}