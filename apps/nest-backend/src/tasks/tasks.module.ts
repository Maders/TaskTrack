import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { InMemoryTaskRepository } from './task.repository';
import { AbstractTaskRepository } from './interfaces/task.repository.interface';
import { CategoriesModule } from '../categories/categories.module';
import { TaskSeederService } from './task-seeder.service';

@Module({
  imports: [CategoriesModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: AbstractTaskRepository,
      useClass: InMemoryTaskRepository,
    },
    TaskSeederService,
  ],
})
export class TasksModule {}
