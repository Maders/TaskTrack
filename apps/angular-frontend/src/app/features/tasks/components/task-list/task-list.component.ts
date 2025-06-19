import { Component, OnInit, inject, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import { Task, TaskFilters } from '../../../../shared/models/task.model';
import { TaskService } from '../../../../core/services/task.service';
import { CategoryService } from '../../../../core/services/category.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Category } from '../../../../shared/models/category.model';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastComponent],
  template: `
    <div class="bg-white shadow rounded-lg">
      <!-- Toast Notifications -->
      <app-toast />

      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900">Tasks</h2>
          <button
            (click)="createTask()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
            New Task
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="px-6 py-4 border-b border-gray-200">
        <form [formGroup]="filterForm" class="space-y-4">
          <!-- Main Filters -->
          <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label
                for="status"
                class="block text-sm font-medium text-gray-700"
                >Status</label
              >
              <select
                id="status"
                formControlName="status"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label
                for="category"
                class="block text-sm font-medium text-gray-700"
                >Category</label
              >
              <select
                id="category"
                formControlName="categoryId"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Categories</option>
                <option
                  *ngFor="let category of categories()"
                  [value]="category.id"
                >
                  {{ category.title }}
                </option>
              </select>
            </div>

            <div>
              <label
                for="search"
                class="block text-sm font-medium text-gray-700"
                >Search</label
              >
              <input
                id="search"
                type="text"
                formControlName="title"
                placeholder="Search tasks..."
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                for="sortBy"
                class="block text-sm font-medium text-gray-700"
                >Sort By</label
              >
              <select
                id="sortBy"
                formControlName="sortBy"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="createdAt">Created Date</option>
                <option value="updatedAt">Updated Date</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>

            <div>
              <label
                for="sortOrder"
                class="block text-sm font-medium text-gray-700"
                >Order</label
              >
              <select
                id="sortOrder"
                formControlName="sortOrder"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            <div class="flex items-end space-x-2">
              <button
                type="button"
                (click)="toggleAdvancedFilters()"
                class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  [ngClass]="{ 'rotate-180': showAdvancedFilters() }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                Advanced
              </button>
              <button
                type="button"
                (click)="clearFilters()"
                class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear
              </button>
            </div>
          </div>

          <!-- Advanced Filters -->
          <div
            *ngIf="showAdvancedFilters()"
            class="border-t border-gray-200 pt-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  for="dateRangeStart"
                  class="block text-sm font-medium text-gray-700"
                >
                  Due Date Range - Start
                </label>
                <input
                  id="dateRangeStart"
                  type="date"
                  formControlName="dateRangeStart"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  for="dateRangeEnd"
                  class="block text-sm font-medium text-gray-700"
                >
                  Due Date Range - End
                </label>
                <input
                  id="dateRangeEnd"
                  type="date"
                  formControlName="dateRangeEnd"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="p-6">
        <div class="flex items-center justify-center">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
          <span class="ml-2 text-gray-600">Loading tasks...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading() && tasks().length === 0" class="p-6">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by creating your first task.
          </p>
          <div class="mt-6">
            <button
              (click)="createTask()"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Task
            </button>
          </div>
        </div>
      </div>

      <!-- Task List -->
      <div
        *ngIf="!loading() && tasks().length > 0"
        class="divide-y divide-gray-200"
      >
        <div
          *ngFor="let task of tasks()"
          class="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3">
                <h3 class="text-sm font-medium text-gray-900 truncate">
                  {{ task.title }}
                </h3>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [ngClass]="getStatusClasses(task.status)"
                >
                  {{ task.status }}
                </span>
              </div>
              <p
                *ngIf="task.description"
                class="mt-1 text-sm text-gray-500 truncate"
              >
                {{ task.description }}
              </p>
              <div
                class="mt-2 flex items-center space-x-4 text-xs text-gray-500"
              >
                <span *ngIf="task.dueDate">
                  Due: {{ task.dueDate | date : 'shortDate' }}
                </span>
                <span
                  *ngIf="getCategoryName(task.categoryId)"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ getCategoryName(task.categoryId) }}
                </span>
                <span
                  *ngIf="!task.categoryId"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500"
                >
                  No Category
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <!-- Category Assignment Dropdown -->
              <div class="relative">
                <label
                  for="category-{{ task.id }}"
                  class="block text-xs font-medium text-gray-500 mb-1 flex items-center"
                >
                  Category
                  <svg
                    class="ml-1 h-3 w-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </label>
                <select
                  id="category-{{ task.id }}"
                  [value]="task.categoryId || ''"
                  (change)="assignCategory(task.id, $event)"
                  class="block w-32 pl-3 pr-8 py-1 text-xs border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white"
                >
                  <option value="">No Category</option>
                  <option
                    *ngFor="let category of categories()"
                    [value]="category.id"
                    [selected]="task.categoryId === category.id"
                  >
                    {{ category.title }}
                  </option>
                </select>
              </div>

              <button
                (click)="editTask(task.id)"
                class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit
              </button>
              <button
                (click)="deleteTask(task.id)"
                class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        *ngIf="!loading() && tasks().length > 0"
        class="px-6 py-4 border-t border-gray-200"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ (currentPage() - 1) * pageSize() + 1 }} to
            {{ Math.min(currentPage() * pageSize(), totalTasks()) }} of
            {{ totalTasks() }} results
          </div>
          <div class="flex items-center space-x-2">
            <button
              (click)="previousPage()"
              [disabled]="currentPage() === 1"
              class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700">
              Page {{ currentPage() }} of {{ totalPages() }}
            </span>
            <button
              (click)="nextPage()"
              [disabled]="currentPage() === totalPages()"
              class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
export class TaskListComponent implements OnInit {
  @Input() initialFilters: { categoryId?: string } = {};

  private taskService = inject(TaskService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  // Signals
  loading = signal(false);
  tasks = signal<Task[]>([]);
  categories = signal<Category[]>([]);
  currentPage = signal(1);
  pageSize = signal(10);
  totalTasks = signal(0);
  totalPages = signal(0);
  sortBy = signal('createdAt');
  sortOrder = signal<'asc' | 'desc'>('desc');
  showAdvancedFilters = signal(false);

  // Form
  filterForm: FormGroup;

  // Computed
  Math = Math;

  constructor() {
    this.filterForm = this.fb.group({
      status: [''],
      categoryId: [''],
      title: [''],
      sortBy: ['createdAt'],
      sortOrder: ['desc'],
      dateRangeStart: [''],
      dateRangeEnd: [''],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.setupFilterSubscription();

    // Apply initial filters if provided
    if (this.initialFilters.categoryId) {
      this.filterForm.patchValue({
        categoryId: this.initialFilters.categoryId,
      });
    }

    this.loadTasks(); // Load initial tasks
  }

  private setupFilterSubscription(): void {
    combineLatest([
      this.filterForm
        .get('status')!
        .valueChanges.pipe(startWith(''), distinctUntilChanged()),
      this.filterForm
        .get('categoryId')!
        .valueChanges.pipe(startWith(''), distinctUntilChanged()),
      this.filterForm
        .get('title')!
        .valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          distinctUntilChanged()
        ),
      this.filterForm.get('sortBy')!.valueChanges.pipe(startWith('createdAt')),
      this.filterForm.get('sortOrder')!.valueChanges.pipe(startWith('desc')),
      this.filterForm.get('dateRangeStart')!.valueChanges.pipe(startWith('')),
      this.filterForm.get('dateRangeEnd')!.valueChanges.pipe(startWith('')),
    ]).subscribe(
      ([
        status,
        categoryId,
        title,
        sortBy,
        sortOrder,
        dateRangeStart,
        dateRangeEnd,
      ]) => {
        this.currentPage.set(1);
        this.loadTasks(); // Actually load tasks when filters change
      }
    );
  }

  private loadTasks(): void {
    this.loading.set(true);

    const statusValue = this.filterForm.get('status')?.value;
    const categoryValue = this.filterForm.get('categoryId')?.value;
    const titleValue = this.filterForm.get('title')?.value;
    const sortByValue = this.filterForm.get('sortBy')?.value;
    const sortOrderValue = this.filterForm.get('sortOrder')?.value;
    const dateRangeStartValue = this.filterForm.get('dateRangeStart')?.value;
    const dateRangeEndValue = this.filterForm.get('dateRangeEnd')?.value;

    const filters: TaskFilters = {
      status:
        statusValue && statusValue.trim() !== '' ? statusValue : undefined,
      categoryId:
        categoryValue && categoryValue.trim() !== ''
          ? categoryValue
          : undefined,
      title: titleValue && titleValue.trim() !== '' ? titleValue : undefined,
      dateRange:
        dateRangeStartValue && dateRangeEndValue
          ? {
              start: dateRangeStartValue,
              end: dateRangeEndValue,
            }
          : undefined,
    };

    this.taskService
      .getTasks(
        filters,
        {
          page: this.currentPage(),
          limit: this.pageSize(),
        },
        sortByValue,
        sortOrderValue
      )
      .subscribe({
        next: (result) => {
          this.tasks.set(result.tasks);
          this.totalTasks.set(result.pagination.total);
          this.totalPages.set(result.pagination.totalPages);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading tasks:', error);
          this.loading.set(false);
        },
      });
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (result) => this.categories.set(result.categories),
      error: (error) => console.error('Error loading categories:', error),
    });
  }

  getCategoryName(categoryId: string | null): string | null {
    if (!categoryId) return null;
    const category = this.categories().find((c) => c.id === categoryId);
    return category?.title || null;
  }

  getStatusClasses(status: 'To Do' | 'In Progress' | 'Done'): string {
    switch (status) {
      case 'To Do':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  createTask(): void {
    this.router.navigate(['/tasks/create']);
  }

  editTask(id: string): void {
    this.router.navigate(['/tasks/edit', id]);
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          alert('Failed to delete task');
        },
      });
    }
  }

  clearFilters(): void {
    this.filterForm.reset({
      status: '',
      categoryId: '',
      title: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      dateRangeStart: '',
      dateRangeEnd: '',
    });
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
      this.loadTasks(); // Load tasks for the new page
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
      this.loadTasks(); // Load tasks for the new page
    }
  }

  assignCategory(taskId: string, event: Event): void {
    const selectedCategoryId = (event.target as HTMLSelectElement).value;
    this.taskService
      .assignCategory(taskId, selectedCategoryId || null)
      .subscribe({
        next: () => {
          this.loadTasks();
          this.toastService.success('Category assigned successfully');
        },
        error: (error: any) => {
          console.error('Error assigning category:', error);
          alert('Failed to assign category');
        },
      });
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters.update((show) => !show);
  }
}
