import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const createCategorySchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

// This class is used for Swagger documentation only
export class CreateCategoryDtoSwagger {
  @ApiProperty({
    description: 'The title of the category',
    minLength: 1,
    example: 'Work',
  })
  title: string;

  @ApiProperty({
    description: 'The description of the category',
    example: 'Tasks related to work',
  })
  description: string | null;
}
