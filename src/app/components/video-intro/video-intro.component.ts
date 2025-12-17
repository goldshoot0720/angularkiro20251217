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

      <!-- 簡化的影片列表 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div *ngFor="let video of videos" class="bg-white rounded-lg shadow-lg overflow-hidden">
          
          <!-- 簡化的影片播放區域 -->
          <div class="relative bg-gray-900 aspect-video">
            <!-- 影片播放器 -->
            <video 
              *ngIf="playingVideo() === video.id"
              [src]="video.url"
              controls
              class="w-full h-full object-contain">
              您的瀏覽器不支援影片播放。
            </video>
            
            <!-- 縮圖顯示 -->
            <div *ngIf="playingVideo() !== video.id" 
                 class="w-full h-full cursor-pointer flex items-center justify-center"
                 (click)="playVideo(video.id)">
              
              <!-- 背景 -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
              
              <!-- 播放按鈕 -->
              <button class="relative z-10 w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                <div class="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
              </button>
              
              <!-- 影片標題 -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 class="text-white font-bold">{{ video.title }}</h3>
              </div>
            </div>
          </div>
          
          <!-- 簡化的影片資訊 -->
          <div class="p-4">
            <h3 class="text-lg font-bold text-gray-800 mb-2">{{ video.title }}</h3>
            <p class="text-gray-600 text-sm mb-3">{{ video.description }}</p>
            
            <!-- 基本統計 -->
            <div class="flex items-center text-sm text-gray-500 mb-4 space-x-4">
              <span>👁️ {{ video.views }}</span>
              <span>⏱️ {{ video.duration }}</span>
              <span>📅 {{ video.uploadDate }}</span>
            </div>
            
            <!-- 播放按鈕 -->
            <button 
              (click)="playVideo(video.id)"
              [class]="playingVideo() === video.id ? 
                'w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors' :
                'w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors'">
              {{ playingVideo() === video.id ? '⏸️ 停止播放' : '▶️ 播放影片' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VideoIntroComponent implements OnInit, OnDestroy {
  playingVideo = signal<number | null>(null);
  videos: VideoItem[] = [];
  
  private subscriptions: Subscription[] = [];

  constructor(private videoService: VideoService) {}

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

  playVideo(videoId: number) {
    if (this.playingVideo() === videoId) {
      // 停止播放
      this.playingVideo.set(null);
    } else {
      // 開始播放
      this.playingVideo.set(videoId);
    }
  }
}