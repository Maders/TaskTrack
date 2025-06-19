import { Injectable, OnModuleInit } from '@nestjs/common';
import { CategorySeederService } from '../categories/category-seeder.service';
import { TaskSeederService } from '../tasks/task-seeder.service';

@Injectable()
export class AppSeederService implements OnModuleInit {
  constructor(
    private readonly categorySeeder: CategorySeederService,
    private readonly taskSeeder: TaskSeederService
  ) {}

  async onModuleInit() {
    console.log('Starting application seeding...');

    // Seed categories first
    await this.categorySeeder.seed();

    // Then seed tasks
    await this.taskSeeder.seed();

    console.log('Application seeding completed!');
  }
}
