import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ required: false, description: 'Starting from 1' })
  page: number;

  @ApiProperty({ required: false, description: 'Starting from 1' })
  page_size: number;

  @ApiProperty({ required: false })
  keyword?: string | null;

  @ApiProperty({ required: false })
  sort_name?: string | null;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  sort_type?: 'asc' | 'desc';
}
