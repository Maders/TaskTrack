import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { InMemoryTaskRepository } from './task.repository';
import { AbstractTaskRepository } from './interfaces/task.repository.interface';
import { CategoriesModule } from '../categories/categories.module';
import { TaskSeederService } from './task-seeder.service';
import { InMemoryCategoryRepository } from '../categories/category.repository';
import { AbstractCategoryRepository } from '../categories/interfaces/category.repository.interface';

@Module({
  imports: [CategoriesModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: AbstractTaskRepository,
      useClass: InMemoryTaskRepository,
    },
    {
      provide: AbstractCategoryRepository,
      useClass: InMemoryCategoryRepository,
    },
    TaskSeederService,
  ],
})
export class TasksModule {}
