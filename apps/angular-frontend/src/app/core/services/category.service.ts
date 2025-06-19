import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../shared/models/category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = `${environment.apiBaseUrl}/categories`;
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  private http = inject(HttpClient);

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(this.apiUrl)
      .pipe(tap((categories) => this.categoriesSubject.next(categories)));
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
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentCategories = this.categoriesSubject.value;
        const filteredCategories = currentCategories.filter((c) => c.id !== id);
        this.categoriesSubject.next(filteredCategories);
      })
    );
  }
}
