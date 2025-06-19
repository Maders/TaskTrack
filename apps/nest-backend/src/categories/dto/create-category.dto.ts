import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const createCategorySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().nullable().default(null),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

// This class is used for Swagger documentation only
export class CreateCategoryDtoSwagger {
  @ApiProperty({
    description: 'The title of the category',
    minLength: 3,
    example: 'Work',
  })
  title: string;

  @ApiProperty({
    description: 'The description of the category',
    example: 'Tasks related to work',
    required: false,
    nullable: true,
  })
  description: string | null;
}
