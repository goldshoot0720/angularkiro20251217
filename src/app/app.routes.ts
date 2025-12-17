import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'gallery', redirectTo: '/home', pathMatch: 'full' },
  { path: 'food-management', loadComponent: () => import('./components/food-management/food-management.component').then(m => m.FoodManagementComponent) },
  { path: 'food-test', loadComponent: () => import('./components/food-test/food-test.component').then(m => m.FoodTestComponent) },
  { path: 'food-debug', loadComponent: () => import('./components/food-debug/food-debug.component').then(m => m.FoodDebugComponent) },
  { path: 'subscription-management', loadComponent: () => import('./components/subscription-management/subscription-management.component').then(m => m.SubscriptionManagementComponent) },
  { path: 'video-intro', loadComponent: () => import('./components/video-intro/video-intro.component').then(m => m.VideoIntroComponent) },

  { path: 'about', loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent) },
  { path: '**', redirectTo: '/dashboard' }
];
