import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- 主題切換按鈕 -->
    <div class="relative">
      <button
        (click)="toggleDropdown()"
        class="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
        [class.ring-2]="showDropdown"
        [class.ring-blue-500]="showDropdown"
        title="切換主題">
        
        <!-- 主題圖標 -->
        <span class="text-lg">{{ themeService.getThemeIcon() }}</span>
        
        <!-- 主題名稱（桌面版顯示） -->
        <span class="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ themeService.getThemeName() }}
        </span>
        
        <!-- 下拉箭頭 -->
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200"
             [class.rotate-180]="showDropdown"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      <!-- 下拉選單 -->
      <div *ngIf="showDropdown"
           class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
        
        <!-- 選單標題 -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">選擇主題</p>
        </div>
        
        <!-- 主題選項 -->
        <div class="py-1">
          <button
            *ngFor="let option of themeOptions"
            (click)="selectTheme(option.value)"
            class="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            [class.bg-blue-50]="themeService.theme() === option.value && !themeService.isDark()"
            [class.dark:bg-blue-900]="themeService.theme() === option.value && themeService.isDark()"
            [class.text-blue-600]="themeService.theme() === option.value && !themeService.isDark()"
            [class.dark:text-blue-400]="themeService.theme() === option.value && themeService.isDark()">
            
            <!-- 選項圖標 -->
            <span class="text-lg flex-shrink-0">{{ option.icon }}</span>
            
            <!-- 選項信息 -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ option.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ option.description }}
              </p>
            </div>
            
            <!-- 選中指示器 -->
            <svg *ngIf="themeService.theme() === option.value"
                 class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0"
                 fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
        
        <!-- 當前狀態 -->
        <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 rounded-full"
                 [class.bg-yellow-400]="!themeService.isDark()"
                 [class.bg-blue-400]="themeService.isDark()"></div>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              目前使用：{{ themeService.isDark() ? '深色模式' : '淺色模式' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 點擊外部關閉下拉選單 -->
    <div *ngIf="showDropdown"
         class="fixed inset-0 z-40"
         (click)="closeDropdown()">
    </div>
  `,
  styles: [`
    /* 動畫效果 */
    .rotate-180 {
      transform: rotate(180deg);
    }
    
    /* 確保下拉選單在最上層 */
    .z-50 {
      z-index: 50;
    }
    
    .z-40 {
      z-index: 40;
    }
    
    /* 平滑過渡 */
    button {
      transition: all 0.2s ease-in-out;
    }
    
    /* 響應式調整 */
    @media (max-width: 640px) {
      .absolute {
        right: 0;
        left: auto;
      }
    }
  `]
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
  showDropdown = false;

  themeOptions = [
    {
      value: 'light' as Theme,
      name: '淺色模式',
      description: '始終使用淺色主題',
      icon: '☀️'
    },
    {
      value: 'dark' as Theme,
      name: '深色模式',
      description: '始終使用深色主題',
      icon: '🌙'
    },
    {
      value: 'auto' as Theme,
      name: '跟隨系統',
      description: '根據系統設置自動切換',
      icon: '🔄'
    }
  ];

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  selectTheme(theme: Theme) {
    this.themeService.setTheme(theme);
    this.closeDropdown();
  }
}