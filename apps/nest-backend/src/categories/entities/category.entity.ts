import { ApiProperty } from '@nestjs/swagger';

export class Category {
  @ApiProperty({ description: 'The unique identifier of the category' })
  id: string;

  @ApiProperty({ description: 'The title of the category' })
  title: string;

  @ApiProperty({
    description: 'The description of the category',
  })
  description: string | null;

  @ApiProperty({
    description: 'The date when the category was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'The date when the category was last updated',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: string;
}
