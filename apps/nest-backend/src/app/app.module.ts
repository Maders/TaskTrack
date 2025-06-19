import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from '../tasks/tasks.module';
import { CategoriesModule } from '../categories/categories.module';
import { DatabaseModule } from './database.module';
import { AppSeederService } from './app-seeder.service';

@Module({
  imports: [DatabaseModule, TasksModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService, AppSeederService],
})
export class AppModule {}
