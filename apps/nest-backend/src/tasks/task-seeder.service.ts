import { Injectable, OnModuleInit } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { AbstractTaskRepository } from './interfaces/task.repository.interface';
import { AbstractCategoriesService } from '../categories/interfaces/categories.service.interface';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskSeederService implements OnModuleInit {
  constructor(
    private readonly taskRepository: AbstractTaskRepository,
    private readonly categoriesService: AbstractCategoriesService
  ) {}

  async onModuleInit() {
    await this.seedTasks();
  }

  private async seedTasks(): Promise<void> {
    try {
      // Check if tasks already exist
      const existingTasks = this.taskRepository.findAll();
      if (existingTasks.tasks.length > 0) {
        console.log('Tasks already exist, skipping seeding...');
        return;
      }

      // Get categories for task assignment
      const categories = this.categoriesService.findAll();

      // Ensure at least 15 'To Do' tasks
      const tasks: CreateTaskDto[] = [];
      for (let i = 0; i < 15; i++) {
        tasks.push({
          title: this.generateTaskTitle(),
          description:
            faker.helpers.maybe(() => faker.lorem.paragraph(), {
              probability: 0.7,
            }) || null,
          status: 'To Do',
          dueDate:
            faker.helpers.maybe(() => faker.date.future().toISOString(), {
              probability: 0.6,
            }) || null,
          categoryId:
            categories.length > 0
              ? faker.helpers.maybe(
                  () => faker.helpers.arrayElement(categories).id,
                  { probability: 0.8 }
                ) || null
              : null,
        });
      }

      // Add 30 more tasks with random statuses (total 45)
      const statuses: ('To Do' | 'In Progress' | 'Done')[] = [
        'To Do',
        'In Progress',
        'Done',
      ];
      for (let i = 0; i < 30; i++) {
        tasks.push({
          title: this.generateTaskTitle(),
          description:
            faker.helpers.maybe(() => faker.lorem.paragraph(), {
              probability: 0.7,
            }) || null,
          status: faker.helpers.arrayElement(statuses),
          dueDate:
            faker.helpers.maybe(() => faker.date.future().toISOString(), {
              probability: 0.6,
            }) || null,
          categoryId:
            categories.length > 0
              ? faker.helpers.maybe(
                  () => faker.helpers.arrayElement(categories).id,
                  { probability: 0.8 }
                ) || null
              : null,
        });
      }

      // Create tasks
      tasks.forEach((task) => {
        this.taskRepository.create(task);
      });

      console.log(`✅ Successfully seeded ${tasks.length} tasks`);
    } catch (error) {
      console.error('❌ Error seeding tasks:', error);
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
