import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';

export interface ImageItem {
  name: string;
  path: string;
  type: 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp';
  category: string;
  size?: string;
  uploadDate?: Date;
  lastModified?: Date;
  views?: number;
  isNew?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly imageBasePath = '/images/';
  
  // 實時更新的圖片列表
  private imagesSubject = new BehaviorSubject<ImageItem[]>([]);
  public images$ = this.imagesSubject.asObservable();
  
  // 統計數據的實時更新
  private statsSubject = new BehaviorSubject<any>({});
  public stats$ = this.statsSubject.asObservable();
  
  // 最近更新的圖片
  private recentUpdatesSubject = new BehaviorSubject<ImageItem[]>([]);
  public recentUpdates$ = this.recentUpdatesSubject.asObservable();

  // 基於實際 public/images 目錄中的圖片 - 完整更新版本
  private readonly imageList: ImageItem[] = [
    // JPEG 圖片 - 人像和其他
    { name: '1761405813-e8acecce-a968-4409-a254-d493d54e8c53.jpeg', path: this.imageBasePath + '1761405813-e8acecce-a968-4409-a254-d493d54e8c53.jpeg', type: 'jpeg', category: 'portraits' },
    { name: '1761405863-3ca40781-b24f-4c48-9795-7bc061f58ed6.jpeg', path: this.imageBasePath + '1761405863-3ca40781-b24f-4c48-9795-7bc061f58ed6.jpeg', type: 'jpeg', category: 'portraits' },
    { name: '1761405934-74814b15-9720-44af-a88e-91f4933748c3.jpeg', path: this.imageBasePath + '1761405934-74814b15-9720-44af-a88e-91f4933748c3.jpeg', type: 'jpeg', category: 'portraits' },
    { name: '248adc66-2260-491b-b5a9-91ca01099528.jpeg', path: this.imageBasePath + '248adc66-2260-491b-b5a9-91ca01099528.jpeg', type: 'jpeg', category: 'portraits' },
    { name: '41debbc7-e26c-402d-8d29-7fa1b06441b7.jpeg', path: this.imageBasePath + '41debbc7-e26c-402d-8d29-7fa1b06441b7.jpeg', type: 'jpeg', category: 'portraits' },
    { name: '9ed35a46-9d95-4376-bd47-a267b49a22c0.jpeg', path: this.imageBasePath + '9ed35a46-9d95-4376-bd47-a267b49a22c0.jpeg', type: 'jpeg', category: 'portraits' },
    { name: 'a31b59e0-088a-4d22-991b-a040af3884fa.jpeg', path: this.imageBasePath + 'a31b59e0-088a-4d22-991b-a040af3884fa.jpeg', type: 'jpeg', category: 'portraits' },
    { name: 'ec6a52ef-397a-481d-a1c2-4336dabc2eb5.jpeg', path: this.imageBasePath + 'ec6a52ef-397a-481d-a1c2-4336dabc2eb5.jpeg', type: 'jpeg', category: 'portraits' },
    { name: 'f56a77b4-342b-4624-aaee-0a1eefda1c02.jpeg', path: this.imageBasePath + 'f56a77b4-342b-4624-aaee-0a1eefda1c02.jpeg', type: 'jpeg', category: 'portraits' },
    { name: 'MindVideo_20251031144254_102.jpeg', path: this.imageBasePath + 'MindVideo_20251031144254_102.jpeg', type: 'jpeg', category: 'screenshots' },
    { name: 'MindVideo_20251031135721_991.jpeg', path: this.imageBasePath + 'MindVideo_20251031135721_991.jpeg', type: 'jpeg', category: 'screenshots' },
    { name: 'Screenshot 2025-10-26 at 21-54-22 20251026_2146_01k8gbv2ynecwrezhhpnx3cwg1.jpeg', path: this.imageBasePath + 'Screenshot 2025-10-26 at 21-54-22 20251026_2146_01k8gbv2ynecwrezhhpnx3cwg1.jpeg', type: 'jpeg', category: 'screenshots' },
    { name: 'Screenshot 2025-10-27 at 15-51-27 cf076046-e3a72956.jpeg', path: this.imageBasePath + 'Screenshot 2025-10-27 at 15-51-27 cf076046-e3a72956.jpeg', type: 'jpeg', category: 'screenshots' },
    { name: '下載.jpeg', path: this.imageBasePath + '下載.jpeg', type: 'jpeg', category: 'photos' },
    
    // ChatGPT 生成圖片 - JPEG
    { name: 'ChatGPT Image 2025年10月26日 下午07_21_51.jpeg', path: this.imageBasePath + 'ChatGPT Image 2025年10月26日 下午07_21_51.jpeg', type: 'jpeg', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年10月26日 下午07_37_12.jpeg', path: this.imageBasePath + 'ChatGPT Image 2025年10月26日 下午07_37_12.jpeg', type: 'jpeg', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年10月26日 下午07_44_21.jpeg', path: this.imageBasePath + 'ChatGPT Image 2025年10月26日 下午07_44_21.jpeg', type: 'jpeg', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年10月26日 下午07_45_30.jpeg', path: this.imageBasePath + 'ChatGPT Image 2025年10月26日 下午07_45_30.jpeg', type: 'jpeg', category: 'ai-generated' },
    
    // JPG 圖片
    { name: '20251026_2147_01k8gbv2ynecwrezhhpnx3cwg1.jpg', path: this.imageBasePath + '20251026_2147_01k8gbv2ynecwrezhhpnx3cwg1.jpg', type: 'jpg', category: 'photos' },
    { name: '20251104_134814.jpg', path: this.imageBasePath + '20251104_134814.jpg', type: 'jpg', category: 'photos' },
    { name: '497468912_1266719442124581_4172133962275491585_n.jpg', path: this.imageBasePath + '497468912_1266719442124581_4172133962275491585_n.jpg', type: 'jpg', category: 'photos' },
    { name: '50a2f658-0691-4694-a692-7c53a73c175f.jpg', path: this.imageBasePath + '50a2f658-0691-4694-a692-7c53a73c175f.jpg', type: 'jpg', category: 'photos' },
    { name: '997e6f98-4db2-447c-8ec5-94a3cd2a5d51.jpg', path: this.imageBasePath + '997e6f98-4db2-447c-8ec5-94a3cd2a5d51.jpg', type: 'jpg', category: 'photos' },
    { name: 'ChatGPT Image 2025年10月26日 下午07_21_51.jpg', path: this.imageBasePath + 'ChatGPT Image 2025年10月26日 下午07_21_51.jpg', type: 'jpg', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年12月17日 下午01_23_17.jpg', path: this.imageBasePath + 'ChatGPT Image 2025年12月17日 下午01_23_17.jpg', type: 'jpg', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年12月17日 下午01_23_52.jpg', path: this.imageBasePath + 'ChatGPT Image 2025年12月17日 下午01_23_52.jpg', type: 'jpg', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年12月17日 下午01_28_57.jpg', path: this.imageBasePath + 'ChatGPT Image 2025年12月17日 下午01_28_57.jpg', type: 'jpg', category: 'ai-generated' },
    { name: 'fused_anime_girl.jpg', path: this.imageBasePath + 'fused_anime_girl.jpg', type: 'jpg', category: 'photos' },
    { name: 'Gemini_Generated_Image_nuh27cnuh27cnuh2.jpg', path: this.imageBasePath + 'Gemini_Generated_Image_nuh27cnuh27cnuh2.jpg', type: 'jpg', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_tkl52gtkl52gtkl5.jpg', path: this.imageBasePath + 'Gemini_Generated_Image_tkl52gtkl52gtkl5.jpg', type: 'jpg', category: 'ai-generated' },
    { name: 'Google-logo_1.jpg', path: this.imageBasePath + 'Google-logo_1.jpg', type: 'jpg', category: 'logos' },
    { name: 'IMG_0032.jpg', path: this.imageBasePath + 'IMG_0032.jpg', type: 'jpg', category: 'photos' },
    { name: 'sora2.jpg', path: this.imageBasePath + 'sora2.jpg', type: 'jpg', category: 'photos' },
    { name: 'vusgyIHWqpJtw3gPtWcw1tJrL7TP9rS5vaQpxPMA.jpg', path: this.imageBasePath + 'vusgyIHWqpJtw3gPtWcw1tJrL7TP9rS5vaQpxPMA.jpg', type: 'jpg', category: 'photos' },
    { name: '未命名.jpg', path: this.imageBasePath + '未命名.jpg', type: 'jpg', category: 'photos' },
    
    // MindVideo 截圖 - JPG
    { name: 'MindVideo_20251102002418_494.jpg', path: this.imageBasePath + 'MindVideo_20251102002418_494.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251103222055_221.jpg', path: this.imageBasePath + 'MindVideo_20251103222055_221.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251128135952_420.jpg', path: this.imageBasePath + 'MindVideo_20251128135952_420.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251128184816_627.jpg', path: this.imageBasePath + 'MindVideo_20251128184816_627.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251128190433_123.jpg', path: this.imageBasePath + 'MindVideo_20251128190433_123.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251128190629_343.jpg', path: this.imageBasePath + 'MindVideo_20251128190629_343.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251128191517_115.jpg', path: this.imageBasePath + 'MindVideo_20251128191517_115.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251128192530_578.jpg', path: this.imageBasePath + 'MindVideo_20251128192530_578.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251128192614_247.jpg', path: this.imageBasePath + 'MindVideo_20251128192614_247.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251128192832_701.jpg', path: this.imageBasePath + 'MindVideo_20251128192832_701.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251128201528_755.jpg', path: this.imageBasePath + 'MindVideo_20251128201528_755.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251128201919_973.jpg', path: this.imageBasePath + 'MindVideo_20251128201919_973.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251128203653_134.jpg', path: this.imageBasePath + 'MindVideo_20251128203653_134.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251130234020_916.jpg', path: this.imageBasePath + 'MindVideo_20251130234020_916.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251130234024_006.jpg', path: this.imageBasePath + 'MindVideo_20251130234024_006.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251130234027_358.jpg', path: this.imageBasePath + 'MindVideo_20251130234027_358.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251201142022_041.jpg', path: this.imageBasePath + 'MindVideo_20251201142022_041.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251201142342_193.jpg', path: this.imageBasePath + 'MindVideo_20251201142342_193.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251201142849_689.jpg', path: this.imageBasePath + 'MindVideo_20251201142849_689.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251201143025_845.jpg', path: this.imageBasePath + 'MindVideo_20251201143025_845.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251214022607_748.jpg', path: this.imageBasePath + 'MindVideo_20251214022607_748.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251214022621_261.jpg', path: this.imageBasePath + 'MindVideo_20251214022621_261.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251214022626_786.jpg', path: this.imageBasePath + 'MindVideo_20251214022626_786.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251214023029_609.jpg', path: this.imageBasePath + 'MindVideo_20251214023029_609.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251214154958_840.jpg', path: this.imageBasePath + 'MindVideo_20251214154958_840.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251214155622_165.jpg', path: this.imageBasePath + 'MindVideo_20251214155622_165.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251214173654_109.jpg', path: this.imageBasePath + 'MindVideo_20251214173654_109.jpg', type: 'jpg', category: 'screenshots' },
    { name: 'MindVideo_20251214215708_986.jpg', path: this.imageBasePath + 'MindVideo_20251214215708_986.jpg', type: 'jpg', category: 'screenshots' },
    
    // PNG 圖片 - 各種類型
    { name: '0d5c4921-9c4c-46b8-8266-85d89c053d66.png', path: this.imageBasePath + '0d5c4921-9c4c-46b8-8266-85d89c053d66.png', type: 'png', category: 'portraits' },
    { name: '148bfa68-c7e3-40e6-abaf-0aad1beb7ec1.png', path: this.imageBasePath + '148bfa68-c7e3-40e6-abaf-0aad1beb7ec1.png', type: 'png', category: 'portraits' },
    { name: '20240917_183326-removebg.png', path: this.imageBasePath + '20240917_183326-removebg.png', type: 'png', category: 'photos' },
    { name: '202509_A4_2.png', path: this.imageBasePath + '202509_A4_2.png', type: 'png', category: 'photos' },
    { name: '248adc66-2260-491b-b5a9-91ca01099528 - 複製.png', path: this.imageBasePath + '248adc66-2260-491b-b5a9-91ca01099528 - 複製.png', type: 'png', category: 'portraits' },
    { name: '248adc66-2260-491b-b5a9-91ca01099528.png', path: this.imageBasePath + '248adc66-2260-491b-b5a9-91ca01099528.png', type: 'png', category: 'portraits' },
    { name: '41debbc7-e26c-402d-8d29-7fa1b06441b7.png', path: this.imageBasePath + '41debbc7-e26c-402d-8d29-7fa1b06441b7.png', type: 'png', category: 'portraits' },
    { name: '717994e4-a0a9-4e7b-b8b5-9f12474f4c47--1-.png', path: this.imageBasePath + '717994e4-a0a9-4e7b-b8b5-9f12474f4c47--1-.png', type: 'png', category: 'photos' },
    { name: '9ce3a953-de81-4de5-b375-865f1e12c916.png', path: this.imageBasePath + '9ce3a953-de81-4de5-b375-865f1e12c916.png', type: 'png', category: 'portraits' },
    { name: '9ed35a46-9d95-4376-bd47-a267b49a22c0.png', path: this.imageBasePath + '9ed35a46-9d95-4376-bd47-a267b49a22c0.png', type: 'png', category: 'portraits' },
    { name: 'a31b59e0-088a-4d22-991b-a040af3884fa.png', path: this.imageBasePath + 'a31b59e0-088a-4d22-991b-a040af3884fa.png', type: 'png', category: 'portraits' },
    { name: 'apple-touch-icon.png', path: this.imageBasePath + 'apple-touch-icon.png', type: 'png', category: 'icons' },
    { name: 'BackTshirtBack.png', path: this.imageBasePath + 'BackTshirtBack.png', type: 'png', category: 'photos' },
    { name: 'baseball_bobblehead_man.png', path: this.imageBasePath + 'baseball_bobblehead_man.png', type: 'png', category: 'photos' },
    { name: 'baseball_bobbleheads.png', path: this.imageBasePath + 'baseball_bobbleheads.png', type: 'png', category: 'photos' },
    { name: 'bobblehead_baseball_v2.png', path: this.imageBasePath + 'bobblehead_baseball_v2.png', type: 'png', category: 'photos' },
    { name: 'bobblehead_baseball.png', path: this.imageBasePath + 'bobblehead_baseball.png', type: 'png', category: 'photos' },
    { name: 'bobblehead_packaging.png', path: this.imageBasePath + 'bobblehead_packaging.png', type: 'png', category: 'photos' },
    { name: 'decorated_cookies.png', path: this.imageBasePath + 'decorated_cookies.png', type: 'png', category: 'photos' },
    { name: 'decorated_sugar_cookies.png', path: this.imageBasePath + 'decorated_sugar_cookies.png', type: 'png', category: 'photos' },
    { name: 'DonaldTrump.png', path: this.imageBasePath + 'DonaldTrump.png', type: 'png', category: 'portraits' },
    { name: 'e39bac39-6028-461e-9ab4-8a282d4b747f.png', path: this.imageBasePath + 'e39bac39-6028-461e-9ab4-8a282d4b747f.png', type: 'png', category: 'portraits' },
    { name: 'ec6a52ef-397a-481d-a1c2-4336dabc2eb5.png', path: this.imageBasePath + 'ec6a52ef-397a-481d-a1c2-4336dabc2eb5.png', type: 'png', category: 'portraits' },
    { name: 'f56a77b4-342b-4624-aaee-0a1eefda1c02.png', path: this.imageBasePath + 'f56a77b4-342b-4624-aaee-0a1eefda1c02.png', type: 'png', category: 'portraits' },
    { name: 'generated-image.png', path: this.imageBasePath + 'generated-image.png', type: 'png', category: 'ai-generated' },
    { name: 'qrcode 1111.png', path: this.imageBasePath + 'qrcode 1111.png', type: 'png', category: 'photos' },
    { name: 'Rose.png', path: this.imageBasePath + 'Rose.png', type: 'png', category: 'photos' },
    { name: 'TUSHENDRAW.png', path: this.imageBasePath + 'TUSHENDRAW.png', type: 'png', category: 'photos' },
    { name: 'TUSHENLOSE.png', path: this.imageBasePath + 'TUSHENLOSE.png', type: 'png', category: 'photos' },
    { name: 'TUSHENWIN.png', path: this.imageBasePath + 'TUSHENWIN.png', type: 'png', category: 'photos' },
    { name: '下載.png', path: this.imageBasePath + '下載.png', type: 'png', category: 'photos' },
    { name: '未命名 LiveDoc(1).png', path: this.imageBasePath + '未命名 LiveDoc(1).png', type: 'png', category: 'photos' },
    
    // ChatGPT 生成圖片 - PNG
    { name: 'ChatGPT Image 1111.png', path: this.imageBasePath + 'ChatGPT Image 1111.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年10月26日 下午07_21_51.png', path: this.imageBasePath + 'ChatGPT Image 2025年10月26日 下午07_21_51.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年10月26日 下午07_37_12.png', path: this.imageBasePath + 'ChatGPT Image 2025年10月26日 下午07_37_12.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年10月26日 下午07_44_21.png', path: this.imageBasePath + 'ChatGPT Image 2025年10月26日 下午07_44_21.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年10月26日 下午07_45_30.png', path: this.imageBasePath + 'ChatGPT Image 2025年10月26日 下午07_45_30.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月10日 下午07 07.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月10日 下午07 07.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月10日 下午07_16_53.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月10日 下午07_16_53.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月10日 下午07_17_25.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月10日 下午07_17_25.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月10日 下午07_17_40.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月10日 下午07_17_40.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月10日 下午07_29_43.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月10日 下午07_29_43.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月10日 下午07_29.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月10日 下午07_29.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月10日 下午07_30_01.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月10日 下午07_30_01.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月10日 下午07.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月10日 下午07.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月11日 下午11_44_54.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月11日 下午11_44_54.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月13日 上午02_56_53.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月13日 上午02_56_53.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月13日 下午09_08_37.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月13日 下午09_08_37.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月13日 下午09_10_45.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月13日 下午09_10_45.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月13日 下午09_12_56.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月13日 下午09_12_56.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月13日 下午09_18_36.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月13日 下午09_18_36.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月13日 下午10_19_22.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月13日 下午10_19_22.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月13日 下午10_19_22@.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月13日 下午10_19_22@.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月13日 下午10_19_22@@.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月13日 下午10_19_22@@.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月18日 上午02_25_03.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月18日 上午02_25_03.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月18日 上午02_26_56.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月18日 上午02_26_56.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月18日 上午02_34_43.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月18日 上午02_34_43.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月18日 下午02_00_03.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月18日 下午02_00_03.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月18日 下午02_11_13.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月18日 下午02_11_13.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月23日 下午01_12_43.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月23日 下午01_12_43.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年11月8日 上午02_45_51.png', path: this.imageBasePath + 'ChatGPT Image 2025年11月8日 上午02_45_51.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年12月17日 上午02_19_53.png', path: this.imageBasePath + 'ChatGPT Image 2025年12月17日 上午02_19_53.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年12月17日 上午02_27_06.png', path: this.imageBasePath + 'ChatGPT Image 2025年12月17日 上午02_27_06.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年12月17日 上午02_32_07.png', path: this.imageBasePath + 'ChatGPT Image 2025年12月17日 上午02_32_07.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年12月17日 下午01_23_17.png', path: this.imageBasePath + 'ChatGPT Image 2025年12月17日 下午01_23_17.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年12月17日 下午01_23_52.png', path: this.imageBasePath + 'ChatGPT Image 2025年12月17日 下午01_23_52.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年12月17日 下午01_28_57.png', path: this.imageBasePath + 'ChatGPT Image 2025年12月17日 下午01_28_57.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年12月17日 下午01_37_16.png', path: this.imageBasePath + 'ChatGPT Image 2025年12月17日 下午01_37_16.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年12月17日 下午01_42_49.png', path: this.imageBasePath + 'ChatGPT Image 2025年12月17日 下午01_42_49.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年12月17日 下午01_53_56.png', path: this.imageBasePath + 'ChatGPT Image 2025年12月17日 下午01_53_56.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年12月17日 下午01_54_33.png', path: this.imageBasePath + 'ChatGPT Image 2025年12月17日 下午01_54_33.png', type: 'png', category: 'ai-generated' },
    { name: 'ChatGPT Image 2025年12月17日 下午01_55_06.png', path: this.imageBasePath + 'ChatGPT Image 2025年12月17日 下午01_55_06.png', type: 'png', category: 'ai-generated' },
    
    // Gemini 生成圖片 - PNG
    { name: 'Gemini_Generated_Image_1acyxf1acyxf1acy.png', path: this.imageBasePath + 'Gemini_Generated_Image_1acyxf1acyxf1acy.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_1ek0291ek0291ek0.png', path: this.imageBasePath + 'Gemini_Generated_Image_1ek0291ek0291ek0.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_1ie89v1ie89v1ie8.png', path: this.imageBasePath + 'Gemini_Generated_Image_1ie89v1ie89v1ie8.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_1xs3cf1xs3cf1xs3.png', path: this.imageBasePath + 'Gemini_Generated_Image_1xs3cf1xs3cf1xs3.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_2abcbx2abcbx2abc.png', path: this.imageBasePath + 'Gemini_Generated_Image_2abcbx2abcbx2abc.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_3348083348083348.png', path: this.imageBasePath + 'Gemini_Generated_Image_3348083348083348.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_3kxbcl3kxbcl3kxb.png', path: this.imageBasePath + 'Gemini_Generated_Image_3kxbcl3kxbcl3kxb.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_4iscnp4iscnp4isc.png', path: this.imageBasePath + 'Gemini_Generated_Image_4iscnp4iscnp4isc.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_4mzs34mzs34mzs34.png', path: this.imageBasePath + 'Gemini_Generated_Image_4mzs34mzs34mzs34.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_4p64sz4p64sz4p64.png', path: this.imageBasePath + 'Gemini_Generated_Image_4p64sz4p64sz4p64.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_59omq559omq559om.png', path: this.imageBasePath + 'Gemini_Generated_Image_59omq559omq559om.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_5ecqar5ecqar5ecq.png', path: this.imageBasePath + 'Gemini_Generated_Image_5ecqar5ecqar5ecq.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_5xiatu5xiatu5xia.png', path: this.imageBasePath + 'Gemini_Generated_Image_5xiatu5xiatu5xia.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_6llglt6llglt6llg.png', path: this.imageBasePath + 'Gemini_Generated_Image_6llglt6llglt6llg.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_6ws9t86ws9t86ws9.png', path: this.imageBasePath + 'Gemini_Generated_Image_6ws9t86ws9t86ws9.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_76qn2776qn2776qn.png', path: this.imageBasePath + 'Gemini_Generated_Image_76qn2776qn2776qn.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_76xom476xom476xo.png', path: this.imageBasePath + 'Gemini_Generated_Image_76xom476xom476xo.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_7lf9ua7lf9ua7lf9.png', path: this.imageBasePath + 'Gemini_Generated_Image_7lf9ua7lf9ua7lf9.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_87mfwr87mfwr87mf.png', path: this.imageBasePath + 'Gemini_Generated_Image_87mfwr87mfwr87mf.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_8d9fxe8d9fxe8d9f.png', path: this.imageBasePath + 'Gemini_Generated_Image_8d9fxe8d9fxe8d9f.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_92km0l92km0l92km.png', path: this.imageBasePath + 'Gemini_Generated_Image_92km0l92km0l92km.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_9l1cis9l1cis9l1c.png', path: this.imageBasePath + 'Gemini_Generated_Image_9l1cis9l1cis9l1c.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_a2t3bra2t3bra2t3.png', path: this.imageBasePath + 'Gemini_Generated_Image_a2t3bra2t3bra2t3.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_a5eanqa5eanqa5ea.png', path: this.imageBasePath + 'Gemini_Generated_Image_a5eanqa5eanqa5ea.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_a7lvpba7lvpba7lv.png', path: this.imageBasePath + 'Gemini_Generated_Image_a7lvpba7lvpba7lv.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_a8aa1aa8aa1aa8aa.png', path: this.imageBasePath + 'Gemini_Generated_Image_a8aa1aa8aa1aa8aa.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_a959gfa959gfa959.png', path: this.imageBasePath + 'Gemini_Generated_Image_a959gfa959gfa959.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_asj7abasj7abasj7.png', path: this.imageBasePath + 'Gemini_Generated_Image_asj7abasj7abasj7.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_avufzzavufzzavuf.png', path: this.imageBasePath + 'Gemini_Generated_Image_avufzzavufzzavuf.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_azcmkgazcmkgazcm.png', path: this.imageBasePath + 'Gemini_Generated_Image_azcmkgazcmkgazcm.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_ba5ai3ba5ai3ba5a.png', path: this.imageBasePath + 'Gemini_Generated_Image_ba5ai3ba5ai3ba5a.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_bimsfebimsfebims.png', path: this.imageBasePath + 'Gemini_Generated_Image_bimsfebimsfebims.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_bklr7fbklr7fbklr (1).png', path: this.imageBasePath + 'Gemini_Generated_Image_bklr7fbklr7fbklr (1).png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_bklr7fbklr7fbklr.png', path: this.imageBasePath + 'Gemini_Generated_Image_bklr7fbklr7fbklr.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_bpn9u0bpn9u0bpn9.png', path: this.imageBasePath + 'Gemini_Generated_Image_bpn9u0bpn9u0bpn9.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_br5g4ybr5g4ybr5g.png', path: this.imageBasePath + 'Gemini_Generated_Image_br5g4ybr5g4ybr5g.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_bv9vbfbv9vbfbv9v.png', path: this.imageBasePath + 'Gemini_Generated_Image_bv9vbfbv9vbfbv9v.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_c7gqahc7gqahc7gq.png', path: this.imageBasePath + 'Gemini_Generated_Image_c7gqahc7gqahc7gq.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_cuhb9mcuhb9mcuhb.png', path: this.imageBasePath + 'Gemini_Generated_Image_cuhb9mcuhb9mcuhb.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_cw45hpcw45hpcw45.png', path: this.imageBasePath + 'Gemini_Generated_Image_cw45hpcw45hpcw45.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_d85lksd85lksd85l.png', path: this.imageBasePath + 'Gemini_Generated_Image_d85lksd85lksd85l.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_e8rnr2e8rnr2e8rn.png', path: this.imageBasePath + 'Gemini_Generated_Image_e8rnr2e8rnr2e8rn.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_edhtqwedhtqwedht.png', path: this.imageBasePath + 'Gemini_Generated_Image_edhtqwedhtqwedht.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_empb0tempb0tempb.png', path: this.imageBasePath + 'Gemini_Generated_Image_empb0tempb0tempb.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_f7jzmkf7jzmkf7jz.png', path: this.imageBasePath + 'Gemini_Generated_Image_f7jzmkf7jzmkf7jz.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_fc3atfc3atfc3atf.png', path: this.imageBasePath + 'Gemini_Generated_Image_fc3atfc3atfc3atf.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_fgep3zfgep3zfgep.png', path: this.imageBasePath + 'Gemini_Generated_Image_fgep3zfgep3zfgep.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_fhubnbfhubnbfhub.png', path: this.imageBasePath + 'Gemini_Generated_Image_fhubnbfhubnbfhub.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_fmz6y8fmz6y8fmz6.png', path: this.imageBasePath + 'Gemini_Generated_Image_fmz6y8fmz6y8fmz6.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_fu20bbfu20bbfu20.png', path: this.imageBasePath + 'Gemini_Generated_Image_fu20bbfu20bbfu20.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_fwk02vfwk02vfwk0.png', path: this.imageBasePath + 'Gemini_Generated_Image_fwk02vfwk02vfwk0.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_gb7e0tgb7e0tgb7e.png', path: this.imageBasePath + 'Gemini_Generated_Image_gb7e0tgb7e0tgb7e.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_gfe9z0gfe9z0gfe9---.png', path: this.imageBasePath + 'Gemini_Generated_Image_gfe9z0gfe9z0gfe9---.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_gfe9z0gfe9z0gfe9.png', path: this.imageBasePath + 'Gemini_Generated_Image_gfe9z0gfe9z0gfe9.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_grs13tgrs13tgrs1.png', path: this.imageBasePath + 'Gemini_Generated_Image_grs13tgrs13tgrs1.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_gtut1tgtut1tgtut.png', path: this.imageBasePath + 'Gemini_Generated_Image_gtut1tgtut1tgtut.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_gy79kugy79kugy79.png', path: this.imageBasePath + 'Gemini_Generated_Image_gy79kugy79kugy79.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_hjm73whjm73whjm7.png', path: this.imageBasePath + 'Gemini_Generated_Image_hjm73whjm73whjm7.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_hzfcqjhzfcqjhzfc.png', path: this.imageBasePath + 'Gemini_Generated_Image_hzfcqjhzfcqjhzfc.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_ibptnlibptnlibpt.png', path: this.imageBasePath + 'Gemini_Generated_Image_ibptnlibptnlibpt.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_ibptnlibptnlibpt(1).png', path: this.imageBasePath + 'Gemini_Generated_Image_ibptnlibptnlibpt(1).png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_jc0z4ojc0z4ojc0z.png', path: this.imageBasePath + 'Gemini_Generated_Image_jc0z4ojc0z4ojc0z.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_jda9w5jda9w5jda9.png', path: this.imageBasePath + 'Gemini_Generated_Image_jda9w5jda9w5jda9.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_jvfd9jvfd9jvfd9j.png', path: this.imageBasePath + 'Gemini_Generated_Image_jvfd9jvfd9jvfd9j.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_k4o1odk4o1odk4o1.png', path: this.imageBasePath + 'Gemini_Generated_Image_k4o1odk4o1odk4o1.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_kzhm4pkzhm4pkzhm.png', path: this.imageBasePath + 'Gemini_Generated_Image_kzhm4pkzhm4pkzhm.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_lj5592lj5592lj55.png', path: this.imageBasePath + 'Gemini_Generated_Image_lj5592lj5592lj55.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_loxacmloxacmloxa.png', path: this.imageBasePath + 'Gemini_Generated_Image_loxacmloxacmloxa.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_lp2kkflp2kkflp2k.png', path: this.imageBasePath + 'Gemini_Generated_Image_lp2kkflp2kkflp2k.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_lsa24nlsa24nlsa2.png', path: this.imageBasePath + 'Gemini_Generated_Image_lsa24nlsa24nlsa2.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_m5qxeqm5qxeqm5qx.png', path: this.imageBasePath + 'Gemini_Generated_Image_m5qxeqm5qxeqm5qx.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_mc2mnmmc2mnmmc2m.png', path: this.imageBasePath + 'Gemini_Generated_Image_mc2mnmmc2mnmmc2m.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_mc90rjmc90rjmc90.png', path: this.imageBasePath + 'Gemini_Generated_Image_mc90rjmc90rjmc90.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_mtbkvmmtbkvmmtbk.png', path: this.imageBasePath + 'Gemini_Generated_Image_mtbkvmmtbkvmmtbk.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_n016vun016vun016.png', path: this.imageBasePath + 'Gemini_Generated_Image_n016vun016vun016.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_n4tgkhn4tgkhn4tg.png', path: this.imageBasePath + 'Gemini_Generated_Image_n4tgkhn4tgkhn4tg.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_n9xibgn9xibgn9xi.png', path: this.imageBasePath + 'Gemini_Generated_Image_n9xibgn9xibgn9xi.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_nbk2atnbk2atnbk2.png', path: this.imageBasePath + 'Gemini_Generated_Image_nbk2atnbk2atnbk2.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_nk0e50nk0e50nk0e.png', path: this.imageBasePath + 'Gemini_Generated_Image_nk0e50nk0e50nk0e.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_no8fxsno8fxsno8f.png', path: this.imageBasePath + 'Gemini_Generated_Image_no8fxsno8fxsno8f.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_nwxi0wnwxi0wnwxi.png', path: this.imageBasePath + 'Gemini_Generated_Image_nwxi0wnwxi0wnwxi.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_olove3olove3olov.png', path: this.imageBasePath + 'Gemini_Generated_Image_olove3olove3olov.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_p8s78p8s78p8s78p.png', path: this.imageBasePath + 'Gemini_Generated_Image_p8s78p8s78p8s78p.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_pit60tpit60tpit6.png', path: this.imageBasePath + 'Gemini_Generated_Image_pit60tpit60tpit6.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_pv4knpv4knpv4knp.png', path: this.imageBasePath + 'Gemini_Generated_Image_pv4knpv4knpv4knp.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_qaj78vqaj78vqaj7.png', path: this.imageBasePath + 'Gemini_Generated_Image_qaj78vqaj78vqaj7.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_qokrlrqokrlrqokr.png', path: this.imageBasePath + 'Gemini_Generated_Image_qokrlrqokrlrqokr.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_qxjt55qxjt55qxjt.png', path: this.imageBasePath + 'Gemini_Generated_Image_qxjt55qxjt55qxjt.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_rgylkergylkergyl.png', path: this.imageBasePath + 'Gemini_Generated_Image_rgylkergylkergyl.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_rui06frui06frui0.png', path: this.imageBasePath + 'Gemini_Generated_Image_rui06frui06frui0.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_swpahnswpahnswpa.png', path: this.imageBasePath + 'Gemini_Generated_Image_swpahnswpahnswpa.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_tmwcxttmwcxttmwc.png', path: this.imageBasePath + 'Gemini_Generated_Image_tmwcxttmwcxttmwc.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_tof53vtof53vtof5.png', path: this.imageBasePath + 'Gemini_Generated_Image_tof53vtof53vtof5.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_ttw5mnttw5mnttw5.png', path: this.imageBasePath + 'Gemini_Generated_Image_ttw5mnttw5mnttw5.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_u13e4ju13e4ju13e.png', path: this.imageBasePath + 'Gemini_Generated_Image_u13e4ju13e4ju13e.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_u9et5zu9et5zu9et.png', path: this.imageBasePath + 'Gemini_Generated_Image_u9et5zu9et5zu9et.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_ubxh3kubxh3kubxh.png', path: this.imageBasePath + 'Gemini_Generated_Image_ubxh3kubxh3kubxh.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_umfn1iumfn1iumfn.png', path: this.imageBasePath + 'Gemini_Generated_Image_umfn1iumfn1iumfn.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_urahmhurahmhurah.png', path: this.imageBasePath + 'Gemini_Generated_Image_urahmhurahmhurah.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_vktfevvktfevvktf.png', path: this.imageBasePath + 'Gemini_Generated_Image_vktfevvktfevvktf.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_vs9orcvs9orcvs9o.png', path: this.imageBasePath + 'Gemini_Generated_Image_vs9orcvs9orcvs9o.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_vwwco7vwwco7vwwc.png', path: this.imageBasePath + 'Gemini_Generated_Image_vwwco7vwwco7vwwc.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_wh22sfwh22sfwh22.png', path: this.imageBasePath + 'Gemini_Generated_Image_wh22sfwh22sfwh22.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_wqjmfpwqjmfpwqjm.png', path: this.imageBasePath + 'Gemini_Generated_Image_wqjmfpwqjmfpwqjm.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_x0tu6lx0tu6lx0tu.png', path: this.imageBasePath + 'Gemini_Generated_Image_x0tu6lx0tu6lx0tu.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_xcac14xcac14xcac.png', path: this.imageBasePath + 'Gemini_Generated_Image_xcac14xcac14xcac.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_xfh0ydxfh0ydxfh0.png', path: this.imageBasePath + 'Gemini_Generated_Image_xfh0ydxfh0ydxfh0.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_yjs1qgyjs1qgyjs1.png', path: this.imageBasePath + 'Gemini_Generated_Image_yjs1qgyjs1qgyjs1.png', type: 'png', category: 'ai-generated' },
    { name: 'Gemini_Generated_Image_zgk4hazgk4hazgk4.png', path: this.imageBasePath + 'Gemini_Generated_Image_zgk4hazgk4hazgk4.png', type: 'png', category: 'ai-generated' },
    
    // MindVideo 截圖 - PNG
    { name: 'MindVideo_20251031135721_991.png', path: this.imageBasePath + 'MindVideo_20251031135721_991.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251031135958_772.png', path: this.imageBasePath + 'MindVideo_20251031135958_772.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251031142300_113.png', path: this.imageBasePath + 'MindVideo_20251031142300_113.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251031142302_604.png', path: this.imageBasePath + 'MindVideo_20251031142302_604.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251031144254_102.png', path: this.imageBasePath + 'MindVideo_20251031144254_102.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251031144327_929.png', path: this.imageBasePath + 'MindVideo_20251031144327_929.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251121165401_394.png', path: this.imageBasePath + 'MindVideo_20251121165401_394.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251121165458_145.png', path: this.imageBasePath + 'MindVideo_20251121165458_145.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251121165634_973.png', path: this.imageBasePath + 'MindVideo_20251121165634_973.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251128014518_331.png', path: this.imageBasePath + 'MindVideo_20251128014518_331.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251128020143_231.png', path: this.imageBasePath + 'MindVideo_20251128020143_231.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251203161741_185.png', path: this.imageBasePath + 'MindVideo_20251203161741_185.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251203161758_843.png', path: this.imageBasePath + 'MindVideo_20251203161758_843.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251212222832_232.png', path: this.imageBasePath + 'MindVideo_20251212222832_232.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251212234638_377.png', path: this.imageBasePath + 'MindVideo_20251212234638_377.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251213234447_658.png', path: this.imageBasePath + 'MindVideo_20251213234447_658.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251213234837_068.png', path: this.imageBasePath + 'MindVideo_20251213234837_068.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251214000504_043.png', path: this.imageBasePath + 'MindVideo_20251214000504_043.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251214000745_021.png', path: this.imageBasePath + 'MindVideo_20251214000745_021.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251214005054_215.png', path: this.imageBasePath + 'MindVideo_20251214005054_215.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251214005938_685.png', path: this.imageBasePath + 'MindVideo_20251214005938_685.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251214013030_085.png', path: this.imageBasePath + 'MindVideo_20251214013030_085.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251214013903_125.png', path: this.imageBasePath + 'MindVideo_20251214013903_125.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251214023235_623---.png', path: this.imageBasePath + 'MindVideo_20251214023235_623---.png', type: 'png', category: 'screenshots' },
    { name: 'MindVideo_20251214023235_623.png', path: this.imageBasePath + 'MindVideo_20251214023235_623.png', type: 'png', category: 'screenshots' },
    
    // 其他截圖
    { name: 'Screenshot 2025-10-26 at 21-54-22 20251026_2146_01k8gbv2ynecwrezhhpnx3cwg1.mp4.png', path: this.imageBasePath + 'Screenshot 2025-10-26 at 21-54-22 20251026_2146_01k8gbv2ynecwrezhhpnx3cwg1.mp4.png', type: 'png', category: 'screenshots' },
    { name: 'Screenshot 2025-10-27 at 15-51-27 cf076046-e3a72956.mp4.png', path: this.imageBasePath + 'Screenshot 2025-10-27 at 15-51-27 cf076046-e3a72956.mp4.png', type: 'png', category: 'screenshots' },
    { name: 'Screenshot 2025-11-15 at 18-31-56 Sora.png', path: this.imageBasePath + 'Screenshot 2025-11-15 at 18-31-56 Sora.png', type: 'png', category: 'screenshots' },
    { name: 'Screenshot 2025-11-15 at 18-37-15 Sora.png', path: this.imageBasePath + 'Screenshot 2025-11-15 at 18-37-15 Sora.png', type: 'png', category: 'screenshots' },
    { name: 'Screenshot 2025-12-02 at 19-00-34 『野良猫ハート』羽雁家Cover【ノラとと】 - YouTube.png', path: this.imageBasePath + 'Screenshot 2025-12-02 at 19-00-34 『野良猫ハート』羽雁家Cover【ノラとと】 - YouTube.png', type: 'png', category: 'screenshots' },
    { name: 'Screenshot 2025-12-03 at 13-48-02 DANZEN!ふたりはプリキュア (ver.MaxHeart) -Cover- 成人男性三人組 - YouTube.png', path: this.imageBasePath + 'Screenshot 2025-12-03 at 13-48-02 DANZEN!ふたりはプリキュア (ver.MaxHeart) -Cover- 成人男性三人組 - YouTube.png', type: 'png', category: 'screenshots' },
    { name: 'Screenshot 2025-12-03 at 16-11-51 さらば碧き面影 - YouTube.png', path: this.imageBasePath + 'Screenshot 2025-12-03 at 16-11-51 さらば碧き面影 - YouTube.png', type: 'png', category: 'screenshots' },
    { name: 'Screenshot 2025-12-05 at 00-22-42 .png', path: this.imageBasePath + 'Screenshot 2025-12-05 at 00-22-42 .png', type: 'png', category: 'screenshots' }
  ];

  constructor() {
    // 初始化數據
    this.updateImageData();
    
    // 每30秒檢查一次更新（模擬實時更新）
    interval(30000).subscribe(() => {
      this.checkForUpdates();
    });
  }

  private updateImageData() {
    // 為每個圖片添加時間戳和其他元數據
    const imagesWithMetadata = this.imageList.map(img => ({
      ...img,
      uploadDate: this.generateUploadDate(img.name),
      size: this.generateFileSize(),
      lastModified: new Date(),
      views: Math.floor(Math.random() * 1000),
      isNew: this.isRecentImage(img.name)
    }));
    
    this.imagesSubject.next(imagesWithMetadata);
    this.updateStats(imagesWithMetadata);
  }

  private generateUploadDate(filename: string): Date {
    // 根據檔名生成合理的上傳日期
    if (filename.includes('2025年12月17日') || filename.includes('20251217')) return new Date('2025-12-17');
    if (filename.includes('20251214')) return new Date('2025-12-14');
    if (filename.includes('20251212')) return new Date('2025-12-12');
    if (filename.includes('20251203')) return new Date('2025-12-03');
    if (filename.includes('20251201')) return new Date('2025-12-01');
    if (filename.includes('20251130')) return new Date('2025-11-30');
    if (filename.includes('20251128')) return new Date('2025-11-28');
    if (filename.includes('20251121')) return new Date('2025-11-21');
    if (filename.includes('2025年11月')) return new Date('2025-11-10');
    if (filename.includes('20251031')) return new Date('2025-10-31');
    if (filename.includes('2025年10月')) return new Date('2025-10-26');
    if (filename.includes('2025年12月')) return new Date('2025-12-01');
    
    // 默認為最近幾天的隨機日期
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  }

  private generateFileSize(): string {
    const sizes = ['1.2 MB', '2.5 MB', '856 KB', '3.1 MB', '1.8 MB', '945 KB', '2.2 MB'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  private isRecentImage(filename: string): boolean {
    // 標記最近的圖片為新圖片 - 包含12月17日的最新圖片
    return filename.includes('20251217') || filename.includes('2025年12月17日') || 
           filename.includes('20251214') || filename.includes('20251212');
  }

  private updateStats(images: ImageItem[]) {
    const stats = {
      total: images.length,
      jpgCount: images.filter(img => img.type === 'jpg' || img.type === 'jpeg').length,
      pngCount: images.filter(img => img.type === 'png').length,
      categories: this.getCategories().length,
      categoryBreakdown: this.getCategories().map(cat => ({
        name: cat,
        count: this.getImagesByCategory(cat).length
      })),
      totalViews: images.reduce((sum, img) => sum + (img.views || 0), 0),
      newImages: images.filter(img => img.isNew).length,
      lastUpdate: new Date()
    };
    
    this.statsSubject.next(stats);
  }

  private checkForUpdates() {
    // 模擬新圖片的添加或更新
    const currentImages = this.imagesSubject.value;
    const shouldUpdate = Math.random() > 0.7; // 30% 機率有更新
    
    if (shouldUpdate) {
      // 模擬圖片瀏覽次數的增加
      const updatedImages = currentImages.map(img => ({
        ...img,
        views: (img.views || 0) + Math.floor(Math.random() * 5),
        lastModified: new Date()
      }));
      
      // 隨機選擇一些圖片作為最近更新
      const recentlyUpdated = updatedImages
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      this.imagesSubject.next(updatedImages);
      this.recentUpdatesSubject.next(recentlyUpdated);
      this.updateStats(updatedImages);
      
      console.log('圖片數據已更新', new Date().toLocaleTimeString());
    }
  }

  getAllImages(): ImageItem[] {
    return this.imagesSubject.value;
  }

  // 新增方法：獲取實時圖片流
  getImagesStream(): Observable<ImageItem[]> {
    return this.images$;
  }

  // 新增方法：獲取實時統計流
  getStatsStream(): Observable<any> {
    return this.stats$;
  }

  // 新增方法：獲取最近更新流
  getRecentUpdatesStream(): Observable<ImageItem[]> {
    return this.recentUpdates$;
  }

  // 新增方法：添加新圖片
  addImage(image: Omit<ImageItem, 'uploadDate' | 'size' | 'lastModified' | 'views' | 'isNew'>): void {
    const newImage: ImageItem = {
      ...image,
      uploadDate: new Date(),
      size: this.generateFileSize(),
      lastModified: new Date(),
      views: 0,
      isNew: true
    };
    
    const currentImages = this.imagesSubject.value;
    const updatedImages = [newImage, ...currentImages];
    
    this.imagesSubject.next(updatedImages);
    this.updateStats(updatedImages);
    this.recentUpdatesSubject.next([newImage]);
  }

  // 新增方法：刷新圖片列表（模擬掃描目錄）
  refreshImageList(): void {
    console.log('正在刷新圖片列表...');
    // 在實際應用中，這裡會調用 API 來掃描 public/images 目錄
    // 目前使用靜態列表，但會重新計算元數據
    this.updateImageData();
    console.log('圖片列表已刷新');
  }

  // 新增方法：獲取最新圖片（最近7天）
  getRecentImages(days: number = 7): ImageItem[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.imagesSubject.value.filter(img => 
      img.uploadDate && img.uploadDate >= cutoffDate
    ).sort((a, b) => 
      (b.uploadDate?.getTime() || 0) - (a.uploadDate?.getTime() || 0)
    );
  }

  // 新增方法：按關鍵字搜索圖片
  searchImages(keyword: string): ImageItem[] {
    if (!keyword.trim()) return this.imagesSubject.value;
    
    const searchTerm = keyword.toLowerCase();
    return this.imagesSubject.value.filter(img =>
      img.name.toLowerCase().includes(searchTerm) ||
      img.category.toLowerCase().includes(searchTerm)
    );
  }

  // 新增方法：刪除圖片
  deleteImage(imageName: string): void {
    const currentImages = this.imagesSubject.value;
    const updatedImages = currentImages.filter(img => img.name !== imageName);
    
    this.imagesSubject.next(updatedImages);
    this.updateStats(updatedImages);
  }

  getImagesByCategory(category: string): ImageItem[] {
    return this.imageList.filter(image => image.category === category);
  }

  getImagesByType(type: string): ImageItem[] {
    return this.imageList.filter(image => image.type === type);
  }

  getCategories(): string[] {
    const categories = [...new Set(this.imageList.map(image => image.category))];
    return categories;
  }

  getImageStats() {
    const total = this.imageList.length;
    const jpgCount = this.imageList.filter(img => img.type === 'jpg' || img.type === 'jpeg').length;
    const pngCount = this.imageList.filter(img => img.type === 'png').length;
    const categories = this.getCategories();

    return {
      total,
      jpgCount,
      pngCount,
      categories: categories.length,
      categoryBreakdown: categories.map(cat => ({
        name: cat,
        count: this.getImagesByCategory(cat).length
      }))
    };
  }
}