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
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">食品管理</h1>
          <p class="text-gray-600">共 {{ foods.length }} 項食品</p>
          <button 
            (click)="refreshData()"
            [disabled]="isLoading"
            class="mt-2 text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors disabled:opacity-50">
            {{ isLoading ? '載入中...' : '重新載入' }}
          </button>
        </div>
        <div class="bg-blue-500 text-white px-6 py-3 rounded-lg">
          <div class="text-sm">總數量</div>
          <div class="text-2xl font-bold">{{ getTotalQuantity() }}</div>
        </div>
      </div>
      
      <div class="flex items-center mb-6 text-sm space-x-4">
        <span class="bg-green-100 text-green-800 px-2 py-1 rounded">✓ 即時同步</span>
        <span *ngIf="getExpiredCount() > 0" class="bg-red-100 text-red-800 px-2 py-1 rounded">
          ⚠️ {{ getExpiredCount() }} 項已過期
        </span>
        <span *ngIf="getExpiringSoonCount() > 0" class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          ⏰ {{ getExpiringSoonCount() }} 項即將到期
        </span>
      </div>

      <!-- 搜尋 -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input 
              type="text" 
              placeholder="搜尋食品名稱..." 
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <button 
            (click)="loadFoods()"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
            重新整理
          </button>
        </div>
      </div>

      <!-- 新增食品表單 -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4 text-green-600">新增食品</h3>
        <form (ngSubmit)="addFood()" #foodForm="ngForm">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">食品名稱 *</label>
              <input 
                type="text" 
                placeholder="輸入食品名稱" 
                [(ngModel)]="newFood.name"
                name="name"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">數量 *</label>
              <input 
                type="number" 
                placeholder="數量" 
                [(ngModel)]="newFood.amount"
                name="amount"
                min="1"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">有效期限 *</label>
              <input 
                type="date" 
                [(ngModel)]="newFood.to_date"
                name="to_date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">圖片</label>
              <input 
                type="file" 
                accept="image/*"
                (change)="onImageSelect($event)"
                name="photo"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          
          <!-- 圖片預覽 -->
          <div *ngIf="selectedImagePreview" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">圖片預覽</label>
            <div class="relative inline-block">
              <img [src]="selectedImagePreview" alt="預覽" class="w-32 h-32 object-cover rounded-lg border">
              <button 
                type="button"
                (click)="removeImage()"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
                ×
              </button>
            </div>
          </div>

          <div class="mt-4 flex gap-2">
            <button 
              type="submit"
              [disabled]="!foodForm.valid || isLoading"
              class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400">
              {{ isLoading ? '新增中...' : '新增食品' }}
            </button>
            <button 
              type="button"
              (click)="resetForm()"
              class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors">
              清除
            </button>
          </div>
        </form>
      </div>

      <!-- 食品列表 -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div *ngIf="isLoading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-2 text-gray-600">載入中...</p>
        </div>
        
        <div *ngIf="!isLoading && foods.length === 0" class="p-8 text-center text-gray-500">
          <p>目前沒有食品資料</p>
        </div>

        <div *ngIf="!isLoading && foods.length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">圖片</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名稱</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">數量</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">到期日期</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let food of displayedFoods" 
                  class="hover:bg-gray-50 {{ getExpiryStatusClass(food) }}"
                  [title]="getExpiryStatusText(food)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img *ngIf="food.photo" [src]="food.photo" [alt]="food.name" 
                         class="w-full h-full object-cover">
                    <span *ngIf="!food.photo" class="text-gray-400 text-xs">無圖片</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ food.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <button 
                      (click)="updateQuantity(food, food.amount - 1)"
                      [disabled]="food.amount <= 1"
                      class="w-6 h-6 bg-gray-200 rounded text-sm hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed">-</button>
                    <span class="text-sm text-gray-900 min-w-[30px] text-center">{{ food.amount }}</span>
                    <button 
                      (click)="updateQuantity(food, food.amount + 1)"
                      class="w-6 h-6 bg-gray-200 rounded text-sm hover:bg-gray-300">+</button>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <div class="text-sm" [ngClass]="{
                      'text-red-600 font-semibold': isExpired(food),
                      'text-yellow-600 font-semibold': isExpiringSoon(food),
                      'text-gray-500': !isExpired(food) && !isExpiringSoon(food)
                    }">
                      {{ formatDate(food.to_date) }}
                    </div>
                    <span *ngIf="isExpired(food)" class="text-red-500 text-xs">⚠️ 已過期</span>
                    <span *ngIf="isExpiringSoon(food) && !isExpired(food)" class="text-yellow-500 text-xs">⏰ 即將到期</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button 
                    (click)="editFood(food)"
                    class="text-blue-600 hover:text-blue-900">編輯</button>
                  <button 
                    (click)="confirmDeleteFood(food)"
                    class="text-red-600 hover:text-red-900">刪除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 編輯食品模態框 -->
      <div *ngIf="editingFood" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4">編輯食品</h3>
          <form (ngSubmit)="updateFood()" #editForm="ngForm">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">食品名稱 *</label>
                <input 
                  type="text" 
                  [(ngModel)]="editingFood.name"
                  name="editName"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">數量 *</label>
                <input 
                  type="number" 
                  [(ngModel)]="editingFood.amount"
                  name="editAmount"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">有效期限 *</label>
                <input 
                  type="date" 
                  [(ngModel)]="editingFood.to_date"
                  name="editToDate"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">圖片</label>
                <input 
                  type="file" 
                  accept="image/*"
                  (change)="onEditImageSelect($event)"
                  name="editPhoto"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <!-- 編輯時的圖片預覽 -->
              <div *ngIf="editingFood.photo || editImagePreview" class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">目前圖片</label>
                <div class="relative inline-block">
                  <img [src]="editImagePreview || editingFood.photo" alt="預覽" class="w-32 h-32 object-cover rounded-lg border">
                  <button 
                    type="button"
                    (click)="removeEditImage()"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
                    ×
                  </button>
                </div>
              </div>
            </div>
            <div class="mt-6 flex gap-2">
              <button 
                type="submit"
                [disabled]="!editForm.valid || isLoading"
                class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400">
                {{ isLoading ? '更新中...' : '更新' }}
              </button>
              <button 
                type="button"
                (click)="cancelEdit()"
                class="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
                取消
              </button>
            </div>
          </form>
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
  selectedImagePreview: string | null = null;
  editImagePreview: string | null = null;
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
    this.editImagePreview = null;
    
    // 格式化日期為 YYYY-MM-DD 格式
    if (this.editingFood.to_date) {
      const date = new Date(this.editingFood.to_date);
      this.editingFood.to_date = date.toISOString().split('T')[0];
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
    this.editImagePreview = null;
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
    this.selectedImagePreview = null;
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
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
    const today = new Date();
    const expiryDate = new Date(food.to_date);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }

  // 檢查食品是否已過期
  isExpired(food: Food): boolean {
    if (!food.to_date) return false;
    const today = new Date();
    const expiryDate = new Date(food.to_date);
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
    
    const today = new Date();
    const expiryDate = new Date(food.to_date);
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

  // 獲取已過期食品數量
  getExpiredCount(): number {
    return this.foods.filter(food => this.isExpired(food)).length;
  }

  // 獲取即將到期食品數量
  getExpiringSoonCount(): number {
    return this.foods.filter(food => this.isExpiringSoon(food) && !this.isExpired(food)).length;
  }

  // 處理新增食品的圖片選擇
  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePreview = e.target.result;
        this.newFood.photo = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // 移除新增食品的圖片
  removeImage() {
    this.selectedImagePreview = null;
    this.newFood.photo = '';
  }

  // 處理編輯食品的圖片選擇
  onEditImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editImagePreview = e.target.result;
        if (this.editingFood) {
          this.editingFood.photo = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // 移除編輯食品的圖片
  removeEditImage() {
    this.editImagePreview = null;
    if (this.editingFood) {
      this.editingFood.photo = '';
    }
  }
}