import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  
  // 當前主題設置
  theme = signal<Theme>('auto');
  
  // 實際應用的主題（考慮系統偏好）
  actualTheme = signal<'light' | 'dark'>('light');
  
  // 是否為暗黑模式
  isDark = signal<boolean>(false);

  constructor() {
    console.log('ThemeService constructor called');
    
    // 從 localStorage 讀取保存的主題設置
    this.loadTheme();
    
    // 監聽系統主題變化
    this.watchSystemTheme();
    
    // 當主題變化時更新 DOM
    effect(() => {
      console.log('Theme effect triggered, isDark:', this.isDark());
      this.applyTheme();
    });
    
    // 立即應用一次主題
    setTimeout(() => {
      console.log('Initial theme application');
      this.applyTheme();
    }, 0);
  }

  /**
   * 設置主題
   */
  setTheme(theme: Theme) {
    console.log('Setting theme to:', theme);
    this.theme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.updateActualTheme();
    // 強制應用主題
    setTimeout(() => this.applyTheme(), 0);
  }

  /**
   * 切換暗黑模式
   */
  toggleDarkMode() {
    const currentTheme = this.theme();
    if (currentTheme === 'dark') {
      this.setTheme('light');
    } else {
      this.setTheme('dark');
    }
  }

  /**
   * 從 localStorage 加載主題設置
   */
  private loadTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      this.theme.set(savedTheme);
    }
    this.updateActualTheme();
  }

  /**
   * 監聽系統主題變化
   */
  private watchSystemTheme() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // 初始檢查
      this.updateActualTheme();
      
      // 監聽變化
      mediaQuery.addEventListener('change', () => {
        this.updateActualTheme();
      });
    }
  }

  /**
   * 更新實際應用的主題
   */
  private updateActualTheme() {
    const theme = this.theme();
    let actualTheme: 'light' | 'dark' = 'light';

    if (theme === 'dark') {
      actualTheme = 'dark';
    } else if (theme === 'light') {
      actualTheme = 'light';
    } else if (theme === 'auto') {
      // 跟隨系統設置
      if (typeof window !== 'undefined' && window.matchMedia) {
        actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    }

    this.actualTheme.set(actualTheme);
    this.isDark.set(actualTheme === 'dark');
  }

  /**
   * 應用主題到 DOM
   */
  private applyTheme() {
    if (typeof document !== 'undefined') {
      const isDark = this.isDark();
      console.log('Applying theme, isDark:', isDark);
      console.log('Document element classes before:', document.documentElement.className);
      
      if (isDark) {
        document.documentElement.classList.add('dark');
        console.log('Added dark class');
      } else {
        document.documentElement.classList.remove('dark');
        console.log('Removed dark class');
      }
      
      console.log('Document element classes after:', document.documentElement.className);
      
      // 更新 meta theme-color
      this.updateMetaThemeColor(isDark);
    } else {
      console.log('Document is undefined, cannot apply theme');
    }
  }

  /**
   * 更新 meta theme-color
   */
  private updateMetaThemeColor(isDark: boolean) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#1f2937' : '#ffffff');
    }
  }

  /**
   * 獲取主題圖標
   */
  getThemeIcon(): string {
    const theme = this.theme();
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'auto':
        return '🔄';
      default:
        return '🔄';
    }
  }

  /**
   * 獲取主題名稱
   */
  getThemeName(): string {
    const theme = this.theme();
    switch (theme) {
      case 'light':
        return '淺色模式';
      case 'dark':
        return '深色模式';
      case 'auto':
        return '跟隨系統';
      default:
        return '跟隨系統';
    }
  }
}