import { Component, signal } from '@angular/core';
import { ResponsiveLayoutComponent } from './components/responsive-layout/responsive-layout.component';

@Component({
  selector: 'app-root',
  imports: [ResponsiveLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('鋒兄AI管理系統');
}
