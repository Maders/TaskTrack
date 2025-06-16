import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';

export abstract class AbstractTaskRepository {
  abstract create(task: CreateTaskDto): Task;
  abstract findAll(): Task[];
  abstract findById(id: string): Task | undefined;
  abstract update(id: string, update: Partial<Task>): Task | undefined;
  abstract delete(id: string): void;
}
