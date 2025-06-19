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
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../../../shared/models/category.model';
import {
  ErrorHandlerService,
  FormValidationErrors,
} from '../../../../core/services/error-handler.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">
          {{ isEditMode() ? 'Edit Category' : 'Create New Category' }}
        </h2>
      </div>

      <!-- General Error Message -->
      <div
        *ngIf="generalError()"
        class="px-6 py-3 bg-red-50 border-b border-red-200"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ generalError() }}</p>
          </div>
        </div>
      </div>

      <form
        [formGroup]="categoryForm"
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
            [ngClass]="{
              'border-red-300 focus:ring-red-500 focus:border-red-500':
                hasFieldError('title')
            }"
            placeholder="Enter category title"
          />
          <div *ngIf="getFieldError('title')" class="mt-1 text-sm text-red-600">
            {{ getFieldError('title') }}
          </div>
          <div
            *ngIf="
              categoryForm.get('title')?.invalid &&
              categoryForm.get('title')?.touched &&
              !getFieldError('title')
            "
            class="mt-1 text-sm text-red-600"
          >
            <span *ngIf="categoryForm.get('title')?.errors?.['required']"
              >Title is required</span
            >
            <span *ngIf="categoryForm.get('title')?.errors?.['minlength']"
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
            [ngClass]="{
              'border-red-300 focus:ring-red-500 focus:border-red-500':
                hasFieldError('description')
            }"
            placeholder="Enter category description"
          ></textarea>
          <div
            *ngIf="getFieldError('description')"
            class="mt-1 text-sm text-red-600"
          >
            {{ getFieldError('description') }}
          </div>
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
            [disabled]="categoryForm.invalid || loading()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div
              *ngIf="loading()"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
            ></div>
            {{ isEditMode() ? 'Update Category' : 'Create Category' }}
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
export class CategoryFormComponent implements OnInit {
  @Input() category?: Category | null;
  @Output() categorySaved = new EventEmitter<
    CreateCategoryDto | UpdateCategoryDto
  >();
  @Output() cancelled = new EventEmitter<void>();

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private errorHandler = inject(ErrorHandlerService);

  // Signals
  loading = signal(false);
  generalError = signal<string>('');
  validationErrors = signal<FormValidationErrors>({});

  // Form
  categoryForm: FormGroup;
  isEditMode = signal(false);

  constructor() {
    this.categoryForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    if (this.category) {
      this.isEditMode.set(true);
      this.categoryForm.patchValue({
        title: this.category.title,
        description: this.category.description || '',
      });
    } else {
      this.isEditMode.set(false);
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.loading.set(true);
      this.clearErrors();

      const formValue = this.categoryForm.value;
      const categoryData: CreateCategoryDto | UpdateCategoryDto = {
        title: formValue.title,
        description: formValue.description || null,
      };

      this.categorySaved.emit(categoryData);
      this.loading.set(false);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  // Error handling methods
  setValidationErrors(errors: FormValidationErrors): void {
    this.validationErrors.set(errors);

    // Set general error if exists
    if (errors['general']) {
      this.generalError.set(errors['general'].serverError);
    }
  }

  clearErrors(): void {
    this.generalError.set('');
    this.validationErrors.set({});
  }

  hasFieldError(fieldName: string): boolean {
    return !!this.getFieldError(fieldName);
  }

  getFieldError(fieldName: string): string | null {
    const errors = this.validationErrors();
    return errors[fieldName]?.serverError || null;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.categoryForm.controls).forEach((key) => {
      const control = this.categoryForm.get(key);
      control?.markAsTouched();
    });
  }
}
