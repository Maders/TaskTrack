import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';

export interface TaskFilters {
  status?: string;
  categoryId?: string;
  title?: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TaskPagination {
  page: number;
  limit: number;
}

export interface TaskListResult {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export abstract class AbstractTaskRepository {
  abstract create(task: CreateTaskDto): Task;
  abstract findAll(): Task[];
  abstract findById(id: string): Task | undefined;
  abstract update(id: string, update: Partial<Task>): Task | undefined;
  abstract delete(id: string): void;
}
