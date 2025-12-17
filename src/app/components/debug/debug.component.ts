import { Component } from '@angular/core';

@Component({
  selector: 'app-debug',
  standalone: true,
  template: `
    <div style="padding: 20px; background: #e8f5e8; border: 2px solid #4caf50; border-radius: 8px;">
      <h1 style="color: #2e7d32; margin: 0 0 10px 0;">🎉 调试组件加载成功！</h1>
      <p style="color: #388e3c; margin: 5px 0;">如果你能看到这个绿色的框，说明路由系统完全正常！</p>
      <p style="color: #388e3c; margin: 5px 0;">当前时间: {{ currentTime }}</p>
      <p style="color: #388e3c; margin: 5px 0;">组件状态: ✅ 正常运行</p>
    </div>
  `
})
export class DebugComponent {
  currentTime = new Date().toLocaleString();

  constructor() {
    console.log('🚀 DebugComponent 已成功加载！');
  }
}