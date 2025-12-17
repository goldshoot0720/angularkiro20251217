import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhostService } from '../../services/nhost.service';

@Component({
  selector: 'app-food-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">食品管理除錯工具</h2>
      
      <div class="space-y-4">
        <button 
          (click)="testBasicConnection()"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          測試基本連接
        </button>
        
        <button 
          (click)="checkFoodTable()"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          檢查 food 資料表
        </button>
        
        <button 
          (click)="listAllTables()"
          class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
          列出所有資料表
        </button>
        
        <button 
          (click)="testSimpleQuery()"
          class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
          測試簡單查詢
        </button>
      </div>

      <div *ngIf="result" class="mt-6 p-4 bg-gray-100 rounded">
        <h3 class="font-bold mb-2">結果:</h3>
        <pre class="text-sm overflow-auto">{{ result | json }}</pre>
      </div>

      <div *ngIf="error" class="mt-6 p-4 bg-red-100 text-red-700 rounded">
        <h3 class="font-bold mb-2">錯誤:</h3>
        <pre class="text-sm">{{ error }}</pre>
      </div>
    </div>
  `
})
export class FoodDebugComponent {
  result: any = null;
  error: string = '';

  constructor(private nhost: NhostService) {}

  async testBasicConnection() {
    this.clearResults();
    try {
      const query = `query { __typename }`;
      const result = await this.nhost.graphqlRequest(query);
      this.result = { message: '基本連接成功', data: result };
    } catch (error: any) {
      this.error = `連接失敗: ${error.message}\n詳情: ${JSON.stringify(error, null, 2)}`;
    }
  }

  async checkFoodTable() {
    this.clearResults();
    try {
      // 嘗試查詢 food 資料表的結構
      const query = `
        query CheckFoodTable {
          food(limit: 1) {
            id
          }
        }
      `;
      const result = await this.nhost.graphqlRequest(query);
      this.result = { message: 'food 資料表存在', data: result };
    } catch (error: any) {
      this.error = `food 資料表檢查失敗: ${error.message}\n詳情: ${JSON.stringify(error, null, 2)}`;
    }
  }

  async listAllTables() {
    this.clearResults();
    try {
      // 使用內省查詢列出所有可用的類型
      const query = `
        query IntrospectionQuery {
          __schema {
            queryType {
              fields {
                name
                type {
                  name
                }
              }
            }
          }
        }
      `;
      const result = await this.nhost.graphqlRequest(query);
      this.result = { message: '可用的查詢類型', data: result };
    } catch (error: any) {
      this.error = `內省查詢失敗: ${error.message}\n詳情: ${JSON.stringify(error, null, 2)}`;
    }
  }

  async testSimpleQuery() {
    this.clearResults();
    try {
      // 嘗試最簡單的查詢
      const query = `
        query SimpleTest {
          food {
            id
            name
          }
        }
      `;
      const result = await this.nhost.graphqlRequest(query);
      this.result = { message: '簡單查詢成功', data: result };
    } catch (error: any) {
      this.error = `簡單查詢失敗: ${error.message}\n詳情: ${JSON.stringify(error, null, 2)}`;
    }
  }

  private clearResults() {
    this.result = null;
    this.error = '';
  }
}