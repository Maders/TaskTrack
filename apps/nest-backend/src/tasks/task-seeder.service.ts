import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { AbstractTaskRepository } from './interfaces/task.repository.interface';
import { AbstractCategoryRepository } from '../categories/interfaces/category.repository.interface';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class TaskSeederService {
  constructor(
    private readonly taskRepository: AbstractTaskRepository,
    private readonly categoryRepository: AbstractCategoryRepository
  ) {}

  async seed(): Promise<void> {
    try {
      // Check if tasks already exist
      const existingTasks = this.taskRepository.findAll();
      if (existingTasks.length > 0) {
        console.log('Tasks already exist, skipping seeding...');
        return;
      }

      console.log('Seeding tasks...');

      // Get categories for task assignment
      const categories: Category[] = this.categoryRepository.findAll();
      console.log(
        'Available categories for seeding tasks:',
        categories.map((c) => ({ id: c.id, title: c.title }))
      );

      // Create 15 tasks with 'To Do' status first
      for (let i = 1; i <= 15; i++) {
        const categoryId =
          (categories.length > 0 &&
            faker.helpers.maybe(
              () => faker.helpers.arrayElement(categories).id,
              { probability: 0.8 }
            )) ||
          null;
        const task = {
          title: faker.lorem.sentence({ min: 5, max: 8 }),
          description:
            faker.helpers.maybe(() => faker.lorem.paragraph(), {
              probability: 0.7,
            }) || null,
          status: 'To Do' as const,
          dueDate:
            faker.helpers.maybe(
              () => faker.date.future({ years: 1 }).toISOString(),
              { probability: 0.6 }
            ) || null,
          categoryId,
        };
        this.taskRepository.create(task);
      }

      // Create 30 more tasks with random statuses
      for (let i = 1; i <= 30; i++) {
        const categoryId =
          (categories.length > 0 &&
            faker.helpers.maybe(
              () => faker.helpers.arrayElement(categories).id,
              { probability: 0.8 }
            )) ||
          null;
        const task = {
          title: faker.lorem.sentence({ min: 5, max: 8 }),
          description:
            faker.helpers.maybe(() => faker.lorem.paragraph(), {
              probability: 0.7,
            }) || null,
          status: faker.helpers.arrayElement(['To Do', 'In Progress', 'Done']),
          dueDate:
            faker.helpers.maybe(
              () => faker.date.future({ years: 1 }).toISOString(),
              { probability: 0.6 }
            ) || null,
          categoryId,
        };
        this.taskRepository.create(task);
      }

      console.log('Tasks seeded successfully!');
    } catch (error) {
      console.error('Error seeding tasks:', error);
    }
  }
}
