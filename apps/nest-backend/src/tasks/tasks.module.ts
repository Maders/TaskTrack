import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { CategoriesModule } from '../categories/categories.module';
import { TaskSeederService } from './task-seeder.service';
import { DatabaseModule } from '../app/database.module';
import { AbstractTasksService } from './interfaces/tasks.service.interface';

@Module({
  imports: [CategoriesModule, DatabaseModule],
  controllers: [TasksController],
  providers: [
    {
      provide: AbstractTasksService,
      useClass: TasksService,
    },
    TasksService,
    TaskSeederService,
  ],
  exports: [AbstractTasksService, TaskSeederService],
})
export class TasksModule {}
