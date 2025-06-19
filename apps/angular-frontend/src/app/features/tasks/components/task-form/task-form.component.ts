import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
} from '../../../../shared/models/task.model';
import { Category } from '../../../../shared/models/category.model';
import { CategoryService } from '../../../../core/services/category.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">
          {{ isEditMode() ? 'Edit Task' : 'Create New Task' }}
        </h2>
      </div>

      <form
        [formGroup]="taskForm"
        (ngSubmit)="onSubmit()"
        class="px-6 py-4 space-y-6"
      >
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700"
            >Title *</label
          >
          <input
            id="title"
            type="text"
            formControlName="title"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter task title"
          />
          <div
            *ngIf="
              taskForm.get('title')?.invalid && taskForm.get('title')?.touched
            "
            class="mt-1 text-sm text-red-600"
          >
            <span *ngIf="taskForm.get('title')?.errors?.['required']"
              >Title is required</span
            >
            <span *ngIf="taskForm.get('title')?.errors?.['minlength']"
              >Title must be at least 3 characters</span
            >
          </div>
        </div>

        <!-- Description -->
        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700"
            >Description</label
          >
          <textarea
            id="description"
            formControlName="description"
            rows="3"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter task description"
          ></textarea>
        </div>

        <!-- Status -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700"
            >Status *</label
          >
          <select
            id="status"
            formControlName="status"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Select status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <div
            *ngIf="
              taskForm.get('status')?.invalid && taskForm.get('status')?.touched
            "
            class="mt-1 text-sm text-red-600"
          >
            <span *ngIf="taskForm.get('status')?.errors?.['required']"
              >Status is required</span
            >
          </div>
        </div>

        <!-- Due Date -->
        <div>
          <label for="dueDate" class="block text-sm font-medium text-gray-700"
            >Due Date</label
          >
          <input
            id="dueDate"
            type="date"
            formControlName="dueDate"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <!-- Category -->
        <div>
          <label
            for="categoryId"
            class="block text-sm font-medium text-gray-700"
            >Category</label
          >
          <select
            id="categoryId"
            formControlName="categoryId"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Select category</option>
            <option *ngFor="let category of categories()" [value]="category.id">
              {{ category.title }}
            </option>
          </select>
        </div>

        <!-- Form Actions -->
        <div
          class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200"
        >
          <button
            type="button"
            (click)="onCancel()"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="taskForm.invalid || loading()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div
              *ngIf="loading()"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
            ></div>
            {{ isEditMode() ? 'Update Task' : 'Create Task' }}
          </button>
        </div>
      </form>
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
export class TaskFormComponent implements OnInit {
  @Input() task?: Task;
  @Output() taskSaved = new EventEmitter<CreateTaskDto | UpdateTaskDto>();
  @Output() cancelled = new EventEmitter<void>();

  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Signals
  loading = signal(false);
  categories = signal<Category[]>([]);

  // Form
  taskForm: FormGroup;
  isEditMode = signal(false);

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['', Validators.required],
      dueDate: [''],
      categoryId: [''],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.initializeForm();
  }

  private initializeForm(): void {
    if (this.task) {
      this.isEditMode.set(true);
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description || '',
        status: this.task.status,
        dueDate: this.task.dueDate
          ? this.formatDateForInput(this.task.dueDate)
          : '',
        categoryId: this.task.categoryId || '',
      });
    } else {
      this.isEditMode.set(false);
      this.taskForm.patchValue({
        status: 'To Do',
      });
    }
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (error) => console.error('Error loading categories:', error),
    });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.loading.set(true);

      const formValue = this.taskForm.value;
      const taskData: CreateTaskDto | UpdateTaskDto = {
        title: formValue.title,
        description: formValue.description || undefined,
        status: formValue.status,
        dueDate: formValue.dueDate || undefined,
        categoryId: formValue.categoryId || undefined,
      };

      this.taskSaved.emit(taskData);
      this.loading.set(false);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.taskForm.controls).forEach((key) => {
      const control = this.taskForm.get(key);
      control?.markAsTouched();
    });
  }
}
