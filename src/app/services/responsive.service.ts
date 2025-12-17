import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { map, startWith, distinctUntilChanged } from 'rxjs/operators';

export interface ScreenSize {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTabletPortrait: boolean;
  isTabletLandscape: boolean;
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private screenSize$ = new BehaviorSubject<ScreenSize>(this.getScreenSize());

  constructor() {
    // 監聽視窗大小變化
    fromEvent(window, 'resize')
      .pipe(
        map(() => this.getScreenSize()),
        distinctUntilChanged((prev, curr) => 
          prev.isMobile === curr.isMobile && 
          prev.isTablet === curr.isTablet && 
          prev.isDesktop === curr.isDesktop &&
          prev.isTabletPortrait === curr.isTabletPortrait &&
          prev.isTabletLandscape === curr.isTabletLandscape
        )
      )
      .subscribe(size => this.screenSize$.next(size));

    // 監聽方向變化
    fromEvent(window, 'orientationchange')
      .pipe(
        map(() => {
          // 延遲獲取尺寸，等待方向變化完成
          setTimeout(() => {
            this.screenSize$.next(this.getScreenSize());
          }, 100);
          return this.getScreenSize();
        })
      )
      .subscribe();
  }

  private getScreenSize(): ScreenSize {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;

    // 🔥 修復：與 Tailwind 斷點一致
    // Tailwind: sm=640px, md=768px, lg=1024px, xl=1280px
    const isMobile = width < 1024;  // < lg (與 lg:hidden 一致)
    const isTablet = width >= 768 && width < 1024;  // md 到 lg 之間
    const isDesktop = width >= 1024;  // >= lg (與 lg:flex 一致)
    const isTabletPortrait = isTablet && isPortrait;
    const isTabletLandscape = isTablet && !isPortrait;

    return {
      isMobile,
      isTablet,
      isDesktop,
      isTabletPortrait,
      isTabletLandscape,
      width,
      height
    };
  }

  getScreenSize$(): Observable<ScreenSize> {
    return this.screenSize$.asObservable();
  }

  getCurrentScreenSize(): ScreenSize {
    return this.screenSize$.value;
  }

  isMobileLayout(): boolean {
    const size = this.getCurrentScreenSize();
    return size.isMobile || size.isTabletPortrait;
  }

  isDesktopLayout(): boolean {
    const size = this.getCurrentScreenSize();
    return size.isDesktop || size.isTabletLandscape;
  }
}