import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const TaskStatus = z.enum(['To Do', 'In Progress', 'Done']);

export const createTaskSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().nullable().default(null),
  dueDate: z.string().datetime('Invalid datetime').nullable().default(null),
  status: TaskStatus,
  categoryId: z.string().uuid('Invalid category ID').nullable().default(null),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;

// This class is used for Swagger documentation only
export class CreateTaskDtoSwagger {
  @ApiProperty({
    description: 'The title of the task',
    minLength: 5,
    example: 'Complete project documentation',
  })
  title: string;

  @ApiProperty({
    description: 'The description of the task',
    example: 'Write comprehensive documentation for the project',
    required: false,
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'The due date of the task in ISO8601 format',
    example: '2024-03-20T15:00:00Z',
    required: false,
    nullable: true,
  })
  dueDate: string | null;

  @ApiProperty({
    description: 'The status of the task',
    enum: ['To Do', 'In Progress', 'Done'],
    example: 'To Do',
  })
  status: 'To Do' | 'In Progress' | 'Done';

  @ApiProperty({
    description: 'The ID of the category this task belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    nullable: true,
  })
  categoryId: string | null;
}
