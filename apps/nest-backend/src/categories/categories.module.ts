import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { AbstractCategoriesService } from './interfaces/categories.service.interface';
import { CategorySeederService } from './category-seeder.service';
import { DatabaseModule } from '../app/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [
    {
      provide: AbstractCategoriesService,
      useClass: CategoriesService,
    },
    CategorySeederService,
  ],
  exports: [AbstractCategoriesService, CategorySeederService],
})
export class CategoriesModule {}
