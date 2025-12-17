import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageItem } from '../../services/image.service';

@Component({
  selector: 'app-image-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="image" class="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- 標題欄 -->
      <div class="flex justify-between items-center p-6 border-b bg-gray-50">
        <div class="flex-1 min-w-0">
          <h2 class="text-xl font-bold text-gray-800 truncate">{{ image.name }}</h2>
          <p class="text-sm text-gray-600 mt-1">{{ getCategoryName(image.category) }} • {{ image.type.toUpperCase() }}</p>
        </div>
        <div class="flex items-center gap-3 ml-4">
          <button 
            (click)="downloadImage()"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
            下載
          </button>
          <button 
            (click)="closeModal()"
            class="text-gray-500 hover:text-gray-700 text-3xl leading-none">
            ×
          </button>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row">
        <!-- 圖片展示區 -->
        <div class="flex-1 p-6 bg-gray-50">
          <div class="relative">
            <img 
              [src]="image.path" 
              [alt]="image.name"
              class="w-full max-h-96 object-contain rounded-lg shadow-md"
              [class.cursor-zoom-in]="!isZoomed"
              [class.cursor-zoom-out]="isZoomed"
              [class.scale-150]="isZoomed"
              [class.origin-center]="isZoomed"
              (click)="toggleZoom()"
              (error)="onImageError($event)">
            
            <!-- 縮放提示 -->
            <div class="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {{ isZoomed ? '點擊縮小' : '點擊放大' }}
            </div>
          </div>
          
          <!-- 圖片操作按鈕 -->
          <div class="flex justify-center gap-3 mt-4">
            <button 
              (click)="rotateImage(-90)"
              class="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors text-sm">
              ↺ 左轉
            </button>
            <button 
              (click)="rotateImage(90)"
              class="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors text-sm">
              ↻ 右轉
            </button>
            <button 
              (click)="resetImage()"
              class="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors text-sm">
              重置
            </button>
          </div>
        </div>

        <!-- 詳細信息區 -->
        <div class="w-full lg:w-80 p-6 border-l bg-white">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">圖片信息</h3>
          
          <div class="space-y-4">
            <!-- 基本信息 -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-700 mb-3">基本信息</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">檔案名稱:</span>
                  <span class="text-gray-800 font-medium break-all text-right ml-2">{{ getShortName(image.name) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">格式:</span>
                  <span class="text-gray-800 font-medium">{{ image.type.toUpperCase() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">分類:</span>
                  <span class="text-gray-800 font-medium">{{ getCategoryName(image.category) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">路徑:</span>
                  <span class="text-gray-800 font-medium text-right ml-2 break-all">{{ image.path }}</span>
                </div>
              </div>
            </div>

            <!-- 分類標籤 -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-700 mb-3">分類標籤</h4>
              <div class="flex flex-wrap gap-2">
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {{ getCategoryIcon(image.category) }} {{ getCategoryName(image.category) }}
                </span>
                <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {{ image.type.toUpperCase() }}
                </span>
              </div>
            </div>

            <!-- 操作歷史 -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-700 mb-3">操作記錄</h4>
              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>圖片已載入</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>詳情已展示</span>
                </div>
                <div *ngIf="rotationAngle !== 0" class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-orange-400 rounded-full"></span>
                  <span>已旋轉 {{ rotationAngle }}°</span>
                </div>
              </div>
            </div>

            <!-- 相關操作 -->
            <div class="space-y-2">
              <button 
                (click)="copyImagePath()"
                class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                📋 複製路徑
              </button>
              <button 
                (click)="shareImage()"
                class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                🔗 分享圖片
              </button>
              <button 
                (click)="deleteImage()"
                class="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm">
                🗑️ 刪除圖片
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ImageDetailComponent {
  @Input() image: ImageItem | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<ImageItem>();

  isZoomed = false;
  rotationAngle = 0;

  closeModal() {
    this.close.emit();
  }

  toggleZoom() {
    this.isZoomed = !this.isZoomed;
  }

  rotateImage(angle: number) {
    this.rotationAngle = (this.rotationAngle + angle) % 360;
    // 這裡可以實現實際的圖片旋轉邏輯
  }

  resetImage() {
    this.isZoomed = false;
    this.rotationAngle = 0;
  }

  downloadImage() {
    if (!this.image) return;
    
    const link = document.createElement('a');
    link.href = this.image.path;
    link.download = this.image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  copyImagePath() {
    if (!this.image) return;
    
    navigator.clipboard.writeText(this.image.path).then(() => {
      alert('圖片路徑已複製到剪貼板');
    }).catch(() => {
      alert('複製失敗');
    });
  }

  shareImage() {
    if (!this.image) return;
    
    if (navigator.share) {
      navigator.share({
        title: this.image.name,
        url: this.image.path
      });
    } else {
      this.copyImagePath();
    }
  }

  deleteImage() {
    if (!this.image) return;
    
    if (confirm(`確定要刪除圖片 "${this.image.name}" 嗎？`)) {
      this.delete.emit(this.image);
    }
  }

  getShortName(name: string): string {
    if (name.length > 30) {
      return name.substring(0, 27) + '...';
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

  onImageError(event: any) {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWcluePh+eEoeazleWKoOi8iDwvdGV4dD48L3N2Zz4=';
  }
}