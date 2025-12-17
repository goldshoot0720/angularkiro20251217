import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-green-600 mb-4">🎉 測試組件載入成功！</h1>
      <p class="text-gray-700 mb-4">如果你能看到這個頁面，說明：</p>
      <ul class="list-disc list-inside space-y-2 text-gray-600">
        <li>Angular 應用正常運行</li>
        <li>路由系統工作正常</li>
        <li>組件載入正常</li>
        <li>響應式布局組件正常</li>
      </ul>
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <h2 class="text-lg font-semibold text-blue-800 mb-2">當前時間</h2>
        <p class="text-blue-600">{{ currentTime | date:'full' }}</p>
      </div>
      <div class="mt-4 p-4 bg-green-50 rounded-lg">
        <h2 class="text-lg font-semibold text-green-800 mb-2">系統狀態</h2>
        <p class="text-green-600">✅ 所有系統正常運行</p>
      </div>
    </div>
  `
})
export class TestComponent {
  currentTime = new Date();

  constructor() {
    console.log('TestComponent 已載入');
    // 每秒更新時間
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }
}