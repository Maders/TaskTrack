import { Injectable, OnModuleInit } from '@nestjs/common';
import { AbstractCategoryRepository } from './interfaces/category.repository.interface';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategorySeederService implements OnModuleInit {
  constructor(
    private readonly categoryRepository: AbstractCategoryRepository
  ) {}

  async onModuleInit() {
    await this.seedCategories();
  }

  private async seedCategories(): Promise<void> {
    try {
      // Check if categories already exist
      const existingCategories = this.categoryRepository.findAll();
      if (existingCategories.length > 0) {
        console.log('Categories already exist, skipping seeding...');
        return;
      }

      // Default categories
      const defaultCategories: CreateCategoryDto[] = [
        {
          title: 'Work',
          description: 'Tasks related to work and professional development',
        },
        {
          title: 'Personal',
          description: 'Personal tasks and life management',
        },
        {
          title: 'Learning',
          description: 'Educational tasks and skill development',
        },
        {
          title: 'Health',
          description: 'Health and fitness related tasks',
        },
        {
          title: 'Finance',
          description: 'Financial planning and money management',
        },
        {
          title: 'Home',
          description: 'Household tasks and maintenance',
        },
        {
          title: 'Travel',
          description: 'Travel planning and arrangements',
        },
        {
          title: 'Shopping',
          description: 'Shopping lists and purchases',
        },
      ];

      // Create categories
      defaultCategories.forEach((category) => {
        this.categoryRepository.create(category);
      });

      console.log(
        `✅ Successfully seeded ${defaultCategories.length} categories`
      );
    } catch (error) {
      console.error('❌ Error seeding categories:', error);
    }
  }
}
