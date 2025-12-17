import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: '首頁'
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard-simple/dashboard-simple.component').then(m => m.DashboardSimpleComponent),
    title: '儀表板'
  },

  { 
    path: 'food-management', 
    loadComponent: () => import('./components/food-management/food-management.component').then(m => m.FoodManagementComponent),
    title: '食品管理'
  },
  { 
    path: 'food-test', 
    loadComponent: () => import('./components/food-test/food-test.component').then(m => m.FoodTestComponent),
    title: '食品測試'
  },
  { 
    path: 'food-debug', 
    loadComponent: () => import('./components/food-debug/food-debug.component').then(m => m.FoodDebugComponent),
    title: '食品調試'
  },
  { 
    path: 'subscription-management', 
    loadComponent: () => import('./components/subscription-management/subscription-management.component').then(m => m.SubscriptionManagementComponent),
    title: '訂閱管理'
  },
  { 
    path: 'video-intro', 
    loadComponent: () => import('./components/video-intro/video-intro.component').then(m => m.VideoIntroComponent),
    title: '影片介紹'
  },
  { 
    path: 'about', 
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent),
    title: '關於我們'
  },
  { 
    path: 'responsive-demo', 
    loadComponent: () => import('./components/responsive-demo/responsive-demo.component').then(m => m.ResponsiveDemoComponent),
    title: '響應式展示'
  },
  { 
    path: 'test', 
    loadComponent: () => import('./components/test/test.component').then(m => m.TestComponent),
    title: '測試頁面'
  },
  { 
    path: 'simple-test', 
    loadComponent: () => import('./components/simple-test/simple-test.component').then(m => m.SimpleTestComponent),
    title: '簡單測試'
  },
  { 
    path: 'image-test', 
    loadComponent: () => import('./components/image-test/image-test.component').then(m => m.ImageTestComponent),
    title: '圖片測試'
  },
  { path: '**', redirectTo: '/home' }
];
