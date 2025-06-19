import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center" [ngClass]="containerClasses">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
      <span *ngIf="showText" class="ml-2 text-gray-600">{{ text }}</span>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class LoadingSpinnerComponent {
  @Input() text = 'Loading...';
  @Input() showText = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullHeight = false;

  get containerClasses(): string {
    const sizeClasses = {
      sm: 'h-16',
      md: 'h-32',
      lg: 'h-64',
    };

    return `${this.fullHeight ? 'min-h-screen' : sizeClasses[this.size]}`;
  }
}
