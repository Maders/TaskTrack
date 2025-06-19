import { Module, Global } from '@nestjs/common';
import { InMemoryCategoryRepository } from '../categories/category.repository';
import { AbstractCategoryRepository } from '../categories/interfaces/category.repository.interface';
import { InMemoryTaskRepository } from '../tasks/task.repository';
import { AbstractTaskRepository } from '../tasks/interfaces/task.repository.interface';

@Global()
@Module({
  providers: [
    {
      provide: AbstractCategoryRepository,
      useClass: InMemoryCategoryRepository,
    },
    {
      provide: AbstractTaskRepository,
      useClass: InMemoryTaskRepository,
    },
  ],
  exports: [AbstractCategoryRepository, AbstractTaskRepository],
})
export class DatabaseModule {}
