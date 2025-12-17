import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-simple',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 bg-white min-h-screen">
      <div class="bg-green-500 text-white p-8 rounded-lg text-center mb-4">
        <h1 class="text-4xl font-bold">✅ 測試成功！</h1>
        <p class="text-xl mt-4">如果你看到這個，說明 router-outlet 正常工作！</p>
      </div>
      
      <div class="bg-blue-100 p-6 rounded-lg">
        <h2 class="text-2xl font-bold mb-4">測試資訊</h2>
        <ul class="space-y-2 text-lg">
          <li>✅ 元件已載入</li>
          <li>✅ 模板已渲染</li>
          <li>✅ Tailwind CSS 正常</li>
          <li>✅ 響應式正常</li>
        </ul>
      </div>
    </div>
  `
})
export class TestSimpleComponent {}
