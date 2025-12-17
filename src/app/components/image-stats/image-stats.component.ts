import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImageService, ImageItem } from '../../services/image.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-image-stats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">圖片庫統計</h3>
        <div class="flex items-center text-sm text-gray-500">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
          實時更新
        </div>
      </div>

      <div *ngIf="loading" class="text-center py-4 text-gray-500">
        載入中...
      </div>

      <div *ngIf="!loading">
        <!-- 主要統計 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ stats.total || 0 }}</div>
            <div class="text-sm text-gray-600">總圖片數</div>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ stats.totalViews || 0 | number }}</div>
            <div class="text-sm text-gray-600">總瀏覽次數</div>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">{{ stats.categories || 0 }}</div>
            <div class="text-sm text-gray-600">分類數量</div>
          </div>
          <div class="text-center p-4 bg-orange-50 rounded-lg">
            <div class="text-2xl font-bold text-orange-600">{{ stats.newImages || 0 }}</div>
            <div class="text-sm text-gray-600">新增圖片</div>
          </div>
        </div>

        <!-- 格式分布 -->
        <div class="mb-6">
          <h4 class="text-md font-semibold text-gray-700 mb-3">格式分布</h4>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">JPG/JPEG</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div class="bg-blue-500 h-2 rounded-full" 
                       [style.width.%]="getPercentage(stats.jpgCount, stats.total)"></div>
                </div>
                <span class="text-sm font-medium">{{ stats.jpgCount || 0 }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">PNG</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div class="bg-green-500 h-2 rounded-full" 
                       [style.width.%]="getPercentage(stats.pngCount, stats.total)"></div>
                </div>
                <span class="text-sm font-medium">{{ stats.pngCount || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 最近活動 -->
        <div class="mb-6">
          <h4 class="text-md font-semibold text-gray-700 mb-3">最近活動</h4>
          <div class="space-y-2">
            <div *ngFor="let update of recentUpdates.slice(0, 3)" 
                 class="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-xs">🖼️</span>
                </div>
                <div>
                  <div class="text-sm font-medium">{{ getShortName(update.name) }}</div>
                  <div class="text-xs text-gray-500">{{ update.category }}</div>
                </div>
              </div>
              <div class="text-xs text-gray-500">
                {{ getTimeAgo(update.lastModified) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 分類統計 -->
        <div class="mb-6">
          <h4 class="text-md font-semibold text-gray-700 mb-3">熱門分類</h4>
          <div class="space-y-2">
            <div *ngFor="let category of getTopCategories()" 
                 class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="mr-2">{{ getCategoryIcon(category.name) }}</span>
                <span class="text-sm text-gray-600">{{ getCategoryName(category.name) }}</span>
              </div>
              <span class="text-sm font-medium">{{ category.count }}</span>
            </div>
          </div>
        </div>

        <!-- 快速操作 -->
        <div class="border-t pt-4">
          <div class="flex space-x-2">
            <a routerLink="/gallery" 
               class="flex-1 bg-blue-500 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm">
              查看圖片庫
            </a>
            <button 
              (click)="refreshStats()"
              class="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm">
              🔄
            </button>
          </div>
        </div>

        <!-- 更新時間 -->
        <div class="text-center mt-4 text-xs text-gray-500">
          最後更新: {{ stats.lastUpdate | date:'HH:mm:ss' }}
        </div>
      </div>
    </div>
  `
})
export class ImageStatsComponent implements OnInit, OnDestroy {
  stats: any = {};
  recentUpdates: ImageItem[] = [];
  loading = false;
  
  private subscriptions: Subscription[] = [];

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.loading = true;
    
    // 訂閱實時統計更新
    this.subscriptions.push(
      this.imageService.getStatsStream().subscribe(stats => {
        this.stats = stats;
        this.loading = false;
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
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getPercentage(value: number, total: number): number {
    return total > 0 ? (value / total) * 100 : 0;
  }

  getShortName(name: string): string {
    if (name.length > 15) {
      return name.substring(0, 12) + '...';
    }
    return name;
  }

  getTimeAgo(date: Date | undefined): string {
    if (!date) return '未知';
    
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return '剛剛';
    if (minutes < 60) return `${minutes}分鐘前`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小時前`;
    
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  }

  getTopCategories() {
    if (!this.stats.categoryBreakdown) return [];
    return this.stats.categoryBreakdown
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);
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

  refreshStats() {
    this.loading = true;
    // 觸發手動刷新
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}