import { Injectable, OnModuleInit } from '@nestjs/common';
import { AbstractCategoryRepository } from './interfaces/category.repository.interface';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategorySeederService implements OnModuleInit {
  constructor(
    private readonly categoryRepository: AbstractCategoryRepository
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed(): Promise<void> {
    try {
      // Check if categories already exist
      const existingCategories = this.categoryRepository.findAll();
      if (existingCategories.categories.length > 0) {
        console.log('Categories already exist, skipping seeding...');
        return;
      }

      console.log('Seeding categories...');

      const defaultCategories = [
        { title: 'Work', description: 'Work-related tasks and projects' },
        { title: 'Personal', description: 'Personal tasks and activities' },
        { title: 'Shopping', description: 'Shopping lists and errands' },
        { title: 'Health', description: 'Health and fitness related tasks' },
        {
          title: 'Learning',
          description: 'Educational and learning activities',
        },
      ];

      for (const category of defaultCategories) {
        this.categoryRepository.create(category);
      }

      console.log('Categories seeded successfully!');
    } catch (error) {
      console.error('Error seeding categories:', error);
    }
  }
}
