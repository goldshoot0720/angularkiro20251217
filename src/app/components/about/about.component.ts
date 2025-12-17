import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">關於我們</h1>
        <p class="text-gray-600">了解鋒兄Next資訊管理的使命與願景</p>
      </div>

      <!-- 公司介紹 -->
      <div class="bg-white rounded-lg shadow p-8 mb-8 text-center">
        <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
          鋒途
        </div>
        
        <h2 class="text-2xl font-bold text-gray-800 mb-4">鋒兄塗哥公開資訊</h2>
        
        <p class="text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
          我們是專業的公開團隊，致力於為客戶提供優質的公關服務和智能管理解決方案。
          透過創新技術和專業服務，幫助企業和個人實現更高效的管理目標。
        </p>
      </div>

      <!-- 團隊成員 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="bg-blue-50 rounded-lg p-8 text-center">
          <div class="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            鋒
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">鋒兄</h3>
          <p class="text-blue-600 font-medium mb-3">技術總監 & 創辦人</p>
          <p class="text-gray-600 text-sm leading-relaxed">
            專精於 Next.js、React 和現代 Web 技術開發，
            致力於打造高效能的管理系統和用戶體驗。
          </p>
        </div>

        <div class="bg-purple-50 rounded-lg p-8 text-center">
          <div class="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            塗
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">塗哥</h3>
          <p class="text-purple-600 font-medium mb-3">營運總監 & 共同創辦人</p>
          <p class="text-gray-600 text-sm leading-relaxed">
            負責業務拓展和客戶關係管理，
            擁有豐富的市場經驗和卓越的溝通能力。
          </p>
        </div>
      </div>

      <!-- 服務特色 -->
      <div class="bg-white rounded-lg shadow p-8">
        <h3 class="text-xl font-bold text-gray-800 mb-6 text-center">我們的服務特色</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">🚀</span>
            </div>
            <h4 class="font-semibold text-gray-800 mb-2">高效管理</h4>
            <p class="text-gray-600 text-sm">提供智能化的管理解決方案，提升工作效率</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">💡</span>
            </div>
            <h4 class="font-semibold text-gray-800 mb-2">創新技術</h4>
            <p class="text-gray-600 text-sm">運用最新技術棧，打造現代化的應用系統</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">🤝</span>
            </div>
            <h4 class="font-semibold text-gray-800 mb-2">專業服務</h4>
            <p class="text-gray-600 text-sm">提供全方位的技術支援和客戶服務</p>
          </div>
        </div>
      </div>

      <!-- 聯絡資訊 -->
      <div class="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center">
        <h3 class="text-xl font-bold mb-4">聯絡我們</h3>
        <p class="mb-4">有任何問題或合作需求，歡迎隨時與我們聯繫</p>
        <div class="flex justify-center space-x-6 text-sm">
          <div>📧 contact@fengxiong.com</div>
          <div>📱 +886-912-345-678</div>
          <div>🌐 www.fengxiong.com</div>
        </div>
      </div>
    </div>
  `
})
export class AboutComponent {}