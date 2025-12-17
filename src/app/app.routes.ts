import { Routes } from '@angular/router';

// 直接導入所有元件（避免懶加載問題）
import { HomeUltraSimpleComponent } from './components/home-ultra-simple/home-ultra-simple.component';
import { TestSimpleComponent } from './components/test-simple/test-simple.component';
import { HomeSimpleV2Component } from './components/home-simple/home-simple-v2.component';
import { MobileTestComponent } from './components/mobile-test/mobile-test.component';
import { DashboardSimpleComponent } from './components/dashboard-simple/dashboard-simple.component';
import { FoodManagementComponent } from './components/food-management/food-management.component';
import { SubscriptionManagementComponent } from './components/subscription-management/subscription-management.component';
import { VideoIntroComponent } from './components/video-intro/video-intro.component';
import { AboutComponent } from './components/about/about.component';
import { ResponsiveDemoComponent } from './components/responsive-demo/responsive-demo.component';
import { SimpleTestComponent } from './components/simple-test/simple-test.component';
import { ImageTestComponent } from './components/image-test/image-test.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeUltraSimpleComponent, title: '首頁' },
  { path: 'test-simple', component: TestSimpleComponent, title: '測試頁面' },
  { path: 'mobile-test', component: MobileTestComponent, title: '手機測試' },
  { path: 'dashboard', component: DashboardSimpleComponent, title: '儀表板' },
  { path: 'food-management', component: FoodManagementComponent, title: '食品管理' },
  { path: 'subscription-management', component: SubscriptionManagementComponent, title: '訂閱管理' },
  { path: 'video-intro', component: VideoIntroComponent, title: '影片介紹' },
  { path: 'about', component: AboutComponent, title: '關於我們' },
  { path: 'responsive-demo', component: ResponsiveDemoComponent, title: '響應式展示' },
  { path: 'simple-test', component: SimpleTestComponent, title: '簡單測試' },
  { path: 'image-test', component: ImageTestComponent, title: '圖片測試' },
  { path: '**', redirectTo: '/home' }
];