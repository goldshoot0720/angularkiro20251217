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
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
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
  { path: '**', redirectTo: '/home' }
];
