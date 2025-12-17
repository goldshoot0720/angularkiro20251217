import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ImageService, ImageItem } from '../../services/image.service';
import { ImageDetailComponent } from '../image-detail/image-detail.component';
import { ResponsiveContainerComponent } from '../../shared/components/responsive-container/responsive-container.component';
import { ResponsiveCardComponent } from '../../shared/components/responsive-card/responsive-card.component';
import { ResponsiveGridComponent } from '../../shared/components/responsive-grid/responsive-grid.component';
import { ResponsiveService, ScreenSize } from '../../services/responsive.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    ImageDetailComponent,
    ResponsiveContainerComponent,
    ResponsiveCardComponent,
    ResponsiveGridComponent
  ],
  template: `
    <app-responsive-container>
      <!-- 歡迎橫幅 -->
      <app-responsive-card class="mb-6" customClasses="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">歡迎使用鋒兄Angular資訊管理系統</h1>
        <p class="text-blue-100 mb-4">版權所有 2025 - 2125</p>
        <div class="responsive-flex responsive-flex-row gap-2 text-xs md:text-sm">
          <span class="bg-white bg-opacity-20 px-2 py-1 rounded">Angular + Material</span>
          <span class="bg-white bg-opacity-20 px-2 py-1 rounded">Nhost 後端</span>
          <span class="bg-white bg-opacity-20 px-2 py-1 rounded">CloudFlare 託管</span>
        </div>
      </app-responsive-card>

      <!-- 圖片路徑測試 -->
      <app-responsive-card title="圖片路徑測試" class="mb-6">
        <app-responsive-grid [mobileColumns]="2" [tabletColumns]="4" [desktopColumns]="4">
          <div class="text-center">
            <p class="text-xs md:text-sm mb-2">Images 路徑</p>
            <img src="/images/0d5c4921-9c4c-46b8-8266-85d89c053d66.png" alt="測試圖片" class="responsive-img-square border" (error)="onImageError($event)" (load)="onImageLoad($event)">
          </div>
          <div class="text-center">
            <p class="text-xs md:text-sm mb-2">Public 路徑</p>
            <img src="/test-image-direct.png" alt="測試圖片" class="responsive-img-square border" (error)="onImageError($event)" (load)="onImageLoad($event)">
          </div>
          <div class="text-center">
            <p class="text-xs md:text-sm mb-2">相對 Images</p>
            <img src="images/0d5c4921-9c4c-46b8-8266-85d89c053d66.png" alt="測試圖片" class="responsive-img-square border" (error)="onImageError($event)" (load)="onImageLoad($event)">
          </div>
          <div class="text-center">
            <p class="text-xs md:text-sm mb-2">備用圖片</p>
            <img [src]="imageService.getFallbackImage()" alt="備用圖片" class="responsive-img-square border">
          </div>
        </app-responsive-grid>
      </app-responsive-card>

      <!-- 圖片展示區域 -->
      <app-responsive-card title="圖片展示" class="mb-6">
        <div slot="header" class="responsive-flex responsive-flex-between items-center">
          <div>
            <p class="text-sm md:text-base text-gray-600">共 {{ stats.total }} 張圖片 • 最後更新: {{ stats.lastUpdate | date:'short' }}</p>
          </div>
          <div class="responsive-flex responsive-flex-row gap-2">
            <button 
              (click)="refreshImages()"
              class="responsive-btn responsive-btn-sm bg-blue-500 text-white hover:bg-blue-600">
              <span>🔄</span>
              <span class="desktop-only">刷新圖片</span>
            </button>
            <button 
              (click)="showRecentOnly = !showRecentOnly"
              [class]="showRecentOnly ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'"
              class="responsive-btn responsive-btn-sm text-white">
              <span>{{ showRecentOnly ? '✅' : '📅' }}</span>
              <span class="desktop-only">{{ showRecentOnly ? '顯示全部' : '僅顯示最新' }}</span>
            </button>
          </div>
        </div>
        
        <!-- 搜索和篩選 -->
        <div class="flex flex-wrap gap-4 items-center mb-6">
          <div class="relative">
            <input 
              type="text" 
              [(ngModel)]="searchTerm"
              (input)="filterImages()"
              placeholder="搜索圖片..."
              class="px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <div class="absolute left-3 top-2.5 text-gray-400">🔍</div>
          </div>
          
          <select 
            [(ngModel)]="selectedCategory" 
            (change)="filterImages()"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">所有分類</option>
            <option value="ai-generated">AI 生成圖片</option>
            <option value="screenshots">截圖</option>
            <option value="portraits">人像</option>
            <option value="photos">照片</option>
            <option value="icons">圖標</option>
            <option value="logos">標誌</option>
          </select>
          
          <select 
            [(ngModel)]="selectedType" 
            (change)="filterImages()"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">所有格式</option>
            <option value="jpg">JPG</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
          </select>
          
          <select 
            [(ngModel)]="gridSize" 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="grid-cols-3 md:grid-cols-4 lg:grid-cols-6">小網格</option>
            <option value="grid-cols-2 md:grid-cols-3 lg:grid-cols-4">中網格</option>
            <option value="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">大網格</option>
          </select>
        </div>
      </app-responsive-card>

      <!-- 統計卡片 -->
      <app-responsive-grid [mobileColumns]="1" [tabletColumns]="2" [desktopColumns]="4" class="mb-6">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm">總圖片數</p>
              <p class="text-2xl font-bold">{{ stats.total }}</p>
            </div>
            <div class="text-3xl opacity-80">🖼️</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm">JPG/JPEG</p>
              <p class="text-2xl font-bold">{{ stats.jpgCount }}</p>
            </div>
            <div class="text-3xl opacity-80">📷</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm">PNG</p>
              <p class="text-2xl font-bold">{{ stats.pngCount }}</p>
            </div>
            <div class="text-3xl opacity-80">🎨</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100 text-sm">新圖片</p>
              <p class="text-2xl font-bold">{{ stats.newImages || 0 }}</p>
            </div>
            <div class="text-3xl opacity-80">✨</div>
          </div>
        </div>
      </app-responsive-grid>

      <!-- 分類統計 -->
      <app-responsive-card title="分類統計" class="mb-6">
        <app-responsive-grid [mobileColumns]="2" [tabletColumns]="3" [desktopColumns]="6">
          <div *ngFor="let category of stats.categoryBreakdown" 
               class="bg-white border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-shadow cursor-pointer"
               (click)="filterByCategory(category.name)">
            <div class="text-2xl mb-1">{{ getCategoryIcon(category.name) }}</div>
            <div class="text-sm font-medium text-gray-800">{{ getCategoryName(category.name) }}</div>
            <div class="text-lg font-bold text-blue-600">{{ category.count }}</div>
          </div>
        </app-responsive-grid>
      </app-responsive-card>

      <!-- 圖片網格 -->
      <app-responsive-card class="mb-6">
        <p class="text-gray-600 mb-4">顯示 {{ filteredImages().length }} 張圖片</p>
        <div [class]="'grid gap-4 ' + gridSize">
          <div *ngFor="let image of filteredImages(); trackBy: trackByImageName" 
               class="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
               (click)="openImageModal(image)">
            
            <!-- 圖片容器 -->
            <div class="aspect-square overflow-hidden bg-gray-100 relative">
              <!-- 實際圖片 -->
              <img 
                src="/images/{{ image.name }}" 
                [alt]="image.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                (error)="onImageError($event)"
                (load)="onImageLoad($event)"
                loading="lazy">
            </div>
            
            <!-- 圖片信息覆蓋層 -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
              <div class="p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p class="text-sm font-medium truncate">{{ getShortName(image.name) }}</p>
                <p class="text-xs opacity-80">{{ image.type.toUpperCase() }} • {{ getCategoryName(image.category) }}</p>
              </div>
            </div>
            
            <!-- 分類標籤 -->
            <div class="absolute top-2 right-2">
              <span class="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                {{ getCategoryIcon(image.category) }}
              </span>
            </div>
          </div>
        </div>
      </app-responsive-card>

      <!-- 快速功能區 -->
      <app-responsive-card title="快速功能">
        <app-responsive-grid [mobileColumns]="2" [tabletColumns]="4" [desktopColumns]="4">
          <a routerLink="/food-management" class="bg-orange-100 hover:bg-orange-200 p-4 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">🍽️</div>
            <p class="text-sm font-medium text-gray-700">食品管理</p>
          </a>
          <a routerLink="/subscription-management" class="bg-green-100 hover:bg-green-200 p-4 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">📋</div>
            <p class="text-sm font-medium text-gray-700">訂閱管理</p>
          </a>
          <a routerLink="/video-intro" class="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">🎬</div>
            <p class="text-sm font-medium text-gray-700">影片介紹</p>
          </a>
          <a routerLink="/dashboard" class="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg text-center transition-colors">
            <div class="text-2xl mb-2">📊</div>
            <p class="text-sm font-medium text-gray-700">數據儀表板</p>
          </a>
        </app-responsive-grid>
      </app-responsive-card>

      <!-- 圖片詳情模態框 -->
      <div *ngIf="selectedImage()" 
           class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
           (click)="closeImageModal()">
        <div (click)="$event.stopPropagation()">
          <app-image-detail 
            [image]="selectedImage()"
            (close)="closeImageModal()"
            (delete)="onDeleteImage($event)">
          </app-image-detail>
        </div>
      </div>
    </app-responsive-container>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  images: ImageItem[] = [];
  stats: any = {};
  selectedCategory = '';
  selectedType = '';
  gridSize = 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
  selectedImage = signal<ImageItem | null>(null);
  searchTerm = '';
  showRecentOnly = false;
  screenSize: ScreenSize | null = null;

  constructor(
    public imageService: ImageService,
    private responsiveService: ResponsiveService
  ) {}

  ngOnInit() {
    // 訂閱響應式服務
    this.responsiveService.getScreenSize$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(size => {
        this.screenSize = size;
        this.updateGridSize();
      });

    // 訂閱實時圖片數據流
    this.imageService.getImagesStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe(images => {
        this.images = images;
      });
    
    // 訂閱實時統計數據流
    this.imageService.getStatsStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.stats = stats;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateGridSize() {
    if (!this.screenSize) return;
    
    if (this.screenSize.isMobile) {
      this.gridSize = 'grid-cols-2';
    } else if (this.screenSize.isTablet) {
      this.gridSize = 'grid-cols-3 md:grid-cols-4';
    } else {
      this.gridSize = 'grid-cols-4 lg:grid-cols-6';
    }
  }

  filteredImages(): ImageItem[] {
    let filtered = this.images;
    
    // 最新圖片過濾
    if (this.showRecentOnly) {
      filtered = this.imageService.getRecentImages(7);
    }
    
    // 搜索過濾
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(img => 
        img.name.toLowerCase().includes(searchLower)
      );
    }
    
    // 分類過濾
    if (this.selectedCategory) {
      filtered = filtered.filter(img => img.category === this.selectedCategory);
    }
    
    // 格式過濾
    if (this.selectedType) {
      filtered = filtered.filter(img => img.type === this.selectedType);
    }
    
    // 按上傳日期排序（最新的在前）
    return filtered.sort((a, b) => 
      (b.uploadDate?.getTime() || 0) - (a.uploadDate?.getTime() || 0)
    );
  }

  filterImages() {
    // 觸發重新計算過濾結果
  }

  filterByCategory(category: string) {
    this.selectedCategory = this.selectedCategory === category ? '' : category;
    this.filterImages();
  }

  trackByImageName(index: number, image: ImageItem): string {
    return image.name;
  }

  getShortName(name: string): string {
    if (name.length > 20) {
      return name.substring(0, 17) + '...';
    }
    return name;
  }

  getCategoryName(category: string): string {
    const categoryNames: { [key: string]: string } = {
      'ai-generated': 'AI 生成',
      'screenshots': '截圖',
      'portraits': '人像',
      'photos': '照片',
      'icons': '圖標',
      'logos': '標誌'
    };
    return categoryNames[category] || category;
  }

  getCategoryIcon(category: string): string {
    const categoryIcons: { [key: string]: string } = {
      'ai-generated': '🤖',
      'screenshots': '📱',
      'portraits': '👤',
      'photos': '📸',
      'icons': '🎯',
      'logos': '🏷️'
    };
    return categoryIcons[category] || '📁';
  }

  openImageModal(image: ImageItem) {
    this.selectedImage.set(image);
  }

  closeImageModal() {
    this.selectedImage.set(null);
  }

  onDeleteImage(image: ImageItem) {
    // 這裡可以實現實際的刪除邏輯
    console.log('Delete image:', image);
    
    // 從列表中移除圖片
    const index = this.images.findIndex(img => img.name === image.name);
    if (index > -1) {
      this.images.splice(index, 1);
      this.stats = this.imageService.getImageStats();
    }
    
    this.closeImageModal();
    alert('圖片已刪除');
  }

  refreshImages() {
    this.imageService.refreshImageList();
  }

  onImageError(event: any) {
    console.warn('圖片載入失敗:', event.target.src);
    event.target.src = this.imageService.getFallbackImage();
    event.target.classList.add('image-error');
    event.target.style.opacity = '1';
  }

  onImageLoad(event: any) {
    console.log('圖片載入成功:', event.target.src);
    event.target.classList.add('image-loaded');
  }
}