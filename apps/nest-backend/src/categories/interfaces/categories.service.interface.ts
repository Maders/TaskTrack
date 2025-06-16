import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

export abstract class AbstractCategoriesService {
  abstract create(createCategoryDto: CreateCategoryDto): Category;
  abstract findAll(): Category[];
  abstract findOne(id: string): Category | undefined;
  abstract update(
    id: string,
    updateCategoryDto: UpdateCategoryDto
  ): Category | undefined;
  abstract remove(id: string): void;
}
