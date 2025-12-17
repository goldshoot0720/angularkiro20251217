import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">簡單測試頁面</h1>
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        ✅ 如果你能看到這個頁面，說明路由系統正常工作！
      </div>
      <div class="bg-blue-50 p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-2">測試信息：</h2>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li>當前時間: {{ getCurrentTime() }}</li>
          <li>頁面載入成功</li>
          <li>組件渲染正常</li>
          <li>手機版導航可用</li>
        </ul>
      </div>
      <div class="mt-4">
        <a href="javascript:history.back()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          返回上一頁
        </a>
      </div>
    </div>
  `
})
export class SimpleTestComponent {
  getCurrentTime(): string {
    return new Date().toLocaleTimeString('zh-TW');
  }
}