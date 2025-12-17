import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiveService, ScreenSize } from '../../../services/responsive.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-responsive-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="responsive-container" 
         [ngClass]="getContainerClasses()"
         [attr.data-screen-type]="getScreenType()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .responsive-container {
      width: 100%;
      transition: all 0.3s ease-in-out;
    }

    /* 手機版容器 */
    .mobile-container {
      padding: 0.75rem;
      max-width: 100%;
      width: 100%;
      box-sizing: border-box;
    }

    /* 平板版容器 */
    .tablet-container {
      padding: 1.5rem;
      max-width: 100%;
    }

    .tablet-portrait-container {
      padding: 1rem;
      max-width: 100%;
    }

    .tablet-landscape-container {
      padding: 2rem;
      max-width: 100%;
    }

    /* 桌面版容器 */
    .desktop-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    /* 響應式網格 */
    .grid-mobile {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .grid-tablet {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .grid-desktop {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    /* 彈性布局 */
    .flex-mobile {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .flex-tablet {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .flex-desktop {
      display: flex;
      flex-direction: row;
      gap: 2rem;
    }
  `]
})
export class ResponsiveContainerComponent implements OnInit, OnDestroy {
  @Input() containerType: 'default' | 'grid' | 'flex' = 'default';
  @Input() maxWidth = '1200px';
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

  getContainerClasses(): string {
    if (!this.screenSize) return '';

    let classes: string[] = [];

    // 基礎容器類別
    if (this.screenSize.isMobile) {
      classes.push('mobile-container');
    } else if (this.screenSize.isTabletPortrait) {
      classes.push('tablet-portrait-container');
    } else if (this.screenSize.isTabletLandscape) {
      classes.push('tablet-landscape-container');
    } else if (this.screenSize.isTablet) {
      classes.push('tablet-container');
    } else if (this.screenSize.isDesktop) {
      classes.push('desktop-container');
    }

    // 布局類型類別
    if (this.containerType === 'grid') {
      if (this.screenSize.isMobile) {
        classes.push('grid-mobile');
      } else if (this.screenSize.isTablet) {
        classes.push('grid-tablet');
      } else if (this.screenSize.isDesktop) {
        classes.push('grid-desktop');
      }
    } else if (this.containerType === 'flex') {
      if (this.screenSize.isMobile) {
        classes.push('flex-mobile');
      } else if (this.screenSize.isTablet) {
        classes.push('flex-tablet');
      } else if (this.screenSize.isDesktop) {
        classes.push('flex-desktop');
      }
    }

    // 自定義類別
    if (this.customClasses) {
      classes.push(this.customClasses);
    }

    return classes.join(' ');
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