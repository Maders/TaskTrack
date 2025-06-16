import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';

export abstract class AbstractCategoryRepository {
  abstract create(category: CreateCategoryDto): Category;
  abstract findAll(): Category[];
  abstract findById(id: string): Category | undefined;
  abstract update(id: string, update: Partial<Category>): Category | undefined;
  abstract delete(id: string): void;
}
