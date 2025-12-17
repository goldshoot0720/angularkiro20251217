import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService, ImageItem } from '../../services/image.service';
import { ImageDetailComponent } from '../image-detail/image-detail.component';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageDetailComponent, ImageUploadComponent],
  template: `
    <div class="p-6">
      <!-- 標題和控制區 -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">圖片展示 
              <span class="inline-flex items-center ml-2">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span class="ml-1 text-sm text-green-600">實時更新</span>
              </span>
            </h1>
            <p class="text-gray-600">共 {{ stats.total }} 張圖片 • 總瀏覽次數: {{ stats.totalViews | number }}</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">最後更新: {{ stats.lastUpdate | date:'HH:mm:ss' }}</div>
            <div *ngIf="stats.newImages > 0" class="text-sm text-green-600">{{ stats.newImages }} 張新圖片</div>
          </div>
        </div>

        <!-- 最近更新提醒 -->
        <div *ngIf="recentUpdates.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div class="flex items-center mb-2">
            <span class="text-blue-600 mr-2">🔄</span>
            <span class="text-blue-800 font-medium">最近更新的圖片</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <span *ngFor="let img of recentUpdates" 
                  class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {{ getShortName(img.name) }}
            </span>
          </div>
        </div>
        
        <!-- 搜索欄 -->
        <div class="mb-4">
          <div class="relative max-w-md">
            <input 
              type="text" 
              [(ngModel)]="searchTerm"
              (input)="filterImages()"
              placeholder="搜索圖片名稱..."
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <div class="absolute left-3 top-2.5 text-gray-400">🔍</div>
          </div>
        </div>

        <!-- 篩選控制和上傳按鈕 -->
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <div class="flex flex-wrap gap-4 items-center">
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
            
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">網格大小:</label>
              <select 
                [(ngModel)]="gridSize" 
                class="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                <option value="grid-cols-3 md:grid-cols-4 lg:grid-cols-6">小</option>
                <option value="grid-cols-2 md:grid-cols-3 lg:grid-cols-4">中</option>
                <option value="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">大</option>
              </select>
            </div>
          </div>
          
          <div class="flex gap-2">
            <button 
              (click)="toggleUploadPanel()"
              class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              <span class="flex items-center">
                <span class="mr-2">📤</span>
                {{ showUploadPanel ? '隱藏上傳' : '上傳圖片' }}
              </span>
            </button>
            
            <button 
              (click)="refreshImages()"
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              <span class="flex items-center">
                <span class="mr-2">🔄</span>
                刷新
              </span>
            </button>
          </div>

        </div>
      </div>

      <!-- 統計卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm">總圖片數</p>
              <p class="text-3xl font-bold">{{ stats.total }}</p>
              <p class="text-blue-200 text-xs mt-1">{{ stats.newImages }} 張新增</p>
            </div>
            <div class="text-4xl opacity-80">🖼️</div>
          </div>
          <div class="absolute top-2 right-2">
            <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm">JPG/JPEG</p>
              <p class="text-3xl font-bold">{{ stats.jpgCount }}</p>
            </div>
            <div class="text-4xl opacity-80">📷</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm">PNG</p>
              <p class="text-3xl font-bold">{{ stats.pngCount }}</p>
            </div>
            <div class="text-4xl opacity-80">🎨</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100 text-sm">總瀏覽次數</p>
              <p class="text-3xl font-bold">{{ stats.totalViews | number }}</p>
              <p class="text-orange-200 text-xs mt-1">實時統計</p>
            </div>
            <div class="text-4xl opacity-80">👁️</div>
          </div>
        </div>
      </div>

      <!-- 上傳面板 -->
      <div *ngIf="showUploadPanel" class="mb-8">
        <app-image-upload></app-image-upload>
      </div>

      <!-- 分類統計 -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">分類統計</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div *ngFor="let category of stats.categoryBreakdown" 
               class="bg-white border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-shadow">
            <div class="text-2xl mb-1">{{ getCategoryIcon(category.name) }}</div>
            <div class="text-sm font-medium text-gray-800">{{ getCategoryName(category.name) }}</div>
            <div class="text-lg font-bold text-blue-600">{{ category.count }}</div>
          </div>
        </div>
      </div>

      <!-- 測試圖片 -->
      <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">路徑測試</h3>
        <div class="grid grid-cols-4 gap-4">
          <div class="text-center">
            <p class="text-sm mb-2">Assets 路徑</p>
            <img src="/assets/images/0d5c4921-9c4c-46b8-8266-85d89c053d66.png" alt="測試圖片1" class="w-20 h-20 object-cover mx-auto border" (error)="onImageError($event)" (load)="onImageLoad($event)">
          </div>
          <div class="text-center">
            <p class="text-sm mb-2">Images 路徑</p>
            <img src="/images/0d5c4921-9c4c-46b8-8266-85d89c053d66.png" alt="測試圖片2" class="w-20 h-20 object-cover mx-auto border" (error)="onImageError($event)" (load)="onImageLoad($event)">
          </div>
          <div class="text-center">
            <p class="text-sm mb-2">相對路徑</p>
            <img src="assets/images/0d5c4921-9c4c-46b8-8266-85d89c053d66.png" alt="測試圖片3" class="w-20 h-20 object-cover mx-auto border" (error)="onImageError($event)" (load)="onImageLoad($event)">
          </div>
          <div class="text-center">
            <p class="text-sm mb-2">動態綁定</p>
            <img [src]="'/assets/images/0d5c4921-9c4c-46b8-8266-85d89c053d66.png'" alt="測試圖片4" class="w-20 h-20 object-cover mx-auto border" (error)="onImageError($event)" (load)="onImageLoad($event)">
          </div>
        </div>
      </div>

      <!-- 圖片網格 -->
      <div class="mb-4">
        <p class="text-gray-600">顯示 {{ filteredImages().length }} 張圖片 (總共 {{ images.length }} 張)</p>
        <div *ngIf="images.length === 0" class="text-red-500 text-sm">
          ⚠️ 沒有載入到圖片數據，請檢查圖片服務
        </div>
      </div>
      
      <div [class]="'grid gap-4 ' + gridSize">
        <div *ngFor="let image of filteredImages(); let i = index; trackBy: trackByImageName" 
             class="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
             (click)="openImageModal(image)">
          
          <!-- 圖片容器 -->
          <div class="aspect-square overflow-hidden bg-gray-100">
            <img 
              src="/assets/images/{{ image.name }}" 
              [alt]="image.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              (error)="onImageError($event)"
              (load)="onImageLoad($event)">
          </div>
          
          <!-- 圖片信息覆蓋層 -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
            <div class="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p class="text-sm font-medium truncate">{{ getShortName(image.name) }}</p>
              <p class="text-xs opacity-80">{{ image.type.toUpperCase() }} • {{ getCategoryName(image.category) }}</p>
              <p class="text-xs opacity-70 mt-1">👁️ {{ image.views || 0 }} • {{ image.size || 'N/A' }}</p>
            </div>
          </div>
          
          <!-- 分類標籤和新圖片標記 -->
          <div class="absolute top-2 right-2 flex flex-col gap-1">
            <span class="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
              {{ getCategoryIcon(image.category) }}
            </span>
            <span *ngIf="image.isNew" class="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              NEW
            </span>
          </div>
        </div>
      </div>

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


    </div>
  `
})
export class GalleryComponent implements OnInit, OnDestroy {
  images: ImageItem[] = [];
  stats: any = {};
  recentUpdates: ImageItem[] = [];
  selectedCategory = '';
  selectedType = '';
  gridSize = 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
  selectedImage = signal<ImageItem | null>(null);
  searchTerm = '';
  showUploadPanel = false;
  
