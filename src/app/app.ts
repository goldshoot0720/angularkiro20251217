import { Component, signal, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScrollButtonsComponent } from './shared/components/scroll-buttons/scroll-buttons.component';
import { ThemeToggleComponent } from './shared/components/theme-toggle/theme-toggle.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, ScrollButtonsComponent, ThemeToggleComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  themeService = inject(ThemeService); // 改為 public 以便在模板中使用
  showMobileMenu = signal(false);

  constructor() {
    // 確保主題服務被初始化
    console.log('App initialized, current theme:', this.themeService.theme());
    console.log('Is dark mode:', this.themeService.isDark());
  }

  toggleMobileMenu() {
    this.showMobileMenu.set(!this.showMobileMenu());
  }

  closeMobileMenu() {
    this.showMobileMenu.set(false);
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('zh-TW', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  // 測試方法：手動切換暗黑模式
  testToggleDark() {
    this.themeService.toggleDarkMode();
    console.log('Theme toggled, is dark:', this.themeService.isDark());
  }
}