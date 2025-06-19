import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CategoryFormComponent } from '../../components/category-form/category-form.component';
import { CategoryService } from '../../../../core/services/category.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { CreateCategoryDto } from '../../../../shared/models/category.model';

@Component({
  selector: 'app-category-create-page',
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
                <span class="ml-4 text-sm font-medium text-gray-500"
                  >Create</span
                >
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <app-category-form
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
export class CategoryCreatePageComponent {
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);
  private errorHandler = inject(ErrorHandlerService);

  onCategorySaved(categoryData: CreateCategoryDto | any): void {
    if (categoryData && typeof categoryData.title === 'string') {
      const createData: CreateCategoryDto = {
        title: categoryData.title,
        description: categoryData.description || null,
      };

      this.categoryService.createCategory(createData).subscribe({
        next: (category) => {
          this.toastService.show('Category created successfully', 'success');
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Error creating category:', error);
          const validationErrors = this.errorHandler.handleError(error);
          // The form component will handle displaying the errors
          // We just need to pass them to the form
          const formComponent = document.querySelector(
            'app-category-form'
          ) as any;
          if (formComponent && formComponent.setValidationErrors) {
            formComponent.setValidationErrors(validationErrors);
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
