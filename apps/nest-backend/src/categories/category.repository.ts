import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  AbstractCategoryRepository,
  CategoryFilters,
  CategorySorting,
  CategoryPagination,
  CategoryListResult,
} from './interfaces/category.repository.interface';

@Injectable()
export class InMemoryCategoryRepository implements AbstractCategoryRepository {
  private categories: Category[] = [];

  create(category: CreateCategoryDto): Category {
    const newCategory: Category = {
      id: uuidv4(),
      ...category,
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  findAll(
    filters?: CategoryFilters,
    sorting?: CategorySorting,
    pagination?: CategoryPagination
  ): CategoryListResult {
    let filteredCategories = [...this.categories];

    // Apply filters
    if (filters) {
      if (filters.title && filters.title.trim() !== '') {
        filteredCategories = filteredCategories.filter((category) =>
          category.title.toLowerCase().includes(filters.title!.toLowerCase())
        );
      }
    }

    // Apply sorting
    if (sorting) {
      filteredCategories.sort((a, b) => {
        let aValue: any = a[sorting.sortBy as keyof Category];
        let bValue: any = b[sorting.sortBy as keyof Category];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sorting.sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    const total = filteredCategories.length;
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const totalPages = Math.ceil(total / limit);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

    return {
      categories: paginatedCategories,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  findById(id: string): Category | undefined {
    console.log('categories:', this.categories);
    return this.categories.find((c) => c.id === id);
  }

  update(id: string, update: Partial<Category>): Category | undefined {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return undefined;
    this.categories[index] = { ...this.categories[index], ...update };
    return this.categories[index];
  }

  delete(id: string): void {
    this.categories = this.categories.filter((c) => c.id !== id);
  }
}
