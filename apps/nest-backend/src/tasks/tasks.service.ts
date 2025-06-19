import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  AbstractTaskRepository,
  TaskFilters,
  TaskPagination,
  TaskListResult,
} from './interfaces/task.repository.interface';
import { AbstractCategoriesService } from '../categories/interfaces/categories.service.interface';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: AbstractTaskRepository,
    private readonly categoriesService: AbstractCategoriesService
  ) {}

  create(createTaskDto: CreateTaskDto) {
    if (createTaskDto.categoryId) {
      const category = this.categoriesService.findOne(createTaskDto.categoryId);
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${createTaskDto.categoryId} not found`
        );
      }
    }
    return this.taskRepository.create(createTaskDto);
  }

  findAll(filters?: TaskFilters, pagination?: TaskPagination): TaskListResult {
    let allTasks = this.taskRepository.findAll();

    // Apply filters
    if (filters) {
      if (filters.status && filters.status.trim() !== '') {
        allTasks = allTasks.filter((task) => task.status === filters.status);
      }

      if (filters.categoryId && filters.categoryId.trim() !== '') {
        allTasks = allTasks.filter(
          (task) => task.categoryId === filters.categoryId
        );
      }

      if (filters.title && filters.title.trim() !== '') {
        allTasks = allTasks.filter((task) =>
          task.title.toLowerCase().includes(filters.title!.toLowerCase())
        );
      }

      // Apply date range filter
      if (filters.dateRangeStart && filters.dateRangeEnd) {
        const startDate = new Date(filters.dateRangeStart);
        const endDate = new Date(filters.dateRangeEnd);

        allTasks = allTasks.filter((task) => {
          if (!task.dueDate) return false;
          const taskDueDate = new Date(task.dueDate);
          return taskDueDate >= startDate && taskDueDate <= endDate;
        });
      }

      // Apply sorting
      if (filters.sortBy && filters.sortOrder) {
        allTasks.sort((a, b) => {
          let aValue: any;
          let bValue: any;

          switch (filters.sortBy) {
            case 'title':
              aValue = a.title.toLowerCase();
              bValue = b.title.toLowerCase();
              break;
            case 'status':
              aValue = a.status;
              bValue = b.status;
              break;
            case 'dueDate':
              aValue = a.dueDate || '';
              bValue = b.dueDate || '';
              break;
            case 'createdAt':
              aValue = a.createdAt;
              bValue = b.createdAt;
              break;
            case 'updatedAt':
              aValue = a.updatedAt;
              bValue = b.updatedAt;
              break;
            default:
              aValue = a.createdAt;
              bValue = b.createdAt;
          }

          if (filters.sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });
      }
    }

    const total = allTasks.length;
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const totalPages = Math.ceil(total / limit);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = allTasks.slice(startIndex, endIndex);

    return {
      tasks: paginatedTasks,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  findOne(id: string) {
    return this.taskRepository.findById(id);
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    if (updateTaskDto.categoryId) {
      const category = this.categoriesService.findOne(updateTaskDto.categoryId);
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateTaskDto.categoryId} not found`
        );
      }
    }
    return this.taskRepository.update(id, updateTaskDto);
  }

  remove(id: string) {
    return this.taskRepository.delete(id);
  }
}
