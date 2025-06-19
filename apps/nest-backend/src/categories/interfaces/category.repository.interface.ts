import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';

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
}

export interface CategoryListResult {
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export abstract class AbstractCategoryRepository {
  abstract create(category: CreateCategoryDto): Category;
  abstract findAll(
    filters?: CategoryFilters,
    sorting?: CategorySorting,
    pagination?: CategoryPagination
  ): CategoryListResult;
  abstract findById(id: string): Category | undefined;
  abstract update(id: string, update: Partial<Category>): Category | undefined;
  abstract delete(id: string): void;
}
