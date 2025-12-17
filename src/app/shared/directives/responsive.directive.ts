import { Directive, Input, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { ResponsiveService } from '../../services/responsive.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appResponsive]',
  standalone: true
})
export class ResponsiveDirective implements OnInit, OnDestroy {
  @Input() mobileClass = '';
  @Input() tabletClass = '';
  @Input() desktopClass = '';
  @Input() tabletPortraitClass = '';
  @Input() tabletLandscapeClass = '';

  private destroy$ = new Subject<void>();
  private currentClasses: string[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private responsiveService: ResponsiveService
  ) {}

  ngOnInit() {
    this.responsiveService.getScreenSize$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(size => {
        this.updateClasses(size);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateClasses(size: any) {
    // 移除之前的類別
    this.currentClasses.forEach(className => {
      if (className) {
        this.renderer.removeClass(this.el.nativeElement, className);
      }
    });
    this.currentClasses = [];

    // 添加新的類別
    let classesToAdd: string[] = [];

    if (size.isMobile && this.mobileClass) {
      classesToAdd = this.mobileClass.split(' ');
    } else if (size.isTabletPortrait && this.tabletPortraitClass) {
      classesToAdd = this.tabletPortraitClass.split(' ');
    } else if (size.isTabletLandscape && this.tabletLandscapeClass) {
      classesToAdd = this.tabletLandscapeClass.split(' ');
    } else if (size.isTablet && this.tabletClass) {
      classesToAdd = this.tabletClass.split(' ');
    } else if (size.isDesktop && this.desktopClass) {
      classesToAdd = this.desktopClass.split(' ');
    }

    classesToAdd.forEach(className => {
      if (className.trim()) {
        this.renderer.addClass(this.el.nativeElement, className.trim());
        this.currentClasses.push(className.trim());
      }
    });
  }
}