import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white min-h-screen">
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        ✅ 圖片測試頁面 - 檢查滾動問題
      </div>
      
      <h1 class="text-2xl font-bold text-gray-800 mb-6">圖片展示測試</h1>
      
      <!-- 簡單的圖片網格 -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div *ngFor="let i of [1,2,3,4,5,6,7,8,9,10,11,12]" 
             class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="aspect-square bg-gray-200 flex items-center justify-center">
            <span class="text-gray-500">圖片 {{ i }}</span>
          </div>
          <div class="p-2">
            <p class="text-sm text-gray-700">測試圖片 {{ i }}</p>
          </div>
        </div>
      </div>
      
      <!-- 更多內容測試 -->
      <div class="bg-blue-50 p-4 rounded-lg mb-4">
        <h2 class="text-lg font-semibold mb-2">測試內容區域</h2>
        <p class="text-gray-600 mb-2">這裡是一些測試內容，用來檢查頁面是否需要滾動。</p>
        <p class="text-gray-600 mb-2">如果這個內容區域可以正常顯示，說明沒有高度限制問題。</p>
        <p class="text-gray-600">頁面應該可以自然地向下延伸，不需要額外的滾動條。</p>
      </div>
      
      <!-- 底部測試內容 -->
      <div class="bg-yellow-50 p-4 rounded-lg">
        <h3 class="font-semibold mb-2">底部測試區域</h3>
        <p class="text-sm text-gray-600">如果你能看到這個區域，說明頁面滾動正常。</p>
      </div>
    </div>
  `
})
export class ImageTestComponent {}