import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 bg-white min-h-screen">
      <div class="bg-green-100 border-2 border-green-500 p-4 rounded-lg mb-4">
        <h1 class="text-2xl font-bold text-green-800">✅ 測試頁面載入成功！</h1>
        <p class="text-green-700 mt-2">如果你看到這個訊息，說明基本路由正常工作。</p>
      </div>
      
      <div class="bg-blue-100 border-2 border-blue-500 p-4 rounded-lg mb-4">
        <h2 class="text-xl font-bold text-blue-800 mb-2">設備資訊</h2>
        <ul class="text-sm text-blue-700 space-y-1">
          <li>螢幕寬度: {{ screenWidth }}px</li>
          <li>螢幕高度: {{ screenHeight }}px</li>
          <li>User Agent: {{ userAgent }}</li>
          <li>當前時間: {{ currentTime }}</li>
        </ul>
      </div>
      
      <div class="bg-yellow-100 border-2 border-yellow-500 p-4 rounded-lg">
        <h2 class="text-xl font-bold text-yellow-800 mb-2">測試按鈕</h2>
        <button 
          (click)="testClick()"
          class="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-bold">
          點擊測試 ({{ clickCount }})
        </button>
      </div>
    </div>
  `
})
export class MobileTestComponent {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  userAgent = navigator.userAgent;
  currentTime = new Date().toLocaleString('zh-TW');
  clickCount = 0;
  
  testClick() {
    this.clickCount++;
    console.log('按鈕被點擊:', this.clickCount);
    alert('測試成功！點擊次數: ' + this.clickCount);
  }
}
