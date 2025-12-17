import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ResponsiveService, ScreenSize } from '../../services/responsive.service';

@Component({
  selector: 'app-responsive-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- 桌面版和平板橫向 - 左側選單，右側內容 -->
    <div class="desktop-layout" [class.hidden]="isMobileLayout">
      <div class="flex min-h-screen bg-gray-100">
        <!-- 左側選單 -->
        <aside class="sidebar bg-white shadow-lg h-screen w-64 fixed left-0 top-0 z-10">
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
              <button *ngFor="let item of menuItems" 
                      (click)="navigateTo(item.route)" 
                      [class.bg-blue-500]="isActive(item.route)"
                      [class.text-white]="isActive(item.route)"
                      class="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors text-left">
                <span class="mr-3">{{item.icon}}</span>
                <span>{{item.label}}</span>
              </button>
            </nav>
          </div>
        </aside>
        
        <!-- 右側內容區域 -->
        <main class="flex-1 ml-64 p-6">
          <router-outlet />
        </main>
      </div>
    </div>

    <!-- 手機版和平板直向 - 上側選單，下側內容 -->
    <div class="mobile-layout" [class.hidden]="!isMobileLayout">
      <div class="flex flex-col min-h-screen bg-gray-100">
        <!-- 上側選單 -->
        <header class="bg-white shadow-lg">
          <div class="p-4">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  鋒
                </div>
                <div class="ml-2">
                  <h1 class="text-base font-bold text-gray-800">鋒兄Angular資訊管理</h1>
                </div>
              </div>
              <button (click)="toggleMobileMenu()" 
                      class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <span class="text-xl">{{isMobileMenuOpen ? '✕' : '☰'}}</span>
              </button>
            </div>
            
            <!-- 手機選單 -->
            <nav class="mobile-menu" [class.hidden]="!isMobileMenuOpen">
              <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button *ngFor="let item of menuItems" 
                        (click)="navigateToMobile(item.route)" 
                        [class.bg-blue-500]="isActive(item.route)"
                        [class.text-white]="isActive(item.route)"
                        class="flex flex-col items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors">
                  <span class="text-lg mb-1">{{item.icon}}</span>
                  <span class="text-xs text-center">{{item.label}}</span>
                </button>
              </div>
            </nav>
          </div>
        </header>
        
        <!-- 下側內容區域 -->
        <main class="flex-1 p-4">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      font-family: 'Microsoft JhengHei', sans-serif;
    }
    
    .mobile-menu {
      animation: slideDown 0.3s ease-out;
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* 響應式斷點 */
    @media (max-width: 768px) {
      .desktop-layout {
        display: none !important;
      }
    }
    
    @media (min-width: 769px) and (max-width: 1024px) {
      /* 平板 */
      .desktop-layout {
        display: block;
      }
      .mobile-layout {
        display: none;
      }
    }
    
    @media (min-width: 1025px) {
      /* 桌面 */
      .mobile-layout {
        display: none !important;
      }
    }
    
    /* 平板直向特殊處理 */
    @media (min-width: 769px) and (max-width: 1024px) and (orientation: portrait) {
      .desktop-layout {
        display: none !important;
      }
      .mobile-layout {
        display: block !important;
      }
    }
    
    /* 平板橫向特殊處理 */
    @media (min-width: 769px) and (max-width: 1024px) and (orientation: landscape) {
      .desktop-layout {
        display: block !important;
      }
      .mobile-layout {
        display: none !important;
      }
    }
  `]
})
export class ResponsiveLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isMobileLayout = false;
  isMobileMenuOpen = false;
  screenSize: ScreenSize | null = null;
  
  menuItems = [
    { route: '/home', icon: '🏠', label: '首頁' },
    { route: '/dashboard', icon: '📊', label: '儀表板' },
    { route: '/subscription-management', icon: '📋', label: '訂閱管理' },
    { route: '/food-management', icon: '🍽️', label: '食品管理' },
    { route: '/video-intro', icon: '🎬', label: '影片介紹' },
    { route: '/responsive-demo', icon: '📱', label: '響應式展示' },
    { route: '/about', icon: 'ℹ️', label: '關於我們' }
  ];

  constructor(
    private router: Router,
    private responsiveService: ResponsiveService
  ) {}

  ngOnInit() {
    // 訂閱螢幕尺寸變化
    this.responsiveService.getScreenSize$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(size => {
        this.screenSize = size;
        this.isMobileLayout = this.responsiveService.isMobileLayout();
        
        // 切換到桌面版時關閉手機選單
        if (!this.isMobileLayout) {
          this.isMobileMenuOpen = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  navigateToMobile(route: string) {
    this.router.navigate([route]);
    this.isMobileMenuOpen = false; // 導航後關閉選單
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}