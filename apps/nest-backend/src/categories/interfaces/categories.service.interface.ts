import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
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
  abstract create(createCategoryDto: CreateCategoryDto): any;
  abstract findAll(
    filters?: CategoryFilters,
    sorting?: CategorySorting,
    pagination?: CategoryPagination
  ): CategoryListResult;
  abstract findOne(id: string): any;
  abstract update(id: string, updateCategoryDto: UpdateCategoryDto): any;
  abstract remove(id: string): CategoryDeletionResult;
  abstract getTaskCountsByCategory(): Record<string, number>;
}
