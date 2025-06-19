import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryListComponent } from '../../components/category-list/category-list.component';

@Component({
  selector: 'app-category-list-page',
  standalone: true,
  imports: [CommonModule, CategoryListComponent],
  template: `
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
        <p class="mt-2 text-sm text-gray-600">
          Manage your task categories. Create, edit, and organize categories to
          better organize your tasks.
        </p>
      </div>

      <app-category-list></app-category-list>
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
export class CategoryListPageComponent {}
