import { Component } from '@angular/core';

@Component({
  selector: 'app-home-ultra-simple',
  standalone: true,
  template: `
    <div class="p-4">
      <div class="bg-green-500 text-white p-8 rounded-lg text-center mb-4">
        <h1 class="text-4xl font-bold">✅ 成功！</h1>
        <p class="text-xl mt-4">首頁已載入</p>
      </div>
      
      <div class="bg-blue-100 p-6 rounded-lg mb-4">
        <h2 class="text-2xl font-bold mb-4">歡迎使用鋒兄Angular資訊管理系統</h2>
        <p class="text-lg">這是一個超級簡單的首頁元件，用來測試路由是否正常工作。</p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <p class="text-2xl mb-2">📊</p>
          <p class="font-bold">儀表板</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <p class="text-2xl mb-2">🍽️</p>
          <p class="font-bold">食品管理</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <p class="text-2xl mb-2">📋</p>
          <p class="font-bold">訂閱管理</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <p class="text-2xl mb-2">🎬</p>
          <p class="font-bold">影片介紹</p>
        </div>
      </div>
    </div>
  `
})
export class HomeUltraSimpleComponent {}
