import { ApiProperty } from '@nestjs/swagger';

export class SearchUserDto {
  @ApiProperty()
  keyword: string;
}
