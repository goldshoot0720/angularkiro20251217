import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodService, CreateFoodInput } from '../../services/food.service';

@Component({
  selector: 'app-food-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">食品管理 API 測試</h2>
      
      <div class="space-y-4">
        <button 
          (click)="testCreateFood()"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          測試新增食品
        </button>
        
        <button 
          (click)="testGetAllFoods()"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          測試取得所有食品
        </button>
        
        <button 
          (click)="testGetStats()"
          class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
          測試取得統計資料
        </button>
        
        <button 
          (click)="testConnection()"
          class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
          測試 GraphQL 連接
        </button>
      </div>

      <div *ngIf="result" class="mt-6 p-4 bg-gray-100 rounded">
        <h3 class="font-bold mb-2">測試結果:</h3>
        <pre class="text-sm">{{ result | json }}</pre>
      </div>

      <div *ngIf="error" class="mt-6 p-4 bg-red-100 text-red-700 rounded">
        <h3 class="font-bold mb-2">錯誤:</h3>
        <p>{{ error }}</p>
      </div>
    </div>
  `
})
export class FoodTestComponent implements OnInit {
  result: any = null;
  error: string = '';

  constructor(private foodService: FoodService) {}

  ngOnInit() {
    console.log('食品測試組件已初始化');
  }

  async testCreateFood() {
    this.clearResults();
    try {
      const testFood: CreateFoodInput = {
        name: '測試食品 - ' + new Date().toLocaleTimeString(),
        amount: 1,
        to_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7天後
        photo: ''
      };
      
      this.result = await this.foodService.createFood(testFood);
      console.log('新增食品成功:', this.result);
    } catch (error: any) {
      this.error = error.message || '新增食品失敗';
      console.error('新增食品失敗:', error);
    }
  }

  async testGetAllFoods() {
    this.clearResults();
    try {
      console.log('開始測試取得所有食品...');
      this.result = await this.foodService.getAllFoods();
      console.log('取得所有食品成功:', this.result);
    } catch (error: any) {
      this.error = error.message || '取得食品失敗';
      console.error('取得食品失敗:', error);
    }
  }

  async testGetStats() {
    this.clearResults();
    try {
      this.result = await this.foodService.getFoodStats();
      console.log('取得統計資料:', this.result);
    } catch (error: any) {
      this.error = error.message || '取得統計資料失敗';
      console.error('取得統計資料失敗:', error);
    }
  }

  async testConnection() {
    this.clearResults();
    try {
      // 測試基本的 GraphQL 查詢
      const query = `
        query TestConnection {
          __typename
        }
      `;
      
      const result = await this.foodService.nhostClient.graphql.request(query);
      this.result = { 
        message: 'GraphQL 連接成功',
        response: result 
      };
      console.log('GraphQL 連接測試成功:', result);
    } catch (error: any) {
      this.error = `連接失敗: ${error.message}`;
      console.error('GraphQL 連接測試失敗:', error);
    }
  }

  private clearResults() {
    this.result = null;
    this.error = '';
  }
}