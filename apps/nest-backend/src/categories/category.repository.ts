import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AbstractCategoryRepository } from './interfaces/category.repository.interface';

@Injectable()
export class InMemoryCategoryRepository implements AbstractCategoryRepository {
  private categories: Category[] = [];

  create(category: CreateCategoryDto): Category {
    const newCategory: Category = {
      id: uuidv4(),
      ...category,
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  findAll(): Category[] {
    return this.categories;
  }

  findById(id: string): Category | undefined {
    console.log('categories:', this.categories);
    return this.categories.find((c) => c.id === id);
  }

  update(id: string, update: Partial<Category>): Category | undefined {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return undefined;
    this.categories[index] = { ...this.categories[index], ...update };
    return this.categories[index];
  }

  delete(id: string): void {
    this.categories = this.categories.filter((c) => c.id !== id);
  }
}
