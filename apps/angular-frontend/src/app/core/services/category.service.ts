import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../shared/models/category.model';
import { environment } from '../../../environments/environment';

// Interface for the backend response
interface CategoryListResponse {
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CategoryDeletionResponse {
  message: string;
  affectedTasksCount: number;
}

export interface CategoryFilters {
  title?: string;
}

export interface CategorySorting {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface CategoryPagination {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = `${environment.apiBaseUrl}/categories`;
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  private http = inject(HttpClient);

  // Get all categories with optional filters, sorting, and pagination
  getCategories(
    filters?: CategoryFilters,
    sorting?: CategorySorting,
    pagination?: CategoryPagination
  ): Observable<{ categories: Category[]; pagination: CategoryPagination }> {
    let params = new HttpParams();

    if (filters) {
      if (filters.title && filters.title.trim() !== '') {
        params = params.set('title', filters.title);
      }
    }

    if (sorting) {
      params = params.set('sortBy', sorting.sortBy);
      params = params.set('sortOrder', sorting.sortOrder);
    }

    if (pagination) {
      params = params.set('page', pagination.page.toString());
      params = params.set('limit', pagination.limit.toString());
    }

    return this.http.get<CategoryListResponse>(this.apiUrl, { params }).pipe(
      map((response) => ({
        categories: response.categories,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        },
      })),
      tap((result) => this.categoriesSubject.next(result.categories))
    );
  }

  // Get a single category by ID
  getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // Create a new category
  createCategory(category: CreateCategoryDto): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      tap((newCategory) => {
        const currentCategories = this.categoriesSubject.value;
        this.categoriesSubject.next([...currentCategories, newCategory]);
      })
    );
  }

  // Update an existing category
  updateCategory(
    id: string,
    category: UpdateCategoryDto
  ): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${id}`, category).pipe(
      tap((updatedCategory) => {
        const currentCategories = this.categoriesSubject.value;
        const updatedCategories = currentCategories.map((c) =>
          c.id === id ? updatedCategory : c
        );
        this.categoriesSubject.next(updatedCategories);
      })
    );
  }

  // Delete a category
  deleteCategory(id: string): Observable<CategoryDeletionResponse> {
    return this.http
      .delete<CategoryDeletionResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          const currentCategories = this.categoriesSubject.value;
          const filteredCategories = currentCategories.filter(
            (c) => c.id !== id
          );
          this.categoriesSubject.next(filteredCategories);
        })
      );
  }

  // Get task counts by category
  getTaskCountsByCategory(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/task-counts`);
  }
}
