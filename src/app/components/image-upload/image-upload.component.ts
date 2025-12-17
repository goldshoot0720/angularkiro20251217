import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService, ImageItem } from '../../services/image.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">上傳新圖片</h3>
      
      <div class="space-y-4">
        <!-- 圖片名稱 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">圖片名稱</label>
          <input 
            type="text" 
            [(ngModel)]="newImage.name"
            placeholder="輸入圖片名稱..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>

        <!-- 分類選擇 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">分類</label>
          <select 
            [(ngModel)]="newImage.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">選擇分類</option>
            <option value="ai-generated">AI 生成圖片</option>
            <option value="screenshots">截圖</option>
            <option value="portraits">人像</option>
            <option value="photos">照片</option>
            <option value="icons">圖標</option>
            <option value="logos">標誌</option>
          </select>
        </div>

        <!-- 檔案類型 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">檔案類型</label>
          <select 
            [(ngModel)]="newImage.type"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">選擇類型</option>
            <option value="jpg">JPG</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="gif">GIF</option>
            <option value="webp">WebP</option>
          </select>
        </div>

        <!-- 模擬檔案上傳 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">模擬圖片</label>
          <div class="grid grid-cols-3 gap-2">
            <div *ngFor="let demo of demoImages" 
                 class="relative cursor-pointer border-2 rounded-lg overflow-hidden"
                 [class.border-blue-500]="selectedDemo === demo"
                 [class.border-gray-200]="selectedDemo !== demo"
                 (click)="selectDemo(demo)">
              <img [src]="demo.url" [alt]="demo.name" class="w-full h-20 object-cover">
              <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all"></div>
            </div>
          </div>
        </div>

        <!-- 上傳按鈕 -->
        <div class="flex space-x-2">
          <button 
            (click)="uploadImage()"
            [disabled]="!canUpload()"
            class="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <span class="flex items-center justify-center">
              <span class="mr-2">📤</span>
              上傳圖片
            </span>
          </button>
          
          <button 
            (click)="simulateRandomUpload()"
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
            <span class="flex items-center justify-center">
              <span class="mr-2">🎲</span>
              隨機上傳
            </span>
          </button>
        </div>

        <!-- 上傳狀態 -->
        <div *ngIf="uploadStatus" 
             class="p-3 rounded-lg"
             [class.bg-green-100]="uploadStatus.type === 'success'"
             [class.bg-red-100]="uploadStatus.type === 'error'"
             [class.bg-blue-100]="uploadStatus.type === 'info'">
          <div class="flex items-center">
            <span class="mr-2">
              {{ uploadStatus.type === 'success' ? '✅' : 
                 uploadStatus.type === 'error' ? '❌' : 'ℹ️' }}
            </span>
            <span class="text-sm font-medium">{{ uploadStatus.message }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ImageUploadComponent {
  newImage = {
    name: '',
    category: '',
    type: 'jpg' as 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp'
  };

  selectedDemo: any = null;
  uploadStatus: { type: 'success' | 'error' | 'info', message: string } | null = null;

  demoImages = [
    { name: 'demo1', url: 'https://picsum.photos/200/200?random=1' },
    { name: 'demo2', url: 'https://picsum.photos/200/200?random=2' },
    { name: 'demo3', url: 'https://picsum.photos/200/200?random=3' },
    { name: 'demo4', url: 'https://picsum.photos/200/200?random=4' },
    { name: 'demo5', url: 'https://picsum.photos/200/200?random=5' },
    { name: 'demo6', url: 'https://picsum.photos/200/200?random=6' }
  ];

  constructor(private imageService: ImageService) {}

  selectDemo(demo: any) {
    this.selectedDemo = demo;
    if (!this.newImage.name) {
      this.newImage.name = `demo_${demo.name}_${Date.now()}.jpg`;
    }
  }

  canUpload(): boolean {
    return !!(this.newImage.name && this.newImage.category && this.newImage.type && this.selectedDemo);
  }

  uploadImage() {
    if (!this.canUpload()) return;

    const imageItem: Omit<ImageItem, 'uploadDate' | 'size' | 'lastModified' | 'views' | 'isNew'> = {
      name: this.newImage.name,
      path: this.selectedDemo.url,
      type: this.newImage.type,
      category: this.newImage.category
    };

    this.imageService.addImage(imageItem);
    
    this.uploadStatus = {
      type: 'success',
      message: `圖片 "${this.newImage.name}" 上傳成功！`
    };

    // 重置表單
    this.resetForm();

    // 3秒後清除狀態
    setTimeout(() => {
      this.uploadStatus = null;
    }, 3000);
  }

  simulateRandomUpload() {
    const categories = ['ai-generated', 'screenshots', 'portraits', 'photos', 'icons', 'logos'];
    const types = ['jpg', 'jpeg', 'png'] as const;
    const randomDemo = this.demoImages[Math.floor(Math.random() * this.demoImages.length)];
    
    const randomImage: Omit<ImageItem, 'uploadDate' | 'size' | 'lastModified' | 'views' | 'isNew'> = {
      name: `random_${Date.now()}.${types[Math.floor(Math.random() * types.length)]}`,
      path: randomDemo.url,
      type: types[Math.floor(Math.random() * types.length)],
      category: categories[Math.floor(Math.random() * categories.length)]
    };

    this.imageService.addImage(randomImage);
    
    this.uploadStatus = {
      type: 'success',
      message: `隨機圖片 "${randomImage.name}" 已添加！`
    };

    setTimeout(() => {
      this.uploadStatus = null;
    }, 3000);
  }

  private resetForm() {
    this.newImage = {
      name: '',
      category: '',
      type: 'jpg'
    };
    this.selectedDemo = null;
  }
}