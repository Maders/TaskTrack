import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import {
  AbstractTaskRepository,
  TaskFilters,
  TaskPagination,
  TaskListResult,
} from './interfaces/task.repository.interface';

@Injectable()
export class InMemoryTaskRepository implements AbstractTaskRepository {
  private tasks: Task[] = [];

  create(task: CreateTaskDto): Task {
    const newTask: Task = {
      id: uuidv4(),
      ...task,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  findAll(filters?: TaskFilters, pagination?: TaskPagination): TaskListResult {
    let filteredTasks = [...this.tasks];

    // Apply filters
    if (filters) {
      if (filters.status && filters.status.trim() !== '') {
        filteredTasks = filteredTasks.filter(
          (task) => task.status === filters.status
        );
      }

      if (filters.categoryId && filters.categoryId.trim() !== '') {
        filteredTasks = filteredTasks.filter(
          (task) => task.categoryId === filters.categoryId
        );
      }

      if (filters.title && filters.title.trim() !== '') {
        filteredTasks = filteredTasks.filter((task) =>
          task.title.toLowerCase().includes(filters.title!.toLowerCase())
        );
      }
    }

    const total = filteredTasks.length;
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const totalPages = Math.ceil(total / limit);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

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

  findById(id: string): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  update(id: string, update: Partial<Task>): Task | undefined {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return undefined;
    this.tasks[index] = { ...this.tasks[index], ...update };
    return this.tasks[index];
  }

  delete(id: string): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }
}
