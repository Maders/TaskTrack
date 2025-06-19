import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../entities/task.entity';
import {
  TaskFilters,
  TaskPagination,
  TaskListResult,
} from './task.repository.interface';

export abstract class AbstractTasksService {
  abstract create(createTaskDto: CreateTaskDto): Task;
  abstract findAll(
    filters?: TaskFilters,
    pagination?: TaskPagination
  ): TaskListResult;
  abstract findOne(id: string): Task | undefined;
  abstract update(id: string, updateTaskDto: UpdateTaskDto): Task | undefined;
  abstract remove(id: string): void;
}
