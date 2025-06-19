import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';
import {
  CategoryFilters,
  CategorySorting,
  CategoryPagination,
  CategoryListResult,
} from './category.repository.interface';

export interface CategoryDeletionResult {
  message: string;
  affectedTasksCount: number;
}

export abstract class AbstractCategoriesService {
  abstract create(createCategoryDto: CreateCategoryDto): Category;
  abstract findAll(
    filters?: CategoryFilters,
    sorting?: CategorySorting,
    pagination?: CategoryPagination
  ): CategoryListResult;
  abstract findOne(id: string): Category | undefined;
  abstract update(
    id: string,
    updateCategoryDto: UpdateCategoryDto
  ): Category | undefined;
  abstract remove(id: string): CategoryDeletionResult;
  abstract getTaskCountsByCategory(): Record<string, number>;
}
