import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { InMemoryCategoryRepository } from './category.repository';
import { AbstractCategoryRepository } from './interfaces/category.repository.interface';
import { AbstractCategoriesService } from './interfaces/categories.service.interface';
import { CategorySeederService } from './category-seeder.service';

@Module({
  controllers: [CategoriesController],
  providers: [
    {
      provide: AbstractCategoriesService,
      useClass: CategoriesService,
    },
    {
      provide: AbstractCategoryRepository,
      useClass: InMemoryCategoryRepository,
    },
    CategorySeederService,
  ],
  exports: [AbstractCategoriesService],
})
export class CategoriesModule {}
