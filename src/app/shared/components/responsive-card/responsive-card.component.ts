import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiveService, ScreenSize } from '../../../services/responsive.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-responsive-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="responsive-card" 
         [ngClass]="getCardClasses()"
         [attr.data-screen-type]="getScreenType()">
      
      <!-- 卡片標題 -->
      <div class="card-header" *ngIf="title || hasHeaderContent">
        <h3 class="card-title" [ngClass]="getTitleClasses()" *ngIf="title">{{title}}</h3>
        <ng-content select="[slot=header]"></ng-content>
      </div>

      <!-- 卡片內容 -->
      <div class="card-content" [ngClass]="getContentClasses()">
        <ng-content></ng-content>
      </div>

      <!-- 卡片底部 -->
      <div class="card-footer" *ngIf="hasFooterContent">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .responsive-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.3s ease-in-out;
      width: 100%;
    }

    .responsive-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    /* 手機版卡片 */
    .mobile-card {
      margin-bottom: 1rem;
      border-radius: 6px;
    }

    .mobile-card .card-header {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .mobile-card .card-content {
      padding: 1rem;
    }

    .mobile-card .card-footer {
      padding: 1rem;
      border-top: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }

    .mobile-card .card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    /* 平板版卡片 */
    .tablet-card {
      margin-bottom: 1.5rem;
      border-radius: 8px;
    }

    .tablet-card .card-header {
      padding: 1.25rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .tablet-card .card-content {
      padding: 1.25rem;
    }

    .tablet-card .card-footer {
      padding: 1.25rem;
      border-top: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }

    .tablet-card .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    /* 桌面版卡片 */
    .desktop-card {
      margin-bottom: 2rem;
      border-radius: 10px;
    }

    .desktop-card .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .desktop-card .card-content {
      padding: 1.5rem;
    }

    .desktop-card .card-footer {
      padding: 1.5rem;
      border-top: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }

    .desktop-card .card-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    /* 特殊樣式 */
    .card-compact .card-header,
    .card-compact .card-content,
    .card-compact .card-footer {
      padding: 0.75rem;
    }

    .card-spacious .card-header,
    .card-spacious .card-content,
    .card-spacious .card-footer {
      padding: 2rem;
    }

    /* 響應式文字 */
    .responsive-text-sm {
      font-size: 0.875rem;
    }

    .responsive-text-base {
      font-size: 1rem;
    }

    .responsive-text-lg {
      font-size: 1.125rem;
    }

    @media (min-width: 769px) {
      .responsive-text-sm {
        font-size: 1rem;
      }
      .responsive-text-base {
        font-size: 1.125rem;
      }
      .responsive-text-lg {
        font-size: 1.25rem;
      }
    }

    @media (min-width: 1025px) {
      .responsive-text-sm {
        font-size: 1.125rem;
      }
      .responsive-text-base {
        font-size: 1.25rem;
      }
      .responsive-text-lg {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ResponsiveCardComponent implements OnInit, OnDestroy {
  @Input() title = '';
  @Input() variant: 'default' | 'compact' | 'spacious' = 'default';
  @Input() customClasses = '';
  @Input() hasHeaderContent = false;
  @Input() hasFooterContent = false;

  private destroy$ = new Subject<void>();
  screenSize: ScreenSize | null = null;

  constructor(private responsiveService: ResponsiveService) {}

  ngOnInit() {
    this.responsiveService.getScreenSize$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(size => {
        this.screenSize = size;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCardClasses(): string {
    if (!this.screenSize) return '';

    let classes: string[] = [];

    // 基礎卡片類別
    if (this.screenSize.isMobile) {
      classes.push('mobile-card');
    } else if (this.screenSize.isTablet) {
      classes.push('tablet-card');
    } else if (this.screenSize.isDesktop) {
      classes.push('desktop-card');
    }

    // 變體類別
    if (this.variant !== 'default') {
      classes.push(`card-${this.variant}`);
    }

    // 自定義類別
    if (this.customClasses) {
      classes.push(this.customClasses);
    }

    return classes.join(' ');
  }

  getTitleClasses(): string {
    if (!this.screenSize) return '';

    if (this.screenSize.isMobile) {
      return 'responsive-text-base';
    } else if (this.screenSize.isTablet) {
      return 'responsive-text-lg';
    } else {
      return 'responsive-text-lg';
    }
  }

  getContentClasses(): string {
    if (!this.screenSize) return '';

    return 'responsive-text-sm';
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