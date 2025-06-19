import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  AbstractCategoryRepository,
  CategoryFilters,
  CategorySorting,
  CategoryPagination,
  CategoryListResult,
} from './interfaces/category.repository.interface';
import { AbstractCategoriesService } from './interfaces/categories.service.interface';

@Injectable()
export class CategoriesService implements AbstractCategoriesService {
  constructor(
    private readonly categoryRepository: AbstractCategoryRepository
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.create(createCategoryDto);
  }

  findAll(
    filters?: CategoryFilters,
    sorting?: CategorySorting,
    pagination?: CategoryPagination
  ): CategoryListResult {
    return this.categoryRepository.findAll(filters, sorting, pagination);
  }

  findOne(id: string) {
    return this.categoryRepository.findById(id);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  remove(id: string) {
    return this.categoryRepository.delete(id);
  }
}
