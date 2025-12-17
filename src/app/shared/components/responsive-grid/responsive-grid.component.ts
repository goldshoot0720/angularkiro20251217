import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiveService, ScreenSize } from '../../../services/responsive.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-responsive-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="responsive-grid" 
         [ngClass]="getGridClasses()"
         [style.gap]="getGap()"
         [attr.data-screen-type]="getScreenType()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .responsive-grid {
      display: grid;
      width: 100%;
      transition: all 0.3s ease-in-out;
    }

    /* 手機版網格 */
    .grid-mobile-1 { grid-template-columns: 1fr; }
    .grid-mobile-2 { grid-template-columns: repeat(2, 1fr); }

    /* 平板版網格 */
    .grid-tablet-1 { grid-template-columns: 1fr; }
    .grid-tablet-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-tablet-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-tablet-4 { grid-template-columns: repeat(4, 1fr); }

    /* 桌面版網格 */
    .grid-desktop-1 { grid-template-columns: 1fr; }
    .grid-desktop-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-desktop-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-desktop-4 { grid-template-columns: repeat(4, 1fr); }
    .grid-desktop-5 { grid-template-columns: repeat(5, 1fr); }
    .grid-desktop-6 { grid-template-columns: repeat(6, 1fr); }

    /* 自動適應網格 */
    .grid-auto-fit-sm { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
    .grid-auto-fit-md { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
    .grid-auto-fit-lg { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }

    /* 特殊布局 */
    .grid-masonry {
      grid-template-rows: masonry;
    }

    .grid-dense {
      grid-auto-flow: dense;
    }

    /* 對齊方式 */
    .grid-center {
      justify-items: center;
      align-items: center;
    }

    .grid-start {
      justify-items: start;
      align-items: start;
    }

    .grid-end {
      justify-items: end;
      align-items: end;
    }
  `]
})
export class ResponsiveGridComponent implements OnInit, OnDestroy {
  @Input() mobileColumns = 1;
  @Input() tabletColumns = 2;
  @Input() desktopColumns = 3;
  @Input() autoFit = false;
  @Input() autoFitSize: 'sm' | 'md' | 'lg' = 'md';
  @Input() gap = '1rem';
  @Input() alignment: 'center' | 'start' | 'end' | 'stretch' = 'stretch';
  @Input() customClasses = '';

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

  getGridClasses(): string {
    if (!this.screenSize) return '';

    let classes: string[] = [];

    if (this.autoFit) {
      classes.push(`grid-auto-fit-${this.autoFitSize}`);
    } else {
      // 根據螢幕尺寸設定網格列數
      if (this.screenSize.isMobile) {
        classes.push(`grid-mobile-${Math.min(this.mobileColumns, 2)}`);
      } else if (this.screenSize.isTablet) {
        classes.push(`grid-tablet-${Math.min(this.tabletColumns, 4)}`);
      } else if (this.screenSize.isDesktop) {
        classes.push(`grid-desktop-${Math.min(this.desktopColumns, 6)}`);
      }
    }

    // 對齊方式
    if (this.alignment !== 'stretch') {
      classes.push(`grid-${this.alignment}`);
    }

    // 自定義類別
    if (this.customClasses) {
      classes.push(this.customClasses);
    }

    return classes.join(' ');
  }

  getGap(): string {
    if (!this.screenSize) return this.gap;

    // 根據螢幕尺寸調整間距
    if (this.screenSize.isMobile) {
      return '0.75rem';
    } else if (this.screenSize.isTablet) {
      return '1rem';
    } else {
      return this.gap;
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