import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('鋒兄AI管理系統');
  showMobileMenu = signal(false);

  constructor() {
    // 检测屏幕和缩放信息
    this.logScreenInfo();
  }

  toggleMobileMenu() {
    const currentState = this.showMobileMenu();
    console.log('toggleMobileMenu called - before:', currentState);
    this.showMobileMenu.set(!currentState);
    console.log('toggleMobileMenu called - after:', this.showMobileMenu());
    
    // 強制觸發變更檢測
    setTimeout(() => {
      console.log('After timeout - menu state:', this.showMobileMenu());
    }, 100);
  }

  closeMobileMenu() {
    console.log('closeMobileMenu called - before:', this.showMobileMenu());
    this.showMobileMenu.set(false);
    console.log('closeMobileMenu called - after:', this.showMobileMenu());
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('zh-TW', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  private logScreenInfo() {
    const screenInfo = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      devicePixelRatio: window.devicePixelRatio,
      estimatedZoom: Math.round((window.outerWidth / window.innerWidth) * 100) + '%'
    };
    console.log('屏幕信息:', screenInfo);
  }
}
