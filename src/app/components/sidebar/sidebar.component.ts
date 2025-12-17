import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar bg-white shadow-lg h-screen w-64 fixed left-0 top-0 z-10">
      <div class="p-4">
        <div class="flex items-center mb-8">
          <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
            鋒
          </div>
          <div class="ml-3">
            <h1 class="text-lg font-bold text-gray-800">鋒兄Angular資訊管理</h1>
            <p class="text-sm text-gray-500">鋒兄AI</p>
          </div>
        </div>
        
        <nav class="space-y-2">
          <a routerLink="/home" 
             routerLinkActive="bg-blue-500 text-white" 
             class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors">
            <span class="mr-3">🏠</span>
            <span>首頁</span>
          </a>
          
          <a routerLink="/dashboard" 
             routerLinkActive="bg-blue-500 text-white" 
             class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors">
            <span class="mr-3">📊</span>
            <span>儀表板</span>
          </a>
          
          <a routerLink="/subscription-management" 
             routerLinkActive="bg-blue-500 text-white" 
             class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors">
            <span class="mr-3">📋</span>
            <span>訂閱管理</span>
          </a>
          
          <a routerLink="/food-management" 
             routerLinkActive="bg-blue-500 text-white" 
             class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors">
            <span class="mr-3">🍽️</span>
            <span>食品管理</span>
          </a>
          
          <a routerLink="/video-intro" 
             routerLinkActive="bg-blue-500 text-white" 
             class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors">
            <span class="mr-3">🎬</span>
            <span>影片介紹</span>
          </a>
          
          
          <a routerLink="/about" 
             routerLinkActive="bg-blue-500 text-white" 
             class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors">
            <span class="mr-3">ℹ️</span>
            <span>關於我們</span>
          </a>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      font-family: 'Microsoft JhengHei', sans-serif;
    }
  `]
})
export class SidebarComponent {}