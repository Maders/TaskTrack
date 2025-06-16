import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AbstractTaskRepository } from './interfaces/task.repository.interface';
import { AbstractCategoriesService } from '../categories/interfaces/categories.service.interface';

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

  findAll() {
    return this.taskRepository.findAll();
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
