import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { VideoService, VideoItem } from '../../services/video.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-video-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">影片介紹</h1>
        <p class="text-gray-600">觀看鋒兄影片內容</p>
      </div>

      <!-- 影片網格 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div *ngFor="let video of videos; let i = index" class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
          <!-- 觀看進度指示器 -->
          <div class="absolute top-2 right-2 z-10 flex space-x-2">
            <div *ngIf="video.watchProgress && video.watchProgress > 0" 
                 class="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
              {{ video.watchProgress }}%
            </div>
          </div>

          <!-- 影片播放器或縮圖 -->
          <div class="video-container relative bg-gray-900 h-64">
            <!-- 載入指示器 -->
            <div *ngIf="loadingVideo() === video.id" 
                 class="video-loading">
              <div class="flex flex-col items-center text-white">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-3"></div>
                <p class="text-sm loading-pulse">載入中...</p>
              </div>
            </div>

            <!-- 影片播放器 -->
            <video 
              *ngIf="playingVideo() === video.id"
              [src]="currentVideoUrl() || video.url"
              controls
              autoplay
              (loadstart)="onVideoLoadStart(video.id)"
              (loadeddata)="onVideoLoaded(video.id)"
              (timeupdate)="onTimeUpdate($event, video.id)"
              (error)="onVideoError(video.id)"
              class="w-full h-full object-contain transition-opacity duration-300"
              [class.opacity-0]="loadingVideo() === video.id"
              [class.opacity-100]="loadingVideo() !== video.id">
              您的瀏覽器不支援影片播放。
            </video>
            
            <!-- 縮圖顯示 -->
            <div *ngIf="playingVideo() !== video.id" 
                 class="video-thumbnail relative h-full cursor-pointer"
                 (click)="playVideo(video.id)">
              
              <!-- 背景縮圖 -->
              <img *ngIf="video.thumbnailUrl" 
                   [src]="video.thumbnailUrl" 
                   [alt]="video.title"
                   class="w-full h-full object-cover transition-transform duration-300">
              
              <!-- 漸層背景（如果沒有縮圖） -->
              <div *ngIf="!video.thumbnailUrl"
                   class="bg-gradient-to-br from-blue-500 to-purple-600 h-full transition-all duration-300"></div>
              
              <!-- 覆蓋層 -->
              <div class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-all duration-300 hover:bg-opacity-40">
                <div class="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm transition-all duration-200">
                  {{ video.duration }}
                </div>
                <div class="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold transition-all duration-200">
                  {{ video.quality }}
                </div>
                
                <!-- 播放按鈕 -->
                <button class="play-button w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
                        [class.animate-pulse]="loadingVideo() === video.id">
                  <div class="w-0 h-0 border-l-[24px] border-l-white border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent ml-1"></div>
                </button>
                
                <!-- 觀看進度條 -->
                <div *ngIf="video.watchProgress && video.watchProgress > 0" 
                     class="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                  <div class="h-full bg-red-500 transition-all" 
                       [style.width.%]="video.watchProgress"></div>
                </div>
              </div>
              
              <!-- 影片標題覆蓋 -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 class="text-white font-bold text-lg">{{ video.title }}</h3>
              </div>
            </div>
          </div>
          
          <!-- 影片資訊 -->
          <div class="p-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-xl font-bold text-gray-800">{{ video.title }}</h3>
              <span class="text-sm text-gray-500">{{ video.uploadDate }}</span>
            </div>
            <p class="text-gray-600 text-sm mb-4 leading-relaxed">{{ video.description }}</p>
            
            <!-- 影片統計 -->
            <div class="flex items-center text-sm text-gray-500 mb-4 space-x-4">
              <span class="flex items-center">
                <span class="mr-1">👁️</span>
                {{ video.views }} 次觀看
              </span>
              <span class="flex items-center">
                <span class="mr-1">👍</span>
                {{ video.likes }} 個讚
              </span>
              <span class="flex items-center">
                <span class="mr-1">⏱️</span>
                {{ video.duration }}
              </span>
              <span *ngIf="video.fileSize" class="flex items-center">
                <span class="mr-1">📁</span>
                {{ video.fileSize }}
              </span>
            </div>
            
            <!-- 觀看資訊 -->
            <div class="flex items-center text-xs text-gray-400 mb-4 space-x-4">
              <span *ngIf="video.lastWatched" class="flex items-center">
                <span class="mr-1">🕒</span>
                上次觀看: {{ formatLastWatched(video.lastWatched) }}
              </span>
            </div>
            
            <div class="flex space-x-2">
              <button 
                (click)="playVideo(video.id)"
                [class]="playingVideo() === video.id ? 
                  'flex-1 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center' :
                  'flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center'">
                <span class="mr-2">{{ playingVideo() === video.id ? '⏸️' : '▶️' }}</span>
                {{ playingVideo() === video.id ? '正在播放' : '播放影片' }}
              </button>
              
              <button 
                (click)="downloadVideo(video)"
                class="bg-green-500 text-white py-3 px-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                title="下載影片">
                <span>⬇️</span>
              </button>
              
              <button 
                (click)="shareVideo(video)"
                class="bg-gray-500 text-white py-3 px-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
                title="分享影片">
                <span>🔗</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 影片統計和信息 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm">總影片數</p>
              <p class="text-3xl font-bold">{{ videos.length }}</p>
            </div>
            <div class="text-4xl opacity-80">🎬</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm">總觀看次數</p>
              <p class="text-3xl font-bold">{{ getTotalViews() }}</p>
            </div>
            <div class="text-4xl opacity-80">👁️</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm">總時長</p>
              <p class="text-3xl font-bold">{{ getTotalDuration() }}</p>
            </div>
            <div class="text-4xl opacity-80">⏱️</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100 text-sm">影片分類</p>
              <p class="text-3xl font-bold">{{ getCategories() }}</p>
            </div>
            <div class="text-4xl opacity-80">📂</div>
          </div>
        </div>
      </div>

      <!-- 熱門影片推薦 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span class="mr-2">🔥</span>
          熱門推薦
        </h3>
        <div class="space-y-4">
          <div *ngFor="let hotVideo of hotVideos; let i = index" 
               class="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
               (click)="playVideoFromHot(hotVideo.id)">
            <div class="relative">
              <div class="w-20 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-sm">▶️</span>
              </div>
              <div class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {{ i + 1 }}
              </div>
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-gray-800 mb-1">{{ hotVideo.title }}</h4>
              <p class="text-sm text-gray-500 flex items-center space-x-3">
                <span>👁️ {{ hotVideo.views }} 次觀看</span>
                <span>•</span>
                <span>📅 {{ hotVideo.uploadDate }}</span>
                <span>•</span>
                <span>⏱️ {{ hotVideo.duration }}</span>
              </p>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-400">{{ hotVideo.category }}</div>
              <div class="text-xs text-green-600 font-medium">{{ hotVideo.status }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VideoIntroComponent implements OnInit, OnDestroy {
  playingVideo = signal<number | null>(null);
  loadingVideo = signal<number | null>(null);
  videos: VideoItem[] = [];
  
  private subscriptions: Subscription[] = [];
  currentVideoUrl = signal<string>('');

  constructor(
    private sanitizer: DomSanitizer,
    private videoService: VideoService
  ) {}

  ngOnInit() {
    // 訂閱影片數據
    this.subscriptions.push(
      this.videoService.getVideos().subscribe(videos => {
        this.videos = videos;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // 移除靜態影片數據，改用服務提供

  get hotVideos() {
    // 從現有影片中生成熱門推薦，按觀看次數排序
    return this.videos
      .map(video => ({
        id: video.id,
        title: video.title,
        views: video.views,
        uploadDate: video.uploadDate,
        duration: video.duration,
        category: video.category,
        status: this.getVideoStatus(video)
      }))
      .sort((a, b) => this.parseViews(b.views) - this.parseViews(a.views))
      .slice(0, 5);
  }

  private getVideoStatus(video: VideoItem): string {
    if (video.watchProgress && video.watchProgress > 0) return '觀看中';
    if (video.uploadDate.includes('天前')) return '最新';
    return '推薦';
  }

  private parseViews(viewsStr: string): number {
    const match = viewsStr.match(/(\d+\.?\d*)(萬|,)?/);
    if (!match) return 0;
    
    const num = parseFloat(match[1]);
    return match[2] === '萬' ? num * 10000 : num;
  }

  playVideo(videoId: number) {
    if (this.playingVideo() === videoId) {
      this.playingVideo.set(null);
      this.currentVideoUrl.set('');
      this.loadingVideo.set(null);
    } else {
      // 設置載入狀態
      this.loadingVideo.set(videoId);
      
      // 使用影片服務播放
      this.videoService.playVideo(videoId).subscribe(url => {
        if (url) {
          this.currentVideoUrl.set(url);
          // 延遲設置播放狀態，讓載入動畫有時間顯示
          setTimeout(() => {
            this.playingVideo.set(videoId);
          }, 300);
        } else {
          this.loadingVideo.set(null);
        }
      });
    }
  }

  // 影片播放事件處理
  onVideoLoadStart(videoId: number) {
    this.loadingVideo.set(videoId);
  }

  onVideoLoaded(videoId: number) {
    // 影片載入完成，移除載入狀態
    setTimeout(() => {
      this.loadingVideo.set(null);
    }, 500); // 給一點時間讓過渡動畫完成
  }

  onVideoError(videoId: number) {
    this.loadingVideo.set(null);
    this.playingVideo.set(null);
    alert('影片載入失敗，請稍後再試');
  }

  onTimeUpdate(event: any, videoId: number) {
    const video = event.target;
    if (video.duration > 0) {
      const progress = Math.floor((video.currentTime / video.duration) * 100);
      this.videoService.updateWatchProgress(videoId, progress);
    }
  }

  playVideoFromHot(videoId: number) {
    // 如果熱門列表中的影片在主影片列表中，則播放
    const mainVideo = this.videos.find(v => v.id === videoId);
    if (mainVideo) {
      this.playVideo(videoId);
    } else {
      alert('此影片暫時無法播放，敬請期待！');
    }
  }

  downloadVideo(video: any) {
    const link = document.createElement('a');
    link.href = video.url;
    link.download = `${video.title}.mp4`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  shareVideo(video: any) {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: video.url
      });
    } else {
      // 複製連結到剪貼板
      navigator.clipboard.writeText(video.url).then(() => {
        alert('影片連結已複製到剪貼板！');
      }).catch(() => {
        alert('分享功能暫時無法使用');
      });
    }
  }

  getTotalViews(): string {
    const total = this.videos.reduce((sum, video) => {
      const views = video.views.replace(/[萬,]/g, '');
      const num = parseFloat(views);
      return sum + (video.views.includes('萬') ? num * 10000 : num);
    }, 0);
    
    if (total >= 10000) {
      return (total / 10000).toFixed(1) + '萬';
    }
    return total.toString();
  }

  getTotalDuration(): string {
    const totalMinutes = this.videos.reduce((sum, video) => {
      const [minutes, seconds] = video.duration.split(':').map(Number);
      return sum + minutes + (seconds / 60);
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  getCategories(): number {
    const categories = new Set(this.videos.map(video => video.category));
    return categories.size;
  }

  // 格式化方法
  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return '剛剛';
    if (minutes < 60) return `${minutes}分鐘前`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小時前`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}天前`;
    
    return date.toLocaleDateString('zh-TW');
  }

  formatLastWatched(date?: Date): string {
    if (!date) return '';
    return this.formatTime(date);
  }
}