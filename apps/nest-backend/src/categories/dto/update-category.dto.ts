import { createCategorySchema } from './create-category.dto';
import { z } from 'zod';
import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDtoSwagger } from './create-category.dto';

export const updateCategorySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  description: z.string().nullable().default(null).optional(),
});

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;

// This class is used for Swagger documentation only
export class UpdateCategoryDtoSwagger extends PartialType(
  CreateCategoryDtoSwagger
) {}
