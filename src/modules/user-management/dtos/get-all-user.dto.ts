import { PaginationDto } from '../../../core/builder/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllUserDto extends PaginationDto {
  @ApiProperty({ required: false, example: 'admin,user' })
  role?: string | null;
}
