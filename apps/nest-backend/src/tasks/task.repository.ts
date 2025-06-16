import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { AbstractTaskRepository } from './interfaces/task.repository.interface';

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

  findAll(): Task[] {
    return this.tasks;
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
