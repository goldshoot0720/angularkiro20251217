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
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">訂閱管理</h1>
          <p class="text-gray-600">共 {{ subscriptions.length }} 筆訂閱服務</p>
          <button 
            (click)="refreshData()"
            [disabled]="loading"
            class="mt-2 text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors disabled:opacity-50">
            {{ loading ? '載入中...' : '重新載入' }}
          </button>
        </div>
        <div class="bg-blue-500 text-white px-6 py-3 rounded-lg">
          <div class="text-sm">總月費</div>
          <div class="text-2xl font-bold">NT$ {{ getTotalMonthlyFee() | number }}</div>
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

      <!-- 新增/編輯訂閱表單 -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4" [ngClass]="{
          'text-green-600': !editingSubscription,
          'text-blue-600': editingSubscription
        }">
          {{ editingSubscription ? '編輯訂閱' : '新增訂閱' }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input 
              type="text" 
              placeholder="服務名稱" 
              [(ngModel)]="newSubscription.name"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <input 
              type="url" 
              placeholder="網站 URL" 
              [(ngModel)]="newSubscription.site"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <input 
              type="number" 
              placeholder="月費" 
              [(ngModel)]="newSubscription.price"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <input 
              type="date" 
              [(ngModel)]="newSubscription.nextdate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
        <div class="mt-4 flex space-x-2">
          <button 
            (click)="editingSubscription ? updateSubscription() : addSubscription()"
            [disabled]="loading"
            class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50">
            {{ loading ? '處理中...' : (editingSubscription ? '更新訂閱' : '新增訂閱') }}
          </button>
          <button 
            *ngIf="editingSubscription"
            (click)="resetForm()"
            class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors">
            取消編輯
          </button>
        </div>
      </div>

      <!-- 訂閱列表 -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div *ngIf="loading && subscriptions.length === 0" class="p-8 text-center text-gray-500">
          載入中...
        </div>
        <div *ngIf="subscriptions.length === 0 && !loading" class="p-8 text-center text-gray-500">
          尚未新增任何訂閱服務
        </div>
        <div *ngIf="subscriptions.length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">服務名稱</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  下次付款日期 
                  <span class="text-blue-500 ml-1" title="已按日期排序（由近至遠）">↑</span>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">月費</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">網站</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let subscription of subscriptions" 
                  class="hover:bg-gray-50"
                  [ngClass]="{
                    'bg-yellow-50 border-l-4 border-yellow-400': isUpcomingSubscription(subscription),
                    'bg-red-50 border-l-4 border-red-400': isOverdueSubscription(subscription)
                  }">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ subscription.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm" [ngClass]="{
                    'text-red-600 font-semibold': isOverdueSubscription(subscription),
                    'text-yellow-600 font-semibold': isUpcomingSubscription(subscription),
                    'text-gray-900': !isUpcomingSubscription(subscription) && !isOverdueSubscription(subscription)
                  }">
                    {{ subscription.nextdate | date:'yyyy-MM-dd' }}
                    <span *ngIf="isOverdueSubscription(subscription)" class="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">已逾期</span>
                    <span *ngIf="isUpcomingSubscription(subscription)" class="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">即將到期</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold" [ngClass]="{
                    'text-green-600': subscription.price < 200,
                    'text-blue-600': subscription.price >= 200 && subscription.price < 500,
                    'text-orange-600': subscription.price >= 500
                  }">
                    NT$ {{ subscription.price | number }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <a [href]="subscription.site" target="_blank" 
                     class="text-blue-600 hover:text-blue-900 text-sm">
                    前往網站
                  </a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button 
                    (click)="editSubscription(subscription)"
                    class="text-blue-600 hover:text-blue-900">編輯</button>
                  <button 
                    (click)="deleteSubscription(subscription.id)"
                    class="text-red-600 hover:text-red-900">刪除</button>
                </td>
              </tr>
            </tbody>
          </table>
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
        },
        error: (error) => {
          console.error('新增訂閱失敗:', error);
          this.error = '新增訂閱失敗';
          this.loading = false;
        }
      });
    }
  }

  editSubscription(subscription: Subscription) {
    this.editingSubscription = { ...subscription };
    this.newSubscription = {
      name: subscription.name,
      site: subscription.site,
      price: subscription.price,
      nextdate: subscription.nextdate
    };
  }

  updateSubscription() {
    if (this.editingSubscription && this.newSubscription.name && this.newSubscription.nextdate) {
      this.loading = true;
      
      const updateData = {
        name: this.newSubscription.name,
        site: this.newSubscription.site,
        price: this.newSubscription.price,
        nextdate: this.newSubscription.nextdate
      };

      this.subscriptionService.updateSubscription(this.editingSubscription.id, updateData).subscribe({
        next: (updatedSubscription) => {
          const index = this.subscriptions.findIndex(s => s.id === this.editingSubscription!.id);
          if (index !== -1) {
            this.subscriptions[index] = updatedSubscription;
            // 重新排序
            this.subscriptions = this.sortSubscriptionsByNextDate(this.subscriptions);
          }
          this.resetForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('更新訂閱失敗:', error);
          this.error = '更新訂閱失敗';
          this.loading = false;
        }
      });
    }
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
        },
        error: (error) => {
          console.error('刪除訂閱失敗:', error);
          this.error = '刪除訂閱失敗';
          this.loading = false;
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
    this.editingSubscription = null;
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