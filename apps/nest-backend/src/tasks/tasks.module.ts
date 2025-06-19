import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { CategoriesModule } from '../categories/categories.module';
import { TaskSeederService } from './task-seeder.service';
import { DatabaseModule } from '../app/database.module';

@Module({
  imports: [CategoriesModule, DatabaseModule],
  controllers: [TasksController],
  providers: [TasksService, TaskSeederService],
  exports: [TaskSeederService],
})
export class TasksModule {}
