import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiveService, ScreenSize } from '../../services/responsive.service';
import { ResponsiveContainerComponent } from '../../shared/components/responsive-container/responsive-container.component';
import { ResponsiveCardComponent } from '../../shared/components/responsive-card/responsive-card.component';
import { ResponsiveGridComponent } from '../../shared/components/responsive-grid/responsive-grid.component';
import { ResponsiveFormComponent } from '../../shared/components/responsive-form/responsive-form.component';
import { ResponsiveNavigationComponent, NavigationItem } from '../../shared/components/responsive-navigation/responsive-navigation.component';
import { ResponsiveDirective } from '../../shared/directives/responsive.directive';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-responsive-demo',
  standalone: true,
  imports: [
    CommonModule,
    ResponsiveContainerComponent,
    ResponsiveCardComponent,
    ResponsiveGridComponent,
    ResponsiveFormComponent,
    ResponsiveNavigationComponent,
    ResponsiveDirective
  ],
  template: `
    <app-responsive-container>
      <h1 class="text-3xl font-bold text-gray-800 mb-6">完整響應式系統展示</h1>
      
      <!-- 當前螢幕資訊 -->
      <app-responsive-card title="當前螢幕資訊" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4" *ngIf="screenSize">
          <div class="space-y-2">
            <p><span class="font-medium">寬度:</span> {{screenSize.width}}px</p>
            <p><span class="font-medium">高度:</span> {{screenSize.height}}px</p>
            <p><span class="font-medium">裝置類型:</span> 
              <span class="px-2 py-1 rounded text-sm"
                    [class.bg-blue-100]="screenSize.isMobile"
                    [class.text-blue-800]="screenSize.isMobile"
                    [class.bg-green-100]="screenSize.isTablet"
                    [class.text-green-800]="screenSize.isTablet"
                    [class.bg-purple-100]="screenSize.isDesktop"
                    [class.text-purple-800]="screenSize.isDesktop">
                {{getDeviceType()}}
              </span>
            </p>
          </div>
          <div class="space-y-2">
            <p><span class="font-medium">布局模式:</span> 
              <span class="px-2 py-1 rounded text-sm"
                    [class.bg-orange-100]="isMobileLayout"
                    [class.text-orange-800]="isMobileLayout"
                    [class.bg-indigo-100]="!isMobileLayout"
                    [class.text-indigo-800]="!isMobileLayout">
                {{isMobileLayout ? '手機版布局' : '桌面版布局'}}
              </span>
            </p>
            <p><span class="font-medium">方向:</span> {{screenSize.isTabletPortrait ? '平板直向' : screenSize.isTabletLandscape ? '平板橫向' : '一般'}}</p>
          </div>
        </div>
      </app-responsive-card>

      <!-- 響應式導航展示 -->
      <app-responsive-card title="響應式導航組件" class="mb-6">
        <app-responsive-navigation 
          [navigationItems]="demoNavItems"
          brandName="示例導航"
          brandIcon="🚀"
          (itemClick)="onNavItemClick($event)">
        </app-responsive-navigation>
      </app-responsive-card>

      <!-- 響應式網格展示 -->
      <app-responsive-card title="響應式網格系統" class="mb-6">
        <app-responsive-grid 
          [mobileColumns]="1" 
          [tabletColumns]="2" 
          [desktopColumns]="3"
          class="mb-4">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <h3 class="font-medium text-blue-800 mb-2">網格項目 1</h3>
            <p class="text-sm text-blue-600">這個網格會根據螢幕尺寸自動調整列數。</p>
          </div>
          <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <h3 class="font-medium text-green-800 mb-2">網格項目 2</h3>
            <p class="text-sm text-green-600">手機版1列，平板版2列，桌面版3列。</p>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <h3 class="font-medium text-purple-800 mb-2">網格項目 3</h3>
            <p class="text-sm text-purple-600">間距也會根據螢幕尺寸自動調整。</p>
          </div>
          <div class="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
            <h3 class="font-medium text-red-800 mb-2">網格項目 4</h3>
            <p class="text-sm text-red-600">完全響應式的網格布局系統。</p>
          </div>
          <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
            <h3 class="font-medium text-yellow-800 mb-2">網格項目 5</h3>
            <p class="text-sm text-yellow-600">支援自定義列數和間距。</p>
          </div>
          <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
            <h3 class="font-medium text-indigo-800 mb-2">網格項目 6</h3>
            <p class="text-sm text-indigo-600">適用於各種內容展示需求。</p>
          </div>
        </app-responsive-grid>
      </app-responsive-card>

      <!-- 響應式表單展示 -->
      <app-responsive-card title="響應式表單組件" class="mb-6">
        <app-responsive-form>
          <div class="form-row">
            <div class="form-group">
              <label for="name">姓名</label>
              <input type="text" id="name" placeholder="請輸入姓名" class="responsive-form-input">
            </div>
            <div class="form-group">
              <label for="email">電子郵件</label>
              <input type="email" id="email" placeholder="請輸入電子郵件" class="responsive-form-input">
            </div>
          </div>
          
          <div class="form-row single">
            <div class="form-group">
              <label for="message">訊息</label>
              <textarea id="message" rows="4" placeholder="請輸入訊息內容" class="responsive-form-input"></textarea>
            </div>
          </div>
          
          <div class="form-row">
            <button type="submit" class="btn-primary">提交表單</button>
            <button type="button" class="btn-outline">取消</button>
          </div>
        </app-responsive-form>
      </app-responsive-card>

      <!-- 響應式指令展示 -->
      <app-responsive-card title="響應式指令展示" class="mb-6">
        <div appResponsive 
             mobileClass="bg-blue-100 text-blue-800 p-4 rounded-lg text-center"
             tabletClass="bg-green-100 text-green-800 p-6 rounded-lg text-left"
             desktopClass="bg-purple-100 text-purple-800 p-8 rounded-lg text-right">
          <h3 class="font-medium mb-2">響應式指令效果</h3>
          <p class="text-sm">這個區塊會根據螢幕尺寸應用不同的樣式類別。</p>
          <p class="text-xs mt-2">手機版：藍色背景，居中對齊</p>
          <p class="text-xs">平板版：綠色背景，左對齊</p>
          <p class="text-xs">桌面版：紫色背景，右對齊</p>
        </div>
      </app-responsive-card>

      <!-- 響應式工具類展示 -->
      <app-responsive-card title="響應式工具類展示" class="mb-6">
        <div class="space-y-4">
          <div class="mobile-only bg-blue-50 p-4 rounded-lg">
            <h4 class="font-medium text-blue-800">手機版專用內容</h4>
            <p class="text-sm text-blue-600">這個區塊只在手機版顯示</p>
          </div>
          
          <div class="tablet-only bg-green-50 p-4 rounded-lg">
            <h4 class="font-medium text-green-800">平板版專用內容</h4>
            <p class="text-sm text-green-600">這個區塊只在平板版顯示</p>
          </div>
          
          <div class="desktop-only bg-purple-50 p-4 rounded-lg">
            <h4 class="font-medium text-purple-800">桌面版專用內容</h4>
            <p class="text-sm text-purple-600">這個區塊只在桌面版顯示</p>
          </div>

          <div class="responsive-flex responsive-flex-between bg-gray-50 p-4 rounded-lg">
            <span class="responsive-text">響應式彈性布局</span>
            <button class="responsive-btn responsive-btn-sm btn-primary">響應式按鈕</button>
          </div>
        </div>
      </app-responsive-card>

      <!-- 測試說明 -->
      <app-responsive-card title="測試說明" variant="spacious">
        <div class="space-y-3 text-sm text-gray-600">
          <p>• <strong>調整瀏覽器視窗大小</strong> - 測試不同的響應式斷點效果</p>
          <p>• <strong>平板裝置旋轉</strong> - 測試方向變化時的布局切換</p>
          <p>• <strong>觀察組件變化</strong> - 注意各個組件如何適應不同螢幕尺寸</p>
          <p>• <strong>互動測試</strong> - 測試表單、按鈕、導航等互動元素</p>
          <p>• <strong>內容適應</strong> - 觀察文字、圖片、間距的響應式調整</p>
        </div>
      </app-responsive-card>
    </app-responsive-container>
  `,
  styles: [`
    .responsive-demo {
      font-family: 'Microsoft JhengHei', sans-serif;
    }
  `]
})
export class ResponsiveDemoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  screenSize: ScreenSize | null = null;
  isMobileLayout = false;

  demoNavItems: NavigationItem[] = [
    { label: '首頁', route: '/home', icon: '🏠' },
    { label: '產品', icon: '📦', badge: '新' },
    { label: '服務', icon: '🛠️' },
    { label: '關於', route: '/about', icon: 'ℹ️' },
    { label: '聯絡', icon: '📞', badge: 5 }
  ];

  constructor(private responsiveService: ResponsiveService) {}

  ngOnInit() {
    this.responsiveService.getScreenSize$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(size => {
        this.screenSize = size;
        this.isMobileLayout = this.responsiveService.isMobileLayout();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDeviceType(): string {
    if (!this.screenSize) return '未知';
    
    if (this.screenSize.isMobile) return '手機';
    if (this.screenSize.isTabletPortrait) return '平板 (直向)';
    if (this.screenSize.isTabletLandscape) return '平板 (橫向)';
    if (this.screenSize.isDesktop) return '桌面電腦';
    
    return '未知';
  }

  onNavItemClick(item: NavigationItem) {
    console.log('導航項目點擊:', item);
  }
}