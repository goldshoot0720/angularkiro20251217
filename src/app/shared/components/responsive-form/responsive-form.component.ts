import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiveService, ScreenSize } from '../../../services/responsive.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-responsive-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <form class="responsive-form" 
          [ngClass]="getFormClasses()"
          [attr.data-screen-type]="getScreenType()">
      <ng-content></ng-content>
    </form>
  `,
  styles: [`
    .responsive-form {
      width: 100%;
      transition: all 0.3s ease-in-out;
    }

    /* 手機版表單 */
    .mobile-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }

    .mobile-form :ng-deep .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .mobile-form :ng-deep .form-row {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .mobile-form :ng-deep label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.25rem;
    }

    .mobile-form :ng-deep input,
    .mobile-form :ng-deep textarea,
    .mobile-form :ng-deep select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s ease-in-out;
    }

    .mobile-form :ng-deep input:focus,
    .mobile-form :ng-deep textarea:focus,
    .mobile-form :ng-deep select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .mobile-form :ng-deep button {
      width: 100%;
      padding: 0.875rem;
      font-size: 1rem;
      font-weight: 500;
      border-radius: 6px;
      transition: all 0.2s ease-in-out;
    }

    /* 平板版表單 */
    .tablet-form {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      padding: 1.5rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .tablet-form :ng-deep .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .tablet-form :ng-deep .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .tablet-form :ng-deep .form-row.single {
      grid-template-columns: 1fr;
    }

    .tablet-form :ng-deep label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.25rem;
    }

    .tablet-form :ng-deep input,
    .tablet-form :ng-deep textarea,
    .tablet-form :ng-deep select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      transition: border-color 0.2s ease-in-out;
    }

    .tablet-form :ng-deep input:focus,
    .tablet-form :ng-deep textarea:focus,
    .tablet-form :ng-deep select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .tablet-form :ng-deep button {
      padding: 0.75rem 1.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.2s ease-in-out;
      justify-self: start;
    }

    /* 桌面版表單 */
    .desktop-form {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .desktop-form :ng-deep .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .desktop-form :ng-deep .form-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .desktop-form :ng-deep .form-row.two-columns {
      grid-template-columns: repeat(2, 1fr);
    }

    .desktop-form :ng-deep .form-row.single {
      grid-template-columns: 1fr;
    }

    .desktop-form :ng-deep label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.25rem;
    }

    .desktop-form :ng-deep input,
    .desktop-form :ng-deep textarea,
    .desktop-form :ng-deep select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      transition: border-color 0.2s ease-in-out;
    }

    .desktop-form :ng-deep input:focus,
    .desktop-form :ng-deep textarea:focus,
    .desktop-form :ng-deep select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .desktop-form :ng-deep button {
      padding: 0.75rem 2rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.2s ease-in-out;
      justify-self: start;
    }

    /* 按鈕樣式 */
    .responsive-form :ng-deep .btn-primary {
      background-color: #3b82f6;
      color: white;
      border: none;
    }

    .responsive-form :ng-deep .btn-primary:hover {
      background-color: #2563eb;
    }

    .responsive-form :ng-deep .btn-secondary {
      background-color: #6b7280;
      color: white;
      border: none;
    }

    .responsive-form :ng-deep .btn-secondary:hover {
      background-color: #4b5563;
    }

    .responsive-form :ng-deep .btn-outline {
      background-color: transparent;
      color: #3b82f6;
      border: 1px solid #3b82f6;
    }

    .responsive-form :ng-deep .btn-outline:hover {
      background-color: #3b82f6;
      color: white;
    }

    /* 錯誤狀態 */
    .responsive-form :ng-deep .error {
      border-color: #ef4444;
    }

    .responsive-form :ng-deep .error:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .responsive-form :ng-deep .error-message {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    /* 成功狀態 */
    .responsive-form :ng-deep .success {
      border-color: #10b981;
    }

    .responsive-form :ng-deep .success:focus {
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
  `]
})
export class ResponsiveFormComponent implements OnInit, OnDestroy {
  @Input() layout: 'vertical' | 'horizontal' | 'inline' = 'vertical';
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

  getFormClasses(): string {
    if (!this.screenSize) return '';

    let classes: string[] = [];

    // 基礎表單類別
    if (this.screenSize.isMobile) {
      classes.push('mobile-form');
    } else if (this.screenSize.isTablet) {
      classes.push('tablet-form');
    } else if (this.screenSize.isDesktop) {
      classes.push('desktop-form');
    }

    // 布局類別
    classes.push(`form-${this.layout}`);

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