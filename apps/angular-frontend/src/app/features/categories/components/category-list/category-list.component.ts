import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Category } from '../../../../shared/models/category.model';
import { Task } from '../../../../shared/models/task.model';
import {
  CategoryService,
  CategoryFilters,
  CategorySorting,
  CategoryPagination,
} from '../../../../core/services/category.service';
import { TaskService } from '../../../../core/services/task.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white shadow rounded-lg">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900">Categories</h2>
          <button
            (click)="createCategory()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              class="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            New Category
          </button>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <label for="search" class="sr-only">Search categories</label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                id="search"
                type="text"
                [(ngModel)]="searchTerm"
                (input)="onSearchChange()"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search categories..."
              />
            </div>
          </div>

          <!-- Sort -->
          <div class="flex gap-2">
            <select
              [(ngModel)]="sortBy"
              (change)="onSortChange()"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="title">Title</option>
              <option value="createdAt">Created Date</option>
            </select>
            <button
              (click)="toggleSortOrder()"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                *ngIf="sortOrder() === 'asc'"
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                ></path>
              </svg>
              <svg
                *ngIf="sortOrder() === 'desc'"
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="px-6 py-8">
        <div class="flex justify-center">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading() && categories().length === 0" class="px-6 py-8">
        <div class="text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            ></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            No categories found
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by creating a new category.
          </p>
          <div class="mt-6">
            <button
              (click)="createCategory()"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                class="h-4 w-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              New Category
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
              <p class="mt-1 text-xs text-gray-400">
                Created {{ category.createdAt | date : 'mediumDate' }}
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
                (click)="editCategory(category)"
                class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit
              </button>
              <button
                (click)="deleteCategory(category)"
                class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        *ngIf="!loading() && categories().length > 0"
        class="px-6 py-4 border-t border-gray-200 bg-gray-50"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ paginationInfo().startIndex + 1 }} to
            {{ paginationInfo().endIndex }} of
            {{ paginationInfo().total }} results
          </div>
          <div class="flex items-center space-x-2">
            <button
              (click)="previousPage()"
              [disabled]="currentPage() <= 1"
              class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700">
              Page {{ currentPage() }} of {{ totalPages() }}
            </span>
            <button
              (click)="nextPage()"
              [disabled]="currentPage() >= totalPages()"
              class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
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
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private taskService = inject(TaskService);
  private toastService = inject(ToastService);

  // Signals
  categories = signal<Category[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  sortBy = signal('title');
  sortOrder = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  itemsPerPage = signal(10);
  categoryTaskCounts = signal<Record<string, number>>({});

  // Computed values
  paginationInfo = computed(() => {
    const total = this.totalItems();
    const page = this.currentPage();
    const limit = this.itemsPerPage();
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);

    return {
      startIndex,
      endIndex,
      total,
    };
  });

  constructor() {
    // Effect to reload categories when filters change
    effect(() => {
      this.loadCategories();
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadCategoryTaskCounts();
  }

  private loadCategories(): void {
    this.loading.set(true);

    const filters: CategoryFilters = {
      title: this.searchTerm() || undefined,
    };

    const sorting: CategorySorting = {
      sortBy: this.sortBy(),
      sortOrder: this.sortOrder(),
    };

    const pagination: CategoryPagination = {
      page: this.currentPage(),
      limit: this.itemsPerPage(),
    };

    this.categoryService.getCategories(filters, sorting, pagination).subscribe({
      next: (result) => {
        this.categories.set(result.categories);
        this.totalPages.set(result.pagination.totalPages || 1);
        this.totalItems.set(result.pagination.total || 0);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toastService.show('Failed to load categories', 'error');
        this.loading.set(false);
      },
    });
  }

  private loadCategoryTaskCounts(): void {
    this.categoryService.getTaskCountsByCategory().subscribe({
      next: (counts) => {
        this.categoryTaskCounts.set(counts);
      },
      error: (error) => {
        console.error('Error loading task counts:', error);
      },
    });
  }

  getTaskCount(categoryId: string): number {
    return this.categoryTaskCounts()[categoryId] || 0;
  }

  onSearchChange(): void {
    this.currentPage.set(1);
    this.loadCategories();
  }

  onSortChange(): void {
    this.currentPage.set(1);
    this.loadCategories();
  }

  toggleSortOrder(): void {
    this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    this.currentPage.set(1);
    this.loadCategories();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  createCategory(): void {
    this.router.navigate(['/categories/create']);
  }

  editCategory(category: Category): void {
    this.router.navigate(['/categories', category.id, 'edit']);
  }

  deleteCategory(category: Category): void {
    const taskCount = this.getTaskCount(category.id);
    let confirmMessage = `Are you sure you want to delete the category "${category.title}"?`;

    if (taskCount > 0) {
      confirmMessage += `\n\nThis category has ${taskCount} associated task(s). These tasks will have their category unassigned.`;
    }

    if (confirm(confirmMessage)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: (response) => {
          this.toastService.show(response.message, 'success');
          this.loadCategories();
          this.loadCategoryTaskCounts(); // Refresh task counts
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.toastService.show('Failed to delete category', 'error');
        },
      });
    }
  }

  viewCategoryTasks(categoryId: string): void {
    this.router.navigate(['/tasks'], { queryParams: { categoryId } });
  }
}
