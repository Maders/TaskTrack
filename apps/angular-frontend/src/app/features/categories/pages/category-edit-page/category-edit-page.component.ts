import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { CategoryFormComponent } from '../../components/category-form/category-form.component';
import { CategoryService } from '../../../../core/services/category.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import {
  Category,
  UpdateCategoryDto,
} from '../../../../shared/models/category.model';

@Component({
  selector: 'app-category-edit-page',
  standalone: true,
  imports: [CommonModule, CategoryFormComponent],
  template: `
    <div class="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <div>
                <button
                  (click)="goBack()"
                  (keyup.enter)="goBack()"
                  (keyup.space)="goBack()"
                  class="text-gray-400 hover:text-gray-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  tabindex="0"
                >
                  <svg
                    class="flex-shrink-0 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="sr-only">Back</span>
                </button>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg
                  class="flex-shrink-0 h-5 w-5 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <button
                  (click)="goToCategories()"
                  (keyup.enter)="goToCategories()"
                  (keyup.space)="goToCategories()"
                  class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  tabindex="0"
                >
                  Categories
                </button>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg
                  class="flex-shrink-0 h-5 w-5 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-500">Edit</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="flex justify-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
      </div>

      <!-- Error State -->
      <div
        *ngIf="error()"
        class="bg-red-50 border border-red-200 rounded-md p-4"
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
            <h3 class="text-sm font-medium text-red-800">
              Error loading category
            </h3>
            <p class="mt-1 text-sm text-red-700">{{ error() }}</p>
            <div class="mt-4">
              <button
                (click)="loadCategory()"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Form -->
      <app-category-form
        *ngIf="!loading() && !error() && category()"
        [category]="category()"
        (categorySaved)="onCategorySaved($event)"
        (cancelled)="onCancelled()"
      ></app-category-form>
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
export class CategoryEditPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);
  private errorHandler = inject(ErrorHandlerService);

  // Signals
  category = signal<Category | null>(null);
  loading = signal(false);
  error = signal<string>('');

  ngOnInit(): void {
    this.loadCategory();
  }

  loadCategory(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (!categoryId) {
      this.error.set('Category ID is required');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.categoryService.getCategory(categoryId).subscribe({
      next: (category) => {
        this.category.set(category);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading category:', error);
        const errorResult = this.errorHandler.handleError(error);
        this.error.set(
          errorResult.message || 'Failed to load category. Please try again.'
        );
        this.loading.set(false);
      },
    });
  }

  onCategorySaved(categoryData: UpdateCategoryDto | any): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (!categoryId) {
      this.toastService.error('Category ID is required');
      return;
    }

    // Type guard to ensure we have valid data
    if (categoryData && typeof categoryData.title === 'string') {
      const updateData: UpdateCategoryDto = {
        title: categoryData.title,
        description: categoryData.description || null,
      };

      this.categoryService.updateCategory(categoryId, updateData).subscribe({
        next: (category) => {
          this.toastService.show('Category updated successfully', 'success');
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Error updating category:', error);
          const validationErrors = this.errorHandler.handleError(error);

          if (validationErrors.validationErrors) {
            // The form component will handle displaying the errors
            const formComponent = document.querySelector(
              'app-category-form'
            ) as any;
            if (formComponent && formComponent.setValidationErrors) {
              formComponent.setValidationErrors(
                validationErrors.validationErrors
              );
            }
          } else {
            // Show general error toast
            this.toastService.error(
              validationErrors.message || 'Failed to update category'
            );
          }
        },
      });
    }
  }

  onCancelled(): void {
    this.router.navigate(['/categories']);
  }

  goBack(): void {
    this.router.navigate(['/categories']);
  }

  goToCategories(): void {
    this.router.navigate(['/categories']);
  }
}
