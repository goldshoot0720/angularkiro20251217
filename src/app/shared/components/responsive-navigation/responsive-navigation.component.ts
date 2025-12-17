import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResponsiveService, ScreenSize } from '../../../services/responsive.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface NavigationItem {
  label: string;
  route?: string;
  icon?: string;
  children?: NavigationItem[];
  action?: () => void;
  badge?: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'app-responsive-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="responsive-navigation" 
         [ngClass]="getNavigationClasses()"
         [attr.data-screen-type]="getScreenType()">
      
      <!-- 手機版導航 -->
      <div class="mobile-nav" *ngIf="screenSize?.isMobile">
        <!-- 頂部欄 -->
        <div class="mobile-header">
          <div class="brand" *ngIf="brandName">
            <span class="brand-icon" *ngIf="brandIcon">{{brandIcon}}</span>
            <span class="brand-name">{{brandName}}</span>
          </div>
          <button class="menu-toggle" (click)="toggleMobileMenu()">
            <span class="hamburger" [class.active]="isMobileMenuOpen">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        <!-- 手機選單 -->
        <div class="mobile-menu" [class.open]="isMobileMenuOpen">
          <div class="mobile-menu-items">
            <ng-container *ngFor="let item of navigationItems">
              <a *ngIf="item.route" 
                 [routerLink]="item.route"
                 class="mobile-menu-item"
                 [class.disabled]="item.disabled"
                 (click)="onItemClick(item)">
                <span class="item-icon" *ngIf="item.icon">{{item.icon}}</span>
                <span class="item-label">{{item.label}}</span>
                <span class="item-badge" *ngIf="item.badge">{{item.badge}}</span>
              </a>
              <button *ngIf="!item.route" 
                      class="mobile-menu-item"
                      [class.disabled]="item.disabled"
                      (click)="onItemClick(item)">
                <span class="item-icon" *ngIf="item.icon">{{item.icon}}</span>
                <span class="item-label">{{item.label}}</span>
                <span class="item-badge" *ngIf="item.badge">{{item.badge}}</span>
              </button>
            </ng-container>
          </div>
        </div>
      </div>

      <!-- 平板/桌面版導航 -->
      <div class="desktop-nav" *ngIf="!screenSize?.isMobile">
        <!-- 品牌區域 -->
        <div class="brand-section" *ngIf="brandName">
          <div class="brand">
            <span class="brand-icon" *ngIf="brandIcon">{{brandIcon}}</span>
            <span class="brand-name">{{brandName}}</span>
          </div>
        </div>

        <!-- 導航項目 -->
        <div class="nav-items" [ngClass]="getNavItemsClasses()">
          <ng-container *ngFor="let item of navigationItems">
            <a *ngIf="item.route" 
               [routerLink]="item.route"
               class="nav-item"
               [class.disabled]="item.disabled"
               routerLinkActive="active"
               (click)="onItemClick(item)">
              <span class="item-icon" *ngIf="item.icon">{{item.icon}}</span>
              <span class="item-label">{{item.label}}</span>
              <span class="item-badge" *ngIf="item.badge">{{item.badge}}</span>
            </a>
            <button *ngIf="!item.route" 
                    class="nav-item"
                    [class.disabled]="item.disabled"
                    (click)="onItemClick(item)">
              <span class="item-icon" *ngIf="item.icon">{{item.icon}}</span>
              <span class="item-label">{{item.label}}</span>
              <span class="item-badge" *ngIf="item.badge">{{item.badge}}</span>
            </button>
          </ng-container>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .responsive-navigation {
      font-family: 'Microsoft JhengHei', sans-serif;
      transition: all 0.3s ease-in-out;
    }

    /* 手機版導航 */
    .mobile-nav {
      position: relative;
    }

    .mobile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .brand-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #3b82f6;
      color: white;
      border-radius: 6px;
      font-weight: bold;
      font-size: 0.875rem;
    }

    .brand-name {
      font-weight: 600;
      color: #1f2937;
      font-size: 1rem;
    }

    .menu-toggle {
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
    }

    .hamburger {
      display: flex;
      flex-direction: column;
      width: 24px;
      height: 18px;
      position: relative;
    }

    .hamburger span {
      display: block;
      height: 2px;
      width: 100%;
      background: #374151;
      border-radius: 1px;
      transition: all 0.3s ease-in-out;
      position: absolute;
    }

    .hamburger span:nth-child(1) {
      top: 0;
    }

    .hamburger span:nth-child(2) {
      top: 50%;
      transform: translateY(-50%);
    }

    .hamburger span:nth-child(3) {
      bottom: 0;
    }

    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg);
      top: 50%;
    }

    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg);
      bottom: 50%;
    }

    .mobile-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease-in-out;
      z-index: 99;
    }

    .mobile-menu.open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }

    .mobile-menu-items {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
      padding: 1rem;
    }

    .mobile-menu-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      background: #f9fafb;
      border: none;
      border-radius: 8px;
      text-decoration: none;
      color: #374151;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
    }

    .mobile-menu-item:hover:not(.disabled) {
      background: #e5e7eb;
      transform: translateY(-1px);
    }

    .mobile-menu-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .mobile-menu-item .item-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .mobile-menu-item .item-label {
      font-size: 0.75rem;
      font-weight: 500;
      text-align: center;
    }

    .mobile-menu-item .item-badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: #ef4444;
      color: white;
      font-size: 0.625rem;
      padding: 0.125rem 0.375rem;
      border-radius: 10px;
      min-width: 1rem;
      text-align: center;
    }

    /* 平板/桌面版導航 */
    .desktop-nav {
      display: flex;
      align-items: center;
      background: white;
      padding: 1rem 2rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .brand-section {
      margin-right: 2rem;
    }

    .desktop-nav .brand-icon {
      width: 40px;
      height: 40px;
      font-size: 1rem;
    }

    .desktop-nav .brand-name {
      font-size: 1.25rem;
    }

    .nav-items {
      display: flex;
      gap: 0.5rem;
      flex: 1;
    }

    .nav-items.horizontal {
      flex-direction: row;
    }

    .nav-items.vertical {
      flex-direction: column;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      border-radius: 6px;
      text-decoration: none;
      color: #6b7280;
      font-weight: 500;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      position: relative;
    }

    .nav-item:hover:not(.disabled) {
      background: #f3f4f6;
      color: #374151;
    }

    .nav-item.active {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .nav-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .nav-item .item-icon {
      font-size: 1.125rem;
    }

    .nav-item .item-label {
      font-size: 0.875rem;
    }

    .nav-item .item-badge {
      background: #ef4444;
      color: white;
      font-size: 0.625rem;
      padding: 0.125rem 0.375rem;
      border-radius: 10px;
      min-width: 1rem;
      text-align: center;
      margin-left: auto;
    }

    /* 平板特殊樣式 */
    @media (min-width: 769px) and (max-width: 1024px) {
      .desktop-nav {
        padding: 1rem 1.5rem;
      }
      
      .nav-item {
        padding: 0.5rem 0.75rem;
      }
      
      .nav-item .item-label {
        font-size: 0.8125rem;
      }
    }

    /* 響應式隱藏/顯示 */
    @media (max-width: 768px) {
      .desktop-nav {
        display: none;
      }
    }

    @media (min-width: 769px) {
      .mobile-nav {
        display: none;
      }
    }
  `]
})
export class ResponsiveNavigationComponent implements OnInit, OnDestroy {
  @Input() navigationItems: NavigationItem[] = [];
  @Input() brandName = '';
  @Input() brandIcon = '';
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal';
  @Output() itemClick = new EventEmitter<NavigationItem>();

  private destroy$ = new Subject<void>();
  screenSize: ScreenSize | null = null;
  isMobileMenuOpen = false;

  constructor(private responsiveService: ResponsiveService) {}

  ngOnInit() {
    this.responsiveService.getScreenSize$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(size => {
        this.screenSize = size;
        // 切換到桌面版時關閉手機選單
        if (!size.isMobile) {
          this.isMobileMenuOpen = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getNavigationClasses(): string {
    if (!this.screenSize) return '';

    let classes: string[] = [];

    if (this.screenSize.isMobile) {
      classes.push('mobile-navigation');
    } else if (this.screenSize.isTablet) {
      classes.push('tablet-navigation');
    } else if (this.screenSize.isDesktop) {
      classes.push('desktop-navigation');
    }

    return classes.join(' ');
  }

  getNavItemsClasses(): string {
    return this.layout;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onItemClick(item: NavigationItem) {
    if (item.disabled) return;

    if (item.action) {
      item.action();
    }

    this.itemClick.emit(item);

    // 手機版點擊後關閉選單
    if (this.screenSize?.isMobile) {
      this.isMobileMenuOpen = false;
    }
  }

  getScreenType(): string {
    if (!this.screenSize) return 'unknown';
    
    if (this.screenSize.isMobile) return 'mobile';
    if (this.screenSize.isTabletPortrait) return 'tablet-portrait';
    if (this.screenSize.isTabletLandscape) return 'tablet-landscape';
    if (this.screenSize.isTablet) return 'tablet';
    if (this.screenSize.isDesktop) return 'desktop';
    
    return 'unknown';
  }
}