  private subscriptions: Subscription[] = [];

  constructor(private imageService: ImageService) {
    console.log('🖼️ 畫廊組件初始化，圖片服務:', this.imageService);
  }

  ngOnInit() {
    // 訂閱實時圖片更新
    this.subscriptions.push(
      this.imageService.getImagesStream().subscribe(images => {
        console.log('📸 收到圖片數據:', images.length, '張圖片');
        this.images = images;
        
        if (images.length > 0) {
          console.log('🔗 第一張圖片路徑:', images[0].path);
          console.log('🔗 前3張圖片:', images.slice(0, 3).map(img => ({ name: img.name, path: img.path })));
        }
      })
    );
    
    // 訂閱實時統計更新
    this.subscriptions.push(
      this.imageService.getStatsStream().subscribe(stats => {
        this.stats = stats;
      })
    );
    
    // 訂閱最近更新
    this.subscriptions.push(
      this.imageService.getRecentUpdatesStream().subscribe(updates => {
        this.recentUpdates = updates;
      })
    );
  }

  ngOnDestroy() {
    // 清理訂閱
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  filteredImages(): ImageItem[] {
    let filtered = this.images;
    
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
    
    return filtered;
  }

  filterImages() {
    // 觸發重新計算過濾結果
  }

  trackByImageName(_index: number, image: ImageItem): string {
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

  onImageError(event: any) {
    const originalSrc = event.target.src;
    console.error('圖片載入失敗:', originalSrc);
    
    // 如果已經嘗試過備用路徑，直接使用 fallback
    if (event.target.dataset.retryCount) {
      console.log('所有路徑都失敗，使用備用圖片');
      event.target.src = this.imageService.getFallbackImage();
      return;
    }
    
    // 標記已嘗試過一次
    event.target.dataset.retryCount = '1';
    
    // 嘗試不同的路徑格式
    if (originalSrc.includes('/images/')) {
      // 嘗試多種備用路徑
      const filename = originalSrc.split('/images/')[1];
      const alternativePaths = [
        `/assets/images/${filename}`,
        `images/${filename}`,
        `./images/${filename}`,
        `/public/images/${filename}`
      ];
      
      console.log('嘗試備用路徑:', alternativePaths[0]);
      event.target.src = alternativePaths[0];
    } else if (originalSrc.includes('/assets/images/')) {
      // 如果 assets 路徑也失敗，嘗試相對路徑
      const filename = originalSrc.split('/assets/images/')[1];
      console.log('嘗試相對路徑:', `images/${filename}`);
      event.target.src = `images/${filename}`;
    } else {
      // 使用備用圖片
      event.target.src = this.imageService.getFallbackImage();
    }
  }

  onImageLoad(event: any) {
    console.log('圖片載入成功:', event.target.src);
  }



  onDeleteImage(image: ImageItem) {
    if (confirm('確定要刪除這張圖片嗎？')) {
      this.imageService.deleteImage(image.name);
      this.closeImageModal();
      
      // 顯示刪除成功訊息
      this.showNotification('圖片已刪除', 'success');
    }
  }

  toggleUploadPanel() {
    this.showUploadPanel = !this.showUploadPanel;
  }

  refreshImages() {
    // 觸發手動刷新
    this.showNotification('圖片列表已刷新', 'info');
  }

  private testImagePath(imagePath: string) {
    console.log('🧪 測試圖片路徑:', imagePath);
    
    const img = new Image();
    img.onload = () => {
      console.log('✅ 圖片路徑可用:', imagePath);
    };
    img.onerror = () => {
      console.error('❌ 圖片路徑不可用:', imagePath);
      
      // 嘗試其他路徑格式
      const filename = imagePath.split('/').pop();
      const alternativePaths = [
        `/images/${filename}`,
        `images/${filename}`,
        `./images/${filename}`,
        `assets/images/${filename}`
      ];
      
      console.log('🔄 嘗試備用路徑:', alternativePaths);
      this.testAlternativePaths(alternativePaths, 0);
    };
    img.src = imagePath;
  }

  private testAlternativePaths(paths: string[], index: number) {
    if (index >= paths.length) {
      console.error('❌ 所有路徑都不可用');
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      console.log('✅ 找到可用的備用路徑:', paths[index]);
    };
    img.onerror = () => {
      console.log('❌ 備用路徑不可用:', paths[index]);
      this.testAlternativePaths(paths, index + 1);
    };
    img.src = paths[index];
  }

  getImageUrl(image: any): string {
    // 確保返回正確的圖片 URL
    return image.path || `/assets/images/${image.name}`;
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info') {
    // 簡單的通知實作
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }
}