import { ApiProperty } from '@nestjs/swagger';

export class Task {
  @ApiProperty({ description: 'The unique identifier of the task' })
  id: string;

  @ApiProperty({ description: 'The title of the task', minLength: 10 })
  title: string;

  @ApiProperty({
    description: 'The status of the task',
    enum: ['To Do', 'In Progress', 'Done'],
  })
  status: 'To Do' | 'In Progress' | 'Done';

  @ApiProperty({
    description: 'The description of the task',
  })
  description: string | null;

  @ApiProperty({
    description: 'The due date of the task in ISO8601 format',
  })
  dueDate: string | null;

  @ApiProperty({
    description: 'The ID of the category this task belongs to',
  })
  categoryId: string | null;

  @ApiProperty({
    description: 'The date when the task was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'The date when the task was last updated',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: string;
}
