import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

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
          <button (click)="navigateTo('/home')" 
                  [class.bg-blue-500]="isActive('/home')"
                  [class.text-white]="isActive('/home')"
                  class="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors text-left">
            <span class="mr-3">🏠</span>
            <span>首頁</span>
          </button>
          
          <button (click)="navigateTo('/dashboard')" 
                  [class.bg-blue-500]="isActive('/dashboard')"
                  [class.text-white]="isActive('/dashboard')"
                  class="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors text-left">
            <span class="mr-3">📊</span>
            <span>儀表板</span>
          </button>
          
          <button (click)="navigateTo('/subscription-management')" 
                  [class.bg-blue-500]="isActive('/subscription-management')"
                  [class.text-white]="isActive('/subscription-management')"
                  class="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors text-left">
            <span class="mr-3">📋</span>
            <span>訂閱管理</span>
          </button>
          
          <button (click)="navigateTo('/food-management')" 
                  [class.bg-blue-500]="isActive('/food-management')"
                  [class.text-white]="isActive('/food-management')"
                  class="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors text-left">
            <span class="mr-3">🍽️</span>
            <span>食品管理</span>
          </button>
          
          <button (click)="navigateTo('/video-intro')" 
                  [class.bg-blue-500]="isActive('/video-intro')"
                  [class.text-white]="isActive('/video-intro')"
                  class="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors text-left">
            <span class="mr-3">🎬</span>
            <span>影片介紹</span>
          </button>
          
          <button (click)="navigateTo('/about')" 
                  [class.bg-blue-500]="isActive('/about')"
                  [class.text-white]="isActive('/about')"
                  class="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors text-left">
            <span class="mr-3">ℹ️</span>
            <span>關於我們</span>
          </button>
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
export class SidebarComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    // 直接導航到目標路由
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}