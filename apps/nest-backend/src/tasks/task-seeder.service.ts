import { Injectable, OnModuleInit } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { AbstractTaskRepository } from './interfaces/task.repository.interface';
import { AbstractCategoriesService } from '../categories/interfaces/categories.service.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { AbstractCategoryRepository } from '../categories/interfaces/category.repository.interface';

@Injectable()
export class TaskSeederService implements OnModuleInit {
  constructor(
    private readonly taskRepository: AbstractTaskRepository,
    private readonly categoriesService: AbstractCategoriesService,
    private readonly categoryRepository: AbstractCategoryRepository
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed(): Promise<void> {
    try {
      // Check if tasks already exist
      const existingTasks = this.taskRepository.findAll();
      if (existingTasks.tasks.length > 0) {
        console.log('Tasks already exist, skipping seeding...');
        return;
      }

      console.log('Seeding tasks...');

      // Get categories for task assignment
      const categoriesResult = this.categoryRepository.findAll();
      const categories = categoriesResult.categories;

      // Create 15 tasks with 'To Do' status first
      for (let i = 1; i <= 15; i++) {
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
          categoryId:
            categories.length > 0
              ? faker.helpers.maybe(
                  () => faker.helpers.arrayElement(categories).id,
                  { probability: 0.8 }
                ) || null
              : null,
        };

        this.taskRepository.create(task);
      }

      // Create 30 more tasks with random statuses
      for (let i = 1; i <= 30; i++) {
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
          categoryId:
            categories.length > 0
              ? faker.helpers.maybe(
                  () => faker.helpers.arrayElement(categories).id,
                  { probability: 0.8 }
                ) || null
              : null,
        };

        this.taskRepository.create(task);
      }

      console.log('Tasks seeded successfully!');
    } catch (error) {
      console.error('Error seeding tasks:', error);
    }
  }

  private generateTaskTitle(): string {
    const taskTypes = [
      'Complete',
      'Review',
      'Implement',
      'Design',
      'Test',
      'Deploy',
      'Update',
      'Fix',
      'Create',
      'Analyze',
      'Optimize',
      'Refactor',
      'Document',
      'Configure',
      'Setup',
    ];

    const subjects = [
      'user authentication system',
      'database schema',
      'API endpoints',
      'frontend components',
      'unit tests',
      'integration tests',
      'deployment pipeline',
      'monitoring dashboard',
      'error handling',
      'performance optimization',
      'security audit',
      'code documentation',
      'user interface design',
      'data migration script',
      'third-party integration',
      'mobile app features',
      'admin panel',
      'reporting system',
      'notification service',
      'caching layer',
      'search functionality',
      'payment processing',
      'email templates',
      'analytics tracking',
      'backup system',
    ];

    const taskType = faker.helpers.arrayElement(taskTypes);
    const subject = faker.helpers.arrayElement(subjects);

    return `${taskType} ${subject}`;
  }
}
