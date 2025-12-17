import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodService } from '../../services/food.service';

@Component({
  selector: 'app-food-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800">食品統計</h3>
      
      <div *ngIf="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-2 text-gray-600">載入統計資料中...</p>
      </div>

      <div *ngIf="!isLoading && stats" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">{{ stats.totalItems }}</div>
          <div class="text-sm text-gray-600">總食品數量</div>
        </div>
        
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <div class="text-2xl font-bold text-green-600">\${{ stats.totalValue.toFixed(2) }}</div>
          <div class="text-sm text-gray-600">總價值</div>
        </div>
        
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <div class="text-2xl font-bold text-purple-600">{{ stats.shopCount }}</div>
          <div class="text-sm text-gray-600">商店數量</div>
        </div>
        
        <div class="text-center p-4 bg-orange-50 rounded-lg">
          <div class="text-2xl font-bold text-orange-600">\${{ stats.averagePrice.toFixed(2) }}</div>
          <div class="text-sm text-gray-600">平均價格</div>
        </div>
      </div>

      <div *ngIf="!isLoading && !stats" class="text-center py-8 text-gray-500">
        <p>無法載入統計資料</p>
      </div>
    </div>
  `
})
export class FoodStatsComponent implements OnInit {
  stats: {
    totalItems: number;
    totalValue: number;
    shopCount: number;
    averagePrice: number;
  } | null = null;
  isLoading = false;

  constructor(private foodService: FoodService) {}

  ngOnInit() {
    this.loadStats();
  }

  async loadStats() {
    this.isLoading = true;
    try {
      this.stats = await this.foodService.getFoodStats();
    } catch (error) {
      console.error('載入統計資料失敗:', error);
    } finally {
      this.isLoading = false;
    }
  }
}