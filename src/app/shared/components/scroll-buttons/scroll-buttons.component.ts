import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-buttons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- 滾動按鈕容器 -->
    <div class="fixed right-4 bottom-4 z-50 flex flex-col space-y-3">
      <!-- 滾動進度指示器 -->
      <div 
        *ngIf="showScrollButtons()"
        class="relative w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center">
        <!-- 進度環 -->
        <svg class="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
          <path
            class="text-gray-200"
            stroke="currentColor"
            stroke-width="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            class="text-blue-500"
            stroke="currentColor"
            stroke-width="3"
            fill="none"
            [attr.stroke-dasharray]="scrollProgress() + ', 100'"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <!-- 百分比文字 -->
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-xs font-semibold text-gray-600">{{ Math.round(scrollProgress()) }}%</span>
        </div>
      </div>

      <!-- 跳轉至頂部按鈕 -->
      <button
        *ngIf="showScrollButtons()"
        (click)="scrollToTop()"
        class="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
        title="回到頂部 ({{ Math.round(scrollProgress()) }}%)"
        aria-label="回到頂部">
        <!-- 背景動畫 -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <svg class="w-6 h-6 transform group-hover:scale-110 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      </button>

      <!-- 跳轉至底部按鈕 -->
      <button
        *ngIf="showScrollButtons()"
        (click)="scrollToBottom()"
        class="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
        title="跳到底部"
        aria-label="跳到底部">
        <!-- 背景動畫 -->
        <div class="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <svg class="w-6 h-6 transform group-hover:scale-110 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V4"></path>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    /* 按鈕動畫效果 */
    button {
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    button:hover {
      transform: translateY(-2px);
    }

    button:active {
      transform: translateY(0);
    }

    /* 響應式調整 */
    @media (max-width: 640px) {
      .fixed {
        right: 1rem;
        bottom: 1rem;
      }
      
      button {
        width: 2.5rem;
        height: 2.5rem;
      }
      
      svg {
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    /* 平板調整 */
    @media (min-width: 641px) and (max-width: 1024px) {
      .fixed {
        right: 1.5rem;
        bottom: 1.5rem;
      }
    }
  `]
})
export class ScrollButtonsComponent {
  showScrollButtons = signal(false);
  scrollProgress = signal(0);
  
  // 暴露 Math 給模板使用
  Math = Math;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // 計算滾動進度百分比
    const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
    this.scrollProgress.set(Math.min(progress, 100));
    
    // 當頁面滾動超過 300px 時顯示按鈕
    this.showScrollButtons.set(scrollTop > 300);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }
}