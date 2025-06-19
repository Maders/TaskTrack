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
import {
  AbstractCategoriesService,
  CategoryDeletionResult,
} from './interfaces/categories.service.interface';
import { AbstractTaskRepository } from '../tasks/interfaces/task.repository.interface';

@Injectable()
export class CategoriesService implements AbstractCategoriesService {
  constructor(
    private readonly categoryRepository: AbstractCategoryRepository,
    private readonly taskRepository: AbstractTaskRepository
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.create(createCategoryDto);
  }

  findAll(
    filters?: CategoryFilters,
    sorting?: CategorySorting,
    pagination?: CategoryPagination
  ): CategoryListResult {
    let categories = this.categoryRepository.findAll();

    // Apply filters
    if (filters) {
      if (filters.title && filters.title.trim() !== '') {
        categories = categories.filter((category) =>
          category.title.toLowerCase().includes(filters.title!.toLowerCase())
        );
      }
    }

    // Apply sorting
    if (sorting) {
      categories.sort((a, b) => {
        let aValue: any = a[sorting.sortBy as keyof typeof a];
        let bValue: any = b[sorting.sortBy as keyof typeof b];

        if (typeof aValue === 'string') {
          // For date fields, convert to Date objects for proper comparison
          if (
            sorting.sortBy === 'createdAt' ||
            sorting.sortBy === 'updatedAt'
          ) {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          } else {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
        }

        if (sorting.sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    const total = categories.length;
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const totalPages = Math.ceil(total / limit);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCategories = categories.slice(startIndex, endIndex);

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

  findOne(id: string) {
    return this.categoryRepository.findById(id);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  remove(id: string): CategoryDeletionResult {
    // Find all tasks associated with this category
    const tasksResult = this.taskRepository.findAll({ categoryId: id });
    const affectedTasks = tasksResult.tasks;

    // Set categoryId to null for all affected tasks
    affectedTasks.forEach((task) => {
      this.taskRepository.update(task.id, { categoryId: null });
    });

    // Delete the category
    this.categoryRepository.delete(id);

    // Return information about what was done
    return {
      message: `Category deleted successfully. ${affectedTasks.length} task(s) had their category unassigned.`,
      affectedTasksCount: affectedTasks.length,
    };
  }

  getTaskCountsByCategory(): Record<string, number> {
    const tasks = this.taskRepository.findAllWithoutPagination();
    const taskCounts: Record<string, number> = {};

    tasks.forEach((task) => {
      if (task.categoryId) {
        taskCounts[task.categoryId] = (taskCounts[task.categoryId] || 0) + 1;
      }
    });

    return taskCounts;
  }
}
