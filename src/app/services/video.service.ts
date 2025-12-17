import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface VideoItem {
  id: number;
  title: string;
  description: string;
  duration: string;
  url: string;
  thumbnailUrl?: string;
  views: string;
  likes: string;
  uploadDate: string;
  quality: string;
  category: string;
  fileSize?: string;
  lastWatched?: Date;
  watchProgress?: number; // 觀看進度 0-100%
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  // 影片數據流
  private videosSubject = new BehaviorSubject<VideoItem[]>([]);
  public videos$ = this.videosSubject.asObservable();

  private readonly videoList: VideoItem[] = [
    {
      id: 1,
      title: '鋒兄的傳奇人生',
      description: '一個關於愛與勇氣的故事，展現了鋒兄平凡卻不平凡的人生歷程。從普通人到傳奇的蛻變過程，充滿了感動與啟發。',
      duration: '15:32',
      url: 'https://pub-c89792336046495e89758a0a802e15c8.r2.dev/angularkiro20251217/19700121-1829-693fee512bec81918cbfd484c6a5ba8f_enx4rsS0.mp4',
      thumbnailUrl: '/images/ChatGPT Image 2025年12月17日 下午01_23_17.png',
      views: '2.5萬',
      likes: '1.8K',
      uploadDate: '2024年12月',
      quality: 'HD',
      category: '人生故事',
      fileSize: '45.2 MB'
    },
    {
      id: 2,
      title: '鋒兄進化Show 🔥',
      description: '鋒兄最新的成長軌跡，展現驚人的進化歷程。從技術提升到人生感悟，每一步都充滿驚喜與成長。',
      duration: '12:45',
      url: 'https://pub-c89792336046495e89758a0a802e15c8.r2.dev/angularkiro20251217/clideo-editor-92eb6755d77b4603a482c25764865a58_7sLjgTgc.mp4',
      thumbnailUrl: '/images/ChatGPT Image 2025年12月17日 下午01_28_57.png',
      views: '1.9萬',
      likes: '1.2K',
      uploadDate: '2024年12月',
      quality: 'HD',
      category: '成長分享',
      fileSize: '38.7 MB'
    }
  ];

  constructor() {
    this.initializeService();
  }

  private initializeService() {
    // 初始化影片數據
    const videos = this.videoList.map(video => ({
      ...video,
      lastWatched: this.getLastWatched(video.id),
      watchProgress: this.getWatchProgress(video.id)
    }));
    
    this.videosSubject.next(videos);
  }



  // 獲取影片流
  getVideos(): Observable<VideoItem[]> {
    return this.videos$;
  }

  // 播放影片
  playVideo(videoId: number): Observable<string> {
    const video = this.videoList.find(v => v.id === videoId);
    if (video) {
      this.updateLastWatched(videoId);
      
      // 添加小延遲以提供更平滑的載入體驗
      return timer(200).pipe(
        map(() => {
          // 確保 URL 有效性
          if (this.isValidVideoUrl(video.url)) {
            return video.url;
          } else {
            throw new Error('無效的影片 URL');
          }
        }),
        catchError(error => {
          console.error('播放影片時發生錯誤:', error);
          return of('');
        })
      );
    }
    
    return of('').pipe(
      catchError(error => {
        console.error('找不到指定的影片:', error);
        return of('');
      })
    );
  }

  // 檢查影片 URL 是否有效
  private isValidVideoUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' && url.includes('.mp4');
    } catch {
      return false;
    }
  }

  // 預載入影片
  preloadVideo(videoId: number): Observable<boolean> {
    const video = this.videoList.find(v => v.id === videoId);
    if (!video) {
      return of(false);
    }

    return new Observable(observer => {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      
      videoElement.onloadedmetadata = () => {
        observer.next(true);
        observer.complete();
      };
      
      videoElement.onerror = () => {
        observer.next(false);
        observer.complete();
      };
      
      videoElement.src = video.url;
    });
  }



  // 更新觀看進度
  updateWatchProgress(videoId: number, progress: number) {
    localStorage.setItem(`watch_progress_${videoId}`, progress.toString());
    
    const videos = this.videosSubject.value.map(video => 
      video.id === videoId ? { ...video, watchProgress: progress } : video
    );
    this.videosSubject.next(videos);
  }

  // 輔助方法
  private getLastWatched(videoId: number): Date | undefined {
    const timestamp = localStorage.getItem(`last_watched_${videoId}`);
    return timestamp ? new Date(parseInt(timestamp)) : undefined;
  }

  private getWatchProgress(videoId: number): number {
    const progress = localStorage.getItem(`watch_progress_${videoId}`);
    return progress ? parseInt(progress) : 0;
  }

  private updateLastWatched(videoId: number) {
    localStorage.setItem(`last_watched_${videoId}`, Date.now().toString());
  }

  private parseViews(viewsStr: string): number {
    const match = viewsStr.match(/(\d+\.?\d*)(萬|,)?/);
    if (!match) return 0;
    
    const num = parseFloat(match[1]);
    return match[2] === '萬' ? num * 10000 : num;
  }
}