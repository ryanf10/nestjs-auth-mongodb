import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  page_size: number;

  @ApiProperty({ required: false })
  keyword?: string | null;

  @ApiProperty({ required: false })
  sort_name?: string | null;

  @ApiProperty({ required: false })
  sort_type?: 'asc' | 'desc';
}
