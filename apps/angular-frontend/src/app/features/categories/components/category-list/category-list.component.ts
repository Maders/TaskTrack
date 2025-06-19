import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Category } from '../../../../shared/models/category.model';
import { Task } from '../../../../shared/models/task.model';
import { CategoryService } from '../../../../core/services/category.service';
import { TaskService } from '../../../../core/services/task.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow rounded-lg">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900">Categories</h2>
          <button
            (click)="createCategory()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg
              class="-ml-1 mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Category
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="p-6">
        <div class="flex items-center justify-center">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
          <span class="ml-2 text-gray-600">Loading categories...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading() && categories().length === 0" class="p-6">
        <div class="text-center py-12">
          <div class="mx-auto h-12 w-12 text-gray-400">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            No categories found
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by creating your first category.
          </p>
          <div class="mt-6">
            <button
              (click)="createCategory()"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Category
            </button>
          </div>
        </div>
      </div>

      <!-- Categories List -->
      <div
        *ngIf="!loading() && categories().length > 0"
        class="divide-y divide-gray-200"
      >
        <div
          *ngFor="let category of categories()"
          class="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3">
                <h3 class="text-sm font-medium text-gray-900 truncate">
                  {{ category.title }}
                </h3>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ getTaskCount(category.id) }} tasks
                </span>
              </div>
              <p
                *ngIf="category.description"
                class="mt-1 text-sm text-gray-500 truncate"
              >
                {{ category.description }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <button
                (click)="viewCategoryTasks(category.id)"
                class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Tasks
              </button>
              <button
                (click)="editCategory(category.id)"
                class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit
              </button>
              <button
                (click)="deleteCategory(category.id)"
                class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
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
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private taskService = inject(TaskService);
  private router = inject(Router);

  // Signals
  loading = signal(false);
  categories = signal<Category[]>([]);
  tasks = signal<Task[]>([]);

  constructor() {
    // Set up effect to reload categories when tasks change
    effect(() => {
      this.loadCategories();
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadCategories(): void {
    this.loading.set(true);
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading.set(false);
      },
    });
  }

  private loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (result) => {
        this.tasks.set(result.tasks);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      },
    });
  }

  getTaskCount(categoryId: string): number {
    return this.tasks().filter((task) => task.categoryId === categoryId).length;
  }

  createCategory(): void {
    this.router.navigate(['/categories/create']);
  }

  editCategory(id: string): void {
    this.router.navigate(['/categories/edit', id]);
  }

  deleteCategory(id: string): void {
    if (
      confirm(
        'Are you sure you want to delete this category? This will also remove the category from all associated tasks.'
      )
    ) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Failed to delete category');
        },
      });
    }
  }

  viewCategoryTasks(categoryId: string): void {
    this.router.navigate(['/tasks'], { queryParams: { categoryId } });
  }
}
