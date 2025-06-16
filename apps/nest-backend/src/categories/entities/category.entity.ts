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
}
